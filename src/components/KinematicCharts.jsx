import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  CartesianGrid
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Maximize2, 
  Minimize2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

// Custom Medical Tooltip
const CustomTooltip = ({ active, payload, label, isDark = true }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className={`p-2.5 rounded-xl border shadow-2xl text-xs space-y-1 z-50 backdrop-blur-md ${
      isDark ? 'bg-[#0b0f19]/95 border-slate-700 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'
    }`}>
      <div className={`text-[11px] font-mono border-b pb-1 flex justify-between gap-4 ${
        isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'
      }`}>
        <span>Time: {label}s</span>
        <span className="text-cyan-500 font-semibold">100Hz Telemetry</span>
      </div>
      <div className="space-y-0.5 pt-1 font-mono">
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {item.value} {item.unit || ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function KinematicCharts({ 
  telemetryHistory = [],
  rotErrorRMS = 1.4,
  transErrorRMS = 1.1,
  staHealth = 'Optimal',
  theme = 'dark'
}) {
  const [timeWindow, setTimeWindow] = useState(10);
  const [showToleranceBands, setShowToleranceBands] = useState(true);

  const isDark = theme === 'dark';

  const filteredData = React.useMemo(() => {
    if (!telemetryHistory.length) return [];
    const latestTime = telemetryHistory[telemetryHistory.length - 1]?.t || 0;
    const cutoff = latestTime - timeWindow;
    return telemetryHistory.filter(d => d.t >= cutoff);
  }, [telemetryHistory, timeWindow]);

  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
  const axisColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <div className="space-y-4">
      
      {/* Charts Header Controls */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-2xl border transition-colors ${
        isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500" />
          <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Real-Time 6-DOF Kinematic Curves
          </h2>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
          }`}>
            Synchronized 60 FPS
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Clinical Tolerance Badge */}
          <button
            onClick={() => setShowToleranceBands(!showToleranceBands)}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              showToleranceBands
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-500 font-semibold'
                : isDark ? 'bg-slate-800/60 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Tolerance Bands (±5° / ±5mm)</span>
          </button>

          {/* Time Window Buttons */}
          <div className={`flex items-center border rounded-lg p-0.5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {[5, 10, 20].map((sec) => (
              <button
                key={sec}
                onClick={() => setTimeWindow(sec)}
                className={`px-2 py-0.5 text-xs rounded-md font-mono transition-all ${
                  timeWindow === sec
                    ? 'bg-cyan-600 text-white font-semibold'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 3 Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* CHART 1: Angular Kinematics */}
        <div className={`p-4 rounded-2xl border shadow-lg flex flex-col transition-colors ${
          isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span>Angular Kinematics (Grood-Suntay)</span>
              </div>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Rotational axes: Flexion, Varus/Valgus, Int/Ext Rotation
              </p>
            </div>
            <div className="text-right">
              <span className={`text-[11px] font-mono font-bold ${
                rotErrorRMS <= 5.0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                RMS Error: ±{rotErrorRMS}°
              </span>
              <div className="text-[9px] text-slate-400">Target &lt; 5.0°</div>
            </div>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} syncId="jontuk-6d" margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.7} />
                <XAxis dataKey="timeFormatted" stroke={axisColor} tick={{ fontSize: 10, fill: axisColor }} />
                <YAxis domain={[-20, 110]} stroke={axisColor} tick={{ fontSize: 10, fill: axisColor }} unit="°" />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                
                {showToleranceBands && (
                  <>
                    <ReferenceLine y={0} stroke={isDark ? "#334155" : "#cbd5e1"} strokeDasharray="2 2" />
                    <ReferenceLine y={90} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: '90° Flex', fill: '#38bdf8', fontSize: 9, position: 'insideTopLeft' }} />
                  </>
                )}

                <Line
                  type="monotone"
                  dataKey="rotations.flexion"
                  name="Flex / Ext"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  unit="°"
                />
                <Line
                  type="monotone"
                  dataKey="rotations.adduction"
                  name="Var / Val"
                  stroke="#10b981"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                  unit="°"
                />
                <Line
                  type="monotone"
                  dataKey="rotations.internalRotation"
                  name="Int / Ext"
                  stroke="#a855f7"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                  unit="°"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <span className="text-cyan-500 font-semibold">Flex: {filteredData[filteredData.length - 1]?.rotations?.flexion ?? 0}°</span>
            <span className="text-emerald-500 font-semibold">Var/Val: {filteredData[filteredData.length - 1]?.rotations?.adduction ?? 0}°</span>
            <span className="text-purple-500 font-semibold">Rot: {filteredData[filteredData.length - 1]?.rotations?.internalRotation ?? 0}°</span>
          </div>
        </div>

        {/* CHART 2: Translational Kinematics */}
        <div className={`p-4 rounded-2xl border shadow-lg flex flex-col transition-colors ${
          isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                <span>3D Translational Kinematics</span>
              </div>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Joint Laxity & Shear: Anterior-Posterior, Prox-Dist, Med-Lat
              </p>
            </div>
            <div className="text-right">
              <span className={`text-[11px] font-mono font-bold ${
                transErrorRMS <= 5.0 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                RMS Error: ±{transErrorRMS}mm
              </span>
              <div className="text-[9px] text-slate-400">Target &lt; 5.0mm</div>
            </div>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} syncId="jontuk-6d" margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.7} />
                <XAxis dataKey="timeFormatted" stroke={axisColor} tick={{ fontSize: 10, fill: axisColor }} />
                <YAxis domain={[-8, 16]} stroke={axisColor} tick={{ fontSize: 10, fill: axisColor }} unit="mm" />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />

                {showToleranceBands && (
                  <>
                    <ReferenceArea y1={-5} y2={5} fill="#10b981" fillOpacity={isDark ? 0.05 : 0.08} />
                    <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.7} />
                    <ReferenceLine y={-5} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.7} />
                  </>
                )}

                <Line
                  type="monotone"
                  dataKey="translations.ap"
                  name="AP Shear"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  unit="mm"
                />
                <Line
                  type="monotone"
                  dataKey="translations.si"
                  name="Prox-Dist"
                  stroke="#6366f1"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                  unit="mm"
                />
                <Line
                  type="monotone"
                  dataKey="translations.ml"
                  name="Med-Lat"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                  unit="mm"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <span className="text-teal-500 font-semibold">AP: {filteredData[filteredData.length - 1]?.translations?.ap ?? 0}mm</span>
            <span className="text-indigo-500 font-semibold">SI: {filteredData[filteredData.length - 1]?.translations?.si ?? 0}mm</span>
            <span className="text-slate-500 font-semibold">ML: {filteredData[filteredData.length - 1]?.translations?.ml ?? 0}mm</span>
          </div>
        </div>

        {/* CHART 3: TASO Tension & MAI Acoustic */}
        <div className={`p-4 rounded-2xl border shadow-lg flex flex-col transition-colors ${
          isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>TASO Tension & Acoustic Transients</span>
              </div>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Strap preload (N) & High-frequency micro-crepitus energy (a.u.)
              </p>
            </div>
            <div className="text-right">
              <span className={`text-[11px] font-mono font-bold ${
                staHealth === 'Optimal' ? 'text-emerald-500' : 'text-amber-500'
              }`}>
                TASO: {staHealth}
              </span>
              <div className="text-[9px] text-slate-400">EKF Covariance Adaptation</div>
            </div>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} syncId="jontuk-6d" margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.7} />
                <XAxis dataKey="timeFormatted" stroke={axisColor} tick={{ fontSize: 10, fill: axisColor }} />
                <YAxis yAxisId="left" domain={[0, 30]} stroke="#f59e0b" tick={{ fontSize: 10, fill: '#f59e0b' }} unit="N" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 1000]} stroke="#f43f5e" tick={{ fontSize: 10, fill: '#f43f5e' }} unit="" />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />

                <ReferenceArea yAxisId="left" y1={11} y2={22} fill="#10b981" fillOpacity={isDark ? 0.06 : 0.09} />
                <ReferenceLine yAxisId="left" y={15} stroke="#10b981" strokeDasharray="2 2" strokeOpacity={0.6} />
                <ReferenceLine yAxisId="right" y={380} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'MAI Crepitus Gate', fill: '#f43f5e', fontSize: 9, position: 'insideTopRight' }} />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tension"
                  name="Strap Tension"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  unit="N"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="acoustic"
                  name="Piezo Acoustic"
                  stroke="#f43f5e"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                  unit="a.u."
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <span className="text-amber-500 font-semibold">Tension: {filteredData[filteredData.length - 1]?.tension ?? 15} N</span>
            <span className="text-rose-500 font-semibold">Acoustic: {filteredData[filteredData.length - 1]?.acoustic ?? 50} a.u.</span>
            <span className="text-slate-500 font-semibold">Jerk: {filteredData[filteredData.length - 1]?.angularJerk ?? 0} °/s³</span>
          </div>
        </div>

      </div>

    </div>
  );
}
