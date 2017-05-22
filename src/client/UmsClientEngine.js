const ClientEngine = require('lance-gg').ClientEngine;
const KeyboardControls = require('lance-gg').controls.Keyboard;
const MyRenderer = require('../client/UmsRenderer');

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.serializer.registerClass(require('../common/Sibling'));

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('left', 'left', { repeat: true });
        this.controls.bindKey('right', 'right', { repeat: true });
        this.controls.bindKey('up', 'up' );
        
    }

}

module.exports = MyClientEngine;
