import type { Reference } from './phenomena';

export const phenomenaReferences: Record<string, Reference[]> = {
  gravity: [
    { title: 'Equations for a falling body', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Equations_for_a_falling_body' },
    { title: 'Gravity – Newtonian gravity', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Gravity#Newtonian_gravity' },
    { title: 'Galileo and Free Fall', source: 'Physics Classroom', url: 'https://www.physicsclassroom.com/class/1DKin/Lesson-5/Introduction' },
  ],
  pendulum: [
    { title: 'Pendulum – Period of oscillation', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Pendulum#Period_of_oscillation' },
    { title: 'Simple Pendulum derivation', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/pend.html' },
  ],
  projectile: [
    { title: 'Projectile motion', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Projectile_motion' },
    { title: 'Projectile Motion equations', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/traj.html' },
  ],
  circular: [
    { title: 'Circular motion', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Circular_motion' },
    { title: 'Centripetal force', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Centripetal_force' },
  ],
  collision: [
    { title: 'Elastic collision', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Elastic_collision' },
    { title: 'Conservation of momentum', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Conservation_of_momentum' },
  ],
  waves: [
    { title: 'Wave interference', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Wave_interference' },
    { title: 'Superposition principle', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Superposition_principle' },
  ],
  doppler: [
    { title: 'Doppler effect', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Doppler_effect' },
    { title: 'Doppler equations', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/Sound/dopp.html' },
  ],
  optics: [
    { title: "Snell's law", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Snell%27s_law" },
    { title: 'Refraction', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Refraction' },
  ],
  magnetism: [
    { title: "Biot–Savart law", source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Biot%E2%80%93Savart_law' },
    { title: 'Magnetic field of a straight wire', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/magnetic/magwir.html' },
  ],
  electric_field: [
    { title: 'Electric field', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Electric_field' },
    { title: "Coulomb's law", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Coulomb%27s_law" },
  ],
  buoyancy: [
    { title: "Archimedes' principle", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Archimedes%27_principle" },
    { title: 'Buoyancy', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Buoyancy' },
  ],
  brownian: [
    { title: 'Brownian motion', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Brownian_motion' },
    { title: 'Diffusion equation', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Diffusion_equation' },
  ],
  conduction: [
    { title: "Fourier's law of heat conduction", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Thermal_conduction#Fourier's_law" },
    { title: 'Heat conduction', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/thermo/conduc.html' },
  ],
  newtons_cradle: [
    { title: "Newton's cradle", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Newton%27s_cradle" },
    { title: 'Conservation of momentum', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Conservation_of_momentum' },
  ],
  friction: [
    { title: 'Friction', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Friction' },
    { title: "Kinetic friction (Amontons' laws)", source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/frict.html' },
  ],
  spring: [
    { title: "Hooke's law", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Hooke%27s_law" },
    { title: 'Simple harmonic motion', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Simple_harmonic_motion' },
    { title: 'Spring-mass system', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/shm.html' },
  ],
  capillary: [
    { title: 'Capillary action', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Capillary_action' },
    { title: 'Jurin\'s law derivation', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Jurin%27s_law' },
  ],
  bernoulli: [
    { title: "Bernoulli's principle", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Bernoulli%27s_principle" },
    { title: 'Continuity equation (fluids)', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Continuity_equation#Fluid_dynamics' },
    { title: 'Venturi effect', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Venturi_effect' },
  ],
  lorentz: [
    { title: 'Lorentz force', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Lorentz_force' },
    { title: 'Cyclotron', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Cyclotron' },
    { title: 'Charged particle in magnetic field', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/magnetic/magfor.html' },
  ],
  photoelectric: [
    { title: 'Photoelectric effect', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Photoelectric_effect' },
    { title: "Einstein's Nobel Prize work", source: 'Nobel Prize', url: 'https://www.nobelprize.org/prizes/physics/1921/einstein/facts/' },
  ],
  ideal_gas: [
    { title: 'Ideal gas law', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Ideal_gas_law' },
    { title: 'Kinetic theory of gases', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Kinetic_theory_of_gases' },
  ],
  entropy: [
    { title: 'Entropy', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Entropy' },
    { title: 'Second law of thermodynamics', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Second_law_of_thermodynamics' },
  ],
  maxwell_boltzmann: [
    { title: 'Maxwell–Boltzmann distribution', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution' },
    { title: 'Kinetic theory speed distributions', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/kinetic/maxspe.html' },
  ],
  convection: [
    { title: 'Convection', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Convection' },
    { title: "Newton's law of cooling", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Newton%27s_law_of_cooling" },
  ],
  phase_change: [
    { title: 'Phase transition', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Phase_transition' },
    { title: 'Latent heat', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Latent_heat' },
  ],
  flow_around_obstacle: [
    { title: 'Reynolds number', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Reynolds_number' },
    { title: 'Turbulence', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Turbulence' },
  ],
  torricelli: [
    { title: "Torricelli's theorem", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Torricelli%27s_theorem" },
    { title: 'Evangelista Torricelli', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Evangelista_Torricelli' },
  ],
  magnus: [
    { title: 'Magnus effect', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Magnus_effect' },
    { title: 'Lift (force)', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Lift_(force)' },
  ],
  pascal: [
    { title: "Pascal's law", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Pascal%27s_law" },
    { title: 'Hydraulic press', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Hydraulic_press' },
  ],
  stokes: [
    { title: "Stokes' law", source: 'Wikipedia', url: "https://en.wikipedia.org/wiki/Stokes%27_law" },
    { title: 'Drag (physics)', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Drag_(physics)' },
  ],
  standing_waves: [
    { title: 'Standing wave', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Standing_wave' },
    { title: 'Harmonic series (music)', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Harmonic_series_(music)' },
  ],
  beats: [
    { title: 'Beat (acoustics)', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Beat_(acoustics)' },
    { title: 'Acoustic beats explained', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/Sound/beat.html' },
  ],
  truss: [
    { title: 'Truss', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Truss' },
    { title: 'Structural analysis', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Structural_analysis' },
  ],
  mass_damper: [
    { title: 'Tuned mass damper', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Tuned_mass_damper' },
    { title: 'Damping', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Damping' },
  ],
  prism: [
    { title: 'Dispersion (optics)', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Dispersion_(optics)' },
    { title: 'Cauchy\'s equation', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Cauchy%27s_equation' },
  ],
  lens: [
    { title: 'Thin lens', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Thin_lens' },
    { title: 'Lens (optics)', source: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Lens_(optics)' },
    { title: 'Lensmaker\'s equation', source: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/geoopt/lenseq.html' },
  ],
};