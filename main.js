const socket = io('https://socket-q4ve.onrender.com');

let canvas = document.getElementById('renderCanvas');
let engine = new BABYLON.Engine(canvas, true);
let scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0.8,0.9,1,1);

const camera = new BABYLON.ArcRotateCamera("cam", -Math.PI/2, Math.PI/3, 8, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
camera.inputs.clear();
camera.inputs.addVirtualJoystick();

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,1,0), scene);

let playerMesh, players = {};

BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "ybot.glb", scene, (meshes, _, skeletons) => {
  playerMesh = meshes[0];
  playerMesh.scaling.scaleInPlace(1.5);
  const idle = scene.beginAnimation(skeletons[0], 0, 30, true);
  players['local'] = { mesh: playerMesh, skeleton: skeletons[0] };
});

socket.on('init', data => {
  Object.values(data.players).forEach(p => createRemote(p));
});

socket.on('newPlayer', createRemote);
socket.on('removePlayer', id => {
  if (players[id]) players[id].mesh.dispose();
  delete players[id];
});

socket.on('playerUpdate', data => {
  let p = players[data.id];
  if (p) {
    p.mesh.position = new BABYLON.Vector3(data.x, data.y, data.z);
    p.mesh.rotation.y = data.rotY;
  }
});

socket.on('playerSkill', data => {
  let p = players[data.id];
  if (p) {
    p.skeleton.beginAnimation(0, 30, false, 1.0);
  }
});

function createRemote(p) {
  if (p.id === socket.id) return;
  BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "ybot.glb", scene, (meshes, _, skeletons) => {
    let m = meshes[0]; m.position = new BABYLON.Vector3(p.x, p.y, p.z);
    players[p.id] = { mesh: m, skeleton: skeletons[0] };
  });
}

let keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function sendUpdate() {
  if (!playerMesh) return;
  let dir = new BABYLON.Vector3(
    keys['w'] ? 0 : keys['s'] ? 0 : 0,
    0,
    keys['w'] ? 1 : keys['s'] ? -1 : 0
  );
  if (dir.z) {
    playerMesh.moveWithCollisions(playerMesh.forward.scale(0.1 * dir.z));
  }
  if (keys[' ']) {
    playerMesh.position.y += 0.1;
  }
  players['local'].mesh = playerMesh;
  socket.emit('update', {
    x: playerMesh.position.x,
    y: playerMesh.position.y,
    z: playerMesh.position.z,
    rotY: playerMesh.rotation.y
  });
}

window.addEventListener('pointerdown', () => {
  if (!playerMesh) return;
  socket.emit('skill', { skill: 'Q' });
  players['local'].skeleton.beginAnimation(0, 30, false, 1.0);
});

engine.runRenderLoop(() => {
  sendUpdate();
  scene.render();
});
window.addEventListener("resize", () => engine.resize());