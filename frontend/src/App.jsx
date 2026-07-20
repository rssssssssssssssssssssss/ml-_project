import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Send,
  Cpu,
  Layers,
  Settings,
  Database,
  BookOpen,
  FileText,
  Sun,
  Moon,
  Activity,
  Info,
  X,
  ArrowRight,
  Upload,
  MessageSquare,
  Mic,
  MicOff,
  Trash2
} from 'lucide-react';

// Helper to write string to DataView
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Convert Float32 PCM to 16-bit WAV
function bufferToWav(buffer, sampleRate = 16000) {
  const bufferLength = buffer.length;
  const wavBuffer = new ArrayBuffer(44 + bufferLength * 2);
  const view = new DataView(wavBuffer);
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + bufferLength * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, 1, true); // Mono channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, bufferLength * 2, true);
  
  let offset = 44;
  for (let i = 0; i < buffer.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  
  return new Blob([view], { type: 'audio/wav' });
}

// 3D Parallax Hover Utility Handlers
function handleCardMouseMove(e) {
  const card = e.currentTarget;
  const box = card.getBoundingClientRect();
  const x = e.clientX - box.left - box.width / 2;
  const y = e.clientY - box.top - box.height / 2;
  
  const factor = 8;
  const rx = -(y / (box.height / 2)) * factor;
  const ry = (x / (box.width / 2)) * factor;
  
  card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
  card.style.transition = 'none';
}

function handleCardMouseLeave(e) {
  const card = e.currentTarget;
  card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  card.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
}

// Heavy Cyber-Industrial SCADA Canvas Animator Component
function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const logs = [
      '[SYS] INITIALIZING VERNACULAR COGNITIVE MATRIX...',
      '[SYS] CONNECTING TO LOCAL OLLAMA SUITE (PORT 11434)...',
      '[SYS] LOCAL ENGINE STATUS: QWEN2.5:7B DETECTED',
      '[SYS] DUAL RETRIEVAL LAYER: VECTOR INDEX LOADED',
      '[SYS] LANGUAGE MAPPING: AI4BHARAT INDICTRANS2 (ACTIVE)',
      '[SYS] DIALECT CODES: HIN_DEVA | TAM_TAML | TEL_TELU | KAN_KNDA',
      '[SYS] SYSTEM SECURITY STATUS: CONSTRAINED RAG ACTIVE',
      '[SYS] KNOWLEDGE BASE: CLEARED (EMPTY SLATE)',
      '[SYS] FACTORY TELEMETRY DIAGNOSTICS: BALANCE OPTIMAL',
      '[SYS] WAITING FOR MANUAL PDF INGESTION...'
    ];

    let activeLogs = [];
    let logTimer = 0;

    const steamParticles = [];
    const maxSteam = 40;

    class SteamParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.vx = (Math.random() - 0.3) * 0.4;
        this.vy = -(Math.random() * 0.8 + 0.4);
        this.size = Math.random() * 20 + 10;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.growth = Math.random() * 0.15 + 0.05;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size += this.growth;
        this.opacity -= 0.0012;

        if (this.opacity <= 0 || this.y < -50) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${Math.max(0, this.opacity)})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxSteam; i++) {
      steamParticles.push(new SteamParticle());
    }

    // 3D Planetary Gear Model Generation
    const planetaryVertices = [];
    const planetaryEdges = [];

    // 1. Sun gear (center cylinder)
    const sunSegments = 12;
    const sunRadius = 0.55;
    const sunLength = 0.8;
    for (let r = 0; r < 2; r++) {
      const z = -sunLength/2 + r * sunLength;
      for (let s = 0; s < sunSegments; s++) {
        const angle = (s / sunSegments) * Math.PI * 2;
        planetaryVertices.push([Math.cos(angle) * sunRadius, Math.sin(angle) * sunRadius, z]);
      }
    }
    for (let s = 0; s < sunSegments; s++) {
      planetaryEdges.push([s, (s + 1) % sunSegments]);
      planetaryEdges.push([sunSegments + s, sunSegments + ((s + 1) % sunSegments)]);
      planetaryEdges.push([s, sunSegments + s]);
    }

    // 2. Planets (3 orbiting gear assemblies)
    const numPlanets = 3;
    const planetRadius = 0.38;
    const planetSegments = 8;
    const orbitRadius = 1.25;

    for (let p = 0; p < numPlanets; p++) {
      const orbitAngle = (p / numPlanets) * Math.PI * 2;
      const cx = Math.cos(orbitAngle) * orbitRadius;
      const cy = Math.sin(orbitAngle) * orbitRadius;
      
      const baseIndex = planetaryVertices.length;
      
      for (let r = 0; r < 2; r++) {
        const z = -sunLength/2 + r * sunLength;
        for (let s = 0; s < planetSegments; s++) {
          const angle = (s / planetSegments) * Math.PI * 2;
          planetaryVertices.push([
            cx + Math.cos(angle) * planetRadius,
            cy + Math.sin(angle) * planetRadius,
            z
          ]);
        }
      }
      
      for (let s = 0; s < planetSegments; s++) {
        planetaryEdges.push([baseIndex + s, baseIndex + ((s + 1) % planetSegments)]);
        planetaryEdges.push([baseIndex + planetSegments + s, baseIndex + planetSegments + ((s + 1) % planetSegments)]);
        planetaryEdges.push([baseIndex + s, baseIndex + planetSegments + s]);
      }
    }

    // 3. Ring Gear (outer gear casing)
    const ringSegments = 18;
    const ringRadius = 1.95;
    const ringBase = planetaryVertices.length;
    for (let r = 0; r < 2; r++) {
      const z = -sunLength/2 + r * sunLength;
      for (let s = 0; s < ringSegments; s++) {
        const angle = (s / ringSegments) * Math.PI * 2;
        planetaryVertices.push([Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, z]);
      }
    }
    for (let s = 0; s < ringSegments; s++) {
      planetaryEdges.push([ringBase + s, ringBase + ((s + 1) % ringSegments)]);
      planetaryEdges.push([ringBase + ringSegments + s, ringBase + ringSegments + ((s + 1) % ringSegments)]);
      planetaryEdges.push([ringBase + s, ringBase + ringSegments + s]);
    }

    // 3D Gyroscope Cube Model Generation
    const cubeVertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    const project = (point, angleX, angleY, scale, cx, cy) => {
      let [x, y, z] = point;
      
      const radY = angleY * Math.PI / 180;
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      
      const radX = angleX * Math.PI / 180;
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      
      const fov = 380;
      const distance = 4.5;
      const projX = (x1 * fov) / (z2 + distance) * scale + cx;
      const projY = (y2 * fov) / (z2 + distance) * scale + cy;
      
      return [projX, projY];
    };

    let pulseTime = 0;

    const draw3DWireframe = (vertices, edges, angleX, angleY, scale, cx, cy, color, drawPulses = false) => {
      const projected = vertices.map(v => project(v, angleX, angleY, scale, cx, cy));
      
      ctx.beginPath();
      edges.forEach(([u, v]) => {
        ctx.moveTo(projected[u][0], projected[u][1]);
        ctx.lineTo(projected[v][0], projected[v][1]);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.0;
      ctx.stroke();
      
      projected.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color.replace('0.14', '0.5').replace('0.08', '0.35');
        ctx.fill();
      });

      if (drawPulses) {
        ctx.lineWidth = 2.0;
        edges.forEach(([u, v], idx) => {
          if (idx % 3 === 0) {
            const t = (pulseTime + idx * 0.12) % 1.0;
            const p1 = vertices[u];
            const p2 = vertices[v];
            
            const px = p1[0] + t * (p2[0] - p1[0]);
            const py = p1[1] + t * (p2[1] - p1[1]);
            const pz = p1[2] + t * (p2[2] - p1[2]);
            
            const [projX, projY] = project([px, py, pz], angleX, angleY, scale, cx, cy);
            
            ctx.beginPath();
            ctx.arc(projX, projY, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
            ctx.fill();
          }
        });
      }
    };

    let rotationAngle = 0;
    let waveOffset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      rotationAngle += 0.35;
      waveOffset += 0.15;
      pulseTime += 0.008;

      steamParticles.forEach((p) => {
        p.update();
        p.draw();
      });

      const cx = width * 0.48;
      const cy = height * 0.46;

      // Draw HUD Radar grid scan lines
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.02)';
      ctx.beginPath();
      ctx.moveTo(cx - 260, cy); ctx.lineTo(cx + 260, cy);
      ctx.moveTo(cx, cy - 260); ctx.lineTo(cx, cy + 260);
      ctx.stroke();

      // Render 3D Planetary Gear Assembly (Orange Wireframe + Cyan Pulses)
      draw3DWireframe(planetaryVertices, planetaryEdges, rotationAngle * 0.3, rotationAngle * 0.45, 1.25, cx, cy, 'rgba(249, 115, 22, 0.09)', true);
      
      // Render 3D rotating Gyroscope Cube (Faint Cyan Casing)
      draw3DWireframe(cubeVertices, cubeEdges, rotationAngle * 0.8, rotationAngle * 1.2, 45, width - 110, height - 240, 'rgba(6, 182, 212, 0.14)');

      // Draw Target brackets
      const hw = 260;
      const hh = 190;
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.15)';
      ctx.lineWidth = 1.2;
      
      ctx.beginPath();
      ctx.moveTo(cx - hw/2, cy - hh/2 + 15); ctx.lineTo(cx - hw/2, cy - hh/2); ctx.lineTo(cx - hw/2 + 15, cy - hh/2);
      ctx.moveTo(cx + hw/2, cy - hh/2 + 15); ctx.lineTo(cx + hw/2, cy - hh/2); ctx.lineTo(cx + hw/2 - 15, cy - hh/2);
      ctx.moveTo(cx - hw/2, cy + hh/2 - 15); ctx.lineTo(cx - hw/2, cy + hh/2); ctx.lineTo(cx - hw/2 + 15, cy + hh/2);
      ctx.moveTo(cx + hw/2, cy + hh/2 - 15); ctx.lineTo(cx + hw/2, cy + hh/2); ctx.lineTo(cx + hw/2 - 15, cy + hh/2);
      ctx.stroke();

      ctx.font = "8px 'JetBrains Mono', Consolas, monospace";
      ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
      ctx.fillText('CORE: PLANETARY TRANSMISSION', cx - hw/2, cy - hh/2 - 6);
      ctx.fillText('LOCK: TARGET NOMINAL', cx + hw/2 - 105, cy - hh/2 - 6);
      ctx.fillText('HYDRAULIC FLOW: 14.5 GPM', cx - hw/2, cy + hh/2 + 12);
      ctx.fillText('SPEED: 1850 RPM', cx + hw/2 - 75, cy + hh/2 + 12);

      logTimer++;
      if (logTimer % 80 === 0) {
        const nextIdx = activeLogs.length % logs.length;
        activeLogs.push(logs[nextIdx]);
        if (activeLogs.length > 5) {
          activeLogs.shift();
        }
      }

      ctx.font = "11px 'JetBrains Mono', Consolas, monospace";
      ctx.fillStyle = 'rgba(249, 115, 22, 0.45)';
      ctx.fillText('DIAGNOSTIC CONSOLE FEED:', 30, height - 120);

      activeLogs.forEach((logLine, idx) => {
        ctx.fillStyle = idx === activeLogs.length - 1 ? 'rgba(249, 115, 22, 0.75)' : 'rgba(249, 115, 22, 0.35)';
        ctx.fillText(logLine, 30, height - 100 + idx * 16);
      });

      const graphX = width - 240;
      const graphY = height - 120;
      const graphW = 210;
      const graphH = 65;

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let g = 0; g <= 4; g++) {
        const lineY = graphY + (graphH * g) / 4;
        ctx.moveTo(graphX, lineY);
        ctx.lineTo(graphX + graphW, lineY);
      }
      for (let g = 0; g <= 6; g++) {
        const lineX = graphX + (graphW * g) / 6;
        ctx.moveTo(lineX, graphY);
        ctx.lineTo(lineX, graphY + graphH);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.22)';
      ctx.strokeRect(graphX, graphY, graphW, graphH);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < graphW; x++) {
        const sineVal = Math.sin(x * 0.06 - waveOffset) * (graphH / 2.8);
        const yCoord = graphY + graphH / 2 + sineVal;
        if (x === 0) ctx.moveTo(graphX, yCoord);
        else ctx.lineTo(graphX + x, yCoord);
      }
      ctx.stroke();

      ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.font = "8px 'JetBrains Mono', Consolas, monospace";
      ctx.fillText('COOLANT HYDRAULIC PRESSURE (WAVE)', graphX, graphY - 8);

      const gaugeX = graphX - 45;
      const gaugeY = graphY + graphH / 2;
      const gaugeR = 25;

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.2)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, gaugeR, Math.PI, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.lineWidth = 1;
      for (let t = 0; t <= 5; t++) {
        const ang = Math.PI + (t * Math.PI) / 5;
        const scaleRadius = t % 5 === 0 ? gaugeR - 6 : gaugeR - 4;
        ctx.beginPath();
        ctx.moveTo(gaugeX + Math.cos(ang) * scaleRadius, gaugeY + Math.sin(ang) * scaleRadius);
        ctx.lineTo(gaugeX + Math.cos(ang) * gaugeR, gaugeY + Math.sin(ang) * gaugeR);
        ctx.stroke();
      }

      const randomJitter = (Math.random() - 0.5) * 0.12;
      const needleAngle = Math.PI + Math.PI * 0.6 + randomJitter;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gaugeX, gaugeY);
      ctx.lineTo(gaugeX + Math.cos(needleAngle) * (gaugeR - 6), gaugeY + Math.sin(needleAngle) * (gaugeR - 6));
      ctx.stroke();

      ctx.fillStyle = 'rgba(249, 115, 22, 0.7)';
      ctx.beginPath();
      ctx.arc(gaugeX, gaugeY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillText('PSI', gaugeX - 7, gaugeY + 12);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none'
      }}
    />
  );
}

// Collapsible References Helper Sub-component
function MessageSources({ chunks, onViewChunk }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ marginTop: '8px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="message-meta-toggle"
        type="button"
      >
        <Info size={12} />
        {isOpen ? 'Hide Retrieved Knowledge Context' : `View ${chunks.length} Retrieved Source Chunks`}
      </button>

      {isOpen && (
        <div className="message-source-panel">
          <div className="source-header">Retrieved Context Sources:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {chunks.map((chunk, idx) => (
              <div
                key={idx}
                className="source-item-ref"
                style={{ cursor: 'pointer' }}
                onClick={() => onViewChunk(chunk)}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="source-item-ref-title">
                  <span>{chunk.document} - {chunk.title}</span>
                  <span style={{ color: 'var(--success)' }}>{chunk.confidence}% match</span>
                </div>
                <p className="source-item-ref-body">{chunk.content.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Monolithic Single File orchestrator React component
export default function App() {
  // Navigation states
  const [isEntered, setIsEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);

  const handleViewportMouseMove = (e) => {
    const workspace = document.querySelector('.app-container');
    const landing = document.querySelector('.landing-content');
    const board = workspace || landing;
    if (!board) return;
    
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = e.clientX - w / 2;
    const y = e.clientY - h / 2;
    
    const factorX = 6;
    const factorY = 8;
    const rx = -(y / (h / 2)) * factorX + 3;
    const ry = (x / (w / 2)) * factorY - 4;
    
    board.style.transform = `perspective(2000px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(0.5deg) scale3d(0.99, 0.99, 0.99)`;
  };

  const handleViewportMouseLeave = () => {
    const workspace = document.querySelector('.app-container');
    const landing = document.querySelector('.landing-content');
    const board = workspace || landing;
    if (board) {
      board.style.transform = 'perspective(2000px) rotateX(3deg) rotateY(-4deg) rotateZ(0.5deg) scale3d(1, 1, 1)';
    }
  };




  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Connection settings
  const [backendUrl, setBackendUrl] = useState('');
  const [connectionMode, setConnectionMode] = useState('live');
  const [modelName, setModelName] = useState('qwen2.5:7b');
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState({ connected: false, modelInstalled: false, details: '' });

  // Chat log states
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Welcome to your Vernacular RAG Workspace. Upload your PDF technical guides, SOPs, or company policies using the sidebar dropzone. You can toggle output languages at the top right.',
      language: 'English',
      status: 'success',
      connection: 'internal'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [loading, setLoading] = useState(false);



  // RAG Visualizer Panel states
  const [activeStep, setActiveStep] = useState(0); 
  const [currentQueryText, setCurrentQueryText] = useState('');
  const [retrievedChunks, setRetrievedChunks] = useState([]);
  const [systemPromptBuilt, setSystemPromptBuilt] = useState('');
  const [lastModelUsed, setLastModelUsed] = useState('qwen2.5:7b');
  const [queryTranslation, setQueryTranslation] = useState('');

  // Detail modal state
  const [activeModalChunk, setActiveModalChunk] = useState(null);

  // PDF Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dynamicDocs, setDynamicDocs] = useState([]);

  const messagesEndRef = useRef(null);

  // Theme Sync
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Ping backend health check on mount and interval
  const checkBackendHealth = async (url) => {
    try {
      const response = await axios.get(`${url}/api/health`, { timeout: 5000 });
      if (response.data.status === 'healthy' || response.data.status === 'degraded') {
        setIsBackendOnline(true);
        setOllamaStatus({
          connected: response.data.ollamaConnected,
          modelInstalled: response.data.modelInstalled,
          details: `Ollama: ${response.data.ollamaConnected ? 'Online' : 'Offline'} | Translation: ${response.data.translationEngine}`
        });
        
        // Auto-sync documents list
        try {
          const docsRes = await axios.get(`${url}/api/documents`);
          if (docsRes.data && docsRes.data.success) {
            setDynamicDocs(docsRes.data.documents || []);
          }
        } catch (docsErr) {
          console.warn('Failed to sync documents list during health check:', docsErr.message);
        }
      } else {
        setIsBackendOnline(false);
        setOllamaStatus({ connected: false, modelInstalled: false, details: 'API offline. Sandbox simulation mode active.' });
      }
    } catch (error) {
      setIsBackendOnline(false);
      setOllamaStatus({ connected: false, modelInstalled: false, details: 'Server offline. Sandbox simulation mode active.' });
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/documents`);
      if (res.data && res.data.success) {
        setDynamicDocs(res.data.documents || []);
      }
    } catch (err) {
      console.warn('Failed to fetch indexed documents list from backend:', err.message);
    }
  };

  useEffect(() => {
    checkBackendHealth(backendUrl);
    const timer = setInterval(() => checkBackendHealth(backendUrl), 5000);
    return () => clearInterval(timer);
  }, [backendUrl]);

  useEffect(() => {
    if (isBackendOnline) {
      fetchDocuments();
    }
  }, [isBackendOnline]);

  // Enter Copilot action (transition triggers with mechanical steel shutters)
  const handleLaunchWorkspace = () => {
    setZoomActive(true);
    setTimeout(() => {
      setIsExiting(true);
    }, 450);
    setTimeout(() => {
      setIsEntered(true);
      setZoomActive(false);
      setIsExiting(false);
    }, 1100);
  };

  // Handle PDF file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Only PDF files are supported.');
      return;
    }

    try {
      setUploading(true);
      const useBackend = isBackendOnline && connectionMode === 'live';

      if (useBackend) {
        setUploadStatus('Uploading PDF...');
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${backendUrl}/api/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          setDynamicDocs(prev => [...prev, {
            name: response.data.filename,
            category: 'User Uploaded',
            chunks: response.data.chunksCount
          }]);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'assistant',
            text: `Successfully uploaded and indexed "${response.data.filename}". Text extracted, partitioned into ${response.data.chunksCount} chunks, and added to the active RAG search library. You can now query topics inside this file!`,
            language: 'english',
            status: 'success',
            connection: 'internal'
          }]);
        }
      } else {
        setUploadStatus('Extracting...');
        await new Promise(r => setTimeout(r, 800));
        alert('Local Express server is offline. Sandbox mode cannot extract text from binary PDF files. Please connect to the backend server (Live Mode) to parse your PDF manuals.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to parse PDF: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
      setUploadStatus('');
    }
  };

  const handleDeleteDocument = async (filename) => {
    if (!confirm(`Are you sure you want to delete "${filename}" and remove its chunks from the RAG search database?`)) {
      return;
    }
    try {
      const res = await axios.delete(`${backendUrl}/api/documents/${encodeURIComponent(filename)}`);
      if (res.data && res.data.success) {
        fetchDocuments();
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'assistant',
          text: `Successfully deleted document "${filename}". Chunks were removed from storage and memory.`,
          language: selectedLanguage,
          status: 'success',
          connection: 'internal'
        }]);
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document: ' + (error.response?.data?.error || error.message));
    }
  };

  // Handle message submission
  const handleSendMessage = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const finalQueryText = textOverride ? textOverride.trim() : inputValue.trim();
    if (!finalQueryText || loading) return;

    const userMessageText = finalQueryText;
    setInputValue('');
    setLoading(true);
    setCurrentQueryText(userMessageText);
    setQueryTranslation('');

    // Append user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: userMessageText,
      language: selectedLanguage
    }]);

    // Bypassed client-side empty block to defer database logic to backend.

    // RAG Visualizer Pipeline Animation Steps
    setActiveStep(1);
    await new Promise(r => setTimeout(r, 600));

    setActiveStep(2);
    await new Promise(r => setTimeout(r, 600));

    setRetrievedChunks([]);
    setActiveStep(3);

    const mockSystemPrompt = `You are a RAG assistant. Output strictly in: ${selectedLanguage}.\nNo document chunks found client-side. Make sure backend is connected.`;
    setSystemPromptBuilt(mockSystemPrompt);

    await new Promise(r => setTimeout(r, 600));

    setActiveStep(4);

    try {
      const useBackend = isBackendOnline && connectionMode === 'live';

      let responseData;
      if (useBackend) {
        const res = await axios.post(`${backendUrl}/api/chat`, {
          message: userMessageText,
          language: selectedLanguage,
          mode: 'live',
          model: modelName
        });
        responseData = res.data;
      } else {
        await new Promise(r => setTimeout(r, 1000));
        const clientAnswer = `[Offline Mode] Express backend is disconnected. PDF parsing and vector RAG querying require an active connection to the Node.js Express backend.`;
        responseData = {
          status: 'simulated',
          answer: clientAnswer,
          chunks: [],
          prompt: mockSystemPrompt,
          modelUsed: `${modelName} (Offline)`,
          connection: 'simulated'
        };
      }

      setActiveStep(5);
      setRetrievedChunks(responseData.chunks || []);
      setSystemPromptBuilt(responseData.prompt || mockSystemPrompt);
      setLastModelUsed(responseData.modelUsed || modelName);
      setQueryTranslation(responseData.translatedQuery || '');

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'assistant',
        text: responseData.answer,
        language: selectedLanguage,
        chunks: responseData.chunks || [],
        status: responseData.status,
        prompt: responseData.prompt,
        connection: responseData.connection,
        rawQuery: userMessageText
      }]);
    } catch (err) {
      console.error(err);
      setActiveStep(5);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'assistant',
        text: `Error connecting to backend: ${err.message}. Please verify the Node.js server is active and running on port 5000.`,
        language: selectedLanguage,
        chunks: [],
        status: 'error',
        connection: 'offline'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageLabel = (lang) => {
    const labels = {
      english: 'English',
      hindi: 'Hindi (हिंदी)',
      tamil: 'Tamil (தமிழ்)',
      telugu: 'Telugu (తెలుగు)',
      kannada: 'Kannada (ಕನ್ನಡ)'
    };
    return labels[lang] || lang;
  };

  // Speech Recognition States
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceLanguage, setVoiceLanguage] = useState('english');
  const recognitionRef = useRef(null);

  // Fallback Audio Recording Refs
  const audioContextRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const micSourceRef = useRef(null);
  const audioSamplesRef = useRef([]);
  const recordingStreamRef = useRef(null);

  const startLocalAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      
      micSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      audioSamplesRef.current = [];
      scriptProcessorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioSamplesRef.current.push(...inputData);
      };
      
      micSourceRef.current.connect(scriptProcessorRef.current);
      scriptProcessorRef.current.connect(audioContextRef.current.destination);
    } catch (e) {
      console.warn('Failed to start local audio recording fallback:', e);
    }
  };

  const stopLocalAudioRecording = () => {
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
        micSourceRef.current.disconnect();
      } catch (e) {
        console.warn(e);
      }
      scriptProcessorRef.current = null;
      micSourceRef.current = null;
    }
    
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn(e);
      }
      audioContextRef.current = null;
    }
    
    if (recordingStreamRef.current) {
      try {
        recordingStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn(e);
      }
      recordingStreamRef.current = null;
    }
    
    if (audioSamplesRef.current.length > 0) {
      return bufferToWav(audioSamplesRef.current, 16000);
    }
    return null;
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const currentText = finalTranscript || interimTranscript;
        setVoiceTranscript(currentText);
        
        if (currentText.trim()) {
          setInputValue(currentText);
        }
        
        if (finalTranscript.trim()) {
          handleSendMessage(null, finalTranscript);
          setShowVoiceModal(false);
          recognition.stop();
          stopLocalAudioRecording();
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'network') {
          setVoiceTranscript('Local browser dictation offline. Using server voice translation... Keep speaking and click SEND QUERY when done.');
        } else if (event.error === 'not-allowed') {
          setVoiceTranscript('Microphone blocked: Please grant microphone access in browser settings.');
        } else {
          setVoiceTranscript(`Local recognition warning: ${event.error}. You can still click SEND QUERY.`);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const handleVoiceLangChange = (newLang) => {
    setVoiceLanguage(newLang);
    if (recognitionRef.current) {
      const wasListening = isListening;
      if (wasListening) {
        recognitionRef.current.stop();
      }
      
      const langCodes = {
        english: 'en-US',
        hindi: 'hi-IN',
        tamil: 'ta-IN',
        telugu: 'te-IN',
        kannada: 'kn-IN',
        marathi: 'mr-IN',
        bengali: 'bn-IN',
        gujarati: 'gu-IN',
        malayalam: 'ml-IN',
        punjabi: 'pa-IN',
        urdu: 'ur-PK'
      };
      recognitionRef.current.lang = langCodes[newLang.toLowerCase()] || 'en-US';
      
      if (wasListening) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn(e);
          }
        }, 300);
      }
    }
  };

  const startVoiceCapture = async () => {
    setVoiceTranscript('');
    setInputValue('');
    setVoiceLanguage(selectedLanguage);
    setShowVoiceModal(true);
    
    // Start background WAV PCM recording
    await startLocalAudioRecording();
    
    if (!recognitionRef.current) {
      console.warn('SpeechRecognition is not supported natively in this browser.');
      return;
    }
    
    const langCodes = {
      english: 'en-US',
      hindi: 'hi-IN',
      tamil: 'ta-IN',
      telugu: 'te-IN',
      kannada: 'kn-IN',
      marathi: 'mr-IN',
      bengali: 'bn-IN',
      gujarati: 'gu-IN',
      malayalam: 'ml-IN',
      punjabi: 'pa-IN',
      urdu: 'ur-PK'
    };
    recognitionRef.current.lang = langCodes[selectedLanguage.toLowerCase()] || 'en-US';
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Speech recognition already active', e);
    }
  };

  const stopVoiceCapture = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceSend = async () => {
    stopVoiceCapture();
    setShowVoiceModal(false);
    
    // Process local PCM recording WAV blob
    const wavBlob = stopLocalAudioRecording();
    
    // Check if the browser's cloud dictation succeeded
    const browserTranscript = voiceTranscript.trim() || inputValue.trim();
    if (browserTranscript && !browserTranscript.startsWith('Local browser dictation') && !browserTranscript.startsWith('Microphone blocked') && !browserTranscript.startsWith('Local recognition warning')) {
      handleSendMessage(null, browserTranscript);
      return;
    }
    
    // Otherwise trigger python transcription fallback
    if (wavBlob) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('audio', wavBlob, 'recording.wav');
        formData.append('language', voiceLanguage);
        
        const res = await axios.post(`${backendUrl}/api/transcribe`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (res.data && res.data.transcript) {
          const finalVal = res.data.transcript;
          setInputValue(finalVal);
          handleSendMessage(null, finalVal);
        } else {
          alert('Could not transcribe audio. Please type your query.');
        }
      } catch (err) {
        console.error('Server transcription fallback failed:', err);
        alert('Server transcription failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVoiceCancel = () => {
    stopVoiceCapture();
    stopLocalAudioRecording();
    setShowVoiceModal(false);
    setInputValue('');
  };

  const handleVoiceRetry = async () => {
    setVoiceTranscript('');
    setInputValue('');
    stopLocalAudioRecording();
    await startLocalAudioRecording();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // 1. RENDER BOOT SCREEN
  if (!isEntered) {
    return (
      <div 
        className="perspective-viewport"
        onMouseMove={handleViewportMouseMove}
        onMouseLeave={handleViewportMouseLeave}
      >
        <div className={`landing-container ${isExiting ? 'exit' : ''}`}>
        <div className="landing-bg-img" />
        <div className="blueprint-grid-overlay" />
        <div className="hazard-bar-top" />
        <div className="hazard-bar-bottom" />
        <div className="scanline" />
        <CanvasBackground />

        <div className="landing-content">
          <div className="landing-header">
            <span className="landing-badge">Factory Cognitive Core</span>
            <h1 className="landing-title glitch-title">
              Vernacular Industrial <span className="gradient-text">RAG Chatbot</span>
            </h1>
            <p className="landing-subtitle">
              Query mechanical manuals, blueprints, and safety regulations in your native language.
              Factual, context-verified answers pulled in real-time.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-card-inner">
                <div className="feature-icon-box">📁</div>
                <h3 className="feature-title">PDF Extraction</h3>
                <p className="feature-desc">Upload operating manuals. Files are parsed, chunked, and indexed on-the-fly inside local memory.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-card-inner">
                <div className="feature-icon-box">🗣️</div>
                <h3 className="feature-title">IndicTrans2 Suite</h3>
                <p className="feature-desc">High-precision language translation. Converts queries and responses seamlessly using AI4Bharat.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-card-inner">
                <div className="feature-icon-box">🧠</div>
                <h3 className="feature-title">Qwen2.5 Generator</h3>
                <p className="feature-desc">Restricts answers exclusively to the retrieved contexts, preventing LLM hallucinations.</p>
              </div>
            </div>
          </div>

          <div className="cta-area">
            <button className="btn-launch" onClick={handleLaunchWorkspace}>
              Launch Chatbot Workspace
              <ArrowRight size={18} />
              <div className="btn-launch-glow" />
            </button>
            <span className="cta-subtext">Industrial SCADA Terminal Active</span>
          </div>
        </div>

        <div className={`shutter-door shutter-top ${zoomActive ? 'active' : ''}`}>
          <div className="shutter-door-label">SYS LOCK: ACCESSING SYSTEM CORE</div>
        </div>
        <div className={`shutter-door shutter-bottom ${zoomActive ? 'active' : ''}`}>
          <div className="shutter-door-label">ENGINES ONLINE: BOOTING COGNITIVE RAG</div>
        </div>
      </div>
    </div>
  );
}

  // 2. RENDER MAIN COGNITIVE COCKPIT
  return (
    <div 
      className="perspective-viewport"
      onMouseMove={handleViewportMouseMove}
      onMouseLeave={handleViewportMouseLeave}
    >
      <div className="app-container">
      <header className="app-header">
        <div className="brand-section">
          <div className="logo-container">🤖</div>
          <div>
            <h1 className="brand-title">Vernacular Industrial RAG</h1>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}>Local Ollama Qwen2.5:7B Pipeline</p>
          </div>
        </div>

        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`status-dot ${isBackendOnline ? '' : 'offline'}`} />
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              {isBackendOnline ? 'Express Connected' : 'Local Sandbox Mode'}
            </span>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="btn-theme-toggle"
            title="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Left Sidebar Panel */}
      <aside className="sidebar-panel">
        <div className="sidebar-section">
          <span className="section-label">
            <Settings size={14} /> Server Configuration
          </span>
          <div className="config-card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
            <div className="form-group">
              <label className="form-label">Express Backend URL</label>
              <input
                type="text"
                className="input-control"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="Auto-configured proxy"
              />
              <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '3px' }}>Leave blank to auto-route via sandbox proxy (recommended).</p>
            </div>

            <div className="form-group">
              <label className="form-label">Ollama Model</label>
              <input
                type="text"
                className="input-control"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="qwen2.5:7b"
              />
            </div>

            <div className="toggle-group">
              <div>
                <span className="form-label">Connection Mode</span>
                <p className="switch-label-desc">Toggle backend vs browser simulation</p>
              </div>
              <label className="switch-control">
                <input
                  type="checkbox"
                  checked={connectionMode === 'live'}
                  onChange={() => setConnectionMode(connectionMode === 'live' ? 'simulated' : 'live')}
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="telemetry-widget" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px 10px', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: 'rgba(0,0,0,0.15)', 
              fontSize: '0.72rem', 
              border: '1px solid var(--card-border)',
              marginTop: '12px',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={`warning-beacon ${isBackendOnline ? 'online' : 'offline'}`} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-color)' }}>System Diagnostic</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.62rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                    {ollamaStatus.details || 'Awaiting telemetry...'}
                  </div>
                </div>
              </div>
              <div className={`telemetry-fan ${loading ? 'processing' : ''}`} title="Core cooling fan speed">
                <div className="telemetry-fan-blades" />
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="section-label">
            <Database size={14} /> Knowledge Base Documents
          </span>
          <div className="sidebar-section" style={{ gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
            {dynamicDocs.length === 0 ? (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px', border: '1px dashed var(--card-border)', borderRadius: 'var(--radius-sm)' }}>
                No manuals loaded.
              </div>
            ) : (
              dynamicDocs.map((doc, idx) => (
                <div key={idx} className="doc-item" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                  <div className="doc-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <FileText size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span title={doc.name} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span className="doc-badge">{doc.chunks} Chunks</span>
                    <button
                      type="button"
                      className="btn-doc-delete"
                      title="Delete manual"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.name);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '4px' }}>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 10px',
                border: '2px dashed var(--card-border)',
                borderRadius: 'var(--radius-md)',
                cursor: uploading ? 'not-allowed' : 'pointer',
                backgroundColor: 'rgba(255,255,255,0.015)',
                transition: 'all 0.2s ease',
              }}
              className="upload-dropzone"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={uploading}
              />

              {uploading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'arrowPulse 1s infinite linear' }}></div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{uploadStatus}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
                  <Upload size={18} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-color)' }}>Upload PDF Manual</span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Click or drag to index</span>
                </div>
              )}
            </label>
          </div>

          <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', padding: '6px', border: '1px dashed var(--card-border)', borderRadius: 'var(--radius-sm)' }}>
            <Info size={14} style={{ flexShrink: 0 }} />
            <span>Search targets your uploaded files in real-time.</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Activity size={14} />
            <span>Vite Sandbox: Node.js V18+</span>
          </div>
        </div>
      </aside>

      {/* Center Chat Panel */}
      <main className="chat-panel">
        <div className="chat-header">
          <div className="chat-title-info">
            <div className={`status-dot ${isBackendOnline && connectionMode === 'live' ? '' : 'offline'}`} />
            <div>
              <h2 className="chat-header-title">Industrial RAG Chatbot</h2>
              <p className="chat-header-subtitle">
                {connectionMode === 'live' && isBackendOnline ? `Live Ollama RAG Active` : `Client Simulator Active`}
              </p>
            </div>
          </div>

          <div className="language-selector">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Output Language:</span>
            <select
              className="select-control"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi (हिंदी)</option>
              <option value="tamil">Tamil (தமிழ்)</option>
              <option value="telugu">Telugu (తెలుగు)</option>
              <option value="kannada">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 1 && dynamicDocs.length === 0 ? (
            <div className="empty-chat">
              <MessageSquare size={36} className="empty-chat-icon" />
              <h3 className="empty-chat-title">Your library is empty</h3>
              <p className="empty-chat-desc">
                Drag and drop or click the **Upload PDF Manual** button in the sidebar to index a document.
                Once indexed, the chatbot will read from your file to answer your queries in your native language.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className="message-sender">
                  {msg.sender === 'user' ? 'Operator' : 'AI Assistant'}
                  {msg.sender === 'assistant' && ` • Response in ${getLanguageLabel(msg.language)}`}
                </div>
                <div className="message-bubble" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>

                  {msg.sender === 'assistant' && msg.chunks && msg.chunks.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--card-border)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', color: 'var(--text-muted)' }}>
                          RAG Connection: {msg.connection}
                        </span>
                        <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--card-border)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', color: 'var(--text-muted)' }}>
                          Model: {lastModelUsed}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'assistant' && msg.chunks && msg.chunks.length > 0 && (
                  <MessageSources
                    chunks={msg.chunks}
                    onViewChunk={(chunk) => setActiveModalChunk(chunk)}
                  />
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="message-wrapper assistant">
              <div className="message-sender">AI Assistant is thinking...</div>
              <div className="message-bubble" style={{ minWidth: '180px' }}>
                <div className="skeleton-loader" style={{ width: '100%', marginBottom: '8px' }}></div>
                <div className="skeleton-loader" style={{ width: '90%', marginBottom: '8px' }}></div>
                <div className="skeleton-loader" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <form onSubmit={handleSendMessage} className="chat-form">
            <button
              type="button"
              onClick={startVoiceCapture}
              className={`btn-voice ${isListening ? 'listening' : ''}`}
              title="Speak your query"
              disabled={loading}
            >
              <Mic size={18} />
            </button>
            <input
              type="text"
              className="textarea-control"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about the uploaded PDF manuals..."
              disabled={loading}
            />
            <button
              type="submit"
              className="btn-send"
              disabled={loading || !inputValue.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>

      {/* Right RAG Pipeline Visualizer Panel */}
      <aside className="visualizer-panel">
        <h2 className="visualizer-title">
          <Layers size={16} style={{ color: 'var(--primary)' }} />
          RAG Pipeline Analyzer
        </h2>

        <div className="pipeline-card">
          <div className="pipeline-connector"></div>

          <div className={`pipeline-step ${activeStep >= 1 ? (activeStep === 1 ? 'active' : 'completed') : ''}`}>
            <div className="pipeline-step-dot">1</div>
            <div className="pipeline-step-content">
              <span className="pipeline-step-title">Query Language Processed</span>
              <span className="pipeline-step-desc">
                {activeStep >= 1 ? (
                  queryTranslation
                    ? `IndicTrans2: "${currentQueryText}" ➔ "${queryTranslation}"`
                    : `Query language: ${selectedLanguage.toUpperCase()}`
                ) : 'Waiting for query...'}
              </span>
            </div>
          </div>

          <div className={`pipeline-step ${activeStep >= 2 ? (activeStep === 2 ? 'active' : 'completed') : ''}`}>
            <div className="pipeline-step-dot">2</div>
            <div className="pipeline-step-content">
              <span className="pipeline-step-title">Dataset Semantic Search</span>
              <span className="pipeline-step-desc">
                {activeStep >= 2 ? `Scanning files for keywords...` : 'Inactive'}
              </span>
            </div>
          </div>

          <div className={`pipeline-step ${activeStep >= 3 ? (activeStep >= 3 ? (activeStep === 3 ? 'active' : 'completed') : '') : ''}`}>
            <div className="pipeline-step-dot">3</div>
            <div className="pipeline-step-content">
              <span className="pipeline-step-title">Context Chunk Retrieval</span>
              <span className="pipeline-step-desc">
                {activeStep >= 3 ? `Retrieved ${retrievedChunks.length} documents matching terms.` : 'Inactive'}
              </span>
            </div>
          </div>

          <div className={`pipeline-step ${activeStep >= 4 ? (activeStep === 4 ? 'active' : 'completed') : ''}`}>
            <div className="pipeline-step-dot">4</div>
            <div className="pipeline-step-content">
              <span className="pipeline-step-title">Ollama Instruction Prompt</span>
              <span className="pipeline-step-desc">
                {activeStep >= 4 ? `Context loaded. Prompting Qwen2.5:7B...` : 'Inactive'}
              </span>
            </div>
          </div>

          <div className={`pipeline-step ${activeStep >= 5 ? 'completed' : ''}`}>
            <div className="pipeline-step-dot">5</div>
            <div className="pipeline-step-content">
              <span className="pipeline-step-title">Vernacular Translation (IndicTrans2)</span>
              <span className="pipeline-step-desc">
                {activeStep >= 5
                  ? (selectedLanguage !== 'english' ? 'IndicTrans2: Output translated back.' : 'English output completed.')
                  : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="section-label">
            <BookOpen size={12} /> Retrieved Chunks ({retrievedChunks.length})
          </span>

          {retrievedChunks.length === 0 ? (
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px', border: '1px dashed var(--card-border)', borderRadius: 'var(--radius-md)' }}>
              No chunks retrieved yet. Send a query to analyze the retrieval.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {retrievedChunks.map((chunk, i) => (
                <div
                  key={chunk.id || i}
                  className="retrieved-chunk-card"
                  onClick={() => setActiveModalChunk(chunk)}
                >
                  <div className="retrieved-chunk-meta">
                    <span className="retrieved-chunk-doc">{chunk.document}</span>
                    <span className="retrieved-chunk-score">{chunk.confidence}% Match</span>
                  </div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-color)' }}>{chunk.title}</h4>
                  <p className="retrieved-chunk-text">{chunk.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {systemPromptBuilt && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="section-label">
              <Cpu size={12} /> Prompt Template Structure
            </span>
            <pre className="prompt-view-code">{systemPromptBuilt}</pre>
          </div>
        )}
      </aside>

      {/* Chunk details modal popup */}
      {activeModalChunk && (
        <div className="modal-overlay" onClick={() => setActiveModalChunk(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{activeModalChunk.title}</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Document: {activeModalChunk.document}</p>
              </div>
              <button className="modal-close" onClick={() => setActiveModalChunk(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className="doc-badge">Confidence Score: {activeModalChunk.confidence}%</span>
                {activeModalChunk.tags && activeModalChunk.tags.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '0.68rem', backgroundColor: 'rgba(0,0,0,0.1)', border: '1px solid var(--card-border)', padding: '2px 6px', borderRadius: 'var(--radius-pill)' }}>
                    #{t}
                  </span>
                ))}
              </div>
              <p style={{ lineHeight: 1.6, color: 'var(--text-color)', whiteSpace: 'pre-wrap' }}>
                {activeModalChunk.content}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
              <button
                className="btn-control primary"
                onClick={() => setActiveModalChunk(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showVoiceModal && (
        <div className="voice-overlay">
          <div className="voice-card">
            <div className="voice-card-header">
              {isListening && <span className="voice-recording-dot"></span>}
              <span className="voice-title">
                {isListening ? "TRANSMITTING VOICE FEED" : "DICTATION COMPLETED"}
              </span>
            </div>
            
            <div className="voice-lang-select-container" style={{ width: '100%' }}>
              <label className="form-label" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>RECORDING DIALECT:</label>
              <select
                className="select-control"
                style={{ width: '100%', marginTop: '4px' }}
                value={voiceLanguage}
                onChange={(e) => handleVoiceLangChange(e.target.value)}
              >
                <option value="english">English (US)</option>
                <option value="tamil">Tamil (தமிழ்)</option>
                <option value="hindi">Hindi (हिंदी)</option>
                <option value="telugu">Telugu (తెలుగు)</option>
                <option value="kannada">Kannada (ಕನ್ನಡ)</option>
                <option value="marathi">Marathi (मराठी)</option>
                <option value="bengali">Bengali (বাংলা)</option>
                <option value="gujarati">Gujarati (ગુજરાતી)</option>
                <option value="malayalam">Malayalam (മലയാളം)</option>
                <option value="punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="urdu">Urdu (اردو)</option>
              </select>
            </div>
            
            <div className="voice-wave-container">
              <div className={`voice-wave-bar bar-1 ${isListening ? '' : 'static'}`}></div>
              <div className={`voice-wave-bar bar-2 ${isListening ? '' : 'static'}`}></div>
              <div className={`voice-wave-bar bar-3 ${isListening ? '' : 'static'}`}></div>
              <div className={`voice-wave-bar bar-4 ${isListening ? '' : 'static'}`}></div>
              <div className={`voice-wave-bar bar-5 ${isListening ? '' : 'static'}`}></div>
              <div className={`voice-wave-bar bar-6 ${isListening ? '' : 'static'}`}></div>
              <div className={`voice-wave-bar bar-7 ${isListening ? '' : 'static'}`}></div>
            </div>
            
            <div className="voice-transcript-box">
              <p className="voice-transcript-text">
                {voiceTranscript || (isListening ? "Listening... Speak your question now" : "Speak again by clicking below")}
              </p>
            </div>
            
            <div className="voice-action-buttons">
              {isListening ? (
                <button type="button" className="btn-voice-action warning" onClick={stopVoiceCapture}>
                  STOP LISTENING
                </button>
              ) : (
                <button type="button" className="btn-voice-action primary" onClick={handleVoiceRetry}>
                  SPEAK AGAIN
                </button>
              )}
              
              <button
                type="button"
                className="btn-voice-action success"
                onClick={handleVoiceSend}
                disabled={!voiceTranscript.trim()}
              >
                SEND QUERY
              </button>
              
              <button type="button" className="btn-voice-action danger" onClick={handleVoiceCancel}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
