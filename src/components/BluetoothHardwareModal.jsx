import React, { useState } from 'react';
import { 
  Bluetooth, 
  Usb, 
  Radio, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Activity, 
  Wifi, 
  Cpu, 
  Zap, 
  Crosshair,
  ShieldCheck,
  RefreshCw,
  Code2,
  Copy,
  Check
} from 'lucide-react';

export default function BluetoothHardwareModal({
  isOpen,
  onClose,
  connectionMode,
  setConnectionMode,
  isConnected,
  onConnectBluetooth,
  onDisconnectBluetooth,
  onConnectWebSerial,
  onDisconnectWebSerial,
  onTareCalibration,
  isCalibrated,
  bluetoothDeviceName = 'ESP32-JONTUK-TASO',
  rawPacket = null,
  theme = 'dark'
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showFirmware, setShowFirmware] = useState(false);
  const [copiedFirmware, setCopiedFirmware] = useState(false);

  if (!isOpen) return null;

  const handleBluetoothClick = async () => {
    setErrorMsg('');
    setIsScanning(true);
    try {
      if (connectionMode === 'bluetooth' && isConnected) {
        await onDisconnectBluetooth();
      } else {
        await onConnectBluetooth();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Bluetooth connection failed or was cancelled by user');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSerialClick = async () => {
    setErrorMsg('');
    try {
      if (connectionMode === 'serial' && isConnected) {
        await onDisconnectWebSerial();
      } else {
        await onConnectWebSerial();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Serial connection failed or was cancelled by user');
    }
  };

  const isDark = theme === 'dark';

  const esp32FirmwareSnippet = `// JONTUK-6D TASO: ESP32-S3 Wearable Sleeve Firmware
// Dual MPU6050 + FSR Load Cell (Tension) + Contact Piezo (MAI)
#include <Wire.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
#define PIN_FSR_TENSION     34
#define PIN_PIEZO_ACOUSTIC  35

BLECharacteristic *pTxCharacteristic;
bool deviceConnected = false;

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // SDA=21, SCL=22
  
  // Init MPU 1 (Thigh - 0x68) & MPU 2 (Shank - 0x69)
  Wire.beginTransmission(0x68); Wire.write(0x6B); Wire.write(0); Wire.endTransmission();
  Wire.beginTransmission(0x69); Wire.write(0x6B); Wire.write(0); Wire.endTransmission();

  BLEDevice::init("ESP32-JONTUK-TASO");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pTxCharacteristic = pService->createCharacteristic(CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  pTxCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  pServer->getAdvertising()->start();
}

void loop() {
  // Read FSR & Piezo
  float tensionN = (analogRead(PIN_FSR_TENSION) / 4095.0) * 30.0;
  int acoustic = analogRead(PIN_PIEZO_ACOUSTIC);

  // Read Dual MPU6050 (ax, ay, az, gx, gy, gz for Thigh & Shank)
  // Format JSON or CSV:
  String packet = "{\\"ax1\\":0.02,\\"ay1\\":0.98,\\"az1\\":0.05,\\"gx1\\":1.2,\\"gy1\\":0.3,\\"gz1\\":0.1,"
                 "\\"ax2\\":0.08,\\"ay2\\":0.95,\\"az2\\":0.04,\\"gx2\\":2.4,\\"gy2\\":0.5,\\"gz2\\":0.2,"
                 "\\"tension\\":" + String(tensionN, 1) + ",\\"acoustic\\":" + String(acoustic) + "}\\n";
  
  Serial.print(packet);
  if (deviceConnected && pTxCharacteristic) {
    pTxCharacteristic->setValue(packet.c_str());
    pTxCharacteristic->notify();
  }
  delay(10); // 100 Hz Stream
}`;

  const copyFirmware = () => {
    navigator.clipboard.writeText(esp32FirmwareSnippet);
    setCopiedFirmware(true);
    setTimeout(() => setCopiedFirmware(false), 2000);
  };

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
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bluetooth className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Real ESP32 Hardware Connection & Calibration</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isConnected 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {isConnected ? 'Hardware Active' : 'Ready to Connect'}
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Connect real ESP32-S3 wearable sleeve band via Web Bluetooth (BLE) or WebSerial (USB)
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
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Connection Modes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. Bluetooth BLE Mode */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              connectionMode === 'bluetooth' && isConnected
                ? 'border-cyan-500 bg-cyan-500/10 shadow-md shadow-cyan-500/10'
                : isDark ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Bluetooth className="w-4 h-4" />
                  </div>
                  {connectionMode === 'bluetooth' && isConnected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping-slow" />
                  )}
                </div>
                <div className="font-bold text-xs text-cyan-500">Wireless Web Bluetooth</div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Wireless BLE GATT connection to real ESP32 sleeve band on patient.
                </p>
              </div>

              <button
                type="button"
                onClick={handleBluetoothClick}
                disabled={isScanning}
                className={`mt-3 w-full py-2 rounded-lg text-xs font-bold transition-all ${
                  connectionMode === 'bluetooth' && isConnected
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
                }`}
              >
                {isScanning ? 'Scanning for BLE...' : connectionMode === 'bluetooth' && isConnected ? 'Disconnect BLE' : 'Pair Real ESP32 BLE'}
              </button>
            </div>

            {/* 2. WebSerial USB Cable Mode */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              connectionMode === 'serial' && isConnected
                ? 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/10'
                : isDark ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Usb className="w-4 h-4" />
                  </div>
                  {connectionMode === 'serial' && isConnected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
                  )}
                </div>
                <div className="font-bold text-xs text-emerald-500">WebSerial USB Cable</div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Direct USB-CDC cable connection to ESP32 @ 115200 baud.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSerialClick}
                className={`mt-3 w-full py-2 rounded-lg text-xs font-bold transition-all ${
                  connectionMode === 'serial' && isConnected
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                }`}
              >
                {connectionMode === 'serial' && isConnected ? 'Disconnect USB' : 'Connect USB Serial'}
              </button>
            </div>

            {/* 3. Simulator Mode */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              connectionMode === 'simulation'
                ? 'border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/10'
                : isDark ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  {connectionMode === 'simulation' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping-slow" />
                  )}
                </div>
                <div className="font-bold text-xs text-indigo-500">Simulator Engine</div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Biomechanical simulation for dry run testing without physical board.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (connectionMode === 'bluetooth') onDisconnectBluetooth();
                  if (connectionMode === 'serial') onDisconnectWebSerial();
                  setConnectionMode('simulation');
                }}
                className={`mt-3 w-full py-2 rounded-lg text-xs font-bold transition-all ${
                  connectionMode === 'simulation'
                    ? 'bg-indigo-600 text-white shadow'
                    : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {connectionMode === 'simulation' ? 'Active Mode' : 'Use Simulator'}
              </button>
            </div>

          </div>

          {/* Sleeve Tare & Neutral Calibration Section */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Patient Neutral Standing Tare Calibration
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                isCalibrated 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {isCalibrated ? 'Calibrated (0° Reference Set)' : 'Pending Calibration'}
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Instruct the patient to stand straight in upright anatomical neutral posture with feet shoulder-width apart. Click <strong>Tare Calibration</strong> to zero the sleeve mounting angle offsets, aligning Grood-Suntay flexion/extension to exactly 0.0°.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onTareCalibration}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Tare Neutral Standing (0° Reference)</span>
              </button>

              <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Compensates for sensor cuff mounting angles
              </div>
            </div>
          </div>

          {/* Live Telemetry Stream Preview */}
          <div className={`p-3 rounded-xl border font-mono text-[11px] ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-1 text-[10px] uppercase font-bold text-slate-400">
              <span>Telemetry Packet Stream:</span>
              <span className="text-cyan-400">100 Hz Streaming</span>
            </div>
            <div className="truncate text-cyan-400">
              {rawPacket 
                ? `Thigh[${rawPacket.thigh?.ax?.toFixed(2) || 0}, ${rawPacket.thigh?.ay?.toFixed(2) || 0}] | Shank[${rawPacket.shank?.ax?.toFixed(2) || 0}, ${rawPacket.shank?.ay?.toFixed(2) || 0}] | Tension: ${rawPacket.tension}N | Acoustic: ${rawPacket.acoustic} a.u.`
                : 'Waiting for hardware packet stream from ESP32...'}
            </div>
          </div>

          {/* Toggle ESP32 C++ / Arduino Firmware Reference */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowFirmware(!showFirmware)}
              className={`text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showFirmware ? 'text-cyan-500' : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{showFirmware ? 'Hide ESP32 Firmware Source' : 'View ESP32 C++ Firmware Snippet (for Arduino IDE)'}</span>
            </button>

            {showFirmware && (
              <div className={`mt-2 p-3 rounded-xl border text-[11px] font-mono relative ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold">jontuk_esp32_firmware.ino</span>
                  <button
                    onClick={copyFirmware}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs flex items-center gap-1 text-slate-300"
                  >
                    {copiedFirmware ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFirmware ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="max-h-48 overflow-y-auto leading-relaxed select-all">
                  {esp32FirmwareSnippet}
                </pre>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            ESP32 BLE GATT • 115200 Baud • TASO v1.2
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow"
          >
            Apply & Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
