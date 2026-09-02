import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeFinanceCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Custom 2026 Gen-Z Luxury Fluid Gradient Shader (Linear/Apple/Moralia style)
    // Silky smooth, organic fluid light dynamics with cursor momentum
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      varying vec2 vUv;

      // Simplex-inspired organic noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y;

        vec2 mouse = uMouse;
        mouse.x *= uResolution.x / uResolution.y;

        float t = uTime * 0.12;

        // Multi-octave fluid field
        float n1 = snoise(st * 0.8 + vec2(t * 0.4, t * 0.2));
        float n2 = snoise(st * 1.6 - vec2(t * 0.3, t * 0.5) + n1 * 0.5);
        float n3 = snoise(st * 2.4 + vec2(t * 0.2, -t * 0.3) + n2 * 0.4);

        // Distance from cursor light spotlight
        float distToMouse = distance(st, mouse);
        float mouseGlow = smoothstep(0.85, 0.0, distToMouse) * 0.45;

        // Rich luxurious palette: Deep charcoal obsidian (#0a0d0b) + Subtle emerald (#00f59b) + Warm champagne gold (#cca77c)
        vec3 bgCharcoal = vec3(0.045, 0.055, 0.048);
        vec3 emeraldCaustic = vec3(0.0, 0.96, 0.61);
        vec3 champagneGold = vec3(0.80, 0.65, 0.48);
        vec3 deepTeal = vec3(0.02, 0.12, 0.09);

        // Blend layers smoothly
        vec3 color = bgCharcoal;
        color += deepTeal * (n1 * 0.5 + 0.5);
        color += emeraldCaustic * (pow(n2 * 0.5 + 0.5, 3.2) * 0.18);
        color += champagneGold * (pow(n3 * 0.5 + 0.5, 4.0) * 0.14);
        color += emeraldCaustic * mouseGlow;

        // Subtle filmic vignette
        vec2 uvCenter = vUv - 0.5;
        float vignette = 1.0 - dot(uvCenter, uvCenter) * 0.95;
        color *= clamp(vignette, 0.0, 1.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Mouse tracking with silky lerp
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();

      // Silky interpolation for mouse spotlight
      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;
      uniforms.uMouse.value.set(mouseX, mouseY);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      material.dispose();

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
