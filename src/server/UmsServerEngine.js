'use strict';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`,{
    userAgent: "lance.gg",
});

global.document = dom.window.document;
global.window = dom.window;
global.Canvas = require('canvas');
global.Image = require('canvas').Image;
global.window.CanvasRenderingContext2D = 'foo'; // let Phaser think that we have a canvas
global.window.Element = undefined;
global.navigator = global.window.navigator;
global.window.focus = function(){};
global.window.scrollTo = function(){};

global.window.DOMParser = require('xmldom').DOMParser;

// fake the xml http request object because Phaser.Loader uses it
global.XMLHttpRequest = function() {};

// initialize Phaser the 'browserify' way
// https://www.npmjs.com/package/phaser#browserify
global.PIXI = require('phaser/build/custom/pixi')
global.p2 = require('phaser/build/custom/p2');
global.Phaser = require('phaser/build/custom/phaser-split');

const ServerEngine = require('lance-gg').ServerEngine;

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.serializer.registerClass(require('../common/Sibling'));
    }

    start() {
        super.start();
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        let sibling = this.gameEngine.makeSibling(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        delete this.gameEngine.world.objects[playerId];
    }
}

module.exports = MyServerEngine;
