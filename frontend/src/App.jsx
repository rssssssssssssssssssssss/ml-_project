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
  MicOff
} from 'lucide-react';

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

    const drawGear = (x, y, radius, teeth, angle, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      
      for (let i = 0; i < teeth; i++) {
        const theta = (i * 2 * Math.PI) / teeth;
        ctx.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
        ctx.lineTo(
          Math.cos(theta + 0.05) * (radius + 12),
          Math.sin(theta + 0.05) * (radius + 12)
        );
        ctx.lineTo(
          Math.cos(theta + 0.12) * (radius + 12),
          Math.sin(theta + 0.12) * (radius + 12)
        );
        ctx.lineTo(Math.cos(theta + 0.17) * radius, Math.sin(theta + 0.17) * radius);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius - 20, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    let rotationAngle = 0;
    let waveOffset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      rotationAngle += 0.005;
      waveOffset += 0.15;

      steamParticles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawGear(width * 0.1, height * 0.25, 80, 12, rotationAngle, 'rgba(249, 115, 22, 0.06)');
      drawGear(width * 0.1 + 104, height * 0.25 + 104, 50, 8, -rotationAngle * 1.6, 'rgba(249, 115, 22, 0.04)');
      drawGear(width * 0.88, height * 0.78, 120, 16, rotationAngle * 0.7, 'rgba(249, 115, 22, 0.05)');

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
        ctx.beginPath();
        ctx.moveTo(gaugeX + Math.cos(ang) * (gaugeR - 4), gaugeY + Math.sin(ang) * (gaugeR - 4));
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

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
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
        
        if (interimTranscript) {
          setVoiceTranscript(interimTranscript);
        }
        if (finalTranscript) {
          setInputValue(prev => {
            const space = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + space + finalTranscript;
          });
          setVoiceTranscript(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setVoiceTranscript('');
      const langCodes = {
        english: 'en-US',
        hindi: 'hi-IN',
        tamil: 'ta-IN',
        telugu: 'te-IN',
        kannada: 'kn-IN'
      };
      recognitionRef.current.lang = langCodes[selectedLanguage.toLowerCase()] || 'en-US';
      recognitionRef.current.start();
    }
  };

  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Connection settings
  const [backendUrl, setBackendUrl] = useState('http://localhost:5000');
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
      const response = await axios.get(`${url}/api/health`, { timeout: 1500 });
      if (response.data.status === 'healthy' || response.data.status === 'degraded') {
        setIsBackendOnline(true);
        setOllamaStatus({
          connected: response.data.ollamaConnected,
          modelInstalled: response.data.modelInstalled,
          details: `Ollama: ${response.data.ollamaConnected ? 'Online' : 'Offline'} | Translation: ${response.data.translationEngine}`
        });
      } else {
        setIsBackendOnline(false);
        setOllamaStatus({ connected: false, modelInstalled: false, details: 'API offline. Sandbox simulation mode active.' });
      }
    } catch (error) {
      setIsBackendOnline(false);
      setOllamaStatus({ connected: false, modelInstalled: false, details: 'Server offline. Sandbox simulation mode active.' });
    }
  };

  useEffect(() => {
    checkBackendHealth(backendUrl);
    const timer = setInterval(() => checkBackendHealth(backendUrl), 5000);
    return () => clearInterval(timer);
  }, [backendUrl]);

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

  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessageText = inputValue;
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

    // Check if documents list is empty
    const totalDocsCount = dynamicDocs.length;
    if (totalDocsCount === 0) {
      await new Promise(r => setTimeout(r, 600));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'assistant',
        text: 'Your document library is currently empty. Please upload an industrial safety manual or technical guide (PDF) in the sidebar so the RAG chatbot can read from it and answer your questions.',
        language: selectedLanguage,
        connection: 'internal'
      }]);
      setLoading(false);
      return;
    }

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

  // 1. RENDER BOOT SCREEN
  if (!isEntered) {
    return (
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
    );
  }

  // 2. RENDER MAIN COGNITIVE COCKPIT
  return (
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
          <div className="config-card">
            <div className="form-group">
              <label className="form-label">Express Backend URL</label>
              <input
                type="text"
                className="input-control"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://localhost:5000"
              />
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

            <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(0,0,0,0.1)', fontSize: '0.72rem', border: '1px solid var(--card-border)' }}>
              <span style={{ fontWeight: 600, color: isBackendOnline ? 'var(--success)' : 'var(--warning)' }}>Status:</span>{' '}
              <span style={{ color: 'var(--text-color)' }}>{ollamaStatus.details}</span>
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
                <div key={idx} className="doc-item">
                  <div className="doc-name">
                    <FileText size={14} style={{ color: 'var(--primary)' }} />
                    <span title={doc.name}>{doc.name}</span>
                  </div>
                  <span className="doc-badge">{doc.chunks} Chunks</span>
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
                <div className="message-bubble">
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
              onClick={toggleListening}
              className={`btn-voice ${isListening ? 'listening' : ''}`}
              title={isListening ? "Listening... Click to stop" : "Speak your query"}
              disabled={loading}
            >
              {isListening ? <MicOff size={18} style={{ color: 'var(--error)' }} /> : <Mic size={18} />}
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
      {isListening && (
        <div className="voice-overlay">
          <div className="voice-card">
            <div className="voice-card-header">
              <span className="voice-recording-dot"></span>
              <span className="voice-title">TRANSMITTING VOICE FEED</span>
            </div>
            
            <div className="voice-wave-container">
              <div className="voice-wave-bar bar-1"></div>
              <div className="voice-wave-bar bar-2"></div>
              <div className="voice-wave-bar bar-3"></div>
              <div className="voice-wave-bar bar-4"></div>
              <div className="voice-wave-bar bar-5"></div>
              <div className="voice-wave-bar bar-6"></div>
              <div className="voice-wave-bar bar-7"></div>
            </div>
            
            <div className="voice-transcript-box">
              <p className="voice-transcript-text">
                {voiceTranscript || "Listening... Speak your question now"}
              </p>
            </div>
            
            <button className="btn-voice-stop" onClick={toggleListening}>
              DISCONNECT MIC
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
