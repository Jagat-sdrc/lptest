import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewPatientPage } from './add-new-patient';

@NgModule({
  declarations: [
    AddNewPatientPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewPatientPage),
  ],
})
export class AddNewPatientPageModule {}
