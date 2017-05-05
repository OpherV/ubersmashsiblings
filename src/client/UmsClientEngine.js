const ClientEngine = require('lance-gg').ClientEngine;
const MyRenderer = require('../client/UmsRenderer');

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.serializer.registerClass(require('../common/Sibling'));
        this.gameEngine.on('client__preStep', this.preStep.bind(this));
    }

    // our pre-step is to process all inputs
    preStep() {

        // if (this.pressedKeys.up) {
        //     this.sendInput('up', { movement: true });
        // }
        //
        // if (this.pressedKeys.down) {
        //     this.sendInput('down', { movement: true });
        // }
        //
        // if (this.pressedKeys.left) {
        //     this.sendInput('left', { movement: true });
        // }
        //
        // if (this.pressedKeys.right) {
        //     this.sendInput('right', { movement: true });
        // }
        //
        // if (this.pressedKeys.space) {
        //     this.sendInput('space', { movement: true });
        // }
    }

}

module.exports = MyClientEngine;
