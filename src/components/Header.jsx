import React from 'react';
import { 
  Activity, 
  Battery, 
  Cpu, 
  Radio, 
  Usb, 
  Bluetooth, 
  Zap, 
  Award, 
  Play, 
  Pause,
  RotateCcw,
  FileText,
  Sun,
  Moon,
  User,
  Stethoscope,
  Crosshair,
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Header({
  connectionMode,
  setConnectionMode,
  isConnected,
  bluetoothDeviceName,
  onOpenHardwareModal,
  activeProtocol,
  setActiveProtocol,
  isPaused,
  setIsPaused,
  onReset,
  onOpenReport,
  theme = 'dark',
  onToggleTheme,
  currentClinician,
  onOpenClinicianModal,
  onLogout,
  currentPatient,
  onOpenPatientModal,
  onTareCalibration,
  isCalibrated,
  battery = { percent: 94, voltage: 4.14, runtimeHours: 8.5 }
}) {
  const protocols = [
    { id: 'walking', label: 'Walking Gait', icon: '🚶‍♂️', desc: 'Standard 1.1s gait cycle' },
    { id: 'sit_to_stand', label: 'Sit-to-Stand', icon: '🪑', desc: '0° - 95° deep flexion' },
    { id: 'stairs', label: 'Stair Descent', icon: '🪜', desc: 'High patellofemoral shear' },
    { id: 'pivoting', label: 'Pivoting Stress', icon: '🔄', desc: 'Rotational torsional laxity' }
  ];

  const isDark = theme === 'dark';

  return (
    <header className={`border-b sticky top-0 z-40 px-4 lg:px-6 py-2.5 transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0b0f19]/95 backdrop-blur-md border-slate-800 text-slate-100' 
        : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-[1920px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-3">
        
        {/* Left: Branding & Patient / Clinician Badges */}
        <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  isDark ? 'bg-[#0a0f1d]' : 'bg-white'
                }`}>
                  <Activity className="w-5 h-5 text-cyan-500" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight font-mono flex items-center gap-1.5">
                  JONTUK<span className="text-cyan-500">-6D</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans tracking-wide border ${
                    isDark ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  }`}>
                    TASO
                  </span>
                </h1>
                <span className={`hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  isDark ? 'text-amber-300 bg-amber-950/50 border-amber-800/50' : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}>
                  <Award className="w-3 h-3 text-amber-500" />
                  L&T Techgium 2026
                </span>
              </div>
              <p className={`text-[11px] hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Wearable 6-DOF Knee Kinematics & Acoustic Micro-Instability Clinician Suite
              </p>
            </div>
          </div>

          {/* Quick Action Profile Pills: Clinician & Patient */}
          <div className="flex items-center gap-2">
            
            {/* Clinician Profile Pill */}
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenClinicianModal}
                title="Click to view/edit Clinician Profile & ID"
                className={`px-2.5 py-1 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 hover:border-cyan-500 text-slate-200' 
                    : 'bg-slate-100 border-slate-200 hover:border-cyan-500 text-slate-800 shadow-sm'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-cyan-500" />
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-[11px] leading-tight text-cyan-500">
                    {currentClinician?.id || 'DR-ORTHO'}
                  </div>
                  <div className={`text-[9px] leading-tight truncate max-w-[90px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentClinician?.name?.split(',')[0] || 'Clinician'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={onLogout}
                title="Sign Out / Switch Clinician (Returns to Login Page)"
                className={`p-1.5 rounded-xl border transition-all text-xs ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50' 
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 shadow-sm'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Patient Info Pill */}
            <button
              onClick={onOpenPatientModal}
              title="Click to view/edit Patient Clinical Intake Information"
              className={`px-2.5 py-1 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 hover:border-emerald-500 text-slate-200' 
                  : 'bg-slate-100 border-slate-200 hover:border-emerald-500 text-slate-800 shadow-sm'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-500" />
              <div className="text-left hidden sm:block">
                <div className="font-bold text-[11px] leading-tight text-emerald-500">
                  {currentPatient?.name || 'New Patient'}
                </div>
                <div className={`text-[9px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentPatient?.affectedLeg === 'left' ? 'Left Knee' : 'Right Knee'} ({currentPatient?.age || 27}y)
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

          </div>
        </div>

        {/* Center: Protocol Selector */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border overflow-x-auto max-w-full ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 hidden lg:inline ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Protocol:
          </span>
          {protocols.map((p) => {
            const isActive = activeProtocol === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProtocol(p.id)}
                title={p.desc}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 font-semibold'
                    : isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-2.5 w-full xl:w-auto justify-end flex-wrap sm:flex-nowrap">
          
          {/* Tare / Calibration Button */}
          <button
            onClick={onTareCalibration}
            title="Tare Neutral Standing Position (0° Flexion reference)"
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
              isCalibrated 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                : 'bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isCalibrated ? 'Tare: 0° Set' : 'Tare Neutral'}</span>
          </button>

          {/* Connection Mode / Hardware Modal Button */}
          <button
            onClick={onOpenHardwareModal}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all flex items-center gap-1.5 border shadow-sm ${
              connectionMode === 'bluetooth' && isConnected
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                : connectionMode === 'serial' && isConnected
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-white'
            }`}
          >
            {connectionMode === 'bluetooth' ? (
              <Bluetooth className="w-3.5 h-3.5 text-cyan-500" />
            ) : connectionMode === 'serial' ? (
              <Usb className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Radio className="w-3.5 h-3.5 text-indigo-500" />
            )}
            <span>
              {connectionMode === 'bluetooth' && isConnected 
                ? 'BLE Sleeve' 
                : connectionMode === 'serial' && isConnected 
                ? 'USB ESP32' 
                : 'Sim Engine'}
            </span>
          </button>

          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            title={isDark ? "Switch to Clinician Light Theme" : "Switch to Clinician Dark Theme"}
            className={`p-1.5 rounded-lg border transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-white shadow-sm'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Pause / Freeze Stream Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume Live Kinematics" : "Pause / Freeze Kinematics for Inspection"}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 ${
              isPaused
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20'
                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Freeze'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset Kinematic Reference Coordinates"
            className={`p-1.5 rounded-lg border transition-all text-xs ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Diagnostic Dossier Report Button */}
          <button
            onClick={onOpenReport}
            className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded-lg shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report</span>
          </button>

        </div>

      </div>
    </header>
  );
}
