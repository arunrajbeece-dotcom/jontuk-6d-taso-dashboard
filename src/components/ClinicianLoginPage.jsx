import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  KeyRound, 
  Stethoscope, 
  Award, 
  ChevronRight, 
  Sun, 
  Moon, 
  UserCheck, 
  Sparkles, 
  Cpu, 
  Lock,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function ClinicianLoginPage({
  onLoginSuccess,
  theme = 'dark',
  onToggleTheme
}) {
  const [formData, setFormData] = useState({
    id: 'DR-ORTHO-8024',
    name: 'Dr. Ananya Roy, MS (Ortho)',
    role: 'Lead Orthopedic Surgeon & Knee Specialist',
    hospital: 'AIIMS Knee Biomechanics & Joint Institute',
    department: 'Dept of Orthopedic Surgery & Gait Lab',
    licenseNo: 'MCI-2019-89241',
    pin: '8024'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isDark = theme === 'dark';

  // Demo 1-Click Clinician Profiles for rapid testing & competition judges
  const presets = [
    {
      id: 'DR-ORTHO-8024',
      name: 'Dr. Ananya Roy, MS (Ortho)',
      role: 'Lead Orthopedic Surgeon',
      hospital: 'AIIMS Knee Biomechanics & Joint Institute',
      department: 'Dept of Orthopedic Surgery & Gait Lab',
      licenseNo: 'MCI-2019-89241',
      pin: '8024'
    },
    {
      id: 'PT-SPORTS-4109',
      name: 'Dr. Rajesh Patel, MPT',
      role: 'Senior Musculoskeletal Biomechanist',
      hospital: 'Apollo Sports Medicine & Rehabilitation',
      department: 'Clinical Motion Assessment Center',
      licenseNo: 'IAP-PT-76123',
      pin: '4109'
    },
    {
      id: 'RES-LT-2026',
      name: 'Dr. Vikramaditya Rao, PhD',
      role: 'Principal BioMed Robotics Engineer',
      hospital: 'L&T Techgium Advanced Health Technologies',
      department: 'Smart Wearables & Rehabilitation Robotics',
      licenseNo: 'LNT-BIO-2026',
      pin: '2026'
    }
  ];

  const handleSelectPreset = (p) => {
    setFormData({ ...p });
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.id.trim() || !formData.name.trim()) {
      setError('Please provide Clinician ID and Name.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(formData);
    }, 400);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      isDark ? 'bg-[#080b11] text-slate-100 bg-grid-medical' : 'bg-[#f1f5f9] text-slate-900 bg-grid-medical'
    }`}>
      
      {/* Top Navbar */}
      <header className={`px-6 py-4 flex items-center justify-between border-b ${
        isDark ? 'border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md' : 'border-slate-200 bg-white/80 backdrop-blur-md shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
              isDark ? 'bg-[#0a0f1d]' : 'bg-white'
            }`}>
              <Activity className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-mono text-base tracking-tight">
                JONTUK<span className="text-cyan-500">-6D</span> TASO
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isDark ? 'bg-amber-950/60 border-amber-800/60 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
                L&T Techgium 2026
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Wearable 6-DOF Knee Kinematics & Acoustic Micro-Instability Clinician Suite
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? "Switch to Clinician Light Mode" : "Switch to Clinician Dark Mode"}
          className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold ${
            isDark 
              ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800' 
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-white shadow-sm'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="hidden sm:inline">{isDark ? 'Light Theme' : 'Dark Theme'}</span>
        </button>
      </header>

      {/* Main Login Card Center */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark ? 'bg-[#0d121f] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          
          {/* Card Title Banner */}
          <div className={`p-6 border-b ${
            isDark ? 'bg-gradient-to-r from-cyan-950/30 to-blue-950/20 border-slate-800' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Clinician Authentication Portal</h2>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Sign in with clinical staff credentials to access live gait telemetry
                  </p>
                </div>
              </div>

              <div className={`text-[10px] font-mono px-2.5 py-1 rounded-full border hidden sm:flex items-center gap-1 font-semibold ${
                isDark ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ISO 13485 Verified</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Quick 1-Click Clinician Preset Buttons */}
            <div>
              <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>Select 1-Click Clinician Profile or Enter ID:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presets.map((p) => {
                  const isSelected = formData.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-sm'
                          : isDark ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold truncate text-cyan-500">{p.id}</div>
                        <div className="font-semibold truncate text-[11px] mt-0.5">{p.name.split(',')[0]}</div>
                      </div>
                      <div className={`text-[10px] truncate mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {p.role}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Credentials Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Clinician Staff ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-cyan-300' : 'bg-slate-50 border-slate-300 text-cyan-700'
                  }`}
                  placeholder="e.g. DR-ORTHO-8024"
                />
              </div>

              <div>
                <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="Dr. Full Name, MS / MPT"
                />
              </div>

              <div>
                <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Specialization / Department
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="e.g. Orthopedic Surgeon"
                />
              </div>

              <div>
                <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Access PIN / Security Pass
                </label>
                <input
                  type="password"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="••••"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Hospital / Research Institute
                </label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="Hospital / Medical Center"
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-600/25 transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <span>Authenticating Clinician...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Authorize & Enter Gait Assessment Suite</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Bottom Security Assurance */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                Session Encrypted (AES-256)
              </span>
              <span>ESP32-S3 Hardware Compatible</span>
            </div>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className={`px-6 py-3 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-2 ${
        isDark ? 'border-slate-800 bg-[#070a10] text-slate-500' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>JONTUK-6D TASO Clinician Suite</span>
          <span>•</span>
          <span>Designed for L&T Techgium 2026</span>
        </div>
        <div className="text-[11px] text-cyan-500 font-semibold">
          Web Bluetooth BLE & WebSerial USB Ready
        </div>
      </footer>

    </div>
  );
}
