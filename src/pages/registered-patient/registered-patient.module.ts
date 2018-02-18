import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisteredPatientPage } from './registered-patient';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    RegisteredPatientPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisteredPatientPage),
    PipesModule
  ],
})
export class RegisteredPatientPageModule {}
