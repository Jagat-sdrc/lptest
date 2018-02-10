import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';


@Component({
  selector: 'accordion-list',
  templateUrl: 'accordion-list.html'
})
export class AccordionListComponent {
   @ViewChild('wrapper', {read: ElementRef}) wrapper;
    @Input('expanded') expanded;
    @Input('height') height;
 
    constructor(public renderer: Renderer) {
 
    }
 
    ngAfterViewInit(){
      if(this.height){
        this.renderer.setElementStyle(this.wrapper.nativeElement, 'height', this.height + 'px');    
      }
    }

}
