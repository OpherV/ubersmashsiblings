'use strict';

const DynamicObject= require('lance-gg').serialize.DynamicObject;
const TwoVector= require('lance-gg').serialize.TwoVector;

class Sibling extends DynamicObject {

    static get netScheme() {
        return Object.assign({}, super.netScheme);
    }

    constructor(id, gameEngine, position) {
        super(id, position);
        this.class = Sibling;

        this.friction = new TwoVector(0.9, 1);
    };
}

module.exports = Sibling;
