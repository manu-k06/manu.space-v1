import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CelestialSky Component (Three.js WebGL 3D Cosmos Engine)
 * 
 * Features:
 * - 100% Three.js GPU accelerated 3D scene with Additive Blending
 * - 12,000+ particle 3D Grand Spiral Galaxy with differential rotation & 3D disc thickness
 * - 4,500+ particle 3D Planetary Nebula (The Helix / "Eye of the Cosmos") with breathing shells
 * - 3,500+ ambient 3D deep-space starfield with authentic starlight depth
 * - Real-time 3D shooting star comets cutting through space
 * - Interactive 3D mouse parallax and smooth scroll-driven camera flight
 * - Pure high-contrast black & white / lunar silver aesthetic, retina ready, 60 FPS
 */
export function CelestialSky() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ----------------------------------------------------
    // 1. Scene, Camera & WebGL Renderer Setup
    // ----------------------------------------------------
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.00075);

    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
    camera.position.set(0, 0, 750);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // Transparent canvas background
    container.appendChild(renderer.domElement);

    // ----------------------------------------------------
    // 2. Procedural Glowing Circular Particle Texture
    // ----------------------------------------------------
    const createParticleTexture = () => {
      const size = 64;
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');

      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(235, 242, 255, 0.85)');
      grad.addColorStop(0.5, 'rgba(180, 195, 225, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(cvs);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // ----------------------------------------------------
    // 3. Object 1: 3D Grand Spiral Galaxy (Upper Right)
    // ----------------------------------------------------
    const galaxyGroup = new THREE.Group();
    galaxyGroup.position.set(280, 180, -60);
    galaxyGroup.rotation.set(0.85, -0.4, 0.35); // 3D Tilted orientation
    scene.add(galaxyGroup);

    const numGalaxyStars = 12000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(numGalaxyStars * 3);
    const galaxyColors = new Float32Array(numGalaxyStars * 3);
    const galaxyParams = [];

    const arms = 2;
    const maxRadius = 320;
    const armSpread = 0.42;

    const colWhite = new THREE.Color(0xffffff);
    const colSilver = new THREE.Color(0xdce5f2);
    const colGlint = new THREE.Color(0xb8c8dc);

    for (let i = 0; i < numGalaxyStars; i++) {
      const isCore = Math.random() < 0.28;
      let r, theta;

      if (isCore) {
        // Spherical core bulge
        r = Math.pow(Math.random(), 2.2) * (maxRadius * 0.24);
        theta = Math.random() * Math.PI * 2;
      } else {
        // Logarithmic spiral arms
        const armIndex = i % arms;
        const armOffset = (armIndex * (Math.PI * 2)) / arms;
        r = Math.pow(Math.random(), 0.94) * maxRadius + 15;
        const spiralAngle = Math.log(r / 15) * 1.85;
        const scatter = (Math.random() - 0.5) * armSpread * (r / maxRadius + 0.16);
        theta = armOffset + spiralAngle + scatter;
      }

      // Vertical Gaussian disc thickness
      const zSpread = isCore
        ? (Math.random() - 0.5) * 65
        : (Math.random() - 0.5) * (35 * (1 - r / maxRadius) + 8);

      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = zSpread;

      galaxyPositions[i * 3] = x;
      galaxyPositions[i * 3 + 1] = y;
      galaxyPositions[i * 3 + 2] = z;

      // Keplerian differential orbital speed (stars closer to core orbit faster)
      const speed = (0.22 / (Math.sqrt(r) + 4.5)) * 0.018;
      galaxyParams.push({ r, theta, z, speed, isCore });

      // Starlight color palette
      const chosenColor = Math.random() < 0.5 ? colWhite : (Math.random() < 0.5 ? colSilver : colGlint);
      galaxyColors[i * 3] = chosenColor.r;
      galaxyColors[i * 3 + 1] = chosenColor.g;
      galaxyColors[i * 3 + 2] = chosenColor.b;
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 4.8,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.9,
    });

    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMaterial);
    galaxyGroup.add(galaxyPoints);

    // ----------------------------------------------------
    // 4. Object 2: 3D Planetary Nebula (The Helix / "Eye of the Cosmos")
    // ----------------------------------------------------
    const nebulaGroup = new THREE.Group();
    nebulaGroup.position.set(290, -320, -50);
    nebulaGroup.rotation.set(0.35, 0.45, 0.25);
    scene.add(nebulaGroup);

    const numNebulaParticles = 4800;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(numNebulaParticles * 3);
    const nebulaColors = new Float32Array(numNebulaParticles * 3);
    const nebulaParams = [];

    const nebRadiusX = 145;
    const nebRadiusY = 115;
    const nebInnerCavity = 0.52;

    for (let i = 0; i < numNebulaParticles; i++) {
      const isRing = Math.random() < 0.78;
      let rNorm, theta, zOffset;

      if (isRing) {
        // Luminous dense emission shell ("Iris of the Eye")
        rNorm = nebInnerCavity + Math.pow(Math.random(), 0.85) * (1.0 - nebInnerCavity);
        theta = Math.random() * Math.PI * 2;
        zOffset = (Math.random() - 0.5) * 28;
      } else {
        // Radial cometary knots & outer gaseous shroud
        rNorm = 0.95 + Math.pow(Math.random(), 1.4) * 0.45;
        theta = Math.random() * Math.PI * 2;
        zOffset = (Math.random() - 0.5) * 45;
      }

      const x = rNorm * nebRadiusX * Math.cos(theta);
      const y = rNorm * nebRadiusY * Math.sin(theta);
      const z = zOffset;

      nebulaPositions[i * 3] = x;
      nebulaPositions[i * 3 + 1] = y;
      nebulaPositions[i * 3 + 2] = z;

      nebulaParams.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        rNorm,
        theta,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        isRing,
      });

      const col = isRing
        ? (Math.random() < 0.6 ? colWhite : colSilver)
        : (Math.random() < 0.5 ? colSilver : colGlint);

      nebulaColors[i * 3] = col.r;
      nebulaColors[i * 3 + 1] = col.g;
      nebulaColors[i * 3 + 2] = col.b;
    }

    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 5.5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.85,
    });

    const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMaterial);
    nebulaGroup.add(nebulaPoints);

    // Central White Dwarf Star Core (Heart of the Nebula)
    const wdGeo = new THREE.BufferGeometry();
    wdGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    const wdMat = new THREE.PointsMaterial({
      size: 24,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffff,
    });
    const wdPoint = new THREE.Points(wdGeo, wdMat);
    nebulaGroup.add(wdPoint);

    // ----------------------------------------------------
    // 5. Deep Space 3D Starfield (3,500 Stars)
    // ----------------------------------------------------
    const numStars = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(numStars * 3);
    const starColors = new Float32Array(numStars * 3);

    for (let i = 0; i < numStars; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 1600;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1200 - 200;

      const col = Math.random() < 0.4 ? colWhite : (Math.random() < 0.4 ? colSilver : colGlint);
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 3.2,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.75,
    });

    const starfield = new THREE.Points(starGeo, starMaterial);
    scene.add(starfield);

    // ----------------------------------------------------
    // 6. Dynamic 3D Cosmic Shooting Stars / Comets
    // ----------------------------------------------------
    const comets = [];
    const cometGroup = new THREE.Group();
    scene.add(cometGroup);

    const spawn3DComet = () => {
      const isGrand = Math.random() < 0.3;
      const startX = Math.random() * 500 - 100;
      const startY = Math.random() * 600 - 100;
      const startZ = Math.random() * 200 - 100;

      const length = isGrand ? 160 : 80;
      const speed = isGrand ? 6.5 : 10.5;

      const dir = new THREE.Vector3(-0.75, -0.65, 0.15).normalize();

      const lineGeo = new THREE.BufferGeometry();
      const positions = new Float32Array([
        startX, startY, startZ,
        startX - dir.x * length, startY - dir.y * length, startZ - dir.z * length,
      ]);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: isGrand ? 0xffffff : 0xd0e0f5,
        transparent: true,
        opacity: 0.95,
        linewidth: isGrand ? 2.5 : 1.5,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      cometGroup.add(line);

      comets.push({
        line,
        dir,
        speed,
        life: 1.0,
        decay: isGrand ? 0.015 : 0.024,
      });
    };

    // ----------------------------------------------------
    // 7. Interactive Scroll Flight & Mouse Parallax
    // ----------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetCameraX = mouseX * 45;
      targetCameraY = -mouseY * 35;
    };

    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      targetScrollY = -scrollProgress * 550; // Camera smoothly descends 550 units through the 3D pass
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ----------------------------------------------------
    // 8. 60 FPS Render Loop with Real 3D Physics
    // ----------------------------------------------------
    let time = 0;

    const animate = () => {
      time += 1;

      // Smooth camera interpolation (Parallax + Scroll descent)
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetScrollY + targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, camera.position.y * 0.5, 0);

      // 1. Galaxy 1 Differential Keplerian Rotation
      const gPos = galaxyGeo.attributes.position.array;
      for (let i = 0; i < numGalaxyStars; i++) {
        const p = galaxyParams[i];
        p.theta += p.speed;
        gPos[i * 3] = p.r * Math.cos(p.theta);
        gPos[i * 3 + 1] = p.r * Math.sin(p.theta);
      }
      galaxyGeo.attributes.position.needsUpdate = true;
      galaxyGroup.rotation.z += 0.0003;

      // 2. Planetary Nebula Harmonic 3D Breathing
      const nebPos = nebulaGeo.attributes.position.array;
      const breathe = Math.sin(time * 0.012) * 0.06 + 1.0;
      for (let i = 0; i < numNebulaParticles; i++) {
        const p = nebulaParams[i];
        const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.04 + 1.0;
        const curScale = breathe * pulse;
        nebPos[i * 3] = p.baseX * curScale;
        nebPos[i * 3 + 1] = p.baseY * curScale;
        nebPos[i * 3 + 2] = p.baseZ * curScale;
      }
      nebulaGeo.attributes.position.needsUpdate = true;
      nebulaGroup.rotation.z += 0.0002;

      // 3. Ambient Starfield Slow Drift
      starfield.rotation.y = time * 0.00008;

      // 4. Comet Spawning & Animation
      if (Math.random() < 0.024 && comets.length < 4) {
        spawn3DComet();
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.life -= c.decay;
        c.line.position.x += c.dir.x * c.speed;
        c.line.position.y += c.dir.y * c.speed;
        c.line.position.z += c.dir.z * c.speed;
        c.line.material.opacity = Math.max(0, c.life);

        if (c.life <= 0) {
          cometGroup.remove(c.line);
          c.line.geometry.dispose();
          c.line.material.dispose();
          comets.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // ----------------------------------------------------
    // Cleanup on Component Unmount
    // ----------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js GPU resources
      galaxyGeo.dispose();
      galaxyMaterial.dispose();
      nebulaGeo.dispose();
      nebulaMaterial.dispose();
      wdGeo.dispose();
      wdMat.dispose();
      starGeo.dispose();
      starMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="celestial-canvas-wrap" aria-hidden="true">
      {/* Three.js 3D WebGL Canvas Container */}
      <div ref={containerRef} className="three-webgl-canvas" />

      {/* Atmospheric Soft Vignette Layers */}
      <div className="nebula-cloud nebula-cloud--top" />
      <div className="nebula-cloud nebula-cloud--mid-left" />
      <div className="nebula-cloud nebula-cloud--bottom-right" />
    </div>
  );
}
