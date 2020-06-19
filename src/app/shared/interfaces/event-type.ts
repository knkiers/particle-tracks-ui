export interface Particle {
    id: number;
    mass: number;
    name: string;
    verbose_name: string;
    charge: number
}

export interface EventType {
    decay_id: number;
    parent: Particle;
    daughters: Particle[];
    name: string;
}

export interface EventsSameSignature {
    original_decay: EventType;
    matching_decays: EventType[];
}