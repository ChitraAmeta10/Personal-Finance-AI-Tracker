import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeFinanceCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // 1. Scene & Filmic Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060807, 0.002);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 52);

    // 2. High-Fidelity Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Central Morphing Liquid Mercury / Financial Quantum Core
    // High subdivision sphere with procedural vertex displacement
    const sphereRadius = 11.5;
    const sphereGeo = new THREE.IcosahedronGeometry(sphereRadius, 32);
    const posAttribute = sphereGeo.attributes.position;
    const originalPositions = posAttribute.array.slice();

    // Procedural noise vectors
    const noiseOffsets = new Float32Array(posAttribute.count);
    for (let i = 0; i < posAttribute.count; i++) {
      noiseOffsets[i] = Math.random() * Math.PI * 2;
    }

    // High-end luxury liquid chrome / dark titanium material with Fresnel rim
    const liquidChromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0f1713,
      emissive: 0x03180f,
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      wireframe: false,
    });

    const liquidCore = new THREE.Mesh(sphereGeo, liquidChromeMaterial);
    liquidCore.position.set(12, 1, -4);
    scene.add(liquidCore);

    // Subtle outer holographic wireframe cage that pulses over the liquid core
    const outerCageGeo = new THREE.IcosahedronGeometry(sphereRadius * 1.14, 2);
    const outerCageMat = new THREE.MeshBasicMaterial({
      color: 0x00f59b,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const outerCage = new THREE.Mesh(outerCageGeo, outerCageMat);
    outerCage.position.copy(liquidCore.position);
    scene.add(outerCage);

    // 4. Orbital Architectural Rings (Financial Astrolabe / Coordinate Meridian)
    const orbitalGroup = new THREE.Group();
    orbitalGroup.position.copy(liquidCore.position);

    const createFineRing = (radius: number, tiltX: number, tiltY: number, color: number) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.08, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createFineRing(15.2, Math.PI / 3, Math.PI / 6, 0x00f59b);
    const ring2 = createFineRing(17.8, -Math.PI / 4, Math.PI / 4, 0xffffff);
    const ring3 = createFineRing(20.4, Math.PI / 2.2, -Math.PI / 8, 0xd4af37);

    orbitalGroup.add(ring1);
    orbitalGroup.add(ring2);
    orbitalGroup.add(ring3);
    scene.add(orbitalGroup);

    // 5. Cinematic Floating Financial Ambient Field (Deep Space Bokeh)
    const fieldCount = 950;
    const fieldGeo = new THREE.BufferGeometry();
    const fieldCoords = new Float32Array(fieldCount * 3);
    const fieldSizes = new Float32Array(fieldCount);
    const fieldColors = new Float32Array(fieldCount * 3);

    const cWhite = new THREE.Color(0xffffff);
    const cEmerald = new THREE.Color(0x00f59b);
    const cGold = new THREE.Color(0xe6c387);
    const cMuted = new THREE.Color(0x3e5246);

    for (let i = 0; i < fieldCount; i++) {
      fieldCoords[i * 3] = (Math.random() - 0.5) * 160;
      fieldCoords[i * 3 + 1] = (Math.random() - 0.5) * 90;
      fieldCoords[i * 3 + 2] = (Math.random() - 0.5) * 100;

      fieldSizes[i] = Math.random() * 2.4 + 0.8;

      const pRand = Math.random();
      const col = pRand > 0.88 ? cGold : pRand > 0.5 ? cEmerald : pRand > 0.2 ? cWhite : cMuted;
      fieldColors[i * 3] = col.r;
      fieldColors[i * 3 + 1] = col.g;
      fieldColors[i * 3 + 2] = col.b;
    }

    fieldGeo.setAttribute("position", new THREE.BufferAttribute(fieldCoords, 3));
    fieldGeo.setAttribute("color", new THREE.BufferAttribute(fieldColors, 3));

    // Crisp circular shader particle texture
    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const dotCtx = dotCanvas.getContext("2d");
    if (dotCtx) {
      const grad = dotCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(0.6, "rgba(255, 255, 255, 0.15)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      dotCtx.fillStyle = grad;
      dotCtx.fillRect(0, 0, 64, 64);
    }
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    const fieldMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      map: dotTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ambientField = new THREE.Points(fieldGeo, fieldMat);
    scene.add(ambientField);

    // 6. Sculptural Studio Lighting (Awwwards Fashion / Automotive Look)
    const ambientStudioLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientStudioLight);

    // High key rim light (Emerald neon)
    const emeraldRim = new THREE.DirectionalLight(0x00f59b, 4.2);
    emeraldRim.position.set(-25, 25, 20);
    scene.add(emeraldRim);

    // Warm specular key light (Champagne gold)
    const goldKey = new THREE.DirectionalLight(0xe6c387, 3.2);
    goldKey.position.set(30, -15, 30);
    scene.add(goldKey);

    // Cold top fill
    const topCold = new THREE.PointLight(0x38bdf8, 2.5, 90);
    topCold.position.set(0, 35, 10);
    scene.add(topCold);

    // 7. Silky Mouse Interpolation & Velocity Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let mouseVelocity = 0;
    let lastClientX = 0;
    let lastClientY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetX = (e.clientX - halfW) / halfW;
      targetY = (e.clientY - halfH) / halfH;

      const dx = e.clientX - lastClientX;
      const dy = e.clientY - lastClientY;
      mouseVelocity = Math.sqrt(dx * dx + dy * dy) * 0.001;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Reposition on smaller screens
      if (w < 900) {
        liquidCore.position.set(0, 6, -10);
        outerCage.position.set(0, 6, -10);
        orbitalGroup.position.set(0, 6, -10);
      } else {
        liquidCore.position.set(12, 1, -4);
        outerCage.position.set(12, 1, -4);
        orbitalGroup.position.set(12, 1, -4);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);

    // 8. Fluid Render Loop with Procedural Surface Waves
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Silky lerp
      mouseX += (targetX - mouseX) * 0.045;
      mouseY += (targetY - mouseY) * 0.045;
      mouseVelocity *= 0.95;

      // Parallax camera rotation
      camera.position.x = mouseX * 8;
      camera.position.y = -mouseY * 6;
      camera.lookAt(0, 0, 0);

      // Morphing liquid surface deformation
      const posArr = posAttribute.array as Float32Array;
      const waveFreq = 0.35 + mouseVelocity * 0.5;
      const waveAmp = 1.15 + mouseVelocity * 2.0;

      for (let i = 0; i < posArr.length; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        const oz = originalPositions[i + 2];

        // Normalizing vector for radial displacement
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;

        const vIdx = i / 3;
        const offset = noiseOffsets[vIdx];

        // Complex liquid harmonic displacement
        const displacement =
          Math.sin(ox * waveFreq + elapsed * 1.8 + offset) *
          Math.cos(oy * waveFreq + elapsed * 1.4) *
          Math.sin(oz * waveFreq + elapsed * 1.1) *
          waveAmp;

        const newR = sphereRadius + displacement;
        posArr[i] = nx * newR;
        posArr[i + 1] = ny * newR;
        posArr[i + 2] = nz * newR;
      }
      posAttribute.needsUpdate = true;
      sphereGeo.computeVertexNormals();

      // Liquid core dynamic tilt and rotation
      liquidCore.rotation.y = elapsed * 0.15 + mouseX * 0.4;
      liquidCore.rotation.x = elapsed * 0.08 - mouseY * 0.3;

      outerCage.rotation.y = -elapsed * 0.1;
      outerCage.rotation.z = elapsed * 0.06;

      // Orbiting astrolabe rings
      ring1.rotation.z = elapsed * 0.2;
      ring2.rotation.z = -elapsed * 0.16;
      ring3.rotation.x = Math.PI / 2.2 + Math.sin(elapsed * 0.4) * 0.15;
      ring3.rotation.z = elapsed * 0.25;

      // Ambient particle slow cosmos drift
      ambientField.rotation.y = elapsed * 0.015;
      ambientField.rotation.x = Math.sin(elapsed * 0.02) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);

      sphereGeo.dispose();
      liquidChromeMaterial.dispose();
      outerCageGeo.dispose();
      outerCageMat.dispose();
      fieldGeo.dispose();
      fieldMat.dispose();
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
