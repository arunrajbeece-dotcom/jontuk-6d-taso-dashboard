import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Flame, 
  Volume2, 
  Zap, 
  Activity, 
  Sliders, 
  Trash2, 
  CheckCircle2,
  Info
} from 'lucide-react';

export default function TasoMaiWidgets({
  tension = 15.5,
  staScale = 1.0,
  staHealth = 'Optimal',
  onSetTension,
  instabilityEvents = [],
  onTriggerInstability,
  onClearEvents,
  latestEvent = null,
  theme = 'dark'
}) {
  const isDark = theme === 'dark';

  const healthConfig = {
    Optimal: {
      color: 'emerald',
      bgBadge: isDark ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-700',
      label: 'Optimal Biomechanical Coupling',
      desc: 'Skin-to-bone inertial transfer validated. EKF measurement noise R is at base nominal state.',
      icon: ShieldCheck,
      textColor: 'text-emerald-500'
    },
    Loose: {
      color: 'amber',
      bgBadge: isDark ? 'bg-amber-950/80 border-amber-700/60 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-700',
      label: 'Moderate Soft-Tissue Wobble',
      desc: 'Soft tissue shear artifact detected. EKF dynamically scaling R-matrix (+250%) to discard skin noise.',
      icon: AlertTriangle,
      textColor: 'text-amber-500'
    },
    Critical: {
      color: 'rose',
      bgBadge: isDark ? 'bg-rose-950/80 border-rose-700/60 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-700',
      label: 'Severe Strap Slippage / Lift-Off',
      desc: 'High STA vulnerability! Accelerometer trust heavily suppressed (+800%). Relying on kinematic prediction.',
      icon: AlertOctagon,
      textColor: 'text-rose-500'
    },
    'Over-tight': {
      color: 'blue',
      bgBadge: isDark ? 'bg-blue-950/80 border-blue-700/60 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-700',
      label: 'Excessive Strap Tension',
      desc: 'Over-tensioned fixture (>22N). Advise loosening strap to avoid cutaneous discomfort or ischemia.',
      icon: AlertTriangle,
      textColor: 'text-blue-500'
    }
  };

  const currentCfg = healthConfig[staHealth] || healthConfig.Optimal;
  const HealthIcon = currentCfg.icon;

  const tensionClamped = Math.max(0, Math.min(30, tension));
  const tensionPercent = (tensionClamped / 30) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* WIDGET 1: TASO STRAP TENSION & EKF ADAPTATION GAUGE */}
      <div className={`rounded-2xl border p-5 shadow-xl flex flex-col justify-between transition-colors ${
        isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Sliders className="w-4 h-4 text-cyan-500" />
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  TASO: Tension-Adaptive STA Compensation
                </h3>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Dynamic Extended Kalman Filter Covariance Scaling
                </p>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${currentCfg.bgBadge}`}>
              <HealthIcon className="w-3.5 h-3.5" />
              <span>{staHealth}</span>
            </div>
          </div>

          {/* Dynamic Gauge Meter */}
          <div className={`my-3 p-4 border rounded-xl space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            
            <div className="flex items-end justify-between">
              <div>
                <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Strap Preload</div>
                <div className="text-3xl font-mono font-extrabold flex items-baseline gap-1.5">
                  <span className={currentCfg.textColor}>{tension}</span>
                  <span className={`text-sm font-sans font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Newtons (N)</span>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>EKF Noise Matrix Scale</div>
                <div className="text-2xl font-mono font-bold text-cyan-500">
                  {staScale}× <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>R_base</span>
                </div>
              </div>
            </div>

            {/* Custom Multi-Zone Gauge Track */}
            <div className="space-y-1.5">
              <div className="relative h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700 flex">
                <div className="w-[20%] h-full bg-rose-500/80 rounded-l-full" title="Critical (<6N)" />
                <div className="w-[17%] h-full bg-amber-500/80" title="Loose (6-11N)" />
                <div className="w-[37%] h-full bg-emerald-500/80" title="Optimal (11-22N)" />
                <div className="w-[26%] h-full bg-blue-500/80 rounded-r-full" title="Over-tight (>22N)" />

                <div 
                  className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-lg border border-slate-900 transition-all duration-150 transform -translate-x-1/2"
                  style={{ left: `${tensionPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono px-0.5">
                <span className="text-rose-500">0N (Slippage)</span>
                <span className="text-amber-500">6N</span>
                <span className="text-emerald-500">11N (Ideal) 22N</span>
                <span className="text-blue-500">30N</span>
              </div>
            </div>

            {/* Scientific Explanation Card */}
            <div className={`flex items-start gap-2.5 p-2.5 border rounded-lg text-xs ${
              isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}>
              <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">{currentCfg.label}</div>
                <div className={`text-[11px] leading-relaxed mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentCfg.desc}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Live Tension Preset Controls for Judges */}
        <div className={`pt-2 border-t flex items-center justify-between gap-2 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <span className={`text-[11px] font-mono uppercase hidden sm:inline ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Judge Demo:
          </span>
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto flex-1">
            <button
              onClick={() => onSetTension(4.5)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                tension < 6 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-500 font-bold' 
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Loose (4.5N)
            </button>
            <button
              onClick={() => onSetTension(15.5)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                tension >= 11 && tension <= 22 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 font-bold' 
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Optimal (15.5N)
            </button>
            <button
              onClick={() => onSetTension(26.0)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                tension > 22 
                  ? 'bg-blue-500/20 border-blue-500 text-blue-500 font-bold' 
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Over-tight (26N)
            </button>
          </div>
        </div>

      </div>

      {/* WIDGET 2: MAI DETECTOR & CREPITUS INSTABILITY EVENT LOG */}
      <div className={`rounded-2xl border p-5 shadow-xl flex flex-col justify-between transition-colors ${
        isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  MAI: Mechanical-Acoustic Instability Engine
                </h3>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Correlated Acoustic Transients vs Peak Angular Jerk (d²ω/dt²)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onTriggerInstability}
                className="px-2.5 py-1 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md shadow-rose-900/20 transition-all"
                title="Inject synthetic subluxation/crepitus spike to demonstrate detection"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Trigger Event</span>
              </button>

              {instabilityEvents.length > 0 && (
                <button
                  onClick={onClearEvents}
                  title="Clear Log"
                  className={`p-1 rounded-lg border transition-all ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Real-time Status Card */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className={`p-2.5 rounded-xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Crepitus Acoustic Gate</div>
              <div className="text-base font-mono font-bold text-rose-500 mt-0.5">
                380 a.u. <span className="text-slate-400 text-xs font-normal">piezo</span>
              </div>
              <div className="text-[10px] text-slate-400">Intra-articular vibration</div>
            </div>

            <div className={`p-2.5 rounded-xl border ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Kinematic Jerk Threshold</div>
              <div className="text-base font-mono font-bold text-amber-500 mt-0.5">
                2,400 °/s³ <span className="text-slate-400 text-xs font-normal">peak</span>
              </div>
              <div className="text-[10px] text-slate-400">Rotational acceleration jump</div>
            </div>
          </div>

          {/* Event Log Scrolling List */}
          <div className={`rounded-xl p-2.5 h-[170px] overflow-y-auto space-y-2 border ${
            isDark ? 'bg-slate-950/70 border-slate-800/90' : 'bg-slate-50 border-slate-200'
          }`}>
            {instabilityEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-400 mb-1" />
                <span className="text-xs font-medium">Joint Kinematics Stable</span>
                <span className="text-[10px]">No correlated acoustic-jerk micro-subluxation events detected.</span>
              </div>
            ) : (
              instabilityEvents.slice(0, 15).map((evt) => {
                const isCritical = evt.severity === 'Critical';
                const isModerate = evt.severity === 'Moderate';

                return (
                  <div
                    key={evt.id}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      isCritical
                        ? isDark ? 'bg-rose-950/40 border-rose-800/80 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
                        : isModerate
                        ? isDark ? 'bg-amber-950/40 border-amber-800/80 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Flame className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-500' : 'text-amber-500'}`} />
                        <span>{evt.classification}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          isCritical 
                            ? 'bg-rose-500/20 text-rose-500' 
                            : 'bg-amber-500/20 text-amber-500'
                        }`}>
                          {evt.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{evt.timestamp}</span>
                      </div>
                    </div>

                    <div className={`grid grid-cols-3 gap-2 text-[11px] font-mono mt-1 p-1.5 rounded-lg ${
                      isDark ? 'bg-black/30 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <div>
                        <span className="text-slate-400">Flex: </span>
                        <span className="font-semibold text-cyan-500">{evt.flexionAngle}°</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Jerk: </span>
                        <span className="font-semibold text-amber-500">{evt.angularJerk} °/s³</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Acoustic: </span>
                        <span className="font-semibold text-rose-500">{evt.acousticEnergy} a.u.</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Total Events Counter Footer */}
        <div className={`pt-2 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
        }`}>
          <span>Captured Events: <strong className="font-mono text-cyan-500">{instabilityEvents.length}</strong></span>
          <span className="text-[11px] text-cyan-500">Window Correlation: 50ms Coincidence</span>
        </div>

      </div>

    </div>
  );
}
