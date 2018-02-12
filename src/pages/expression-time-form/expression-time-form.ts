import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

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
  methodOfExpressionList: any;
  locationOfexpressionList: any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    this.methodOfExpressionList = [{
        type: 'Single Pump'
      },
      {
        type: 'Double Pump'
      },
      {
        type: 'Hand'
      }
    ]
    this.locationOfexpressionList = [{
      locationOfExp: 'During skin to skin'
      },
      {
        locationOfExp: 'Infant bed side (not in KMC)'
      },
      {
        locationOfExp: 'Expression room'
      },
      {
        locationOfExp: 'Maternity ward'
      },
      {
        locationOfExp: 'Home'
      },
      {
        locationOfExp: 'other'
      }
    ]

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
  expressionSelected() {
  }
  locationSelected(){

  }

  saveExpressionTIme(item:any) {
    if(item.type==null){
   
    }


  }
  editExpressionTIme() {

  }
}
