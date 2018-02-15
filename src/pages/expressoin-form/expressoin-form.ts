import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  ExpressionTimeFormPage
} from '../expression-time-form/expression-time-form';

import {
  MessageProvider
} from '../../providers/message/message';
import {
  ExpressionBfDateProvider
} from '../../providers/expression-bf-date/expression-bf-date'
/**
 * Generated class for the ExpressoinFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expressoin-form',
  templateUrl: 'expressoin-form.html',
})
export class ExpressoinFormPage {

  babyCode: any;
  form: any;
  items: any;
  expBfDateListData: string[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private expressionBFdateService: ExpressionBfDateProvider,
    private messageService: MessageProvider) {
    this.babyCode = this.navParams.get("param1");
    this.form = this.navParams.get("param2");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpressoinFormPage');
  }
  goToBabyExBfTimeView(babyId: any, date: any) {
    this.navCtrl.push(ExpressionTimeFormPage, {
      param: babyId,
      date: date
    });
  }
  addnewExpressionForm() {
    var d = new Date();
    var currentTime = d.getHours() + ":" + d.getMinutes();
    var objectToPush = {
      babyCode: this.babyCode,
      userId: '123',
      dateOfExpression: this.getDateFormat(),
      timeOfExpression: currentTime,
      durationOfExpression: null,
      methodOfExpression: '',
      locationOfExpression: '',
      volOfMilkExpressedFromL: null,
      volOfMilkExpressedFromR: null

    }


    this.navCtrl.push(ExpressionTimeFormPage, {
      expressionBfObject: objectToPush
    });
  }
  getDateFormat() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = 0 + dd;
    }
    if (mm < 10) {
      mm = 0 + mm;
    }
    var date = dd + '-' + mm + '-' + yyyy;
    return date
  }

  ngOnInit() {
    //Getting date list
    this.expressionBFdateService.getExpressionBFDateListData(this.babyCode)
      .then(data => {
        this.expBfDateListData = data
      })
      .catch(err => {
        this.messageService.showErrorToast((err as IDBOperationStatus).message)
      })
  }

}
