import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  MessageProvider
} from '../../providers/message/message';
/**
 * Generated class for the ExpressionNewFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expression-new-form',
  templateUrl: 'expression-new-form.html',
})
export class ExpressionNewFormPage {
  expressionFormObj: any
  methodOfExpressionList: any
  methodOfLocationList: any
  volOfMilkLeft: number
  volOfMilkRight: number
  constructor(public navCtrl: NavController, public navParams: NavParams, private messageService: MessageProvider, ) {
    this.expressionFormObj = {
      date: '',
      time: '',
      expression: '',
      location: ''
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpressionNewFormPage');
  }
  saveForm() {
    if (this.expressionFormObj.date.length == 0) {
      this.messageService.showErrorToast(MessageProvider.messages.ENTER_DATE_OF_EXPRESSION);
    } else if (this.expressionFormObj.time.length == 0) {
      this.messageService.showErrorToast(MessageProvider.messages.ENTER_TIME_OF_EXPRESSION);

    } else if (this.expressionFormObj.expression.length == 0) {
      this.messageService.showErrorToast(MessageProvider.messages.ENTER_TYPE_OF_EXPRESSION);
    } else if (this.expressionFormObj.expression.location.length == 0) {
      this.messageService.showErrorToast(MessageProvider.messages.ENTER_LOC_OF_EXPRESSION);
    } else if (this.volOfMilkLeft == undefined) {
      this.messageService.showErrorToast(MessageProvider.messages.ENTER_VOLUME_OF_MILK_FROM_LEFT);
    } else if (this.volOfMilkLeft < 0 || this.volOfMilkLeft > 300) {
      this.messageService.showErrorToast(MessageProvider.messages.ENTER_VALID_VOLUME_OF_MILK);
    } else if (this.volOfMilkRight == undefined) {
      this.messageService.showErrorToast(MessageProvider.messages.ENTER_VOLUME_OF_MILK_FROM_RIGHT);
    }

  }
  resetForm() {    
  }

}
