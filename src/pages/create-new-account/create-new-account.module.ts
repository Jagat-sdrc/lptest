import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateNewAccountPage } from './create-new-account';

@NgModule({
  declarations: [
    CreateNewAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateNewAccountPage),
  ],
})
export class CreateNewAccountPageModule {}
