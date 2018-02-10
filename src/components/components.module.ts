import { NgModule } from '@angular/core';
import { ExpandableComponent } from './expandable/expandable';
import { AccordionListComponent } from './accordion-list/accordion-list';
@NgModule({
	declarations: [ExpandableComponent,
    AccordionListComponent],
	imports: [],
	exports: [ExpandableComponent,
    AccordionListComponent]
})
export class ComponentsModule {}
