export interface Phenomenon {
  id: string;
  title: string;
  description: string;
  category: string;
  equation: string;
}

export const phenomena: Phenomenon[] = [
  {
    id: "gravity",
    title: "Gravity (Free Fall)",
    description: "Gravity is the force by which a planet or other body draws objects toward its center. In free fall, an object accelerates at 9.8 m/s² (on Earth), regardless of its mass.",
    category: "Classical Mechanics",
    equation: "y(t) = y_0 + v_0 t - \\frac{1}{2} g t^2"
  },
  {
    id: "pendulum",
    title: "Pendulum Motion",
    description: "A pendulum is a weight suspended from a pivot so that it can swing freely. The time for one complete cycle (period) depends on the length of the string, not the mass.",
    category: "Classical Mechanics",
    equation: "T = 2\\pi \\sqrt{\\frac{L}{g}}"
  },
  {
    id: "projectile",
    title: "Projectile Motion",
    description: "Projectile motion is the motion of an object thrown into the air, subject only to acceleration as a result of gravity. The path is always a parabola.",
    category: "Classical Mechanics",
    equation: "y = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}"
  },
  {
    id: "circular",
    title: "Circular Motion",
    description: "Uniform circular motion describes the motion of a body traversing a circular path at a constant speed. A centripetal force constantly pulls the object toward the center.",
    category: "Classical Mechanics",
    equation: "F_c = \\frac{m v^2}{r}"
  },
  {
    id: "collision",
    title: "Elastic Collision",
    description: "An elastic collision is an encounter between two bodies in which the total kinetic energy and total momentum of the two bodies are conserved.",
    category: "Classical Mechanics",
    equation: "m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"
  },
  {
    id: "waves",
    title: "Wave Interference",
    description: "Wave interference is the phenomenon that occurs when two waves meet while traveling along the same medium. They superpose to form a resultant wave of greater or lower amplitude.",
    category: "Waves & Optics",
    equation: "y(x,t) = y_1(x,t) + y_2(x,t)"
  },
  {
    id: "doppler",
    title: "Doppler Effect",
    description: "The Doppler effect is the change in frequency of a wave in relation to an observer who is moving relative to the wave source.",
    category: "Waves & Optics",
    equation: "f' = \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right) f"
  },
  {
    id: "optics",
    title: "Reflection & Refraction",
    description: "Reflection is the change in direction of a wavefront at an interface. Refraction is the bending of light as it passes from one medium to another with a different density.",
    category: "Waves & Optics",
    equation: "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)"
  },
  {
    id: "magnetism",
    title: "Magnetism",
    description: "Magnetism is a class of physical phenomena that are mediated by magnetic fields. Electric currents and the magnetic moments of elementary particles give rise to a magnetic field.",
    category: "Electromagnetism",
    equation: "B = \\frac{\\mu_0 I}{2\\pi r}"
  },
  {
    id: "electric_field",
    title: "Electric Field",
    description: "An electric field is the physical field that surrounds electrically charged particles and exerts force on all other charged particles in the field.",
    category: "Electromagnetism",
    equation: "\\vec{E} = \\frac{1}{4\\pi\\epsilon_0} \\frac{q}{r^2} \\hat{r}"
  },
  {
    id: "buoyancy",
    title: "Archimedes' Principle",
    description: "Archimedes' principle states that the upward buoyant force that is exerted on a body immersed in a fluid is equal to the weight of the fluid that the body displaces.",
    category: "Fluid Dynamics",
    equation: "F_b = \\rho g V"
  },
  {
    id: "brownian",
    title: "Brownian Motion",
    description: "Brownian motion is the random motion of particles suspended in a medium (a liquid or a gas) resulting from their collision with the fast-moving atoms or molecules in the gas or liquid.",
    category: "Thermodynamics",
    equation: "\\langle x^2 \\rangle = 2Dt"
  },
  {
    id: "conduction",
    title: "Heat Conduction",
    description: "Conduction is the process by which heat energy is transmitted through collisions between neighboring atoms or molecules.",
    category: "Thermodynamics",
    equation: "\\frac{Q}{t} = -kA \\frac{\\Delta T}{\\Delta x}"
  },
  {
    id: "newtons_cradle",
    title: "Newton's Cradle",
    description: "Newton's cradle is a device that demonstrates conservation of momentum and energy via a series of swinging spheres.",
    category: "Classical Mechanics",
    equation: "p_i = p_f \\implies m v_i = m v_f"
  },
  {
    id: "friction",
    title: "Friction",
    description: "Friction is the force resisting the relative motion of solid surfaces, fluid layers, and material elements sliding against each other.",
    category: "Classical Mechanics",
    equation: "f_k = \\mu_k N"
  },
  {
    id: "spring",
    title: "Spring-Mass System",
    description: "A spring-mass system undergoes Simple Harmonic Motion (SHM) where the restoring force is directly proportional to the displacement from equilibrium.",
    category: "Classical Mechanics",
    equation: "F = -kx"
  },
  {
    id: "capillary",
    title: "Capillary Action",
    description: "Capillary action is the ability of a liquid to flow in narrow spaces without the assistance of, or even in opposition to, external forces like gravity.",
    category: "Fluid Dynamics",
    equation: "h = \\frac{2 \\gamma \\cos(\\theta)}{\\rho g r}"
  },
  {
    id: "bernoulli",
    title: "Bernoulli's Principle",
    description: "Bernoulli's principle states that an increase in the speed of a fluid occurs simultaneously with a decrease in static pressure or a decrease in the fluid's potential energy.",
    category: "Fluid Dynamics",
    equation: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{constant}"
  },
  {
    id: "lorentz",
    title: "Lorentz Force",
    description: "The Lorentz force is the combination of electric and magnetic force on a point charge due to electromagnetic fields.",
    category: "Electromagnetism",
    equation: "\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})"
  },
  {
    id: "photoelectric",
    title: "Photoelectric Effect",
    description: "The photoelectric effect is the emission of electrons when electromagnetic radiation, such as light, hits a material.",
    category: "Modern Physics",
    equation: "K_{\\max} = hf - \\Phi"
  },
  {
    id: "ideal_gas",
    title: "Ideal Gas Law",
    description: "The ideal gas law describes the state of a hypothetical ideal gas, relating pressure, volume, temperature, and amount of substance.",
    category: "Thermodynamics",
    equation: "PV = nRT"
  },
  {
    id: "entropy",
    title: "Entropy & Mixing",
    description: "Entropy is a measure of the disorder or randomness of a system. When two gases mix, the total entropy of the universe increases.",
    category: "Thermodynamics",
    equation: "\\Delta S \\ge 0"
  },
  {
    id: "maxwell_boltzmann",
    title: "Maxwell-Boltzmann Distribution",
    description: "This distribution describes the speeds of particles in an idealized gas, showing how higher temperatures lead to a wider range of faster particle speeds.",
    category: "Thermodynamics",
    equation: "f(v) \\propto v^2 e^{-mv^2 / 2kT}"
  },
  {
    id: "convection",
    title: "Convection Currents",
    description: "Convection is heat transfer by the macroscopic movement of a fluid. Hot fluid rises due to lower density, while cold fluid sinks.",
    category: "Thermodynamics",
    equation: "\\dot{q} = h A \\Delta T"
  },
  {
    id: "phase_change",
    title: "Phase Transitions",
    description: "A phase transition is the physical process of transition between basic states of matter: solid, liquid, and gas, usually due to temperature changes.",
    category: "Thermodynamics",
    equation: "Q = mL"
  },
  {
    id: "flow_around_obstacle",
    title: "Laminar vs Turbulent Flow",
    description: "Fluid flow can be laminar (smooth, parallel layers) or turbulent (chaotic property changes and eddies), often determined by the Reynolds number.",
    category: "Fluid Dynamics",
    equation: "Re = \\frac{\\rho v L}{\\mu}"
  },
  {
    id: "torricelli",
    title: "Torricelli's Law",
    description: "Torricelli's law relates the speed of fluid flowing out of an opening to the height of the fluid above the opening.",
    category: "Fluid Dynamics",
    equation: "v = \\sqrt{2gh}"
  },
  {
    id: "magnus",
    title: "Magnus Effect",
    description: "The Magnus effect is the observable phenomenon where a spinning object dragged through a fluid creates a whirlpool of fluid, leading to a force perpendicular to the line of motion.",
    category: "Fluid Dynamics",
    equation: "F = G \\rho v"
  },
  {
    id: "pascal",
    title: "Pascal's Principle",
    description: "Pascal's principle states that a pressure change at any point in a confined incompressible fluid is transmitted throughout the fluid such that the same change occurs everywhere.",
    category: "Fluid Dynamics",
    equation: "\\frac{F_1}{A_1} = \\frac{F_2}{A_2}"
  },
  {
    id: "stokes",
    title: "Stokes' Law",
    description: "Stokes' law calculates the drag force exerted on spherical objects with very small Reynolds numbers in a viscous fluid.",
    category: "Fluid Dynamics",
    equation: "F_d = 6 \\pi \\mu R v"
  },
  {
    id: "standing_waves",
    title: "Standing Waves & Harmonics",
    description: "A standing wave is formed by the interference of two waves traveling in opposite directions. It features nodes (zero displacement) and antinodes (maximum displacement).",
    category: "Acoustics & Audio Physics",
    equation: "f_n = \\frac{n v}{2 L}"
  },
  {
    id: "beats",
    title: "Acoustic Beats",
    description: "Beats are an interference pattern between two sounds of slightly different frequencies, perceived as a periodic variation in volume whose rate is the difference of the two frequencies.",
    category: "Acoustics & Audio Physics",
    equation: "f_{beat} = |f_1 - f_2|"
  },
  {
    id: "truss",
    title: "Truss Bridge Load",
    description: "A truss is an assembly of members creating a rigid structure. When a load is applied, forces distribute as tension (stretching) and compression (pushing) along the members.",
    category: "Physics of Building",
    equation: "\\sum \\vec{F} = 0, \\quad \\sum \\vec{\\tau} = 0"
  },
  {
    id: "mass_damper",
    title: "Tuned Mass Damper",
    description: "A tuned mass damper is a device mounted in structures to reduce the amplitude of mechanical vibrations, such as those caused by earthquakes or strong winds.",
    category: "Physics of Building",
    equation: "m \\ddot{x} + c \\dot{x} + kx = F(t)"
  },
  {
    id: "prism",
    title: "Prismatic Dispersion",
    description: "Dispersion is the phenomenon in which the phase velocity of a wave depends on its frequency, causing white light to separate into its constituent colors through a prism.",
    category: "Waves & Optics",
    equation: "n(\\lambda) = A + \\frac{B}{\\lambda^2}"
  },
  {
    id: "lens",
    title: "Thin Lens Ray Tracing",
    description: "Rays of light originating from an object converge or diverge when passing through a lens, forming real or virtual images depending on the focal length.",
    category: "Waves & Optics",
    equation: "\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}"
  }
];
