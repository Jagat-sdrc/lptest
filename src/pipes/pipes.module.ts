import { NgModule } from '@angular/core';
import { OrderByDatePipe } from './order-by-date/order-by-date';
import { OrderByTimePipe } from './order-by-time/order-by-time';
import { SortPatientPipe } from './sort-patient/sort-patient';
@NgModule({
	declarations: [OrderByDatePipe,
    OrderByTimePipe,
    SortPatientPipe],
	imports: [],
	exports: [OrderByDatePipe,
    OrderByTimePipe,
    SortPatientPipe]
})
export class PipesModule {}
