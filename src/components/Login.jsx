import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { WINE, BG, BORDER, TEXT, MUTED } from '../constants';
import { Field } from './ui/Field';
import { Icon } from './ui/Icon';
import { inputStyle } from './ui/inputStyle';

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
  fontWeight: 600, fontSize: 13, borderRadius: 8, transition: 'all 0.18s ease',
};

function ShaderBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.04;
        float lw = 0.0025;
        float r = 0.0; float g = 0.0; float b = 0.0;
        for(int i = 0; i < 6; i++){
          float fi = float(i);
          r += lw * fi * fi / abs(fract(t - 0.008*fi)*6.0 - length(uv) + mod(uv.x+uv.y, 0.22));
          g += lw * 0.3 / abs(fract(t - 0.01 + 0.009*fi)*5.5 - length(uv) + mod(uv.x-uv.y, 0.18));
          b += lw * 0.15 / abs(fract(t + 0.012*fi)*6.5 - length(uv) + mod(uv.x*uv.y, 0.2));
        }
        gl_FragColor = vec4(r * 1.2, g * 0.15, b * 0.1, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    scene.add(new THREE.Mesh(geometry, material));

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
}

export function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (user === 'admin' && pass === 'nodex123') {
        onLogin();
      } else {
        setErr('Credenciais inválidas. Tente novamente.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: BG,
      position: 'relative', overflow: 'hidden',
    }}>
      <ShaderBackground />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(10,10,10,0.55)' }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
            <span style={{ color: TEXT }}>NODE</span>
            <span style={{ color: WINE }}>X</span>
          </div>
          <div style={{ color: MUTED, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 8 }}>
            AGÊNCIA DE MARKETING DIGITAL
          </div>
        </div>

        <div style={{
          background: 'rgba(18,18,18,0.92)', border: `1px solid ${BORDER}`,
          borderRadius: 20, padding: 36,
          boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px ${WINE}33`,
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Entrar</div>
          <div style={{ color: MUTED, fontSize: 13, marginBottom: 32 }}>Acesse o painel de controle</div>

          <form onSubmit={submit}>
            <Field label="Usuário">
              <input
                value={user}
                onChange={(e) => { setUser(e.target.value); setErr(''); }}
                placeholder="admin"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = WINE)}
                onBlur={(e) => (e.target.style.borderColor = BORDER)}
              />
            </Field>

            <Field label="Senha">
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setErr(''); }}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={(e) => (e.target.style.borderColor = WINE)}
                  onBlur={(e) => (e.target.style.borderColor = BORDER)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex',
                  }}
                >
                  <Icon name={showPass ? 'eye_off' : 'eye'} size={16} />
                </button>
              </div>
            </Field>

            {err && (
              <div style={{
                background: '#1a0a0a', border: '1px solid #3a1818',
                borderRadius: 8, padding: '10px 14px', color: '#e05050',
                fontSize: 13, marginBottom: 20,
              }}>
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...btnBase, background: WINE, color: TEXT,
                width: '100%', justifyContent: 'center', padding: '13px',
                fontSize: 14, marginTop: 8,
                boxShadow: `0 8px 24px ${WINE}66`,
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
