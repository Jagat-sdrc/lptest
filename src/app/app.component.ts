import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { MessageProvider } from '../providers/message/message';
import { SyncServiceProvider } from '../providers/sync-service/sync-service'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  user: IUser = {
    country: null,
    district: null,
    email: null,
    firstName: null,
    institution: null,
    lastName: null,
    state: null,
    isSynced: false,
    syncFailureMessage: null
  }

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private messageProvider: MessageProvider, private syncService: SyncServiceProvider,
  private events: Events) {
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

  ngOnInit(){

    this.events.subscribe('user', data=>{
      this.user = data;
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  export(){
    this.messageProvider.showErrorToast("Under construction!")
  }

  /**
   * This function will be called when a user clicks on the sync button of the side menu.
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * 
   */
  prepareForSync(){
    this.messageProvider.showLoader("Syncing, please wait...");
    this.syncService.fetchDataFromDbAndValidateForSync();
  }

  /**
   * This method will let us logout from the app
   * @author Ratikanta
   * @since 0.0.1
   * @memberof MyApp
   */
  logout(){
    this.nav.setRoot(LoginPage);
  }
}