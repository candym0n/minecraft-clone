import * as THREE from "./three/three.module.js";
import { PointerLockControls } from "./three/pointerlockcontrols.module.js";

class Player {
    radius = 0.5;
    height = 1.75;
    jumpSpeed = 0.05;
    onGround = false;
    flashlight = new THREE.PointLight( 0xffffff, 1, 100 );
    
    maxSpeed = 10;
    input = new THREE.Vector3();
    velocity = new THREE.Vector3();
    #worldVelocity = new THREE.Vector3();
    
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
        controls = new PointerLockControls(this.camera, document.body);
        cameraHelper = new THREE.CameraHelper(this.camera);
    
    constructor(scene) {
        scene.add(this.flashlight);
        
        this.camera.position.set(32, 56, 32);
        scene.add(this.camera);
        scene.add(this.cameraHelper);
        
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
        
        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
            new THREE.MeshBasicMaterial({ wireframe: true })
        );
        scene.add(this.boundsHelper);
    }
    
    get worldVelocity() {
        this.#worldVelocity.copy(this.velocity);
        this.#worldVelocity.applyEuler(new THREE.Euler(0, this.camera.rotation.y, 0));
        return this.#worldVelocity;
    }
    
    applyWorldDeltaVelocity(dv) {
        dv.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));
        this.velocity.add(dv);
    }
    
    applyInputs(dt) {
        if (this.controls.isLocked) {
            this.velocity.x = this.input.x;
            this.velocity.z = this.input.z;
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);
            this.position.y += this.velocity.y;
            
            document.getElementById("player-position").innerHTML = this.toString();
        }
    }
    
    updateFlashlight() {
        this.flashlight.position.copy(this.position);
        this.flashlight.castShadow = true;
    }
    
    updateBoundsHelper() {
        this.boundsHelper.position.copy(this.position);
        this.boundsHelper.position.y -= this.height / 2;
    }
    
    onKeyDown(event) {
        if (!this.controls.isLocked) {
            this.controls.lock();
        }
        
        switch(event.code) {
            case 'KeyW':
                this.input.z = this.maxSpeed;
                break;
            case "KeyA":
                this.input.x = -this.maxSpeed;
                break;
            case "KeyS":
                this.input.z = -this.maxSpeed;
                break;
            case "KeyD":
                this.input.x = this.maxSpeed;
                break;
            case "Space":
                if (this.onGround) {
                    this.velocity.y += this.jumpSpeed;
                }
                break;
        }
    }

    onKeyUp(event) {
        switch(event.code) {
            case 'KeyW':
                this.input.z = 0;
                break;
            case "KeyA":
                this.input.x = 0;
                break;
            case "KeyS":
                this.input.z = 0;
                break;
            case "KeyD":
                this.input.x = 0;
                break;
            case "KeyR":
                this.position.y = 56;
                this.velocity.set(0, 0, 0);
                break;
        }
    }

    get position() {
        return this.camera.position;
    }
    
    toString() {
        let str = '';
        str += `X: ${this.position.x.toFixed(3)}`;
        str += `Y: ${this.position.y.toFixed(3)}`;
        str += `Z: ${this.position.z.toFixed(3)}`;
        return str;
    }
}


export { Player };
