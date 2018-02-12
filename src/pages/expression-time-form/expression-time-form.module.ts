import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressionTimeFormPage } from './expression-time-form';

@NgModule({
  declarations: [
    ExpressionTimeFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpressionTimeFormPage),
  ],
})
export class ExpressionTimeFormPageModule {}
