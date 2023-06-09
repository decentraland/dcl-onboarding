

class ResourcePool<T>{

    resources: { [key: string]: T } = {};

    constructor() { }

    hasResource(name: string): boolean {
        if (this.resources[name]) {
            return true;
        }
        return false;
    }

    getResource(name: string): T {
        return this.resources[name];
    }

    setResource(name: string, resource: T): void {
        this.resources[name] = resource;
    }

}

//Material Pool to avoid creating the same material multiple times
class MaterialPool {

    private materialPool: ResourcePool<Material>
    private basicMaterialPool: ResourcePool<BasicMaterial>

    private primaryMaterialPool: ResourcePool<Material>
    private matTotalTrans: Material
    private matDebugTrans: Material

    private static instanceRef: MaterialPool;

    private constructor() {
        this.materialPool = new ResourcePool<Material>();
        this.basicMaterialPool = new ResourcePool<BasicMaterial>();
        this.primaryMaterialPool = new ResourcePool<Material>();
    }
    // Singleton Instance of the Object
    static instance(): MaterialPool { return this.instanceRef || (this.instanceRef = new this()); }
    //Get a material from the pool, if exists
    getMaterial(name: string): Material {
        return this.materialPool.getResource(name);
    }
    //Store a material in the pool
    setMaterial(name: string, material: Material): void {
        this.materialPool.setResource(name, material);
    }
    //True if the material is in the pool
    hasMaterial(name: string): boolean {
        return this.materialPool.hasResource(name);
    }

    getBasicMaterial(name: string): BasicMaterial {
        return this.basicMaterialPool.getResource(name);
    }
    setBasicMaterial(name: string, material: BasicMaterial): void {
        this.basicMaterialPool.setResource(name, material);
    }

    hasBasicMaterial(name: string): boolean {
        return this.basicMaterialPool.hasResource(name);
    }
    //Get a standard full transparent material
    getTotalTransMaterial(): Material {
        if (!this.matTotalTrans) {
            this.createTotalTransMaterial()
        }
        return this.matTotalTrans;
    }

    getDebugTransMaterial(): Material {
        if (!this.matDebugTrans) {
            this.createDebugTransMaterial()
        }
        return this.matDebugTrans;
    }

    private createTotalTransMaterial() {
        this.matTotalTrans = new Material();
        this.matTotalTrans.albedoColor = new Color4(0, 0, 0, 0);
        this.matTotalTrans.castShadows = false;
    }
    private createDebugTransMaterial() {
        this.matDebugTrans = new Material();
        this.matDebugTrans.albedoColor = new Color4(1, 0, 0, 0.5);
        this.matDebugTrans.castShadows = false;
    }
    //Get a flat red material
    getRed(): Material {
        if (!this.primaryMaterialPool.hasResource("red")) {
            this.createPrimaryMaterial("red", Color3.Red());
        }
        return this.primaryMaterialPool.getResource("red");
    }
    //Get a flat green material
    getGreen(): Material {
        if (!this.primaryMaterialPool.hasResource("green")) {
            this.createPrimaryMaterial("green", Color3.Green());
        }
        return this.primaryMaterialPool.getResource("green");
    }
    //Get a flat blue material
    getBlue(): Material {
        if (!this.primaryMaterialPool.hasResource("blue")) {
            this.createPrimaryMaterial("blue", Color3.Blue());
        }
        return this.primaryMaterialPool.getResource("blue");
    }
    //Get a flat yellow material
    getYellow(): Material {
        if (!this.primaryMaterialPool.hasResource("yellow")) {
            this.createPrimaryMaterial("yellow", Color3.Yellow());
        }
        return this.primaryMaterialPool.getResource("yellow");
    }
    //Get a flat purple material
    getPurple(): Material {
        if (!this.primaryMaterialPool.hasResource("purple")) {
            this.createPrimaryMaterial("purple", Color3.Purple());
        }
        return this.primaryMaterialPool.getResource("purple");
    }

    getBlack(): Material {
        if (!this.primaryMaterialPool.hasResource("black")) {
            this.createPrimaryMaterial("black", Color3.Black());
        }
        return this.primaryMaterialPool.getResource("black");
    }

    getWhite(): Material {
        if (!this.primaryMaterialPool.hasResource("white")) {
            this.createPrimaryMaterial("white", Color3.White());
        }
        return this.primaryMaterialPool.getResource("white");
    }

    getGray(): Material {
        if (!this.primaryMaterialPool.hasResource("gray")) {
            this.createPrimaryMaterial("gray", Color3.Gray());
        }
        return this.primaryMaterialPool.getResource("gray");
    }

    getBridgeArrow(): Material {
        if (!this.primaryMaterialPool.hasResource("bridgeArrow")) {
            this.createPrimaryMaterial("bridgeArrow", Color3.Gray());
            const arrowTexture = new Texture("assets/textures/arrow2.png")
            const baseMaterial = new Material()
            const originalColor = Color3.Yellow()
            baseMaterial.albedoColor = originalColor
            baseMaterial.emissiveColor = originalColor
            baseMaterial.emissiveIntensity = 5
            baseMaterial.albedoTexture = arrowTexture 
            baseMaterial.alphaTexture = arrowTexture

            this.primaryMaterialPool.setResource("bridgeArrow", baseMaterial);
        }
        return this.primaryMaterialPool.getResource("bridgeArrow");
    }

    private createPrimaryMaterial(name: string, color: Color3) {
        let mat = new Material();
        mat.albedoColor = color;
        this.primaryMaterialPool.setResource(name, mat);
    }

}

class TexturePool {

    private texturePool: ResourcePool<Texture>

    private static instanceRef: TexturePool;

    private constructor() {
        this.texturePool = new ResourcePool<Texture>();
    }
    // Singleton Instance of the Object
    static instance(): TexturePool { return this.instanceRef || (this.instanceRef = new this()); }

    getTexture(name: string): Texture {
        return this.texturePool.getResource(name);
    }
    setTexture(name: string, texture: Texture): void {
        this.texturePool.setResource(name, texture);
    }

    hasTexture(name: string): boolean {
        return this.texturePool.hasResource(name);
    }

    hasTextureBySrc(src: string): boolean {
        for (const key in this.texturePool.resources) {
            if (this.texturePool.resources[key].src == src) {
                return true;
            }
        }
        return false;
    }

}

class Arrows{

    private static instanceRef: Arrows;

    arrowsToFlip: Entity []

    private constructor() {
        this.arrowsToFlip = []
    }

    // Singleton Instance of the Object
    static instance(): Arrows { return this.instanceRef || (this.instanceRef = new this()); }

    public createBridgeArrows(parent: Entity, bridge1: boolean, xOffsets: number[]){
        
        const baseMaterial = MaterialPool.instance().getBridgeArrow()
        
        let arrow 
        let zOffset = 1.85

        if(bridge1){
            for (let i = 0; i < xOffsets.length + 1; i++) {
                arrow = new Entity()
                arrow.addComponent(new PlaneShape()).visible = true
                arrow.setParent(parent)
                arrow.addComponent(baseMaterial)
    
                if(i == xOffsets.length / 2) zOffset = - 1.85
    
                if(i==8){
                    arrow.addComponentOrReplace(new Transform({position: new Vector3(-7, 1.6, 0), scale: new Vector3(1, 1, 1), rotation: new Vector3(0, 90, 90).toQuaternion()}))
                }else{
                    arrow.addComponentOrReplace(new Transform({position: new Vector3(xOffsets[i], 1.4, zOffset), scale: new Vector3(.3, .3, .3), rotation: new Vector3(0, 90, 90).toQuaternion()}))
                }
            }
        }else{
            for (let i = 0; i < xOffsets.length + 1; i++) {
                arrow = new Entity()
                arrow.addComponent(new PlaneShape()).visible = true
                arrow.setParent(parent)
                arrow.addComponent(baseMaterial)
    
                if(i == xOffsets.length / 2) zOffset = - 1.85
    
                if(i==8){
                    arrow.addComponentOrReplace(new Transform({position: new Vector3(7, 1.6, 0), scale: new Vector3(1, 1, 1), rotation: new Vector3(0, 90, -90).toQuaternion()}))
                }else{
                    arrow.addComponentOrReplace(new Transform({position: new Vector3(xOffsets[i], 1.4, zOffset), scale: new Vector3(.3, .3, .3), rotation: new Vector3(0, 90, -90).toQuaternion()}))
                }
            }
        }
    }

    public createStairsArrows(parent: Entity, needToFlip: boolean, yOffsets: number[], zOffsets: number[]){

        const baseMaterial = MaterialPool.instance().getBridgeArrow()

        let arrow
        let xOffset = 4.5


        if(needToFlip){
            for (let i = 0; i < yOffsets.length; i++) {
                arrow = new Entity()
                this.arrowsToFlip.push(arrow)
                arrow.addComponent(new PlaneShape()).visible = true
                arrow.addComponent(baseMaterial)
                if(i < yOffsets.length / 2){
                    arrow.addComponentOrReplace(new Transform({position: new Vector3(0.7, yOffsets[i], zOffsets[i]), scale: new Vector3 (.3,.3,.3), rotation: new Vector3(0, 90, 180).toQuaternion()}))
                }else{
                    arrow.addComponentOrReplace(new Transform({position: new Vector3(xOffset, yOffsets[i], zOffsets[i]), scale: new Vector3 (.3,.3,.3), rotation: new Vector3(0, 90, 180).toQuaternion()}))
                }
                arrow.setParent(parent)
            }
        }else{
            for (let i = 0; i < yOffsets.length; i++) {
                arrow = new Entity()
                arrow.addComponent(new PlaneShape()).visible = true
                arrow.addComponent(baseMaterial)
                if(i < yOffsets.length / 2){
                    arrow.addComponentOrReplace(new Transform({position: new Vector3(0.7, yOffsets[i], zOffsets[i]), scale: new Vector3 (.3,.3,.3), rotation: new Vector3(0, 90, 180).toQuaternion()}))
                }else{
                    arrow.addComponentOrReplace(new Transform({position: new Vector3(xOffset, yOffsets[i], zOffsets[i]), scale: new Vector3 (.3,.3,.3), rotation: new Vector3(0, 90, 180).toQuaternion()}))
                }
                arrow.setParent(parent)
            }
        }
    }
    

    public flipArrows(){
        log("CANE")
        for (let i = 0; i < this.arrowsToFlip.length; i++) {
            log("DIO")
            this.arrowsToFlip[i].getComponent(Transform).rotation = new Vector3(0, 90, 0).toQuaternion()
        }
    }
}