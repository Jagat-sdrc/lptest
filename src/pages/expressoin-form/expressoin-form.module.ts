import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressoinFormPage } from './expressoin-form';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ExpressoinFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpressoinFormPage),
    PipesModule
  ],
})
export class ExpressoinFormPageModule {}
