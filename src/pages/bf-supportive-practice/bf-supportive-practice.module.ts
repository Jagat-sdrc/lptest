import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BfSupportivePracticePage } from './bf-supportive-practice';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BfSupportivePracticePage,
  ],
  imports: [
    IonicPageModule.forChild(BfSupportivePracticePage),
    PipesModule
  ],
})
export class BfSupportivePracticePageModule {}
