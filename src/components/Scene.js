import React, { Component } from 'react';
import OrbitControls from 'three/examples/js/controls/OrbitControls';
import GLTFLoader from 'three/examples/js/loaders/GLTFLoader';
import * as THREE from 'three';

// import styled from 'styled-components';

class Scene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      model: null
    }

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);

    this.canvas = React.createRef();
  }

  componentDidMount() {
    let self = this;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.25, 1000);
    camera.position.set( -1.8, 0.9, 2.7 );

    const controls = new OrbitControls( camera );
    controls.target.set( 0, -0.2, -0.2 );
    controls.update();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);
    renderer.gammaOutput = true;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 'red' });
    const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 'red' });
    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    lineGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
    lineGeometry.vertices.push(new THREE.Vector3(10, 0, 0));

    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    const light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    const path = 'images/';
    const format = '.jpg';
    const envMap = new THREE.CubeTextureLoader().load( [
      path + 'space' + format, path + 'space' + format,
      path + 'space' + format, path + 'space' + format,
      path + 'space' + format, path + 'space' + format
    ] );
    scene.background = envMap;

    const loader = new GLTFLoader();
    loader.load('models/bmw_2002/scene.gltf', function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.material.envMap = envMap;
        }
      });
      self.setState({model: gltf.scene});
      scene.add(gltf.scene);
    });

    window.addEventListener( 'resize', this.onWindowResize, false );

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = material;
    this.cube = cube;
    this.width = width;
    this.height = height;

    this.canvas.current.appendChild(this.renderer.domElement);
    this.start();
  }

  onClick() {
    console.log(this.camera)
    // this.camera.zoom = -900;
    // this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  componentWillUnmount() {
    this.stop();
    this.canvas.current.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    if (this.state.model) {
      this.setState(prevState => {
        let newState = Object.assign({}, prevState);
        newState.model.rotation.y += 0.01;
        return newState;
      });
    }


    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div>
        <button onClick={(e) => this.onClick(e)}>button</button>
      
        <div
          ref={this.canvas}>
        </div>
      </div>
    );
  }
}

export default Scene;