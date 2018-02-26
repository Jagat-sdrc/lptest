import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BfSupportivePracticeDateListPage } from './bf-supportive-practice-date-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BfSupportivePracticeDateListPage,
  ],
  imports: [
    IonicPageModule.forChild(BfSupportivePracticeDateListPage),
    PipesModule
  ],
})
export class BfSupportivePracticeDateListPageModule {}
