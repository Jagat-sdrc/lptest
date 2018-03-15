import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the SpsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sps',
  templateUrl: 'sps.html'
})
export class SpsPage {

  basicRoot = 'BasicPage'
  motherRelatedRoot = 'MotherRelatedPage'
  togetherRoot = 'TogetherPage'
  infantRelatedRoot = 'InfantRelatedPage'
  exclusiveBfRoot = 'ExclusiveBfPage'


  constructor(public navCtrl: NavController) {}

}
