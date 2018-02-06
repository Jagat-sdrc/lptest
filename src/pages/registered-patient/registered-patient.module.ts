import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisteredPatientPage } from './registered-patient';

@NgModule({
  declarations: [
    RegisteredPatientPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisteredPatientPage),
  ],
})
export class RegisteredPatientPageModule {}
