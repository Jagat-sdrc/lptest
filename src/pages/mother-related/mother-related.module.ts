import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MotherRelatedPage } from './mother-related';

@NgModule({
  declarations: [
    MotherRelatedPage,
  ],
  imports: [
    IonicPageModule.forChild(MotherRelatedPage),
  ],
})
export class MotherRelatedPageModule {}
