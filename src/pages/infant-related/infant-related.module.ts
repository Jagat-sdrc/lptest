import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfantRelatedPage } from './infant-related';

@NgModule({
  declarations: [
    InfantRelatedPage,
  ],
  imports: [
    IonicPageModule.forChild(InfantRelatedPage),
  ],
})
export class InfantRelatedPageModule {}
