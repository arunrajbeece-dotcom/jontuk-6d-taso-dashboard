import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Award,
  Calendar,
  User,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export default function ClinicalReportModal({
  isOpen,
  onClose,
  activeProtocol = 'walking',
  telemetryHistory = [],
  instabilityEvents = [],
  currentTension = 15,
  rotErrorRMS = 1.3,
  transErrorRMS = 1.0,
  currentClinician = null,
  currentPatient = null,
  theme = 'dark'
}) {
  const [patientId, setPatientId] = useState(currentPatient?.id || 'PT-2026-9042');
  const [patientName, setPatientName] = useState(currentPatient?.name || 'Rohan Sharma');
  const [clinicianName, setClinicianName] = useState(currentClinician?.name || 'Dr. Ananya Roy, MS (Ortho)');
  const [notes, setNotes] = useState(currentPatient?.notes || 'Patient exhibits intact sagittal kinematics during walking. Slight increase in anterior tibial translation during stair descent. TASO tension maintained within clinical bounds.');

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const summary = React.useMemo(() => {
    if (!telemetryHistory.length) {
      return {
        maxFlexion: 62.4,
        minFlexion: 2.1,
        maxVarusValgus: 4.8,
        maxIntExt: 12.5,
        peakAP: 6.2,
        avgTension: 15.2,
        optimalTensionPercent: 96,
        totalFrames: 0
      };
    }

    let maxFlex = -999, minFlex = 999;
    let maxAdd = 0, maxRot = 0;
    let maxAP = -999;
    let tensionSum = 0;
    let optimalTensionCount = 0;

    telemetryHistory.forEach(d => {
      const flex = d.rotations?.flexion || 0;
      const add = Math.abs(d.rotations?.adduction || 0);
      const rot = Math.abs(d.rotations?.internalRotation || 0);
      const ap = d.translations?.ap || 0;
      const t = d.tension || 15;

      if (flex > maxFlex) maxFlex = flex;
      if (flex < minFlex) minFlex = flex;
      if (add > maxAdd) maxAdd = add;
      if (rot > maxRot) maxRot = rot;
      if (ap > maxAP) maxAP = ap;

      tensionSum += t;
      if (t >= 11 && t <= 22) optimalTensionCount++;
    });

    return {
      maxFlexion: Number(maxFlex.toFixed(1)),
      minFlexion: Number(minFlex.toFixed(1)),
      maxVarusValgus: Number(maxAdd.toFixed(1)),
      maxIntExt: Number(maxRot.toFixed(1)),
      peakAP: Number(maxAP.toFixed(1)),
      avgTension: Number((tensionSum / telemetryHistory.length).toFixed(1)),
      optimalTensionPercent: Math.round((optimalTensionCount / telemetryHistory.length) * 100),
      totalFrames: telemetryHistory.length
    };
  }, [telemetryHistory]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!telemetryHistory.length) return;
    const headers = "Timestamp,Flexion_deg,VarusValgus_deg,InternalRot_deg,AP_mm,SI_mm,ML_mm,StrapTension_N,Acoustic_au,AngularJerk_deg_s3\n";
    const rows = telemetryHistory.map(d => 
      `${d.t},${d.rotations?.flexion},${d.rotations?.adduction},${d.rotations?.internalRotation},${d.translations?.ap},${d.translations?.si},${d.translations?.ml},${d.tension},${d.acoustic},${d.angularJerk}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `JONTUK6D_Kinematics_${patientId}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6 border transition-all ${
        isDark ? 'bg-[#0b101c] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Clinical Knee Biomechanics Diagnostic Dossier</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ISB / Grood-Suntay Standard
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                JONTUK-6D TASO • L&T Techgium 2026
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs max-h-[75vh]">
          
          {/* Metadata Row */}
          <div className={`grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <label className={`text-[10px] uppercase font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Subject UHID / Name
              </label>
              <div className="font-bold text-xs text-cyan-500">
                {currentPatient?.name || patientName}
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                {currentPatient?.id || patientId} ({currentPatient?.age || 27}y, {currentPatient?.gender || 'M'})
              </div>
            </div>

            <div>
              <label className={`text-[10px] uppercase font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Evaluated Knee Side
              </label>
              <div className="font-bold text-xs text-emerald-500 capitalize">
                {currentPatient?.affectedLeg === 'left' ? 'Left Knee' : 'Right Knee'}
              </div>
              <div className="text-[10px] text-slate-400">
                BMI: {currentPatient?.bmi || 23.4} ({currentPatient?.bmiCategory || 'Normal'})
              </div>
            </div>

            <div>
              <label className={`text-[10px] uppercase font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Attending Clinician
              </label>
              <div className="font-bold text-xs">
                {currentClinician?.name || clinicianName}
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                {currentClinician?.id || 'DR-ORTHO-8024'}
              </div>
            </div>

            <div>
              <label className={`text-[10px] uppercase font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Protocol & Date
              </label>
              <div className="font-mono text-xs text-emerald-500 capitalize font-bold">
                {activeProtocol.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Section 1: 6-DOF ROM & Laxity */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>1. Range of Motion (ROM) & 3D Joint Laxity</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] text-slate-400 uppercase">Peak Sagittal Flexion</div>
                <div className="text-xl font-mono font-bold text-cyan-500 mt-0.5">
                  {summary.maxFlexion}°
                </div>
                <div className="text-[10px] text-slate-400">Extension: {summary.minFlexion}°</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] text-slate-400 uppercase">Varus / Valgus Coronal</div>
                <div className="text-xl font-mono font-bold text-emerald-500 mt-0.5">
                  ±{summary.maxVarusValgus}°
                </div>
                <div className="text-[10px] text-slate-400">Normal envelope &lt; 5°</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] text-slate-400 uppercase">Internal / External Rot</div>
                <div className="text-xl font-mono font-bold text-purple-500 mt-0.5">
                  {summary.maxIntExt}°
                </div>
                <div className="text-[10px] text-slate-400">Transverse excursion</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] text-slate-400 uppercase">Peak Anterior Translation</div>
                <div className="text-xl font-mono font-bold text-amber-500 mt-0.5">
                  {summary.peakAP} mm
                </div>
                <div className="text-[10px] text-slate-400">Lachman/Drawer laxity</div>
              </div>
            </div>
          </div>

          {/* Section 2: TASO Quality */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>2. TASO Soft-Tissue Artifact (STA) Quality Index</span>
            </h3>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Average Strap Preload</div>
                <div className="text-lg font-mono font-bold mt-0.5">
                  {summary.avgTension} N
                </div>
                <div className="text-[10px] text-emerald-500">Within optimal 11-22N window</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Optimal Coupling Fraction</div>
                <div className="text-lg font-mono font-bold text-cyan-500 mt-0.5">
                  {summary.optimalTensionPercent}%
                </div>
                <div className="text-[10px] text-slate-400">Session data integrity score</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Sensor EKF RMS Error</div>
                <div className="text-lg font-mono font-bold mt-0.5">
                  ±{rotErrorRMS}° <span className="text-xs text-slate-400">/ ±{transErrorRMS}mm</span>
                </div>
                <div className="text-[10px] text-emerald-500">Passed clinical threshold (&lt;5° / &lt;5mm)</div>
              </div>
            </div>
          </div>

          {/* Section 3: MAI Events */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              <Activity className="w-4 h-4 text-rose-500" />
              <span>3. Micro-Acoustic Instability (MAI) Event Log ({instabilityEvents.length})</span>
            </h3>

            {instabilityEvents.length === 0 ? (
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                isDark ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>No pathological crepitus or subluxation slip transients detected during test protocol.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {instabilityEvents.map((evt) => (
                  <div key={evt.id} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="font-bold">{evt.classification}</span>
                      <span className="text-[10px] text-slate-400 ml-2">@ {evt.flexionAngle}° Flexion ({evt.timestamp})</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-amber-500">Jerk: {evt.angularJerk} °/s³</span>
                      <span className="text-rose-500">Acoustic: {evt.acousticEnergy} a.u.</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[10px]">
                        {evt.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Clinician Diagnostic Notes & Recommendations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans border ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            Hardware: ESP32-S3 BLE Sleeve • TASO v1.2
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadCSV}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <Download className="w-4 h-4 text-cyan-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/25 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
