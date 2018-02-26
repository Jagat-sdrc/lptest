import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressionTimeFormPage } from './expression-time-form';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ExpressionTimeFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpressionTimeFormPage),
    PipesModule
  ],
})
export class ExpressionTimeFormPageModule {}
