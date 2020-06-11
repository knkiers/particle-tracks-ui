export interface Particle {
    name: string;
    symbol: string;
    humanReadableName: string;
    mass: string;
    charge: string;
}

export const PARTICLE_PROPERTIES: Particle[] = [
    {
        name: 'Sigma-plus',
        symbol: '&#931;<sup>+</sup>',
        humanReadableName: 'charged Sigma',
        mass: '1189.37',
        charge: 'positive'
    },
    {
        name: 'proton',
        symbol: 'p',
        humanReadableName: 'proton',
        mass: '938.272',
        charge: 'positive'
    },
    {
        name: 'neutron',
        symbol: 'n',
        humanReadableName: 'neutron',
        mass: '939.565',
        charge: 'neutral'
    },
    {
        name: 'D-zero',
        symbol: 'D<sup>0</sup>',
        humanReadableName: 'neutral D meson',
        mass: '1864.83',
        charge: 'neutral'
    },
    {
        name: 'K-plus',
        symbol: 'K<sup>+</sup>',
        humanReadableName: 'charged kaon',
        mass: '493.677',
        charge: 'positive'
    },
    {
        name: 'K-minus',
        symbol: 'K<sup>-</sup>',
        humanReadableName: 'charged kaon',
        mass: '493.677',
        charge: 'negative'
    },
    {
        name: 'K-zero',
        symbol: 'K<sup>0</sup><sub>S</sub>',
        humanReadableName: 'neutral kaon ("K-short")',
        mass: '497.611',
        charge: 'neutral'
    },
    {
        name: 'pi-plus',
        symbol: '&pi;<sup>+</sup>',
        humanReadableName: 'charged pion',
        mass: '139.571',
        charge: 'positive',
    },
    {
        name: 'pi-minus',
        symbol: '&pi;<sup>-</sup>',
        humanReadableName: 'charged pion',
        mass: '139.571',
        charge: 'negative'
    },
    {
        name: 'pi-zero',
        symbol: '&pi;<sup>0</sup>',
        humanReadableName: 'neutral pion',
        mass: '134.977',
        charge: 'neutral'
    },
    {
        name: 'positron',
        symbol: 'e<sup>+</sup>',
        humanReadableName: 'positron',
        mass: '0.51100',
        charge: 'positive'
    },
    {
        name: 'electron',
        symbol: 'e<sup>-</sup>',
        humanReadableName: 'electron',
        mass: '0.51100',
        charge: 'negative'
    },
    {
        name: 'antimuon',
        symbol: '&mu;<sup>+</sup>',
        humanReadableName: 'antimuon',
        mass: '105.658',
        charge: 'positive'
    },
    {
        name: 'muon',
        symbol: '&mu;<sup>-</sup>',
        humanReadableName: 'muon',
        mass: '105.658',
        charge: 'negative'
    },
    {
        name: 'neutrino',
        symbol: '&nu;',
        humanReadableName: 'neutrino',
        mass: '0',
        charge: 'neutral'
    },
    {
        name: 'antineutrino',
        symbol: '&nu;&#773;',
        humanReadableName: 'antineutrino',
        mass: '0',
        charge: 'neutral'
    },
    {
        name: 'photon',
        symbol: '&#947;',
        humanReadableName: 'photon',
        mass: '0',
        charge: 'neutral'
    },

];