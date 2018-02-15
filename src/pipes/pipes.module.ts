import { NgModule } from '@angular/core';
import { OrderByDatePipe } from './order-by-date/order-by-date';
import { OrderByTimePipe } from './order-by-time/order-by-time';
@NgModule({
	declarations: [OrderByDatePipe,
    OrderByTimePipe],
	imports: [],
	exports: [OrderByDatePipe,
    OrderByTimePipe]
})
export class PipesModule {}
