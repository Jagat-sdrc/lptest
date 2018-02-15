import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private alertCtrl: AlertController) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  goTo(page) {
    switch (page) {
      case "sync":
        break;
      case "export":
        break;
      case "logout":
        this.nav.setRoot(LoginPage);
      // let confirm = this.alertCtrl.create({
      //   enableBackdropDismiss: false,
      //   title: 'Warning',
      //   message: 'Are you sure you want to logout?',
      //   buttons: [{
      //       text: 'No',
      //       handler: () => {}
      //     },
      //     {
      //       text: 'Yes',
      //       handler: () => {
      //           this.nav.setRoot(LoginPage);
      //       }
      //     }
      //   ]
      // });
      // confirm.setCssClass('modalDialog');
      // confirm.present();
        break;
    }
  }
}
