import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

/**
 * This class is used to manage the Expandable list view component
 * set up the two inputs that we wanted, and we also grab a reference to the expandWrapper using the
 * template variable we added earlier. We then use that reference to set the height of the component in
 * the ngAfterViewInit function.
 *
 * @author Subhadarshini
 * @since 1.0.0
 */
@Component({
  selector: 'expandable',
  templateUrl: 'expandable.html'
})
export class ExpandableComponent {

    @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
    @Input('expanded') expanded;
    @Input('expandHeight') expandHeight;

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
        this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', this.expandHeight + 'px');
    }

}
