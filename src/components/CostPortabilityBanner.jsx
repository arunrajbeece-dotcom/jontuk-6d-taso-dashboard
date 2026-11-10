import React, { useState } from 'react';
import { 
  DollarSign, 
  Sparkles, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Zap, 
  MapPin, 
  Clock, 
  Shield, 
  Cpu 
} from 'lucide-react';

export default function CostPortabilityBanner({ theme = 'dark' }) {
  const [expanded, setExpanded] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl border p-4 shadow-xl overflow-hidden relative transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-r from-[#0d1424] via-[#0f1b2e] to-[#0d1424] border-cyan-800/40 text-slate-100' 
        : 'bg-gradient-to-r from-slate-50 via-cyan-50/40 to-slate-50 border-cyan-200 text-slate-800 shadow-sm'
    }`}>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-12 bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Main Banner Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Headline & Metrics */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-bold text-emerald-500 font-mono text-base ${
              isDark ? 'bg-[#0a0f1d]' : 'bg-white'
            }`}>
              ₹4K
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold tracking-tight flex items-center gap-1.5 font-mono">
                JONTUK-6D TASO: Sub-₹4,000 Portable Kit vs. ₹20L+ Optical Mocap Labs
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                500× Cost Disruption
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Democratizing gold-standard clinical 6-DOF knee kinematics, soft-tissue compensation, and crepitus acoustic screening.
            </p>
          </div>
        </div>

        {/* Right: Quick Action Pill & Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-left md:text-right">
              <div className="text-[10px] text-slate-400 uppercase">Hardware BOM</div>
              <div className="font-extrabold text-emerald-500 text-sm">₹3,850 ($46)</div>
            </div>
            <div className={`h-6 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className="text-left md:text-right">
              <div className="text-[10px] text-slate-400 uppercase">Optical Lab</div>
              <div className="font-semibold text-rose-500 line-through text-xs">₹20,00,000+</div>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-700 hover:border-cyan-500/50 text-slate-200' 
                : 'bg-white border-slate-300 hover:border-cyan-500 text-slate-700 shadow-sm'
            }`}
          >
            <span>{expanded ? 'Hide Matrix' : 'Compare Specs'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Expandable Deep-Dive Comparison Matrix */}
      {expanded && (
        <div className={`mt-4 pt-4 border-t animate-in fade-in duration-200 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            {/* Feature 1: Clinical Access & Portability */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-1.5 text-cyan-500 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Field Portability</span>
              </div>
              <div className="text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>JONTUK: Sidelines, rural clinics & home rehab</span>
              </div>
              <div className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Optical: Confined to 12-camera dark room</span>
              </div>
            </div>

            {/* Feature 2: Setup Time & Usability */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-1.5 text-cyan-500 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Clinician Setup Time</span>
              </div>
              <div className="text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>JONTUK: &lt; 45 seconds (dual strap click)</span>
              </div>
              <div className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Optical: 45 - 60 min marker palpation</span>
              </div>
            </div>

            {/* Feature 3: Soft-Tissue Artifact (STA) */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-1.5 text-cyan-500 font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>STA Compensation</span>
              </div>
              <div className="text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>JONTUK: Dynamic TASO EKF noise matrix</span>
              </div>
              <div className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Optical: Marker skin wobble corrupts raw data</span>
              </div>
            </div>

            {/* Feature 4: Acoustic Crepitus Detection */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-1.5 text-cyan-500 font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>Acoustic Instability</span>
              </div>
              <div className="text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>JONTUK: 4kHz Piezo MAI Crepitus correlation</span>
              </div>
              <div className={`text-[11px] flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Optical: 0% Acoustic awareness (optical only)</span>
              </div>
            </div>

          </div>

          {/* BOM Breakdown Sub-bar */}
          <div className={`mt-3 p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono ${
            isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <span className="font-bold text-cyan-500 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> JONTUK BOM:
            </span>
            <span>ESP32-S3: ₹420</span>
            <span>•</span>
            <span>Dual MPU6050 6-DOF IMUs: ₹380</span>
            <span>•</span>
            <span>Piezo Acoustic Contact Mic: ₹160</span>
            <span>•</span>
            <span>TASO FSR Strap Load Cell: ₹490</span>
            <span>•</span>
            <span>3.7V 500mAh LiPo & BMS: ₹280</span>
            <span>•</span>
            <span>SLA 3D Enclosure & Neoprene: ₹620</span>
            <span className="font-bold text-emerald-500">= ₹2,350 Raw / ₹3,850 Finished</span>
          </div>
        </div>
      )}

    </div>
  );
}
