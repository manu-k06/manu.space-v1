import * as THREE from 'three';
import { animate } from 'animejs';
import { buildStation } from './buildStation';

export function createStationScene(host, onUnavailable) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-12, 12, 8, -8, 0.1, 100);
  camera.position.set(8, -11, 22);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xd9e7ff, 0x4a3c2d, 1.3));
  const sun = new THREE.DirectionalLight(0xffebc5, 3.4);
  sun.position.set(-5, 7, 12);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x99bbec, 2.5);
  rim.position.set(5, -4, -3);
  scene.add(rim);
  const station = buildStation();
  scene.add(station);
  station.rotation.z = 0.25;

  const pose = { yaw: -0.16, roll: 0.25, drift: -0.12 };
  // Anime.js supplies the easing; a local clock advances only while visible.
  const motion = animate(pose, {
    yaw: { from: -0.16, to: 0.16 },
    roll: { from: 0.25, to: 0.33 },
    drift: { from: -0.12, to: 0.12 },
    duration: 24000,
    alternate: true,
    loop: true,
    ease: 'inOutSine',
    autoplay: false,
  });
  let frame = 0,
    lastTime = 0,
    elapsed = 0,
    active = false,
    disposed = false;
  const draw = () => {
    station.rotation.y = pose.yaw;
    station.rotation.z = pose.roll;
    station.position.y = pose.drift;
    renderer.render(scene, camera);
  };
  const tick = (now) => {
    if (!active || disposed) return;
    frame = requestAnimationFrame(tick);
    if (now - lastTime < 1000 / 30) return;
    elapsed += Math.min(now - lastTime, 100);
    lastTime = now;
    motion.seek(elapsed % 48000, true);
    draw();
  };
  const setActive = (value) => {
    active = value && !disposed;
    cancelAnimationFrame(frame);
    host.dataset.motion = active ? 'running' : 'still';
    if (active) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };
  const resize = () => {
    if (disposed) return;
    const width = Math.max(host.clientWidth, 1),
      height = Math.max(host.clientHeight, 1);
    const aspect = width / height;
    const halfHeight = Math.max(6.6, 9.6 / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    draw();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const onContextLost = (event) => {
    event.preventDefault();
    setActive(false);
    onUnavailable();
  };
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  resize();
  return {
    setActive,
    dispose() {
      if (disposed) return;
      setActive(false);
      disposed = true;
      resizeObserver.disconnect();
      motion.revert();
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        onContextLost
      );
      const geometries = new Set(),
        materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) materials.add(object.material);
        if (object.isInstancedMesh) object.dispose();
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
