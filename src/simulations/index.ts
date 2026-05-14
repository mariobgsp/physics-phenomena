import { gravitySimulation } from './gravity';
import { pendulumSimulation } from './pendulum';
import { wavesSimulation } from './waves';
import { projectileSimulation } from './projectile';
import { circularSimulation } from './circular';
import { collisionSimulation } from './collision';
import { springSimulation } from './spring';
import { brownianSimulation } from './brownian';
import { dopplerSimulation } from './doppler';
import { electricFieldSimulation } from './electric_field';
import { opticsSimulation } from './optics';
import { magnetismSimulation } from './magnetism';
import { buoyancySimulation } from './buoyancy';
import { conductionSimulation } from './conduction';
import { newtonsCradleSimulation } from './newtons_cradle';
import { frictionSimulation } from './friction';
import { capillarySimulation } from './capillary';
import { bernoulliSimulation } from './bernoulli';
import { lorentzSimulation } from './lorentz';
import { photoelectricSimulation } from './photoelectric';
import { idealGasSimulation } from './ideal_gas';
import { entropySimulation } from './entropy';
import { maxwellBoltzmannSimulation } from './maxwell_boltzmann';
import { convectionSimulation } from './convection';
import { phaseChangeSimulation } from './phase_change';
import { flowAroundObstacleSimulation } from './flow_around_obstacle';
import { torricelliSimulation } from './torricelli';
import { magnusSimulation } from './magnus';
import { pascalSimulation } from './pascal';
import { stokesSimulation } from './stokes';
import { standingWavesSimulation } from './standing_waves';
import { beatsSimulation } from './beats';
import { trussSimulation } from './truss';
import { massDamperSimulation } from './mass_damper';
import { prismSimulation } from './prism';
import { lensSimulation } from './lens';

export const simulationRegistry: Record<string, () => any> = {
  gravity: gravitySimulation,
  pendulum: pendulumSimulation,
  waves: wavesSimulation,
  projectile: projectileSimulation,
  circular: circularSimulation,
  collision: collisionSimulation,
  spring: springSimulation,
  brownian: brownianSimulation,
  doppler: dopplerSimulation,
  optics: opticsSimulation,
  magnetism: magnetismSimulation,
  electric_field: electricFieldSimulation,
  buoyancy: buoyancySimulation,
  conduction: conductionSimulation,
  newtons_cradle: newtonsCradleSimulation,
  friction: frictionSimulation,
  capillary: capillarySimulation,
  bernoulli: bernoulliSimulation,
  lorentz: lorentzSimulation,
  photoelectric: photoelectricSimulation,
  ideal_gas: idealGasSimulation,
  entropy: entropySimulation,
  maxwell_boltzmann: maxwellBoltzmannSimulation,
  convection: convectionSimulation,
  phase_change: phaseChangeSimulation,
  flow_around_obstacle: flowAroundObstacleSimulation,
  torricelli: torricelliSimulation,
  magnus: magnusSimulation,
  pascal: pascalSimulation,
  stokes: stokesSimulation,
  standing_waves: standingWavesSimulation,
  beats: beatsSimulation,
  truss: trussSimulation,
  mass_damper: massDamperSimulation,
  prism: prismSimulation,
  lens: lensSimulation,
};
