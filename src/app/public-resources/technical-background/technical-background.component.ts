import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technical-background',
  templateUrl: './technical-background.component.html',
  styleUrls: ['./technical-background.component.scss']
})
export class TechnicalBackgroundComponent implements OnInit {

  momIsVectorParagraph: string = `
    In our simulations we will always be working in two dimensions,
    which means that the momentum of a particle will always be a two-dimensional
    vector.
    If the magnitude of the momentum is $p$ and the
    momentum vector is pointing in the direction \$\\theta\$, then the
    \$x\$ and \$y\$ components are
    \$\$p_x = p \\cos\\theta,~~~~~ p_y = p \\sin\\theta.\$\$
    If you already have the \$x\$ and \$y\$ components of the momentum vector, 
    you can get the magnitude as follows:
    \$\$ p = \\sqrt{p_x^2+p_y^2}.\$\$
  `;

  energyMomMassParagraph: string = `
    The relativistic energy of a particle is related to the magnitude of 
    its momentum (\$p\$) and its mass (\$m\$):
    \$ E = \\sqrt{p^2c^2+m^2c^4}\$, where \$c\$ is the speed of light.  
    If you set the momentum to zero, you arrive
    at Einstein's famous equation, \$E=mc^2\$.  In these expressions, momentum is always
    multiplied by \$c\$ and mass is always multiplied by \$c^2\$.  For this reason, we
    "absorb" the \$c\$ and \$c^2\$ into the definitions of momentum and mass and simply
    write \$\$E = \\sqrt{p^2+m^2}.\$\$  In this approach, momentum (which is really \$ pc\$)
    and mass (which is really \$mc^2\$) both have units of energy.
  `;

  unitsParagraph: string = `
    Energy, momentum and mass are all measured in units of MeV ("mega-electronvolts"), 
    where 1 MeV\$~\\simeq 1.602\\times10^{-13}~\$ J (although you should not convert
    energies to joules -- just keep them in MeV).
  `;

  speedParagraph: string = `
    The speed of a particle is related to its momentum and energy: \$v = p c^2/E\$.
    Instead of using the speed itself, we always consider the ratio of the particle's
    speed to the speed of light, \$\\beta = v/c\$.  In our modified definition of momentum
    (where \$pc\$ becomes \$p\$), we then simply have \$\$\\beta \\equiv \\frac{v}{c} = \\frac{p}{E}.\$\$
    That is, the speed of a particle (in units of \$c\$) is just the ratio of its momentum
    to its energy!
  `;

  masslessParticlesParagraph: string = `
    The photon is a massless particle, meaning \$m=0\$ for photons.  The same is almost true for 
    particles called neutrinos (they actually have tiny, non-zero masses, but it's OK to set 
    those to zero here).  What happens to our equations for energy, momentum
    and speed when we set the mass of a particle to zero?  If you are used to using the non-relativistic
    definition of momentum, you might expect the momentum to be zero for a massless particle.  But this is
    not the case, actually, since the definition of momentum changes in Einstein's theory of special relativity!
    If we set \$m\$ to zero in our expression for energy, we find \$\$E=p~~~~(m=0)\$\$
    and \$\$\\beta = \\frac{p}{E} = \\frac{E}{E} = 1~~~~(m=0)\$\$ for a massless particle.  This tells
    us that massless particles are always moving at the speed of light!  (...in a vacuum, that is.)
  `;

  momentumConservedParagraph: string = `
    Momentum is conserved in particle physics decays.  Suppose some particle \$A\$ decays to 
    three particles \$X\$, \$Y\$ and \$Z\$: \$\$ A \\to X + Y + Z .\$\$  Since momentum is conserved,
    and since momentum is actually a vector, momentum conservation gives us two separate
    equations that hold for the decay: \$\$p_{Ax}=p_{Xx}+p_{Yx}+p_{Zx}\$\$ and \$\$p_{Ay}=p_{Xy}+p_{Yy}+p_{Zy}.\$\$
    That is, the \$x\$ and \$y\$ components of momentum are separately conserved.
  `;  

  energyConservedParagraph: string = `
    Relativistic energy is also conserved.  Since energy is a scalar (not a vector), there
    is only one equation, instead of two.  Considering the same decay as above, we would 
    have \$\$E_{A}=E_{X}+E_{Y}+E_{Z}.\$\$  (Note that $X$ is the name of the particle 
    here, which is not to be confused with the "\$x\$" direction!)  Recall that each of the \$E\$'s is related
    to its corresponding \$p\$ and \$m\$.  Thus, for example, \$E_A = \\sqrt{p_A^2 + m_A^2}\$.
  `;  

  pBrParagraph: string = `
    And finally we come to what might be the most important equation for our analysis!  The
    simulation always assumes that the decays are taking place in a magnetic field that
    is pointing into the page.
    As you may know, a charged particle traveling perpendicular to a uniform magnetic field follows
    a circular path.  Furthermore, the momentum of the particle is proportional to the radius
    of the circle (even in special relativity!)  Specifically, the momentum of the particle 
    is given by \$\$p = 0.299792 B r,\$\$ where \$B\$ is the strength of the magnetic field in kG ("kilo-Gauss"),
    \$r\$ is the radius of the circle in cm and \$p\$ is the momentum in MeV.  We should note
    that this expression assumes that the particle has "unit charge" (like a proton or electron).
    Note that neutral particles are unaffected by a uniform magnetic field and travel in a straight line.
  `;
  
  constructor() { }

  ngOnInit(): void {
  }

}
