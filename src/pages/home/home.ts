import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
    this.navCtrl.setRoot(HomePage)
    this.menuCtrl.enable(true);
    this.menuCtrl.swipeEnable(true);
    this.menuCtrl.get().enable(true);
  }

}
