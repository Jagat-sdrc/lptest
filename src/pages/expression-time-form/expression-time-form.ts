import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  AddNewExpressionBfServiceProvider
} from '../../providers/add-new-expression-bf-service/add-new-expression-bf-service';
import {
  MessageProvider
} from '../../providers/message/message';
import { SaveExpressionBfProvider } from '../../providers/save-expression-bf/save-expression-bf';
/**
 * Generated class for the ExpressionTimeFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-expression-time-form',
  templateUrl: 'expression-time-form.html',
})
export class ExpressionTimeFormPage {
  expressionBfTimeList: any;
  shownGroup: any;
  methodOfExpObj: any
  methodOfExpressionBfList: any;
  locationOfexpressionList: any;
  objectToPush:any
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private addNewExpressionBfService: AddNewExpressionBfServiceProvider,
    private messageService: MessageProvider,
  private saveBfExpressionnService:SaveExpressionBfProvider) {
    this.expressionBfTimeList = [];
  }
  //getting whether there is a new record and add to the exting time list from database
  getNewRecord() {
    if (this.navParams.get("expressionBfObject") != null) {
      this.expressionBfTimeList.push(this.navParams.get("expressionBfObject"));
      setTimeout(() => {
        this.toggleGroup(this.expressionBfTimeList[0]);
      }, 500);
    }
  }
  ngOnInit() {
    this.objectToPush = {
      babyCode: 124,
      userId: '124',
      dateOfExpression: '13-02-2013',
      timeOfExpression: '07:03',
      durationOfExpression: 1,
      methodOfExpression: 'abc',
      locationOfExpression: 'abc',
      volOfMilkExpressedFromL: 20,
      volOfMilkExpressedFromR: 20

    }
    this.getNewRecord();
    //Getting method of expressionbf type details
    this.addNewExpressionBfService.getMethodOfExpressionBF()
      .subscribe(data => {
        this.methodOfExpressionBfList = data
      }, err => {
        this.messageService.showErrorToast(err)
      });
    //Getting location of expression type detail
    this.addNewExpressionBfService.getLocationOfExpressionBF()
      .subscribe(data => {
        this.locationOfexpressionList = data
      }, err => {
        this.messageService.showErrorToast(err)
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpressionTimeFormPage');
  }
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {

    return this.shownGroup === group;
  };
  //This method will add new time of expressionBF 
  addExpressionTIme() {
    var d = new Date();
    var currentTime = d.getHours() + ":" + d.getMinutes();
    var objectToPush = {
      time: currentTime
    }
    this.expressionBfTimeList.unshift(objectToPush);
    setTimeout(() => {
      this.toggleGroup(this.expressionBfTimeList[0]);
    }, 500);

  }
  expressionSelected() {}
  locationSelected() {

  }

  saveExpressionTIme(item: any) {

    console.log(item);
    
    this.saveBfExpressionnService.saveBfExpression(item)
    .then(data=> {
    this.messageService.showSuccessToast("save successful!")
  })
    .catch(err =>{
    this.messageService.showErrorToast((err as IDBOperationStatus).message)
  })
    

  }
  editExpressionTIme() {

  }
}
