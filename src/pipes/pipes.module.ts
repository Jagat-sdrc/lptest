import { NgModule } from '@angular/core';
import { OrderByDatePipe } from './order-by-date/order-by-date';
import { OrderByTimePipe } from './order-by-time/order-by-time';
import { SortPatientPipe } from './sort-patient/sort-patient';
import { SearchPipe } from './search/search';
@NgModule({
	declarations: [OrderByDatePipe,
    OrderByTimePipe,
    SortPatientPipe,
    SearchPipe],
	imports: [],
	exports: [OrderByDatePipe,
    OrderByTimePipe,
    SortPatientPipe,
    SearchPipe]
})
export class PipesModule {}
