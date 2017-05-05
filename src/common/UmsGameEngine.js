'use strict';

const SimplePhysicsEngine = require('lance-gg').physics.SimplePhysicsEngine;
const GameEngine = require('lance-gg').GameEngine;
const TwoVector = require('lance-gg').serialize.TwoVector;

const Sibling = require('./Sibling');

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine();
        this.physicsEngine.init({
            gameEngine: this,
            gravity: new TwoVector(0, 0.3)
        });

        this.on('postStep', () => {
            this.world.forEachObject((id, obj) => {

                if (obj.class == Sibling){
                    if (obj.y >= 200) {
                        obj.affectedByGravity = false;
                        obj.velocity.y = 0;
                    }
                }

            });
        })
    }

    start() {

        super.start();

        // this.worldSettings = {
        //     width: 400,
        //     height: 400
        // };
    }

    makeSibling(playerId) {
        console.log(`adding sibling of player`, playerId);

        let position = new TwoVector(50, 50);
        let sibling= new Sibling(++this.world.idCount, this, position);
        sibling.playerId = playerId;


        this.addObjectToWorld(sibling);
        
        return sibling;
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.getPlayerObject(playerId);
        if (player) {
            console.log(`player ${playerId} pressed ${inputData.input}`);
            if (inputData.input === 'up') {
                player.isMovingUp = true;
            } else if (inputData.input === 'down') {
                player.isMovingDown = true;
            } else if (inputData.input === 'right') {
                player.isRotatingRight = true;
            } else if (inputData.input === 'left') {
                player.isRotatingLeft = true;
            } else if (inputData.input === 'space') {
                this.fire(player, inputData.messageIndex);
                this.emit('fire');
            }
        }
    }
}

module.exports = MyGameEngine;
