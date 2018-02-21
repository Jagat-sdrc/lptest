import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.expressionFormObj = {
      date: '',
      time: '',
      expression: '',
      location: ''
    }
  }

}
