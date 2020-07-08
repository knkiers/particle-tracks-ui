import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
//import { ViewportScroller } from '@angular/common';

import { MatTableDataSource } from '@angular/material/table';
import { DefaultLayoutAlignDirective } from '@angular/flex-layout';

@Component({
  selector: 'app-help-online-analysis',
  templateUrl: './help-online-analysis.component.html',
  styleUrls: ['./help-analysis.component.scss']
})
export class HelpOnlineAnalysisComponent implements OnInit {

  @Input() includeLinks: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'app-help-offline-analysis',
  templateUrl: './help-offline-analysis.component.html',
  styleUrls: ['./help-analysis.component.scss']
})
export class HelpOfflineAnalysisComponent implements OnInit {

  @ViewChild('neutralParticleSection', {static: false}) neutralParticleSection: ElementRef;
  sampleDataSource: MatTableDataSource<any>;

  xVariable: string = 'x';
  yVariable: string = 'y';

  pBrParagraph: string = `
    \$\$p_K = 0.299792 B r = (0.299792 \\times 11.0 \\times 29.7520)~{\\rm MeV} \\simeq 98.11~{\\rm MeV}\$\$ 
  `;

  pxpyParagraph: string = `
    \$\$p_{Kx} = p_K \\cos\\theta \\simeq -74.09~{\\rm MeV}\$\$
    \$\$p_{Ky} = p_K \\sin\\theta \\simeq 64.32~{\\rm MeV}.\$\$
  `;

  kaonMass: string = 'm_K = 493.677~{\\rm MeV}'

  //\$\$p_x = p \\sin\\theta \\simeq 64.32~{\\rm MeV}}\$\$

  kaonEnergyParagraph: string = `
    \$\$E_K = \\sqrt{p_K^2 + m_K^2} \\simeq 503.33~{\\rm MeV} .\$\$
  `;



  displayedColumnsStudentData: string[] = ['particle', 'circleNumber', 'inOut', 'radius', 'theta', 'momentum', 'px', 'py', 'mass', 'energy', 'beta'];

  sampleData: any = [
    {
      name: 'K<sup>-</sup>',
      circleNumber: 1,
      inout: 'in',
      r: 29.75,
      theta: 2.43,
      pMag: 98.11,
      px: -74.09,
      py: 64.32,
      mass: 493.68,
      energy: 503.33,
      beta: 0.195,
      summaryRow: false
    },
    {
      name: 'e<sup>+</sup>',
      circleNumber: 2,
      inout: 'out',
      r: 66.21,
      theta: 3.32,
      pMag: 218.35,
      px: -214.85,
      py: -38.97,
      mass: 0.511,
      energy: 218.35,
      beta: 0.999997,
      summaryRow: false
    },
    {
      name: '&pi;<sup>-</sup>',
      circleNumber: 3,
      inout: 'out',
      r: 49.25,
      theta: 1.05,
      pMag: 162.40,
      px: 81.05,
      py: 140.73,
      mass: 139.57,
      energy: 214.13,
      beta: 0.758,
      summaryRow: false
    },
    {
      name: 'e<sup>-</sup>',
      circleNumber: 4,
      inout: 'out',
      r: 21.35,
      theta: 5.73,
      pMag: 70.42,
      px: 60.01,
      py: -36.85,
      mass: 0.511,
      energy: 70.42,
      beta: 0.99997,
      summaryRow: false
    },
    {
      name: null,
      circleNumber: null,
      inout: null,
      r: null,
      theta: null,
      pMag: '&Delta;:',
      px: -0.30,
      py: -0.59,
      mass: null,
      energy: 0.43,
      beta: null,
      summaryRow: true
    },
    {
      name: null,
      circleNumber: null,
      inout: null,
      r: null,
      theta: null,
      pMag: '&Delta;%:',
      px: -0.14,
      py: -0.42,
      mass: null,
      energy: 0.08,
      beta: null,
      summaryRow: true
    }
  ]



  constructor() {}//private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    this.sampleDataSource = new MatTableDataSource(this.sampleData);
  }

  scrollToNeutralParticleSection(): void {
    // Note: using the nativeElement is discouraged by the Angular docs, but I was not able to get scrollToAnchor() to work correctly
    //this.viewportScroller.scrollToAnchor(neutralParticleSection);
    this.neutralParticleSection.nativeElement.scrollIntoView();
  }

  /*
  scrollToSection(fnNumber: string) {
    switch(fnNumber) {
      case 'fn1': {
        this.fn1Source.nativeElement.scrollIntoView();
        break;
      }
      case 'fn2': {
        this.fn2Source.nativeElement.scrollIntoView();
        break;
      }
      case 'fn3': {
        this.fn3Source.nativeElement.scrollIntoView();
        break;
      }
      default: {
        //statements;
        break;
     }
   }
   */
 




}