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
  shownGroup: any;
  methodOfExpObj: any
  methodOfExpressionBfList: any;
  locationOfexpressionList: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private addNewExpressionBfService: AddNewExpressionBfServiceProvider, private messageService: MessageProvider) {
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

    //getting whether there is a new record


  }
  //getting whether there is a new record and add to the exting time list from database
  getNewRecord() {
    if (this.navParams.get("expressionBfObject") != null) {
      this.timeList.unshift(this.navParams.get("expressionBfObject"));
      //this.toggleGroup(this.navParams.get("expressionBfObject"));
      setTimeout(() => {
        this.toggleGroup(this.timeList[0]);
      }, 500);


    }
  }
  ngOnInit() {
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
    this.timeList.unshift(objectToPush);
    setTimeout(() => {
      this.toggleGroup(this.timeList[0]);
    }, 500);

  }
  expressionSelected() {}
  locationSelected() {

  }

  saveExpressionTIme(item: any) {



  }
  editExpressionTIme() {

  }
}
