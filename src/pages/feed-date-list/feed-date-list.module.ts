import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedDateListPage } from './feed-date-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    FeedDateListPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedDateListPage),
    PipesModule
  ],
})
export class FeedDateListPageModule {}
