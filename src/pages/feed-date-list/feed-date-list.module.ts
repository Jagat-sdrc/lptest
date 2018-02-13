import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedDateListPage } from './feed-date-list';

@NgModule({
  declarations: [
    FeedDateListPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedDateListPage),
  ],
})
export class FeedDateListPageModule {}
