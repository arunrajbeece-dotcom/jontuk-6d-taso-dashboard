import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCcw, Compass, Layers, ShieldCheck, AlertCircle } from 'lucide-react';

export default function KneeVisualizer3D({ 
  rotations = { flexion: 0, adduction: 0, internalRotation: 0 },
  translations = { ap: 0, si: 0, ml: 0 },
  tension = 15,
  staHealth = 'Optimal',
  theme = 'dark',
  affectedLeg = 'right'
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const gridRef = useRef(null);
  
  // 3D Joint articulation nodes
  const kneeJointRef = useRef(null);
  const tibiaGroupRef = useRef(null);
  const patellaRef = useRef(null);
  const axesTriadRef = useRef(null);
  const femurStrapRef = useRef(null);
  const tibiaStrapRef = useRef(null);

  // View settings
  const [activeView, setActiveView] = useState('isometric');
  const [showAxes, setShowAxes] = useState(true);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const orbitGroupRef = useRef(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isDark ? 0x0a0e17 : 0xf1f5f9);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.75 : 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(15, 20, 20);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.0);
    dirLight2.position.set(-15, -10, 15);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.5);
    rimLight.position.set(0, 10, -20);
    scene.add(rimLight);

    // Grid Floor
    const gridColor1 = isDark ? 0x1e293b : 0xcbd5e1;
    const gridColor2 = isDark ? 0x0f172a : 0xe2e8f0;
    const grid = new THREE.GridHelper(30, 20, gridColor1, gridColor2);
    grid.position.y = -12;
    gridRef.current = grid;
    scene.add(grid);

    // 5. Build Biomechanical Knee Anatomy Hierarchy
    const orbitGroup = new THREE.Group();
    orbitGroupRef.current = orbitGroup;
    scene.add(orbitGroup);

    // Bone Materials
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0xe2e8f0 : 0xd1d5db,
      roughness: 0.35,
      metalness: 0.15
    });

    const condyleMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0xcfd8e3 : 0x9ca3af,
      roughness: 0.25,
      metalness: 0.2
    });

    const cartilageMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true
    });

    const sensorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.8
    });

    const strapMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.6,
      metalness: 0.1
    });

    // FEMUR HIERARCHY
    const femurGroup = new THREE.Group();
    orbitGroup.add(femurGroup);

    const femurShaftGeo = new THREE.CylinderGeometry(1.6, 2.0, 11, 24);
    const femurShaft = new THREE.Mesh(femurShaftGeo, boneMaterial);
    femurShaft.position.set(0, 7.5, 0);
    femurGroup.add(femurShaft);

    const trochanterGeo = new THREE.SphereGeometry(2.1, 16, 16);
    const trochanter = new THREE.Mesh(trochanterGeo, boneMaterial);
    trochanter.position.set(-0.8, 13, 0);
    femurGroup.add(trochanter);

    const lateralCondyleGeo = new THREE.SphereGeometry(1.9, 20, 20);
    lateralCondyleGeo.scale(1.0, 1.25, 1.4);
    const lateralCondyle = new THREE.Mesh(lateralCondyleGeo, condyleMaterial);
    lateralCondyle.position.set(1.7, 2.0, 0);
    femurGroup.add(lateralCondyle);

    const medialCondyle = new THREE.Mesh(lateralCondyleGeo, condyleMaterial);
    medialCondyle.position.set(-1.7, 2.0, 0);
    femurGroup.add(medialCondyle);

    // Wearable TASO Sensor Pack on Femur
    const sensorFemurGeo = new THREE.BoxGeometry(2.4, 3.2, 1.2);
    const sensorFemur = new THREE.Mesh(sensorFemurGeo, sensorMaterial);
    sensorFemur.position.set(0, 8.5, 2.1);
    
    const ledGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 12);
    ledGeo.rotateX(Math.PI / 2);
    const ledFemurMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const ledFemur = new THREE.Mesh(ledGeo, ledFemurMat);
    ledFemur.position.set(0, 9.5, 2.7);
    sensorFemur.add(ledFemur);

    const strapFemurGeo = new THREE.TorusGeometry(2.1, 0.35, 12, 32);
    strapFemurGeo.rotateX(Math.PI / 2);
    const strapFemur = new THREE.Mesh(strapFemurGeo, strapMaterial);
    strapFemur.position.set(0, 8.5, 0);
    femurStrapRef.current = strapFemur;

    femurGroup.add(sensorFemur);
    femurGroup.add(strapFemur);

    // KNEE JOINT ARTICULATION NODE
    const kneeJoint = new THREE.Group();
    kneeJoint.position.set(0, 1.2, 0);
    kneeJointRef.current = kneeJoint;
    femurGroup.add(kneeJoint);

    // Grood-Suntay Axis Triad
    const axesTriad = new THREE.Group();
    axesTriadRef.current = axesTriad;
    
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 3.5, 0xef4444, 0.8, 0.4);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3.5, 0x10b981, 0.8, 0.4);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 3.5, 0x3b82f6, 0.8, 0.4);
    
    axesTriad.add(arrowX);
    axesTriad.add(arrowY);
    axesTriad.add(arrowZ);
    kneeJoint.add(axesTriad);

    // Meniscus Cartilage
    const meniscusGeo = new THREE.CylinderGeometry(3.0, 3.2, 0.5, 24);
    const meniscus = new THREE.Mesh(meniscusGeo, cartilageMaterial);
    meniscus.position.set(0, -0.2, 0);
    kneeJoint.add(meniscus);

    // TIBIA & SHANK HIERARCHY
    const tibiaGroup = new THREE.Group();
    tibiaGroupRef.current = tibiaGroup;
    kneeJoint.add(tibiaGroup);

    const plateauGeo = new THREE.CylinderGeometry(2.8, 2.0, 2.0, 20);
    const plateau = new THREE.Mesh(plateauGeo, condyleMaterial);
    plateau.position.set(0, -1.2, 0);
    tibiaGroup.add(plateau);

    const tibiaShaftGeo = new THREE.CylinderGeometry(1.8, 1.4, 12, 16);
    const tibiaShaft = new THREE.Mesh(tibiaShaftGeo, boneMaterial);
    tibiaShaft.position.set(0, -7.5, 0);
    tibiaGroup.add(tibiaShaft);

    const fibulaShaftGeo = new THREE.CylinderGeometry(0.45, 0.45, 11, 12);
    const fibulaShaft = new THREE.Mesh(fibulaShaftGeo, boneMaterial);
    fibulaShaft.position.set(2.4, -7.0, -0.3);
    tibiaGroup.add(fibulaShaft);

    // Wearable TASO Sensor Pack on Tibia
    const sensorTibia = new THREE.Mesh(sensorFemurGeo, sensorMaterial);
    sensorTibia.position.set(0, -6.5, 2.0);

    const ledTibia = new THREE.Mesh(ledGeo, ledFemurMat);
    ledTibia.position.set(0, -5.5, 2.6);
    sensorTibia.add(ledTibia);

    const strapTibiaGeo = new THREE.TorusGeometry(1.9, 0.35, 12, 32);
    strapTibiaGeo.rotateX(Math.PI / 2);
    const strapTibia = new THREE.Mesh(strapTibiaGeo, strapMaterial);
    strapTibia.position.set(0, -6.5, 0);
    tibiaStrapRef.current = strapTibia;

    tibiaGroup.add(sensorTibia);
    tibiaGroup.add(strapTibia);

    // PATELLA
    const patellaGeo = new THREE.SphereGeometry(1.3, 16, 16);
    patellaGeo.scale(1.0, 1.4, 0.5);
    const patella = new THREE.Mesh(patellaGeo, boneMaterial);
    patella.position.set(0, 1.5, 2.8);
    patellaRef.current = patella;
    femurGroup.add(patella);

    orbitGroup.rotation.y = 0.5;
    orbitGroup.rotation.x = 0.15;

    // Mouse Drag Controls
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !orbitGroupRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      orbitGroupRef.current.rotation.y += deltaX * 0.008;
      orbitGroupRef.current.rotation.x += deltaY * 0.008;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(16, Math.min(48, cameraRef.current.position.z + e.deltaY * 0.03));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 420;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update theme background color dynamically
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(isDark ? 0x0a0e17 : 0xf8fafc);
    }
  }, [isDark]);

  // Update Dynamic Articulation based on Grood-Suntay Telemetry
  useEffect(() => {
    if (!tibiaGroupRef.current || !kneeJointRef.current || !patellaRef.current) return;

    const deg2rad = Math.PI / 180;
    const flexRad = (rotations.flexion || 0) * deg2rad;
    const addRad = (rotations.adduction || 0) * deg2rad;
    const intRotRad = (rotations.internalRotation || 0) * deg2rad;

    const apTranslation = (translations.ap || 0) * 0.1;
    const siTranslation = (translations.si || 0) * 0.1;
    const mlTranslation = (translations.ml || 0) * 0.1;

    // Joint Translation
    kneeJointRef.current.position.set(
      mlTranslation,
      1.2 + siTranslation,
      apTranslation
    );

    // Shank Articulation
    tibiaGroupRef.current.rotation.set(
      flexRad,
      intRotRad,
      addRad
    );

    // Patella Tracking
    const patellaVerticalShift = 1.5 - (rotations.flexion / 90) * 1.8;
    const patellaDepth = 2.8 - Math.sin(flexRad * 0.6) * 0.5;
    patellaRef.current.position.set(0, patellaVerticalShift, patellaDepth);

    // Update Tension Color
    const strapColor = 
      staHealth === 'Optimal' ? 0x10b981 :
      staHealth === 'Loose' ? 0xf59e0b :
      staHealth === 'Critical' ? 0xef4444 :
      0x38bdf8;

    if (femurStrapRef.current) femurStrapRef.current.material.color.setHex(strapColor);
    if (tibiaStrapRef.current) tibiaStrapRef.current.material.color.setHex(strapColor);

  }, [rotations, translations, tension, staHealth]);

  const applyViewPreset = (view) => {
    setActiveView(view);
    if (!orbitGroupRef.current) return;

    switch (view) {
      case 'sagittal':
        orbitGroupRef.current.rotation.set(0, Math.PI / 2, 0);
        break;
      case 'coronal':
        orbitGroupRef.current.rotation.set(0, 0, 0);
        break;
      case 'axial':
        orbitGroupRef.current.rotation.set(Math.PI / 2.2, 0, 0);
        break;
      case 'isometric':
      default:
        orbitGroupRef.current.rotation.set(0.2, 0.6, 0);
        break;
    }
  };

  const toggleAxes = () => {
    setShowAxes(!showAxes);
    if (axesTriadRef.current) {
      axesTriadRef.current.visible = !showAxes;
    }
  };

  return (
    <div className={`relative rounded-2xl border overflow-hidden shadow-xl flex flex-col h-full min-h-[460px] transition-colors duration-200 ${
      isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      
      {/* Top Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        
        {/* Title & Clinical Coordinates Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow ${
            isDark ? 'bg-slate-900/90 border-slate-700/70 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-800'
          }`}>
            <Compass className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-semibold">
              Grood–Suntay 3D Articulation ({affectedLeg === 'left' ? 'Left Knee' : 'Right Knee'})
            </span>
          </div>

          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border backdrop-blur-md ${
            staHealth === 'Optimal' 
              ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300' 
              : 'bg-amber-950/70 border-amber-800/80 text-amber-300'
          }`}>
            <span className="w-2 h-2 rounded-full animate-ping-slow bg-current" />
            <span>TASO: {tension}N ({staHealth})</span>
          </div>
        </div>

        {/* View Presets & Controls */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border backdrop-blur-md pointer-events-auto ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}>
          <button
            onClick={() => applyViewPreset('isometric')}
            className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-all ${
              activeView === 'isometric' ? 'bg-cyan-500 text-white font-semibold' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3D Iso
          </button>
          <button
            onClick={() => applyViewPreset('sagittal')}
            className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-all ${
              activeView === 'sagittal' ? 'bg-cyan-500 text-white font-semibold' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sagittal (Flex)
          </button>
          <button
            onClick={() => applyViewPreset('coronal')}
            className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-all ${
              activeView === 'coronal' ? 'bg-cyan-500 text-white font-semibold' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Coronal (Var/Val)
          </button>
          <button
            onClick={toggleAxes}
            title="Toggle Grood-Suntay Axis Triad"
            className={`p-1 rounded-lg text-xs transition-all ${
              showAxes ? 'text-cyan-500 bg-cyan-500/10' : isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 3D Canvas Mount */}
      <div 
        ref={mountRef} 
        className="w-full flex-1 cursor-grab active:cursor-grabbing select-none"
      />

      {/* Bottom Live Kinematic HUD Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-10 grid grid-cols-3 sm:grid-cols-6 gap-2 pointer-events-none">
        
        {/* Flexion */}
        <div className={`backdrop-blur-md border rounded-xl p-2 text-center pointer-events-auto ${
          isDark ? 'bg-slate-950/80 border-slate-800/90' : 'bg-white/90 border-slate-200 shadow-sm'
        }`}>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Flex / Ext</div>
          <div className="text-sm sm:text-base font-mono font-bold text-cyan-500">
            {rotations.flexion}°
          </div>
          <div className="text-[9px] text-slate-400">Sagittal Plane</div>
        </div>

        {/* Adduction */}
        <div className={`backdrop-blur-md border rounded-xl p-2 text-center pointer-events-auto ${
          isDark ? 'bg-slate-950/80 border-slate-800/90' : 'bg-white/90 border-slate-200 shadow-sm'
        }`}>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Var / Val</div>
          <div className={`text-sm sm:text-base font-mono font-bold ${
            Math.abs(rotations.adduction) > 6 ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {rotations.adduction}°
          </div>
          <div className="text-[9px] text-slate-400">Coronal Plane</div>
        </div>

        {/* Internal Rotation */}
        <div className={`backdrop-blur-md border rounded-xl p-2 text-center pointer-events-auto ${
          isDark ? 'bg-slate-950/80 border-slate-800/90' : 'bg-white/90 border-slate-200 shadow-sm'
        }`}>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Int / Ext</div>
          <div className="text-sm sm:text-base font-mono font-bold text-purple-500">
            {rotations.internalRotation}°
          </div>
          <div className="text-[9px] text-slate-400">Transverse Axis</div>
        </div>

        {/* AP Translation */}
        <div className={`backdrop-blur-md border rounded-xl p-2 text-center pointer-events-auto ${
          isDark ? 'bg-slate-950/80 border-slate-800/90' : 'bg-white/90 border-slate-200 shadow-sm'
        }`}>
          <div className="text-[10px] text-slate-400 uppercase font-medium">AP Shear</div>
          <div className="text-sm sm:text-base font-mono font-bold text-teal-500">
            {translations.ap} <span className="text-[10px] font-normal">mm</span>
          </div>
          <div className="text-[9px] text-slate-400">Anterior Draw</div>
        </div>

        {/* SI Compression */}
        <div className={`backdrop-blur-md border rounded-xl p-2 text-center pointer-events-auto ${
          isDark ? 'bg-slate-950/80 border-slate-800/90' : 'bg-white/90 border-slate-200 shadow-sm'
        }`}>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Prox-Dist</div>
          <div className="text-sm sm:text-base font-mono font-bold text-indigo-500">
            {translations.si} <span className="text-[10px] font-normal">mm</span>
          </div>
          <div className="text-[9px] text-slate-400">Joint Space</div>
        </div>

        {/* ML Shift */}
        <div className={`backdrop-blur-md border rounded-xl p-2 text-center pointer-events-auto ${
          isDark ? 'bg-slate-950/80 border-slate-800/90' : 'bg-white/90 border-slate-200 shadow-sm'
        }`}>
          <div className="text-[10px] text-slate-400 uppercase font-medium">Med-Lat</div>
          <div className={`text-sm sm:text-base font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {translations.ml} <span className="text-[10px] font-normal">mm</span>
          </div>
          <div className="text-[9px] text-slate-400">Coronal Shift</div>
        </div>

      </div>

    </div>
  );
}
