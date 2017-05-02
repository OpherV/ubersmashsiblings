'use strict';

// initialize Phaser the 'browserify' way
// https://www.npmjs.com/package/phaser#browserify
window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

const Renderer = require('lance-gg').render.Renderer;
const Sibling = require('../common/Sibling');


var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;

class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.initPhaser();
    }

    draw() {
        super.draw();

        for (let objId of Object.keys(this.sprites)) {
            let objData = this.gameEngine.world.objects[objId];
            let sprite = this.sprites[objId];

            if (objData) {
                sprite.x = objData.position.x;
                sprite.y = objData.position.y;

                // if (objData.class == Ship){
                //     sprite.actor.shipContainerSprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
                // } else{
                //     sprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI/180;
                // }
            }

        }
    }

    phaserPreload(){
        this.phaserGame.load.spritesheet('dude', 'resources/images/dude.png', 32, 48);
        this.phaserGame.load.image('background', 'resources/images/background2.png');
    }

    phaserCreate(){
        this.bg = this.phaserGame.add.tileSprite(0, 0, 800, 600, 'background');
        // player.animations.add('left', [0, 1, 2, 3], 10, true);
        // player.animations.add('turn', [4], 20, true);
        // player.animations.add('right', [5, 6, 7, 8], 10, true);

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    phaserUpdate(){
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;

            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;

            if (facing != 'right')
            {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else
        {
            if (facing != 'idle')
            {
                player.animations.stop();

                if (facing == 'left')
                {
                    player.frame = 0;
                }
                else
                {
                    player.frame = 5;
                }

                facing = 'idle';
            }
        }

        if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -500;
            jumpTimer = game.time.now + 750;
        }
    }

    phaserRender(){

    }


    initPhaser() {
        this.phaserGame = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example',
            {
                preload: this.phaserPreload,
                create: this.phaserCreate,
                update: this.phaserUpdate
            });


    }

}

module.exports = MyRenderer;
