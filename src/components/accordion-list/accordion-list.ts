import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

/**
 * This class is used to manage the Accordion List Component
 * set up the two inputs that we wanted, and we also grab a reference to the wrapper using the
 * template variable we added earlier. We then use that reference to set the height of the component in
 * the ngAfterViewInit function.
 *
 * @author Subhadarshini
 * @since 1.0.0
 */
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

    /**
     * Respond after Angular initializes the component's views and child views / the view that a directive is in.
     * to set the height of the component
     *
     * @author Subhadarshini
     * @since 1.0.0
     */
    ngAfterViewInit(){
      if(this.height){
        this.renderer.setElementStyle(this.wrapper.nativeElement, 'height', this.height + 'px');
      }
    }

}
