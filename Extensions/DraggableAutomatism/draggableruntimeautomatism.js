/**
GDevelop - Draggable Automatism Extension
Copyright (c) 2013-2015 Florian Rival (Florian.Rival@gmail.com)
 */

/**
 * The draggableRuntimeAutomatism represents an automatism allowing objects to be
 * moved using the mouse.
 *
 * @class DraggableRuntimeAutomatism
 * @constructor
 */
gdjs.DraggableRuntimeAutomatism = function(runtimeScene, automatismData, owner)
{
    gdjs.RuntimeAutomatism.call(this, runtimeScene, automatismData, owner);

    this._dragged = false;
    this._xOffset = 0;
    this._yOffset = 0;
};

gdjs.DraggableRuntimeAutomatism.prototype = Object.create( gdjs.RuntimeAutomatism.prototype );
gdjs.DraggableRuntimeAutomatism.thisIsARuntimeAutomatismConstructor = "DraggableAutomatism::Draggable";

gdjs.DraggableRuntimeAutomatism.prototype.onDeActivate = function() {
    if ( this._dragged ) gdjs.DraggableRuntimeAutomatism.draggingSomething = false;
    this._dragged = false;
};

gdjs.DraggableRuntimeAutomatism.prototype.doStepPreEvents = function(runtimeScene) {
    var mousePos = null;

    //Begin drag ?
    if ( !this._dragged && runtimeScene.getGame().getInputManager().isMouseButtonPressed(0) &&
         !gdjs.DraggableRuntimeAutomatism.leftPressedLastFrame &&
         !gdjs.DraggableRuntimeAutomatism.draggingSomething ) {

        mousePos = runtimeScene.getLayer(this.owner.getLayer()).convertCoords(
            runtimeScene.getGame().getInputManager().getMouseX(),
            runtimeScene.getGame().getInputManager().getMouseY());

        if (this.owner.insideObject(mousePos[0], mousePos[1])) {
            this._dragged = true;
            gdjs.DraggableRuntimeAutomatism.draggingSomething = true;
            this._xOffset = mousePos[0] - this.owner.getX();
            this._yOffset = mousePos[1] - this.owner.getY();
        }
    }
    //End dragging ?
    else if ( !runtimeScene.getGame().getInputManager().isMouseButtonPressed(0) ) {
        this._dragged = false;
        gdjs.DraggableRuntimeAutomatism.draggingSomething = false;
    }

    //Being dragging ?
    if ( this._dragged ) {
        if ( mousePos === null ) {
            mousePos = runtimeScene.getLayer(this.owner.getLayer()).convertCoords(
                runtimeScene.getGame().getInputManager().getMouseX(),
                runtimeScene.getGame().getInputManager().getMouseY());
        }

        this.owner.setX(mousePos[0] - this._xOffset);
        this.owner.setY(mousePos[1] - this._yOffset);
    }
};

gdjs.DraggableRuntimeAutomatism.prototype.doStepPostEvents = function(runtimeScene) {
    gdjs.DraggableRuntimeAutomatism.leftPressedLastFrame =
        runtimeScene.getGame().getInputManager().isMouseButtonPressed(0);
};

gdjs.DraggableRuntimeAutomatism.prototype.isDragged = function(runtimeScene) {
    return this._dragged;
};

//Static property used to avoid start dragging an object while another is dragged.
gdjs.DraggableRuntimeAutomatism.draggingSomething = false;

//Static property used to only start dragging when clicking.
gdjs.DraggableRuntimeAutomatism.leftPressedLastFrame = false;
