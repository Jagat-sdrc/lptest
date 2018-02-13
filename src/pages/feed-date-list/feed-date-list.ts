import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import { FeedDateListServiceProvider } from '../../providers/feed-date-list-service/feed-date-list-service';
import { MessageProvider } from '../../providers/message/message';

/**
 * This page/component will have entries of feed expression by date
 * 
 * @author Ratikanta
 * @since 0.0.1
 */
@IonicPage()
@Component({
  selector: 'page-feed-date-list',
  templateUrl: 'feed-date-list.html',
})
export class FeedDateListPage {

  feedDateListData: string[];
  patientId:string;

  constructor(private feedDateListService: FeedDateListServiceProvider,
    private messageService: MessageProvider) {}

  ngOnInit(){

    //test
    this.patientId = 'qqqqq-ddddd'
    //Getting date list
    this.feedDateListService.getFeedDateListData(this.patientId)
    .then(data=>{
      this.feedDateListData = data
    })
    .catch(err=>{
      this.messageService.showErrorToast((err as IDBOperationStatus).message)
    })
  }

}
