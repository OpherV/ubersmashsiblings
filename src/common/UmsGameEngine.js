'use strict';

const GameEngine = require('lance-gg').GameEngine;
const TwoVector = require('lance-gg').serialize.TwoVector;


class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
    }

    start() {

        super.start();

        // this.worldSettings = {
        //     width: 400,
        //     height: 400
        // };
        this.phaserGame = new Phaser.Game(800, 600, Phaser.HEADLESS, '', { create: this.phaserCreate.bind(this), update: this.phaserUpdate.bind(this) });

        //tie the Phaser step the the Lance step
        this.on('postStep', ()=>{ this.phaserGame.step(); });
    }

    makeSibling(playerId) {
        console.log(`adding sibling of player`, playerId);

        let position = new TwoVector(50, 50);
        let sibling= new Sibling(++this.world.idCount, this, position);
        sibling.playerId = playerId;

        this.addObjectToWorld(sibling);
        
        return sibling;
    }

    phaserUpdate(){
        // console.log(this.phaserGame.stepCount);
    }

    phaserCreate(){
        this.phaserGame.enableStep();
        this.phaserGame.physics.startSystem(Phaser.Physics.ARCADE);

        this.phaserGame.physics.arcade.gravity.y = 300;

        this.player = this.phaserGame.add.sprite(32, 320, 'dude');
        this.phaserGame.physics.enable(this.player, Phaser.Physics.ARCADE);

        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 1000;
        this.player.body.maxVelocity.y = 500;
        this.player.body.setSize(20, 32, 5, 16);
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
