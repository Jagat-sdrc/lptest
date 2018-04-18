import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateNewAccountPage } from './create-new-account';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CreateNewAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateNewAccountPage),
    PipesModule
  ],
})
export class CreateNewAccountPageModule {}
