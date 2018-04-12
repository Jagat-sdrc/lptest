import { NgModule } from '@angular/core';
import { ExpandableComponent } from './expandable/expandable';
import { AccordionListComponent } from './accordion-list/accordion-list';

/**
 *
 *
 * @author Subhdarshini
 * @since 1.0.0
 */
@NgModule({
	declarations: [ExpandableComponent,
    AccordionListComponent],
	imports: [],
	exports: [ExpandableComponent,
    AccordionListComponent]
})
export class ComponentsModule {}
