'use strict';

const DynamicObject= require('lance-gg').serialize.DynamicObject;

class Sibling extends DynamicObject {

    static get netScheme() {
        return Object.assign({}, super.netScheme);
    }

    constructor(id, position) {
        super(id, position);
        this.class = Sibling;
    };
}

module.exports = Sibling;
