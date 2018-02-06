import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SinglePatientSummaryPage } from './single-patient-summary';

@NgModule({
  declarations: [
    SinglePatientSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(SinglePatientSummaryPage),
  ],
})
export class SinglePatientSummaryPageModule {}
