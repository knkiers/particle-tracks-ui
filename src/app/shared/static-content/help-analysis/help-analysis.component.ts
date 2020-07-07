import { Component, OnInit, Input } from '@angular/core';

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

  eqEmc2: string = 'E = mc^2';
  eqEmp: string = '\$\$ E = mc^2\$\$';
  equation: string = '\\sum_{i=1}^nx_i';

  equation2: string = 'c = \pm\sqrt{a^2 + b^2}'

  pBrEquation: string = 'p = 0.299792 B r';

  paragraph: string = `
    $E = \\sqrt{p^2c^2 + m^2 c^4}$
    You can write text, that contains expressions like this: $x ^ 2 + 5$ inside them. As you probably know.
    You also can write expressions in display mode as follows: $$\\sum_{i=1}^n(x_i^2 - \\overline{x}^2)$$.
    In first case you will need to use \\$expression\\$ and in the second one \\$\\$expression\\$\\$.
    To scape the \\$ symbol it's mandatory to write as follows: \\\\$
  `;

  paragraph1: string = `
    Einstein's famous equation says that \$E=mc^2\$.  This expression
    holds for an object that is at rest.  For an object that is moving, the more general expression
    is \$\$ E = \\sqrt{p^2c^2+m^2c^4}. \$\$ This holds.
  `;

  constructor() { }

  ngOnInit(): void {
  }

}