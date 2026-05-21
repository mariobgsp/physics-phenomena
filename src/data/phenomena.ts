export interface ControlDef {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  default: number;
  hint?: string;
}

export interface Reference {
  title: string;
  source: string;
  url: string;
}

export interface Phenomenon {
  id: string;
  title: string;
  description: string;
  category: string;
  equation: string;
  equationVars?: { symbol: string; description: string }[];
  controls?: ControlDef[];
  references?: Reference[];
}

import { phenomenaReferences } from './references';

const _raw: Phenomenon[] = [
  {
    id: "gravity",
    title: "Gravity (Free Fall)",
    description: "Gravity is the force by which a planet or other body draws objects toward its center. In free fall, an object accelerates at 9.8 m/s² (on Earth), regardless of its mass.",
    category: "Classical Mechanics",
    equation: "y(t) = y_0 + v_0 t - \\frac{1}{2} g t^2",
    equationVars: [
      { symbol: "y(t)", description: "Position at time t" },
      { symbol: "y₀", description: "Initial position" },
      { symbol: "v₀", description: "Initial velocity" },
      { symbol: "g", description: "Gravitational acceleration (9.8 m/s²)" },
    ],
  },
  {
    id: "pendulum",
    title: "Pendulum Motion",
    description: "A pendulum is a weight suspended from a pivot so that it can swing freely. The period depends on the string length and gravitational acceleration — not the mass.",
    category: "Classical Mechanics",
    equation: "T = 2\\pi \\sqrt{\\frac{L}{g}}",
    equationVars: [
      { symbol: "T", description: "Period (time for one full swing)" },
      { symbol: "L", description: "Pendulum length" },
      { symbol: "g", description: "Gravitational acceleration" },
    ],
    controls: [
      { key: "length", label: "Length (L)", min: 80, max: 350, step: 5, unit: "px", default: 220, hint: "Longer → slower swing" },
      { key: "gravity", label: "Gravity (g)", min: 1, max: 25, step: 0.5, unit: "m/s²", default: 9.8, hint: "Higher g → faster swing" },
      { key: "initialAngle", label: "Initial Angle (θ₀)", min: 5, max: 85, step: 1, unit: "°", default: 45, hint: "Starting displacement" },
      { key: "damping", label: "Damping", min: 0.990, max: 0.9999, step: 0.0001, unit: "", default: 0.9992, hint: "Lower → faster decay" },
    ],
  },
  {
    id: "projectile",
    title: "Projectile Motion",
    description: "Projectile motion is the motion of an object thrown into the air, subject only to acceleration as a result of gravity. The path is always a parabola.",
    category: "Classical Mechanics",
    equation: "y = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}",
    equationVars: [
      { symbol: "θ", description: "Launch angle" },
      { symbol: "v₀", description: "Initial speed" },
      { symbol: "g", description: "Gravitational acceleration" },
    ],
  },
  {
    id: "circular",
    title: "Circular Motion",
    description: "Uniform circular motion describes the motion of a body traversing a circular path at a constant speed. A centripetal force constantly pulls the object toward the center.",
    category: "Classical Mechanics",
    equation: "F_c = \\frac{m v^2}{r}",
    equationVars: [
      { symbol: "Fc", description: "Centripetal force" },
      { symbol: "m", description: "Mass of object" },
      { symbol: "v", description: "Speed" },
      { symbol: "r", description: "Radius of circle" },
    ],
  },
  {
    id: "collision",
    title: "Elastic Collision",
    description: "An elastic collision is an encounter between two bodies in which the total kinetic energy and total momentum of the two bodies are conserved.",
    category: "Classical Mechanics",
    equation: "m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}",
  },
  {
    id: "waves",
    title: "Wave Interference",
    description: "Wave interference is the phenomenon that occurs when two waves meet while traveling along the same medium. They superpose to form a resultant wave of greater or lower amplitude.",
    category: "Waves & Optics",
    equation: "y(x,t) = y_1(x,t) + y_2(x,t)",
  },
  {
    id: "doppler",
    title: "Doppler Effect",
    description: "The Doppler effect is the change in frequency of a wave in relation to an observer who is moving relative to the wave source.",
    category: "Waves & Optics",
    equation: "f' = \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right) f",
    equationVars: [
      { symbol: "f'", description: "Observed frequency" },
      { symbol: "v", description: "Wave speed in medium" },
      { symbol: "vₒ", description: "Observer velocity" },
      { symbol: "vₛ", description: "Source velocity" },
    ],
  },
  {
    id: "optics",
    title: "Reflection & Refraction",
    description: "Reflection is the change in direction of a wavefront at an interface. Refraction is the bending of light as it passes from one medium to another with a different density.",
    category: "Waves & Optics",
    equation: "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)",
  },
  {
    id: "magnetism",
    title: "Magnetism",
    description: "Magnetism is a class of physical phenomena that are mediated by magnetic fields. Electric currents and the magnetic moments of elementary particles give rise to a magnetic field.",
    category: "Electromagnetism",
    equation: "B = \\frac{\\mu_0 I}{2\\pi r}",
    equationVars: [
      { symbol: "B", description: "Magnetic field strength" },
      { symbol: "μ₀", description: "Permeability of free space" },
      { symbol: "I", description: "Current" },
      { symbol: "r", description: "Distance from wire" },
    ],
  },
  {
    id: "electric_field",
    title: "Electric Field",
    description: "An electric field surrounds electrically charged particles and exerts force on all other charged particles in the field. Change the charge signs and separation to see how the field lines respond.",
    category: "Electromagnetism",
    equation: "\\vec{E} = \\frac{1}{4\\pi\\epsilon_0} \\frac{q}{r^2} \\hat{r}",
    equationVars: [
      { symbol: "E", description: "Electric field strength" },
      { symbol: "ε₀", description: "Permittivity of free space" },
      { symbol: "q", description: "Charge magnitude" },
      { symbol: "r", description: "Distance from charge" },
    ],
    controls: [
      { key: "charge1", label: "Charge 1 (q₁)", min: -1, max: 1, step: 2, unit: "", default: 1, hint: "+1 = positive, -1 = negative" },
      { key: "charge2", label: "Charge 2 (q₂)", min: -1, max: 1, step: 2, unit: "", default: -1, hint: "+1 = positive, -1 = negative" },
      { key: "separation", label: "Separation", min: 0.05, max: 0.35, step: 0.01, unit: "%", default: 0.18, hint: "Orbit radius fraction" },
      { key: "orbitSpeed", label: "Orbit Speed", min: 0.05, max: 1.5, step: 0.05, unit: "×", default: 0.3 },
    ],
  },
  {
    id: "buoyancy",
    title: "Archimedes' Principle",
    description: "Archimedes' principle states that the upward buoyant force that is exerted on a body immersed in a fluid is equal to the weight of the fluid that the body displaces.",
    category: "Fluid Dynamics",
    equation: "F_b = \\rho g V",
    equationVars: [
      { symbol: "Fb", description: "Buoyant force" },
      { symbol: "ρ", description: "Fluid density" },
      { symbol: "g", description: "Gravitational acceleration" },
      { symbol: "V", description: "Volume of displaced fluid" },
    ],
  },
  {
    id: "brownian",
    title: "Brownian Motion",
    description: "Brownian motion is the random motion of particles suspended in a medium. The displacement scales with temperature and time. Higher temperature → larger, faster random steps.",
    category: "Thermodynamics",
    equation: "\\langle x^2 \\rangle = 2Dt",
    equationVars: [
      { symbol: "⟨x²⟩", description: "Mean squared displacement" },
      { symbol: "D", description: "Diffusion coefficient (∝ Temperature)" },
      { symbol: "t", description: "Time elapsed" },
    ],
    controls: [
      { key: "temperature", label: "Temperature (T)", min: 0.1, max: 3.0, step: 0.1, unit: "×", default: 1.0, hint: "Higher T → faster random walk" },
      { key: "numMolecules", label: "Molecules", min: 20, max: 200, step: 10, unit: "", default: 80 },
      { key: "pollenSize", label: "Pollen Size", min: 8, max: 35, step: 1, unit: "px", default: 18 },
    ],
  },
  {
    id: "conduction",
    title: "Heat Conduction",
    description: "Conduction is the process by which heat energy is transmitted through collisions between neighboring atoms or molecules.",
    category: "Thermodynamics",
    equation: "\\frac{Q}{t} = -kA \\frac{\\Delta T}{\\Delta x}",
  },
  {
    id: "newtons_cradle",
    title: "Newton's Cradle",
    description: "Newton's cradle is a device that demonstrates conservation of momentum and energy via a series of swinging spheres.",
    category: "Classical Mechanics",
    equation: "p_i = p_f \\implies m v_i = m v_f",
  },
  {
    id: "friction",
    title: "Friction",
    description: "Friction is the force resisting the relative motion of solid surfaces, fluid layers, and material elements sliding against each other.",
    category: "Classical Mechanics",
    equation: "f_k = \\mu_k N",
  },
  {
    id: "spring",
    title: "Spring-Mass System",
    description: "A spring-mass system undergoes Simple Harmonic Motion (SHM) where the restoring force is directly proportional to the displacement. Adjust k, mass, and damping to change period and amplitude decay.",
    category: "Classical Mechanics",
    equation: "F = -kx",
    equationVars: [
      { symbol: "F", description: "Restoring force" },
      { symbol: "k", description: "Spring constant (stiffness)" },
      { symbol: "x", description: "Displacement from equilibrium" },
    ],
    controls: [
      { key: "springConstant", label: "Spring Constant (k)", min: 10, max: 200, step: 5, unit: "N/m", default: 60, hint: "Stiffer → faster oscillation" },
      { key: "mass", label: "Mass (m)", min: 0.2, max: 5, step: 0.1, unit: "kg", default: 1, hint: "Heavier → slower oscillation" },
      { key: "damping", label: "Damping", min: 0.970, max: 0.999, step: 0.001, unit: "", default: 0.992, hint: "Lower → faster decay" },
      { key: "amplitude", label: "Set Amplitude", min: 20, max: 150, step: 5, unit: "px", default: 100, hint: "Click to displace mass" },
    ],
  },
  {
    id: "capillary",
    title: "Capillary Action",
    description: "Capillary action is the ability of a liquid to flow in narrow spaces without the assistance of, or even in opposition to, external forces like gravity.",
    category: "Fluid Dynamics",
    equation: "h = \\frac{2 \\gamma \\cos(\\theta)}{\\rho g r}",
    equationVars: [
      { symbol: "h", description: "Height of liquid rise" },
      { symbol: "γ", description: "Surface tension" },
      { symbol: "θ", description: "Contact angle" },
      { symbol: "r", description: "Tube radius" },
    ],
  },
  {
    id: "bernoulli",
    title: "Bernoulli's Principle",
    description: "An increase in fluid speed occurs with a decrease in static pressure. Narrow the pipe throat to see velocity increase and pressure drop — drag the neck ratio slider to observe the effect.",
    category: "Fluid Dynamics",
    equation: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{constant}",
    equationVars: [
      { symbol: "P", description: "Static pressure" },
      { symbol: "ρ", description: "Fluid density" },
      { symbol: "v", description: "Flow velocity" },
      { symbol: "h", description: "Height (elevation)" },
    ],
    controls: [
      { key: "neckRatio", label: "Throat Ratio (A₂/A₁)", min: 0.15, max: 0.55, step: 0.01, unit: "", default: 0.35, hint: "Smaller → faster narrow flow, lower pressure" },
      { key: "flowSpeed", label: "Base Flow Speed (v₁)", min: 30, max: 200, step: 5, unit: "px/s", default: 80, hint: "Continuity: v₂ = v₁ · (A₁/A₂)" },
    ],
  },
  {
    id: "lorentz",
    title: "Lorentz Force",
    description: "The Lorentz force acts on a moving charged particle in electromagnetic fields, causing circular motion in a uniform magnetic field. Change cyclotron frequency and particle speed to control orbit radius.",
    category: "Electromagnetism",
    equation: "\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})",
    equationVars: [
      { symbol: "F", description: "Lorentz force" },
      { symbol: "q", description: "Particle charge" },
      { symbol: "E", description: "Electric field" },
      { symbol: "v×B", description: "Velocity cross magnetic field" },
    ],
    controls: [
      { key: "omega", label: "Cyclotron Freq (ω)", min: 0.5, max: 8, step: 0.25, unit: "rad/s", default: 3, hint: "r = v/ω — larger ω → tighter circle" },
      { key: "v0", label: "Particle Speed (v₀)", min: 50, max: 300, step: 10, unit: "px/s", default: 150, hint: "r = v/ω — faster → wider orbit" },
    ],
  },
  {
    id: "photoelectric",
    title: "Photoelectric Effect",
    description: "The photoelectric effect is the emission of electrons when electromagnetic radiation, such as light, hits a material.",
    category: "Modern Physics",
    equation: "K_{\\max} = hf - \\Phi",
    equationVars: [
      { symbol: "Kmax", description: "Maximum kinetic energy of emitted electron" },
      { symbol: "h", description: "Planck's constant" },
      { symbol: "f", description: "Photon frequency" },
      { symbol: "Φ", description: "Work function of material" },
    ],
  },
  {
    id: "ideal_gas",
    title: "Ideal Gas Law",
    description: "The ideal gas law describes the state of a hypothetical ideal gas, relating pressure, volume, temperature, and amount of substance.",
    category: "Thermodynamics",
    equation: "PV = nRT",
    equationVars: [
      { symbol: "P", description: "Pressure" },
      { symbol: "V", description: "Volume" },
      { symbol: "n", description: "Amount of substance (moles)" },
      { symbol: "R", description: "Ideal gas constant" },
      { symbol: "T", description: "Temperature (Kelvin)" },
    ],
  },
  {
    id: "entropy",
    title: "Entropy & Mixing",
    description: "Entropy is a measure of the disorder or randomness of a system. When two gases mix, the total entropy of the universe increases.",
    category: "Thermodynamics",
    equation: "\\Delta S \\ge 0",
  },
  {
    id: "maxwell_boltzmann",
    title: "Maxwell-Boltzmann Distribution",
    description: "This distribution describes the speeds of particles in an idealized gas, showing how higher temperatures lead to a wider range of faster particle speeds.",
    category: "Thermodynamics",
    equation: "f(v) \\propto v^2 e^{-mv^2 / 2kT}",
  },
  {
    id: "convection",
    title: "Convection Currents",
    description: "Convection is heat transfer by the macroscopic movement of a fluid. Hot fluid rises due to lower density, while cold fluid sinks.",
    category: "Thermodynamics",
    equation: "\\dot{q} = h A \\Delta T",
  },
  {
    id: "phase_change",
    title: "Phase Transitions",
    description: "A phase transition is the physical process of transition between basic states of matter: solid, liquid, and gas, usually due to temperature changes.",
    category: "Thermodynamics",
    equation: "Q = mL",
  },
  {
    id: "flow_around_obstacle",
    title: "Laminar vs Turbulent Flow",
    description: "Fluid flow can be laminar (smooth, parallel layers) or turbulent (chaotic property changes and eddies), often determined by the Reynolds number.",
    category: "Fluid Dynamics",
    equation: "Re = \\frac{\\rho v L}{\\mu}",
  },
  {
    id: "torricelli",
    title: "Torricelli's Law",
    description: "Torricelli's law relates the speed of fluid flowing out of an opening to the height of the fluid above the opening.",
    category: "Fluid Dynamics",
    equation: "v = \\sqrt{2gh}",
  },
  {
    id: "magnus",
    title: "Magnus Effect",
    description: "The Magnus effect is the observable phenomenon where a spinning object dragged through a fluid creates a whirlpool of fluid, leading to a force perpendicular to the line of motion.",
    category: "Fluid Dynamics",
    equation: "F = G \\rho v",
  },
  {
    id: "pascal",
    title: "Pascal's Principle",
    description: "Pascal's principle states that pressure applied to a confined fluid is transmitted equally in all directions. A small force on a small piston creates a large force on a large piston.",
    category: "Fluid Dynamics",
    equation: "\\frac{F_1}{A_1} = \\frac{F_2}{A_2}",
    equationVars: [
      { symbol: "F₁", description: "Input force on small piston" },
      { symbol: "A₁", description: "Area of small piston" },
      { symbol: "F₂", description: "Output force on large piston" },
      { symbol: "A₂", description: "Area of large piston" },
    ],
    controls: [
      { key: "areaRatio", label: "Area Ratio (A₂/A₁)", min: 1.5, max: 6, step: 0.5, unit: "×", default: 3, hint: "F₂ = F₁ × ratio — mechanical advantage" },
      { key: "inputForce", label: "Max Input Force (F₁)", min: 10, max: 100, step: 5, unit: "N", default: 48 },
    ],
  },
  {
    id: "stokes",
    title: "Stokes' Law",
    description: "Stokes' law calculates the drag force exerted on spherical objects with very small Reynolds numbers in a viscous fluid.",
    category: "Fluid Dynamics",
    equation: "F_d = 6 \\pi \\mu R v",
  },
  {
    id: "standing_waves",
    title: "Standing Waves & Harmonics",
    description: "A standing wave is formed by the interference of two waves traveling in opposite directions. It features nodes (zero displacement) and antinodes (maximum displacement).",
    category: "Acoustics & Audio Physics",
    equation: "f_n = \\frac{n v}{2 L}",
  },
  {
    id: "beats",
    title: "Acoustic Beats",
    description: "Beats are an interference pattern between two sounds of slightly different frequencies, perceived as a periodic variation in volume whose rate is the difference of the two frequencies.",
    category: "Acoustics & Audio Physics",
    equation: "f_{beat} = |f_1 - f_2|",
  },
  {
    id: "truss",
    title: "Truss Bridge Load",
    description: "A truss is an assembly of members creating a rigid structure. When a load is applied, forces distribute as tension (stretching) and compression (pushing) along the members.",
    category: "Physics of Building",
    equation: "\\sum \\vec{F} = 0, \\quad \\sum \\vec{\\tau} = 0",
  },
  {
    id: "mass_damper",
    title: "Tuned Mass Damper",
    description: "A tuned mass damper is a device mounted in structures to reduce the amplitude of mechanical vibrations, such as those caused by earthquakes or strong winds.",
    category: "Physics of Building",
    equation: "m \\ddot{x} + c \\dot{x} + kx = F(t)",
  },
  {
    id: "prism",
    title: "Prismatic Dispersion",
    description: "Dispersion is the phenomenon in which the phase velocity of a wave depends on its frequency, causing white light to separate into its constituent colors through a prism.",
    category: "Waves & Optics",
    equation: "n(\\lambda) = A + \\frac{B}{\\lambda^2}",
  },
  {
    id: "lens",
    title: "Thin Lens Ray Tracing",
    description: "Rays of light originating from an object converge or diverge when passing through a lens, forming real or virtual images depending on the focal length.",
    category: "Waves & Optics",
    equation: "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}",
  }
];

// Attach references from the references module
export const phenomena: Phenomenon[] = _raw.map(p => ({
  ...p,
  references: phenomenaReferences[p.id] ?? [],
}));