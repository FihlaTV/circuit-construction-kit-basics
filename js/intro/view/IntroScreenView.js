// Copyright 2015-2016, University of Colorado Boulder
// TODO: Review, document, annotate, i18n, bring up to standards

/**
 * Shows the selected scene, and relays the visible bounds to each IntroSceneNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var circuitConstructionKitCommon = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/circuitConstructionKitCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroSceneNode = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/intro/view/IntroSceneNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var IntroSceneModel = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/intro/model/IntroSceneModel' );
  var SceneSelectionRadioButtonGroup = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/intro/view/SceneSelectionRadioButtonGroup' );
  var CCKCConstants =
    require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/CCKCConstants' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  // constants
  var LAYOUT_INSET = CCKCConstants.LAYOUT_INSET;

  /**
   * @param {CircuitConstructionKitModel} introScreenModel
   * @constructor
   */
  function IntroScreenView( introScreenModel, tandem ) {
    var self = this;
    this.introScreenModel = introScreenModel;
    ScreenView.call( this );

    this.sceneNodes = {};

    var sceneSelectionRadioButtonGroup = new SceneSelectionRadioButtonGroup(
      introScreenModel.selectedSceneProperty
    );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        introScreenModel.reset();

        _.values( self.sceneNodes ).forEach( function( sceneNode ) {
          sceneNode.reset();
          sceneNode.model.reset();
        } );
      }
    } );
    this.addChild( resetAllButton );

    introScreenModel.selectedSceneProperty.link( function( selectedScene ) {
      if ( !self.sceneNodes[ selectedScene ] ) {
        var options = {
          0: {
            numberOfRightBatteriesInToolbox: 1,
            numberOfWiresInToolbox: 4,
            numberOfLightBulbsInToolbox: 0,
            numberOfResistorsInToolbox: 0,
            numberOfSwitchesInToolbox: 0
          },
          1: {
            numberOfRightBatteriesInToolbox: 1,
            numberOfWiresInToolbox: 4,
            numberOfLightBulbsInToolbox: 0,
            numberOfResistorsInToolbox: 0,
            numberOfSwitchesInToolbox: 0
          },
          2: {
            numberOfRightBatteriesInToolbox: 1,
            numberOfWiresInToolbox: 4,
            numberOfLightBulbsInToolbox: 0,
            numberOfResistorsInToolbox: 0,
            numberOfSwitchesInToolbox: 1
          }
        }[ selectedScene ];
        var sceneNode = new IntroSceneNode(
          new IntroSceneModel( self.layoutBounds, introScreenModel.selectedSceneProperty ),
          tandem.createTandem( selectedScene ),
          options );
        sceneNode.visibleBoundsProperty.set( self.visibleBoundsProperty.value );
        self.sceneNodes[ selectedScene ] = sceneNode;
      }

      // scene selection buttons go in back so that circuit elements may go in front
      self.children = [
        resetAllButton,
        sceneSelectionRadioButtonGroup,
        self.sceneNodes[ selectedScene ]
      ];
    } );

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      _.values( self.sceneNodes ).forEach( function( sceneNode ) {
        sceneNode.visibleBoundsProperty.set( visibleBounds );
      } );

      sceneSelectionRadioButtonGroup.mutate( {
        left: visibleBounds.left + LAYOUT_INSET,
        top: visibleBounds.top + LAYOUT_INSET
      } );

      // Float the resetAllButton to the bottom right
      resetAllButton.mutate( {
        right: visibleBounds.right - LAYOUT_INSET,
        bottom: visibleBounds.bottom - LAYOUT_INSET
      } );
    } );
  }

  circuitConstructionKitCommon.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView, {
    step: function( dt ) {
      this.sceneNodes[ this.introScreenModel.selectedScene ].circuitConstructionKitScreenModel.step( dt );
    }
  } );
} );