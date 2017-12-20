// An autoresize directive that works with ion-textarea in Ionic 2
// Usage example: <ion-textarea autoresize [(ngModel)]="body"></ion-textarea>
// Based on https://www.npmjs.com/package/angular2-autosize

import { Directive, HostListener, ElementRef  } from '@angular/core';

/**
 * Generated class for the AutoresizeDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: "ion-textarea[autoresize]" // Attribute selector
})
export class AutoresizeDirective {
	@HostListener("input", ["$event.target"])
	onInput(textArea: HTMLTextAreaElement): void {
		this.adjust();
	}

  constructor(public element: ElementRef) {
    console.log('Hello AutoresizeDirective Directive');
  }

	ngOnInit(): void {
		this.adjust();
  }
  ngAfterViewInit()
  {
    this.adjust();
  }
  
	adjust(): void {
    setTimeout(()=>{
      let ta = this.element.nativeElement.querySelector("textarea");
      ta.style.overflow = "hidden";
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    },0);
	}
}
