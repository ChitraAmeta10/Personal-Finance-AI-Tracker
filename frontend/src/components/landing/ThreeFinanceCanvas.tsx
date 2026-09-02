import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeFinanceCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060908, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 24, 75);
    camera.lookAt(0, 0, 0);

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Financial undulating 3D Wave Plane (Yield / Cashflow topology)
    const planeWidth = 140;
    const planeHeight = 110;
    const segmentsW = 55;
    const segmentsH = 45;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsW, segmentsH);
    geometry.rotateX(-Math.PI / 2.2);

    const positionAttribute = geometry.attributes.position;
    const basePositions = positionAttribute.array.slice();

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const waveMesh = new THREE.Mesh(geometry, wireframeMaterial);
    waveMesh.position.set(0, -14, 0);
    scene.add(waveMesh);

    // 4. Financial Transaction Node Particles
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x3ecf9a); // Emerald
    const colorB = new THREE.Color(0xf59e0b); // Cyber Amber/Gold
    const colorC = new THREE.Color(0x3b82f6); // Cyber Blue

    for (let i = 0; i < particleCount; i++) {
      particleCoords[i * 3] = (Math.random() - 0.5) * 160;
      particleCoords[i * 3 + 1] = (Math.random() - 0.5) * 70;
      particleCoords[i * 3 + 2] = (Math.random() - 0.5) * 110;

      const pickColor = Math.random() > 0.65 ? colorB : Math.random() > 0.3 ? colorA : colorC;
      particleColors[i * 3] = pickColor.r;
      particleColors[i * 3 + 1] = pickColor.g;
      particleColors[i * 3 + 2] = pickColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particleCoords, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    // Custom circular soft particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.7)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 5. Floating 3D Geometric Financial Holograms (Golden Coin, Icosahedron, Diamond Prism)
    const floatingGroup = new THREE.Group();

    // Golden Coin Ring
    const torusGeo = new THREE.TorusGeometry(5, 0.6, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
    });
    const torus = new THREE.Mesh(torusGeo, goldMat);
    torus.position.set(28, 8, -10);
    floatingGroup.add(torus);

    // Icosahedron (Neural AI Token)
    const icoGeo = new THREE.IcosahedronGeometry(4, 0);
    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: true,
      emissive: 0x064e3b,
      emissiveIntensity: 0.5,
    });
    const ico = new THREE.Mesh(icoGeo, emeraldMat);
    ico.position.set(-30, 6, -15);
    floatingGroup.add(ico);

    // Central Core Floating Prism
    const octGeo = new THREE.OctahedronGeometry(3.5, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.7,
      roughness: 0.25,
      wireframe: true,
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(0, 16, -25);
    floatingGroup.add(octahedron);

    scene.add(floatingGroup);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 4, 120);
    emeraldLight.position.set(-20, 20, 20);
    scene.add(emeraldLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 3, 120);
    amberLight.position.set(25, -10, 30);
    scene.add(amberLight);

    // 7. Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetMouseX = (e.clientX - windowHalfX) * 0.0008;
      targetMouseY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    // 8. Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 45;
      camera.position.y = 24 - mouseY * 30;
      camera.lookAt(0, 0, 0);

      // Animate undulating financial cashflow wave
      const posArr = positionAttribute.array as Float32Array;
      for (let i = 0; i < posArr.length; i += 3) {
        const x = basePositions[i];
        const y = basePositions[i + 1];
        // Dynamic sine/cosine yield wave calculation
        const z =
          Math.sin(x * 0.08 + elapsedTime * 1.5) * 3.8 +
          Math.cos(y * 0.09 + elapsedTime * 1.2) * 3.2 +
          Math.sin((x + y) * 0.05 + elapsedTime * 0.8) * 2.0;

        posArr[i + 2] = z;
      }
      positionAttribute.needsUpdate = true;

      // Animate floating financial shapes
      torus.rotation.x = elapsedTime * 0.4;
      torus.rotation.y = elapsedTime * 0.6;
      torus.position.y = 8 + Math.sin(elapsedTime * 1.5) * 1.8;

      ico.rotation.x = elapsedTime * 0.5;
      ico.rotation.y = elapsedTime * 0.35;
      ico.position.y = 6 + Math.cos(elapsedTime * 1.2) * 1.5;

      octahedron.rotation.y = elapsedTime * 0.8;
      octahedron.rotation.z = elapsedTime * 0.4;
      octahedron.position.y = 16 + Math.sin(elapsedTime * 2.0) * 1.2;

      // Slow particle rotation
      particleSystem.rotation.y = elapsedTime * 0.04;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      wireframeMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      torusGeo.dispose();
      goldMat.dispose();
      icoGeo.dispose();
      emeraldMat.dispose();
      octGeo.dispose();
      octMat.dispose();
      particleTexture.dispose();

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
