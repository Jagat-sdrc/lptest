import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressionTimeFormPage } from './expression-time-form';




@NgModule({
  declarations: [
    ExpressionTimeFormPage
    
   
  ],
  imports: [
    IonicPageModule.forChild(ExpressionTimeFormPage),
  ],
  schemas:[
    
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ExpressionTimeFormPageModule {}
