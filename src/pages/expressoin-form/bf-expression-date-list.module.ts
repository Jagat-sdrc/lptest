import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { BFExpressionDateListPage } from './bf-expression-date-list';

@NgModule({
  declarations: [
    BFExpressionDateListPage,
  ],
  imports: [
    IonicPageModule.forChild(BFExpressionDateListPage),
    PipesModule
  ],
})
export class BFExpressionDateListPageModule {}
