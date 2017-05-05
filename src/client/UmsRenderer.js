'use strict';

const PIXI = require('pixi.js');
const Renderer = require('lance-gg').render.Renderer;
const Sibling = require('../common/Sibling');

class UmsRenderer extends Renderer {

    get ASSETPATHS(){
        return {
            bg1: 'resources/images/background2.png',
            dude: 'resources/images/dude.png'
        };
    }

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};

        // asset prefix
        this.assetPathPrefix = this.gameEngine.options.assetPathPrefix?this.gameEngine.options.assetPathPrefix:'';
    }

    init() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.stage = new PIXI.Container();
        this.layer1 = new PIXI.Container();
        this.layer2 = new PIXI.Container();

        this.stage.addChild(this.layer1, this.layer2);

        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            this.onDOMLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', ()=>{
                this.onDOMLoaded();
            });
        }

        return new Promise((resolve, reject)=>{

            // load PIXI assets
            PIXI.loader.add(Object.keys(this.ASSETPATHS).map((x)=>{
                return{
                    name: x,
                    url: this.assetPathPrefix + this.ASSETPATHS[x]
                };
            }))
                .load(() => {
                    this.isReady = true;
                    this.setupStage();
                    this.gameEngine.emit('renderer.ready');


                    resolve();
                });
        });
    }

    onDOMLoaded(){
        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        document.body.querySelector('.pixiContainer').appendChild(this.renderer.view);
    }

    setupStage() {
        window.addEventListener('resize', ()=>{ this.setRendererSize(); });
        
        // background
        this.bg1 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg1.texture,
            this.viewportWidth, this.viewportHeight);

        this.bg1.tilePosition.y -= PIXI.loader.resources.bg1.texture.height;

        this.layer1.addChild(this.bg1);
    }

    setRendererSize() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.bg1.width = this.viewportWidth;
        this.bg1.height = this.viewportHeight;

        this.renderer.resize(this.viewportWidth, this.viewportHeight);
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

        // Render the stage
        this.renderer.render(this.stage);
    }

    addObject(objData, options) {
        let sprite;

        if (objData.class == Sibling) {
            // sprite.width = 32;
            // sprite.height = 48;
            let texture = PIXI.loader.resources.dude.texture;
            texture.frame = new PIXI.Rectangle(0,0,32,48);

            sprite = new PIXI.Sprite(texture);
            this.sprites[objData.id] = sprite;

            console.log(objData.position);
            sprite.anchor.set(0.5, 0.5);
        }

        sprite.position.set(objData.position.x, objData.position.y);
        this.layer2.addChild(sprite);

        Object.assign(sprite, options);
        return sprite;
    }

    removeObject(obj) {
        let sprite = this.sprites[obj.id];

        this.sprites[obj.id].destroy();
        delete this.sprites[obj.id];
    }
    
}

module.exports = UmsRenderer;
