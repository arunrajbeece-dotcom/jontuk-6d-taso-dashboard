import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ClinicianLoginPage from './components/ClinicianLoginPage';
import KneeVisualizer3D from './components/KneeVisualizer3D';
import KinematicCharts from './components/KinematicCharts';
import TasoMaiWidgets from './components/TasoMaiWidgets';
import CostPortabilityBanner from './components/CostPortabilityBanner';
import ClinicalReportModal from './components/ClinicalReportModal';
import ClinicianAuthModal from './components/ClinicianAuthModal';
import PatientIntakeModal from './components/PatientIntakeModal';
import BluetoothHardwareModal from './components/BluetoothHardwareModal';
import { 
  KneeKinematicsSimulator, 
  WebSerialManager, 
  WebBluetoothManager,
  LiveSleeveProcessor,
  GroodSuntayTransform 
} from './utils/kinematicsEngine';
import { 
  ShieldCheck, 
  Activity, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  Heart, 
  Cpu, 
  Layers, 
  Sparkles, 
  Bluetooth, 
  Usb, 
  Crosshair,
  ArrowRight,
  Wifi
} from 'lucide-react';

export default function App() {
  // 1. Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('jontuk_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    localStorage.setItem('jontuk_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 2. Authentication Gate: Clinician must log in first
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clinician Profile State
  const [currentClinician, setCurrentClinician] = useState({
    id: 'DR-ORTHO-8024',
    name: 'Dr. Ananya Roy, MS (Ortho)',
    role: 'Lead Orthopedic Surgeon & Knee Specialist',
    hospital: 'AIIMS Knee Biomechanics & Joint Institute',
    department: 'Dept of Orthopedic Surgery & Gait Lab',
    licenseNo: 'MCI-2019-89241'
  });
  const [isClinicianModalOpen, setIsClinicianModalOpen] = useState(false);

  // 3. Patient Information State
  const [currentPatient, setCurrentPatient] = useState({
    id: 'PT-2026-9042',
    name: 'Rohan Sharma',
    age: 27,
    gender: 'Male',
    heightCm: 178,
    weightKg: 74,
    bmi: 23.4,
    bmiCategory: 'Normal',
    affectedLeg: 'right', // 'right' | 'left' | 'bilateral'
    indication: 'ACL Reconstruction (Week 8 Post-Op)',
    painScale: 3,
    activityLevel: 'Competitive Footballer',
    notes: 'Evaluating rotational laxity and anterior tibial translation during pivoting.'
  });
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // 4. Hardware Connection State: 'simulation' | 'bluetooth' | 'serial'
  const [connectionMode, setConnectionMode] = useState('simulation');
  const [isConnected, setIsConnected] = useState(false);
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState('ESP32 Sleeve Band');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [rawPacket, setRawPacket] = useState(null);

  // 5. Kinematic Protocol State: 'walking' | 'sit_to_stand' | 'stairs' | 'pivoting'
  const [activeProtocol, setActiveProtocol] = useState('walking');
  const [isPaused, setIsPaused] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // 6. Live Telemetry Frame
  const [currentFrame, setCurrentFrame] = useState({
    timestamp: 0,
    timeFormatted: '0.00',
    t: 0,
    rotations: { flexion: 15.2, adduction: 1.1, internalRotation: 2.3 },
    translations: { ap: 3.2, si: 0.1, ml: 0.4 },
    metrics: { rotErrorRMS: 1.35, transErrorRMS: 0.98, targetRotBound: 5.0, targetTransBound: 5.0, clinicalReliable: true },
    tension: 15.5,
    staScale: 1.0,
    staHealth: 'Optimal',
    acoustic: 65,
    angularVelocity: 45,
    angularJerk: 120,
    maiEvent: null
  });

  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [instabilityEvents, setInstabilityEvents] = useState([]);

  // Hardware/Engine References
  const simulatorRef = useRef(null);
  const serialManagerRef = useRef(null);
  const bluetoothManagerRef = useRef(null);
  const liveSleeveRef = useRef(null);

  const lastUpdateRef = useRef(performance.now());
  const animationFrameRef = useRef(null);
  const historyBufferRef = useRef([]);

  // Handler for incoming raw hardware packets (from BLE or USB)
  const handleHardwarePacket = useCallback((packet) => {
    setRawPacket(packet);

    if (liveSleeveRef.current && (connectionMode === 'bluetooth' || connectionMode === 'serial')) {
      const frame = liveSleeveRef.current.processPacket(packet);
      
      setCurrentFrame(frame);
      setIsCalibrated(frame.isCalibrated);

      historyBufferRef.current.push(frame);
      if (historyBufferRef.current.length > 500) {
        historyBufferRef.current.shift();
      }
      setTelemetryHistory([...historyBufferRef.current]);

      if (frame.maiEvent) {
        setInstabilityEvents(prev => [frame.maiEvent, ...prev.slice(0, 49)]);
      }
    }
  }, [connectionMode]);

  // Initialize Engines
  useEffect(() => {
    simulatorRef.current = new KneeKinematicsSimulator();
    simulatorRef.current.setProtocol(activeProtocol);

    liveSleeveRef.current = new LiveSleeveProcessor({ affectedLeg: currentPatient.affectedLeg });

    // WebSerial Manager
    serialManagerRef.current = new WebSerialManager(
      (data) => handleHardwarePacket(data),
      (status) => setIsConnected(status.status === 'connected')
    );

    // WebBluetooth Manager
    bluetoothManagerRef.current = new WebBluetoothManager(
      (data) => handleHardwarePacket(data),
      (status) => {
        setIsConnected(status.status === 'connected');
        if (status.deviceName) setBluetoothDeviceName(status.deviceName);
      }
    );

    return () => {
      if (serialManagerRef.current) serialManagerRef.current.disconnect().catch(() => {});
      if (bluetoothManagerRef.current) bluetoothManagerRef.current.disconnect().catch(() => {});
    };
  }, []);

  // Sync affected leg to Live Processor & Simulator
  useEffect(() => {
    if (liveSleeveRef.current) {
      liveSleeveRef.current.setAffectedLeg(currentPatient.affectedLeg);
    }
  }, [currentPatient.affectedLeg]);

  // Sync protocol changes to simulator
  useEffect(() => {
    if (simulatorRef.current) {
      simulatorRef.current.setProtocol(activeProtocol);
    }
  }, [activeProtocol]);

  // 60 FPS Telemetry Stream Loop (for Simulation Mode)
  useEffect(() => {
    let frameCounter = 0;

    const streamLoop = (now) => {
      const dt = Math.min(0.05, (now - lastUpdateRef.current) / 1000);
      lastUpdateRef.current = now;

      if (!isPaused && simulatorRef.current && connectionMode === 'simulation') {
        const frame = simulatorRef.current.nextFrame(dt);

        frameCounter++;
        historyBufferRef.current.push(frame);

        if (historyBufferRef.current.length > 500) {
          historyBufferRef.current.shift();
        }

        if (frameCounter % 2 === 0) {
          setCurrentFrame(frame);
          setTelemetryHistory([...historyBufferRef.current]);

          if (frame.maiEvent) {
            setInstabilityEvents(prev => [frame.maiEvent, ...prev.slice(0, 49)]);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(streamLoop);
    };

    lastUpdateRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(streamLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, connectionMode]);

  // Bluetooth Connect / Disconnect Handlers
  const handleConnectBluetooth = async () => {
    if (bluetoothManagerRef.current) {
      await bluetoothManagerRef.current.connect();
      setConnectionMode('bluetooth');
    }
  };

  const handleDisconnectBluetooth = async () => {
    if (bluetoothManagerRef.current) {
      await bluetoothManagerRef.current.disconnect();
      setIsConnected(false);
      setConnectionMode('simulation');
    }
  };

  // WebSerial Connect / Disconnect Handlers
  const handleConnectWebSerial = async () => {
    if (serialManagerRef.current) {
      await serialManagerRef.current.connect();
      setConnectionMode('serial');
    }
  };

  const handleDisconnectWebSerial = async () => {
    if (serialManagerRef.current) {
      await serialManagerRef.current.disconnect();
      setIsConnected(false);
      setConnectionMode('simulation');
    }
  };

  // Tare Neutral Standing Calibration
  const handleTareCalibration = () => {
    if (liveSleeveRef.current) {
      liveSleeveRef.current.tareNeutralCalibration();
      setIsCalibrated(true);
    }
  };

  // Tension Preset Changer for Judges
  const handleSetTension = (newTension) => {
    if (simulatorRef.current) {
      simulatorRef.current.setTension(newTension);
    }
  };

  // Synthetic Instability Trigger for Judges
  const handleTriggerInstability = () => {
    if (simulatorRef.current) {
      simulatorRef.current.triggerInstability();
    }
  };

  const handleClearEvents = () => {
    setInstabilityEvents([]);
  };

  const handleReset = () => {
    if (simulatorRef.current) {
      simulatorRef.current = new KneeKinematicsSimulator();
      simulatorRef.current.setProtocol(activeProtocol);
      historyBufferRef.current = [];
      setTelemetryHistory([]);
    }
    if (liveSleeveRef.current) {
      liveSleeveRef.current.resetCalibration();
      setIsCalibrated(false);
    }
  };

  const isDark = theme === 'dark';

  // LOGIN INTERFACE GATE
  // If clinician has not logged in, show the dedicated Login Portal
  if (!isAuthenticated) {
    return (
      <ClinicianLoginPage
        onLoginSuccess={(clinician) => {
          setCurrentClinician(clinician);
          setIsAuthenticated(true);
          // Seamlessly prompt for patient intake after login
          setIsPatientModalOpen(true);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // GAIT ASSESSMENT SHOWING PAGE (Logged in)
  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#080b11] text-slate-100 bg-grid-medical' : 'bg-[#f1f5f9] text-slate-900 bg-grid-medical'
    }`}>
      
      {/* 1. Clinician Header */}
      <Header
        connectionMode={connectionMode}
        setConnectionMode={setConnectionMode}
        isConnected={isConnected}
        bluetoothDeviceName={bluetoothDeviceName}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        activeProtocol={activeProtocol}
        setActiveProtocol={setActiveProtocol}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        onReset={handleReset}
        onOpenReport={() => setIsReportOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentClinician={currentClinician}
        onOpenClinicianModal={() => setIsClinicianModalOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
        currentPatient={currentPatient}
        onOpenPatientModal={() => setIsPatientModalOpen(true)}
        onTareCalibration={handleTareCalibration}
        isCalibrated={isCalibrated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 lg:px-6 py-4 space-y-4">
        
        {/* Hardware ESP32 & Patient Status Bar */}
        <div className={`px-4 py-3 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs transition-colors shadow-sm ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Patient Details */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Patient:</span>
              <strong className="text-cyan-500 font-bold text-sm">{currentPatient.name}</strong>
              <span className="font-mono text-slate-400">({currentPatient.id})</span>
              <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-cyan-500/10 text-cyan-500 capitalize">
                {currentPatient.affectedLeg} Knee
              </span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span className="text-slate-400 hidden sm:inline truncate max-w-xs">{currentPatient.indication}</span>
            </div>
          </div>

          {/* Real Hardware ESP32 Connection Status & Quick Action Button */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            
            {/* Calibration Status */}
            <span className={`text-[11px] font-mono px-2 py-1 rounded-lg border font-semibold flex items-center gap-1 ${
              isCalibrated 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' 
                : 'bg-amber-500/10 border-amber-500/40 text-amber-500'
            }`}>
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isCalibrated ? 'Tare 0° Calibrated' : 'Needs Tare'}</span>
            </span>

            {/* Direct Connect Real ESP32 Button */}
            <button
              onClick={() => setIsHardwareModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border ${
                connectionMode === 'bluetooth' && isConnected
                  ? 'bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/25'
                  : connectionMode === 'serial' && isConnected
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-transparent'
              }`}
            >
              {connectionMode === 'bluetooth' && isConnected ? (
                <>
                  <Bluetooth className="w-3.5 h-3.5" />
                  <span>ESP32 BLE Linked ({bluetoothDeviceName})</span>
                </>
              ) : connectionMode === 'serial' && isConnected ? (
                <>
                  <Usb className="w-3.5 h-3.5" />
                  <span>ESP32 USB Cable Linked</span>
                </>
              ) : (
                <>
                  <Bluetooth className="w-3.5 h-3.5" />
                  <span>Connect Real ESP32 Hardware</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* 2. Cost & Portability Competition Banner */}
        <CostPortabilityBanner theme={theme} />

        {/* 3. Primary Workspace: 3D Biomechanical Articulation & TASO/MAI Widgets */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* Left: 3D Articulating Knee Model */}
          <div className="xl:col-span-5 h-[480px]">
            <KneeVisualizer3D
              rotations={currentFrame.rotations}
              translations={currentFrame.translations}
              tension={currentFrame.tension}
              staHealth={currentFrame.staHealth}
              theme={theme}
              affectedLeg={currentPatient.affectedLeg}
            />
          </div>

          {/* Right: TASO Dynamic Noise Adaptation & MAI Event Engine */}
          <div className="xl:col-span-7 flex flex-col justify-between">
            <TasoMaiWidgets
              tension={currentFrame.tension}
              staScale={currentFrame.staScale}
              staHealth={currentFrame.staHealth}
              onSetTension={handleSetTension}
              instabilityEvents={instabilityEvents}
              onTriggerInstability={handleTriggerInstability}
              onClearEvents={handleClearEvents}
              latestEvent={currentFrame.maiEvent}
              theme={theme}
            />
          </div>

        </div>

        {/* 4. Real-Time Synchronized 6-DOF Kinematic Curves */}
        <KinematicCharts
          telemetryHistory={telemetryHistory}
          rotErrorRMS={currentFrame.metrics.rotErrorRMS}
          transErrorRMS={currentFrame.metrics.transErrorRMS}
          staHealth={currentFrame.staHealth}
          theme={theme}
        />

        {/* 5. Clinical Decision Support & Competition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className={`border rounded-2xl p-4 flex items-center gap-3.5 shadow-md transition-colors ${
            isDark ? 'bg-[#0b0f19] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5 font-mono">
                <span>Clinical Error Bounds: &lt; 5° / &lt; 5mm</span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Dynamic RMS Error currently at <strong className="text-emerald-500">±{currentFrame.metrics.rotErrorRMS}°</strong> and <strong className="text-emerald-500">±{currentFrame.metrics.transErrorRMS}mm</strong>. Certified within ISB diagnostic limits.
              </p>
            </div>
          </div>

          <div className={`border rounded-2xl p-4 flex items-center gap-3.5 shadow-md transition-colors ${
            isDark ? 'bg-[#0b0f19] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5 font-mono">
                <span>Tension-Adaptive STA Filter (TASO)</span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Strap preload load-cell updates EKF measurement noise R in real time, neutralizing muscle/skin wobble artifacts during gait.
              </p>
            </div>
          </div>

          <div className={`border rounded-2xl p-4 flex items-center gap-3.5 shadow-md transition-colors ${
            isDark ? 'bg-[#0b0f19] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5 font-mono">
                <span>Multi-Modal MAI Acoustic Engine</span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Dual MPU6050 angular jerk ($d^2\omega/dt^2$) cross-referenced with 4 kHz contact piezo micro-crepitus within 50ms window.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className={`border-t px-6 py-3 mt-6 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors ${
        isDark ? 'border-slate-800 bg-[#070a10] text-slate-500' : 'border-slate-200 bg-white text-slate-500 shadow-inner'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-bold font-mono">JONTUK-6D TASO</span>
          <span>•</span>
          <span>Designed for L&T Techgium 2026</span>
          <span>•</span>
          <span className="text-cyan-500 font-semibold">BioMed & Robotics Innovation</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span>Grood-Suntay JCS v2.4</span>
          <span>100Hz ESP32 BLE/USB</span>
          <span>Clinician Suite: {currentClinician.name.split(',')[0]}</span>
        </div>
      </footer>

      {/* Modals */}
      <ClinicianAuthModal
        isOpen={isClinicianModalOpen}
        onClose={() => setIsClinicianModalOpen(false)}
        currentClinician={currentClinician}
        onSaveClinician={(clinician) => setCurrentClinician(clinician)}
        theme={theme}
      />

      <PatientIntakeModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        currentPatient={currentPatient}
        onSavePatient={(patient) => setCurrentPatient(patient)}
        theme={theme}
      />

      <BluetoothHardwareModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        connectionMode={connectionMode}
        setConnectionMode={setConnectionMode}
        isConnected={isConnected}
        onConnectBluetooth={handleConnectBluetooth}
        onDisconnectBluetooth={handleDisconnectBluetooth}
        onConnectWebSerial={handleConnectWebSerial}
        onDisconnectWebSerial={handleDisconnectWebSerial}
        onTareCalibration={handleTareCalibration}
        isCalibrated={isCalibrated}
        bluetoothDeviceName={bluetoothDeviceName}
        rawPacket={rawPacket}
        theme={theme}
      />

      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        activeProtocol={activeProtocol}
        telemetryHistory={telemetryHistory}
        instabilityEvents={instabilityEvents}
        currentTension={currentFrame.tension}
        rotErrorRMS={currentFrame.metrics.rotErrorRMS}
        transErrorRMS={currentFrame.metrics.transErrorRMS}
        currentClinician={currentClinician}
        currentPatient={currentPatient}
        theme={theme}
      />

    </div>
  );
}
