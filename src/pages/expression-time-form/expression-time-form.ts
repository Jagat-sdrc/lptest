import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import { AddNewExpressionBfServiceProvider } from '../../providers/add-new-expression-bf-service/add-new-expression-bf-service';
import { MessageProvider } from '../../providers/message/message';
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
  timeList: any;
  shownGroup: null;
  methodOfExpObj: any
  methodOfExpressionBfList: any;
  locationOfexpressionList: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private addNewExpressionBfService: AddNewExpressionBfServiceProvider,private messageService: MessageProvider) {
    this.timeList = [{
        time: '19:14',
        type: 'single Pump',
        locationOfExp: 'Home',
        volOfMilkLeft: '20',
        volOfMilkRight: '20'
      },
      {
        time: '20:14',
        type: 'Double Pump',
        locationOfExp: 'Home',
        volOfMilkLeft: '20',
        volOfMilkRight: '20'
      },
      {
        time: '21:14',
        type: 'Hand',
        locationOfExp: 'Home',
        volOfMilkLeft: '20',
        volOfMilkRight: '20'
      },
      {
        time: '22:14',
        type: 'Single Pump',
        locationOfExp: 'Home',
        volOfMilkLeft: '20',
        volOfMilkRight: '20'
      },
      {
        time: '23:14',
        type: 'Double Pump',
        locationOfExp: 'Home',
        volOfMilkLeft: '20',
        volOfMilkRight: '20'
      }
    ]   
  
  }
  ngOnInit(){
    //Getting delivery methods type details
    this.addNewExpressionBfService.getMethodOfExpressionBF()
    .subscribe(data =>{
      this.methodOfExpressionBfList = data
    }, err => {
      this.messageService.showErrorToast(err)
    });
    this.addNewExpressionBfService.getLocationOfExpressionBF()
    .subscribe(data =>{
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
  addExpressionTIme() {
    var d = new Date();
    var currentTime = d.getHours() + ":" + d.getMinutes();
    var objectToPush = {
      time: currentTime
    }
    this.timeList.unshift(objectToPush);


  }
  expressionSelected() {}
  locationSelected() {

  }

  saveExpressionTIme(item: any) {
    if (item.type == null) {

    }


  }
  editExpressionTIme() {

  }
}
