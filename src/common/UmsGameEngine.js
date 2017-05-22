'use strict';

const SimplePhysicsEngine = require('lance-gg').physics.SimplePhysicsEngine;
const GameEngine = require('lance-gg').GameEngine;
const TwoVector = require('lance-gg').serialize.TwoVector;

const Sibling = require('./Sibling');

const RUNSPEED = new TwoVector(0.5, 0);
const JUMPSPEED = new TwoVector(0, -9);

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine();
        this.physicsEngine.init({
            gameEngine: this,
            gravity: new TwoVector(0, 0.5)
        });

        this.on('postStep', () => {
            this.world.forEachObject((id, obj) => {

                if (obj.class == Sibling){
                    if (obj.y >= 200) {
                        obj.affectedByGravity = false;
                        obj.velocity.y = 0;
                    }
                    else{
                        obj.affectedByGravity = true;
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

        console.log('got input', inputData);

        // get the player's primary object
        let playerSibling = this.world.getPlayerObject(playerId);
        if (playerSibling) {
            console.log(`player ${playerId} pressed ${inputData.input}`);

            if (inputData.input === 'up') {
                playerSibling.velocity.add(JUMPSPEED)
            } else if (inputData.input === 'right') {
                playerSibling.velocity.add(RUNSPEED);
            } else if (inputData.input === 'left') {
                playerSibling.velocity.subtract(RUNSPEED);
            } else if (inputData.input === 'space') {

            }
        }
    }
}

module.exports = MyGameEngine;
