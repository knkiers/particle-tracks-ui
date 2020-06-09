import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUserEventWrapperAnchor]'
})
export class UserEventWrapperAnchorDirective {

  constructor(public viewContainer: ViewContainerRef) { }

}
