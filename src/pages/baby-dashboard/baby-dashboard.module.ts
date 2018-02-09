import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BabyDashboardPage } from './baby-dashboard';

@NgModule({
  declarations: [
    BabyDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(BabyDashboardPage),
  ],
})
export class BabyDashboardPageModule {}
