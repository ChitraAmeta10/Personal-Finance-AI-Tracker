import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeFinanceCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // 1. Scene & Camera (Moralia deep charcoal atmosphere)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x272727, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 48);

    // 2. High-Fidelity Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Central Sculptural Geometric Glass Prism (Autonomous Core)
    const prismGroup = new THREE.Group();
    prismGroup.position.set(14, 2, -5);

    // Smoked Obsidian Glass Outer Polyhedron
    const coreGeo = new THREE.OctahedronGeometry(9.5, 0);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1f1d1b,
      emissive: 0x120e0a,
      emissiveIntensity: 0.3,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      transparent: true,
      opacity: 0.92,
    });
    const mainPrism = new THREE.Mesh(coreGeo, glassMaterial);
    prismGroup.add(mainPrism);

    // Brushed Champagne Gold Wire Edges
    const wireGeo = new THREE.WireframeGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xcca77c,
      transparent: true,
      opacity: 0.7,
      linewidth: 1.5,
    });
    const wireEdges = new THREE.LineSegments(wireGeo, wireMat);
    prismGroup.add(wireEdges);

    // Inner Glowing Gold Icosahedron Core
    const innerGeo = new THREE.IcosahedronGeometry(4.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xcca77c,
      emissive: 0x9e7a4f,
      emissiveIntensity: 0.6,
      metalness: 0.95,
      roughness: 0.2,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    prismGroup.add(innerCore);

    scene.add(prismGroup);

    // 4. Subtle Orbital Champagne Gold Meridian Rings
    const createGoldOrbit = (radius: number, tiltX: number, tiltY: number) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.06, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xcca77c,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.38,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const orbit1 = createGoldOrbit(13.8, Math.PI / 3, Math.PI / 5);
    const orbit2 = createGoldOrbit(16.5, -Math.PI / 4, Math.PI / 3.5);
    prismGroup.add(orbit1);
    prismGroup.add(orbit2);

    // 5. Ambient Gold & Champagne Bokeh Particles
    const particleCount = 650;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cGold = new THREE.Color(0xcca77c);
    const cWarmWhite = new THREE.Color(0xf5ede4);
    const cDeepAmber = new THREE.Color(0x8f6a3d);

    for (let i = 0; i < particleCount; i++) {
      particleCoords[i * 3] = (Math.random() - 0.5) * 150;
      particleCoords[i * 3 + 1] = (Math.random() - 0.5) * 85;
      particleCoords[i * 3 + 2] = (Math.random() - 0.5) * 90;

      const pRand = Math.random();
      const col = pRand > 0.6 ? cGold : pRand > 0.2 ? cWarmWhite : cDeepAmber;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particleCoords, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    // Particle texture
    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const dotCtx = dotCanvas.getContext("2d");
    if (dotCtx) {
      const grad = dotCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(204, 167, 124, 0.75)");
      grad.addColorStop(0.7, "rgba(204, 167, 124, 0.12)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      dotCtx.fillStyle = grad;
      dotCtx.fillRect(0, 0, 64, 64);
    }
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 1.3,
      vertexColors: true,
      map: dotTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Sculptural Warm Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.7);
    scene.add(ambientLight);

    const keyGoldLight = new THREE.DirectionalLight(0xcca77c, 3.8);
    keyGoldLight.position.set(20, 25, 25);
    scene.add(keyGoldLight);

    const rimWarmLight = new THREE.PointLight(0xd9baa0, 2.5, 80);
    rimWarmLight.position.set(-20, -15, 15);
    scene.add(rimWarmLight);

    // 7. Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = (e.clientX - halfW) / halfW;
      targetY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      if (w < 900) {
        prismGroup.position.set(0, 4, -12);
      } else {
        prismGroup.position.set(14, 2, -5);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);

    // 8. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Silky lerp
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      camera.position.x = mouseX * 7;
      camera.position.y = -mouseY * 5;
      camera.lookAt(0, 0, 0);

      // Prism rotations
      mainPrism.rotation.y = elapsed * 0.22 + mouseX * 0.3;
      mainPrism.rotation.x = elapsed * 0.14 - mouseY * 0.2;
      wireEdges.rotation.copy(mainPrism.rotation);

      innerCore.rotation.y = -elapsed * 0.35;
      innerCore.rotation.z = elapsed * 0.2;

      orbit1.rotation.z = elapsed * 0.16;
      orbit2.rotation.z = -elapsed * 0.2;

      // Particles subtle drift
      particles.rotation.y = elapsed * 0.012;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);

      coreGeo.dispose();
      glassMaterial.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      dotTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-canvas-container"
      aria-hidden="true"
    />
  );
}
