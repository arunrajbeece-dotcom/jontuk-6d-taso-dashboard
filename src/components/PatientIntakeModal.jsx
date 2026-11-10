import React, { useState } from 'react';
import { 
  User, 
  Activity, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Heart, 
  Scale, 
  Ruler, 
  PlayCircle,
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';

export default function PatientIntakeModal({
  isOpen,
  onClose,
  currentPatient,
  onSavePatient,
  theme = 'dark'
}) {
  const [formData, setFormData] = useState({
    id: currentPatient?.id || 'PT-2026-9042',
    name: currentPatient?.name || 'Rohan Sharma',
    age: currentPatient?.age || 27,
    gender: currentPatient?.gender || 'Male',
    heightCm: currentPatient?.heightCm || 178,
    weightKg: currentPatient?.weightKg || 74,
    affectedLeg: currentPatient?.affectedLeg || 'right', // 'right' | 'left' | 'bilateral'
    indication: currentPatient?.indication || 'ACL Reconstruction (Week 8 Post-Op)',
    painScale: currentPatient?.painScale || 3, // VAS 0-10
    activityLevel: currentPatient?.activityLevel || 'Competitive Athlete (Football)',
    notes: currentPatient?.notes || 'Patient reporting mild pivot apprehension during descending stairs. No active joint effusion.'
  });

  const [checklist, setChecklist] = useState({
    bandFitted: true,
    tensionChecked: true,
    neutralStanding: true
  });

  if (!isOpen) return null;

  // Calculate BMI
  const heightM = (formData.heightCm || 170) / 100;
  const bmi = Number(((formData.weightKg || 70) / (heightM * heightM)).toFixed(1));

  let bmiCategory = 'Normal';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
  else if (bmi >= 30) bmiCategory = 'Obese';

  // Demo Clinical Case Presets
  const presets = [
    {
      id: 'PT-2026-9042',
      name: 'Rohan Sharma',
      age: 27,
      gender: 'Male',
      heightCm: 178,
      weightKg: 74,
      affectedLeg: 'right',
      indication: 'ACL Reconstruction (Week 8 Post-Op)',
      painScale: 3,
      activityLevel: 'Competitive Footballer',
      notes: 'Evaluating rotational laxity and anterior tibial translation during pivoting.'
    },
    {
      id: 'PT-2026-8819',
      name: 'Dr. Meera Nair',
      age: 34,
      gender: 'Female',
      heightCm: 165,
      weightKg: 61,
      affectedLeg: 'left',
      indication: 'Medial Meniscus Posterior Horn Tear',
      painScale: 4,
      activityLevel: 'Recreational Runner',
      notes: 'Patient reports clicking/crepitus at 40°-60° flexion during stair descent.'
    },
    {
      id: 'PT-2026-7240',
      name: 'Sunil Joshi',
      age: 58,
      gender: 'Male',
      heightCm: 172,
      weightKg: 82,
      affectedLeg: 'right',
      indication: 'Knee Osteoarthritis (KL Grade III)',
      painScale: 6,
      activityLevel: 'Sedentary',
      notes: 'Assessing varus deformity excursion and dynamic joint space narrowing during sit-to-stand.'
    }
  ];

  const handleApplyPreset = (p) => {
    setFormData({ ...formData, ...p });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSavePatient({
      ...formData,
      bmi,
      bmiCategory
    });
    onClose();
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border my-6 transition-all ${
        isDark ? 'bg-[#0c111e] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Patient Clinical Intake & Gait Assessment Setup</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Pre-Assessment
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter patient physiological metrics to calibrate TASO 6-DOF kinematics
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
          
          {/* Quick Preset Selector */}
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Select Pre-Configured Clinical Case or Enter Patient:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presets.map((p) => {
                const isSelected = formData.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                        : isDark ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold truncate text-emerald-500">{p.id}</div>
                      <div className="font-semibold truncate text-[11px] mt-0.5">{p.name} ({p.age}y, {p.gender[0]})</div>
                    </div>
                    <div className={`text-[10px] truncate mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {p.indication}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Patient UHID / MRN
              </label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-emerald-300' : 'bg-slate-50 border-slate-300 text-emerald-700'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Patient Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Age
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Affected Leg Selection */}
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Target Evaluation Leg
              </label>
              <select
                value={formData.affectedLeg}
                onChange={(e) => setFormData({ ...formData, affectedLeg: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-cyan-300' : 'bg-slate-50 border-slate-300 text-cyan-700'
                }`}
              >
                <option value="right">Right Knee (Dominant)</option>
                <option value="left">Left Knee (Dominant)</option>
                <option value="bilateral">Bilateral Assessment</option>
              </select>
            </div>

            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 170 })}
                className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Weight (kg)
              </label>
              <input
                type="number"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Calculated BMI Badge */}
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Calculated BMI
              </label>
              <div className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold flex items-center justify-between ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <span>{bmi} kg/m²</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  {bmiCategory}
                </span>
              </div>
            </div>

          </div>

          {/* Clinical Indication & Pain Scale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Clinical Indication / Diagnosis
              </label>
              <input
                type="text"
                value={formData.indication}
                onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Reported VAS Pain Scale
                </label>
                <span className="text-xs font-mono font-bold text-amber-500">
                  {formData.painScale} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.painScale}
                onChange={(e) => setFormData({ ...formData, painScale: parseInt(e.target.value) })}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0 (No Pain)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe)</span>
              </div>
            </div>
          </div>

          {/* Pre-Assessment Biomechanical Verification Checklist */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sleeve Band Biomechanical Readiness Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.bandFitted}
                  onChange={(e) => setChecklist({ ...checklist, bandFitted: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Sleeve Fixture Strapped</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.tensionChecked}
                  onChange={(e) => setChecklist({ ...checklist, tensionChecked: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Preload (11N-22N) Verified</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.neutralStanding}
                  onChange={(e) => setChecklist({ ...checklist, neutralStanding: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Neutral Stand Ready</span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className={`pt-4 border-t flex items-center justify-between ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Assigned: <span className="font-bold text-emerald-500">{formData.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Initialize Gait Assessment</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
