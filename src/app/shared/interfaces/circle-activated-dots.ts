/**
 * this interface specifies the format for data connected to the dots activated by a circle for a particle in an event
 */
export interface CircleActivatedDots {
  dotIndices: number[];
  mass: number;
  momentum: number;
  radius: number;
  index: number;
  name: string;
  incoming: boolean;
  CW: boolean;
  charge: number;
  particleId: number;
}