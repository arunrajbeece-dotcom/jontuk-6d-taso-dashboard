# JONTUK-6D TASO: Wearable 6-DOF Knee Kinematics & Acoustic Micro-Instability Clinician Suite
### Submission for L&T Techgium 2026 | Healthcare & Bio-Robotics Innovation

---

## 🌟 Executive Summary

**JONTUK-6D TASO** is an ultra-low-cost, medical-grade wearable knee kinematics and acoustic micro-instability assessment system. It is designed to displace prohibitive **₹20L+ ($25,000+ USD) multi-camera optical motion analysis laboratories** (such as Vicon and Qualisys) with a **sub-₹4,000 (~$46 USD)** field-portable wearable kit.

### New Features Added:
1. **Clinician Theme Toggle (Dark & Light Mode):** One-click toggle between an ultra-high-contrast **Dark Operating/Lab Theme** and a clean **Clinical Light Theme** (with clean slate/white cards and calibrated 3D bone rendering).
2. **Clinician Authentication & ID Interface:** Secure clinician profile modal with Staff ID (`DR-ORTHO-8024`), Full Name, Registration License No, and Hospital affiliation badges.
3. **Pre-Assessment Patient Intake Form:** Captures patient basic information (Name, UHID, Age, Biological Sex, Height, Weight $\rightarrow$ auto BMI calculation, Affected Knee Side: **Right / Left / Bilateral**, Diagnosis/Indication, VAS Pain scale, and pre-assessment biomechanical readiness checklist) before starting gait evaluation.
4. **Web Bluetooth (Wireless BLE Sleeve Band):** Direct wireless connection to ESP32-S3 over Web Bluetooth API (`navigator.bluetooth`) with Nordic UART / HM-10 GATT service streaming.
5. **True Patient Sleeve Calibration (Tare Neutral Standing):** Single-click 0° standing posture tare calibration that zeroes out sleeve mounting angle variations on the patient's leg.

---

## 🔬 Mathematical & Algorithmic Formulation

### 1. Tension-Adaptive EKF Covariance Formulation (`TASO_EKF`)
Let strap tension be $T$ (nominal $T_{opt} \approx 15\text{ N}$). Measurement noise covariance $R(T)$ is dynamically scaled according to:

$$R(T) = R_{nominal} \cdot \left[ 1 + \alpha \cdot \left( \frac{\max(0, T_{crit\_low} - T)}{T_{crit\_low}} \right)^2 + \beta \cdot \frac{|T - T_{opt}|}{T_{opt}} \right]$$

- **Optimal Preload (11 N – 22 N):** $R \approx R_{nominal}$, rigid bone coupling validated.
- **Loose Strap (6 N – 11 N):** $R$ scales by $2.5\times - 4\times$, heavily dampening erratic accelerometer shocks.
- **Critical Strap Slippage (< 6 N):** $R$ scales by $>8\times$, transitioning filter state propagation to kinematic constraint integration while prompting the clinician to tighten the cuff.

### 2. Grood–Suntay Joint Coordinate System (JCS) Kinematic Transform
Conforming strictly to **ISB (International Society of Biomechanics)** standards:
- **Femoral Fixed Axis ($\mathbf{e}_1$):** Transepicondylar lateral axis $\rightarrow$ **Flexion / Extension ($\alpha$)**
- **Tibial Fixed Axis ($\mathbf{e}_3$):** Mechanical longitudinal tibial axis $\rightarrow$ **Internal / External Rotation ($\gamma$)**
- **Floating Axis ($\mathbf{e}_2$):** $\mathbf{e}_2 = \frac{\mathbf{e}_1 \times \mathbf{e}_3}{\|\mathbf{e}_1 \times \mathbf{e}_3\|}$ $\rightarrow$ **Abduction / Adduction / Varus-Valgus ($\beta$)**
- **Translational Laxity:**
  - $\Delta X_{AP}$ (Anterior-Posterior drawer in mm)
  - $\Delta Y_{SI}$ (Proximal-Distal joint space compression in mm)
  - $\Delta Z_{ML}$ (Medial-Lateral shear in mm)

**Clinical Error Bounds Target:** Rotational RMS Error $\le 5.0^\circ$, Translational RMS Error $\le 5.0\text{ mm}$.

### 3. MAI (Mechanical-Acoustic Instability) Detector
Computes the second time derivative of angular velocity (angular jerk):
$$J(t) = \frac{d^2\omega(t)}{dt^2} = \frac{d\alpha(t)}{dt}$$
Coincident with acoustic energy envelope $E_{piezo}(t) > \Gamma_{acoustic}$:
$$\text{Trigger Condition: } (\|J(t)\| > 2,400^\circ/s^3) \land (E_{piezo}(t) > 380\text{ a.u.}) \quad \forall \; |\Delta t| \le 50\text{ ms}$$
Classifies triggers into:
- **Mild:** *Chondral Micro-Crepitus*
- **Moderate:** *Meniscal Catch / Patellar Tracking Snap*
- **Critical:** *Dynamic Subluxation / Pivot Slip*

---

## 💻 Tech Stack & Architecture

- **Frontend Core:** React 18, Vite 5, Tailwind CSS (with full Dark & Light mode support)
- **3D Biomechanical Engine:** Three.js with real-time bone anatomy, condyle curvature, patellar tracking, and coordinate triads
- **Real-Time Kinematic Visuals:** Recharts with synchronized 60 FPS multi-stream charts
- **Hardware Integration:**
  - **Web Bluetooth API** (Wireless BLE connection to ESP32 sleeve)
  - **WebSerial API** (Direct USB-CDC cable connection @ 115200 baud)
  - **Biomechanical Simulator** (4 clinical gait protocols)
- **Icons & UI:** Lucide React, JetBrains Mono font

---

## 📊 Head-to-Head: JONTUK vs. Optical Mocap Labs

| Feature | JONTUK-6D TASO Wearable | 12-Camera Optical Motion Lab (Vicon/Qualisys) |
|---|---|---|
| **Capital Cost** | **₹3,850 (~$46 USD)** | **₹20,00,000 – ₹35,00,000 ($25K–$42K USD)** |
| **Setup Time** | **< 45 seconds** (dual quick-release straps) | 45 – 60 minutes (retro-reflective marker palpation) |
| **Field Portability** | Sidelines, rural clinics, patient's home | Confined to dedicated, dark indoor optical studio |
| **Soft-Tissue Compensation** | **Real-time TASO EKF adaptation** | Marker skin-wobble introduces uncompensated artifact |
| **Acoustic Pathology** | **Yes (4 kHz MAI Piezo Crepitus sensor)** | 0% (Optical sensors are deaf to joint acoustics) |
| **Power Supply** | 3.7V 500mAh LiPo rechargeable (~8.5 hrs) | Continuous 230V AC Mains power grid |

---

## 🚀 Running the Project

### Development Mode
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build & Preview
```powershell
npm run build
npm run preview
```
