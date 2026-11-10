import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Building2, 
  Award, 
  KeyRound, 
  X, 
  ChevronRight, 
  Stethoscope, 
  User,
  Sparkles
} from 'lucide-react';

export default function ClinicianAuthModal({
  isOpen,
  onClose,
  currentClinician,
  onSaveClinician,
  theme = 'dark'
}) {
  const [formData, setFormData] = useState({
    id: currentClinician?.id || 'DR-ORTHO-8024',
    name: currentClinician?.name || 'Dr. Ananya Roy, MS (Ortho)',
    role: currentClinician?.role || 'Lead Orthopedic Surgeon & Knee Specialist',
    hospital: currentClinician?.hospital || 'AIIMS Knee Biomechanics & Sports Institute',
    department: currentClinician?.department || 'Department of Orthopedic Surgery & Gait Analysis',
    licenseNo: currentClinician?.licenseNo || 'MCI-2019-89241',
    pin: '****'
  });

  if (!isOpen) return null;

  // Preset clinician profiles for rapid competition demo
  const presets = [
    {
      id: 'DR-ORTHO-8024',
      name: 'Dr. Ananya Roy, MS (Ortho)',
      role: 'Lead Orthopedic Surgeon & Knee Specialist',
      hospital: 'AIIMS Knee Biomechanics & Sports Institute',
      department: 'Dept of Orthopedic Surgery & Gait Lab',
      licenseNo: 'MCI-2019-89241'
    },
    {
      id: 'PT-SPORTS-4109',
      name: 'Dr. Rajesh Patel, MPT (Sports)',
      role: 'Senior Musculoskeletal Biomechanist',
      hospital: 'Apollo Sports Medicine & Rehabilitation',
      department: 'Clinical Motion Assessment Center',
      licenseNo: 'IAP-PT-76123'
    },
    {
      id: 'RES-LT-2026',
      name: 'Dr. Vikramaditya Rao, PhD',
      role: 'Principal BioMed Robotics Engineer',
      hospital: 'L&T Techgium Advanced Health Technologies',
      department: 'Smart Wearables & Rehabilitation Robotics',
      licenseNo: 'LNT-BIO-2026'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveClinician(formData);
    onClose();
  };

  const applyPreset = (preset) => {
    setFormData({ ...formData, ...preset });
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border transition-all ${
        isDark ? 'bg-[#0c111e] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-500">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Clinician Profile & Security Authentication</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Verified ID
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                JONTUK-6D TASO Clinical Decision Support System
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick Demo Preset Selector */}
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Select Clinician Profile or Enter Custom ID:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presets.map((p) => {
                const isSelected = formData.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
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
                      {p.role.split('&')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
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
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Full Name & Credentials
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
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Clinical Specialization
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
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Registration / License No
              </label>
              <input
                type="text"
                value={formData.licenseNo}
                onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                placeholder="e.g. MCI-2019-89241"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Hospital / Institution Affiliation
              </label>
              <input
                type="text"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                placeholder="e.g. AIIMS Knee Biomechanics & Sports Institute"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className={`pt-4 border-t flex items-center justify-between ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Session ID: <span className="font-bold text-cyan-500">CLIN-AUTH-OK</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Save Clinician Profile</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
