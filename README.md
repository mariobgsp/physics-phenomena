# ⚛️ PhysicsLab

**PhysicsLab** is a high-fidelity, interactive suite of 37 physics simulations designed to visualize fundamental physical phenomena with premium aesthetics and pedagogical clarity.

Built using **React**, **TypeScript**, and **HTML5 Canvas**, every simulation has been overhauled to provide a "Physics Lab" experience featuring dark-gradient backgrounds, ambient lighting, dynamic glows (`shadowBlur`), and real-time physical readouts.

---

## ✨ Key Features

- **37 Interactive Simulations**: Covering Classical Mechanics, Waves & Optics, Thermodynamics, Electromagnetism, and Fluid Dynamics.
- **Premium Aesthetics**: High-end visual style with radial/linear gradients, specular highlights, and motion-blur trails.
- **Pedagogical Tools**: Real-time Info Panels, governing equations (KaTeX), and dynamic vector overlays (Force, Velocity, Magnetic Fields).
- **Smooth Animation**: Optimized `requestAnimationFrame` loops with deltaTime-based physics for consistent performance.
- **Responsive Design**: Modern UI with dark mode and sleek overlays using Tailwind CSS and Framer Motion.

---

## 🔬 Simulation Catalog

### ⚙️ Classical Mechanics
- **Pendulum Motion**: Harmonic oscillation with energy bar and arc trails.
- **Spring-Mass System**: Elastic dynamics with equilibrium markers.
- **Gravity (Free Fall)**: Squash/stretch deformation on impact with floor glow.
- **Projectile Motion**: Parabolic trajectories with reference curves.
- **Circular Motion**: Orbital mechanics with centripetal force vectors.
- **Elastic Collision**: Momentum conservation with speed-hued bodies.
- **Newton's Cradle**: Momentum transfer with steel-gradient aesthetics.
- **Friction**: Deceleration and heat spark visualization on surfaces.

### 🌊 Waves & Optics
- **Wave Interference**: Dynamic 2D pixel-based interference patterns.
- **Doppler Effect**: Frequency shifting visualization with moving sources.
- **Prismatic Dispersion**: Light refraction through glass with spectral splitting.
- **Standing Waves**: Harmonic resonance with node/antinode markers.
- **Beats**: Superposition of frequencies with envelope visualization.
- **Thin Lens Ray Tracing**: Converging/diverging ray progression.
- **Reflection & Refraction**: Snell's Law with incident and refracted rays.

### 🌡️ Thermodynamics
- **Ideal Gas Law**: Particle collisions and hue-shifting temperature.
- **Entropy & Mixing**: Spontaneous mixing of gases with mixing percentage.
- **Brownian Motion**: Random walk of pollen in water molecules.
- **Heat Conduction**: Thermal gradient flow along a solid rod.
- **Convection Currents**: Thermal fluid loops with particle density shifts.
- **Maxwell-Boltzmann Distribution**: Real-time speed histogram and theoretical curve.
- **Phase Change**: Molecular lattice vibration and state transitions (Solid/Liquid/Gas).

### ⚡ Electromagnetism
- **Electric Field**: Dynamic field lines from moving dipole charges.
- **Magnetism**: B-field visualization with animated flux lines.
- **Lorentz Force**: Electron deflection in magnetic fields with trails.
- **Photoelectric Effect**: Photon impact and electron emission spectrum.

### 💧 Fluid Dynamics
- **Archimedes' Principle**: Buoyancy with caustic shimmer and bubbles.
- **Bernoulli's Principle**: Pressure-velocity relationship with gauge tubes.
- **Torricelli's Law**: Exit velocity jets from varying tank depths.
- **Capillary Action**: Surface tension and meniscus height in glass tubes.
- **Magnus Effect**: Curved trajectory of spinning bodies in fluid flow.
- **Laminar vs Turbulent Flow**: Flow around obstacles with wake vortex simulation.
- **Stokes' Law**: Terminal velocity in viscous fluids with force balance.
- **Pascal's Principle**: Hydraulic pressure multiplication.

---

## 🛠️ Technology Stack

- **Core**: React 18, TypeScript, Vite
- **Rendering**: HTML5 Canvas API (2D Context)
- **Styling**: Tailwind CSS, Vanilla CSS
- **Animations**: Framer Motion (UI), Custom Canvas Physics (Simulation)
- **Math**: KaTeX (for equations)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mariobgsp/physics-phenomena.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```

---

## 📜 License
This project is for educational purposes. Feel free to explore and modify.
