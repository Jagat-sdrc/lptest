import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MessageProvider } from '../providers/message/message';
import { SyncServiceProvider } from '../providers/sync-service/sync-service'
import { ExportServiceProvider } from '../providers/export-service/export-service';
import { File } from '@ionic-native/file';
import { ConstantProvider } from '../providers/constant/constant';
import { UtilServiceProvider } from '../providers/util-service/util-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';
  user: IUser = {
    country: null,
    district: null,
    email: null,
    firstName: null,
    institution: null,
    lastName: null,
    state: null,
    isSynced: false,
    syncFailureMessage: null,
    createdDate: null,
    updatedDate: null,
    uuidNumber: null
  }

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private messageProvider: MessageProvider, private syncService: SyncServiceProvider,
  private events: Events, private exportService: ExportServiceProvider, private file: File,
private utilService: UtilServiceProvider) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.createProjectFolder()
      this.utilService.setUuid()
    });
  }

  ngOnInit(){

    this.events.subscribe('user', data=>{
      this.user = data;
    })


    this.utilService.setDefaults()

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  /**
   * This method is going to export data to csv file which will reside in android device root folder
   *
   * @memberof MyApp
   * @since 1.2.0
   * @author Ratikanta
   */
  export(){
    this.exportService.export()
  }

  /**
   * This function will be called when a user clicks on the sync button of the side menu.
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   *
   */
  prepareForSync(){
    this.messageProvider.showLoader(ConstantProvider.messages.syncingPleaseWait);
    this.syncService.fetchDataFromDbAndValidateForSync();
  }

  /**
   * This method will let us logout from the app
   * @author Ratikanta
   * @since 0.0.1
   * @memberof MyApp
   */
  logout(){
    this.nav.setRoot('LoginPage');
  }

  /**
   *
   * This method is going to create project folders where we are going to keep the data and if
   * the folder is present the app is not create the folder again
   * @memberof MyApp
   *
   * @since 1.2.0
   * @author Ratikanta
   * @author Jagat Bandhu
   */
  createProjectFolder(){
    //checking folder existance
    this.file.checkDir(this.file.externalRootDirectory, ConstantProvider.appFolderName)
    .catch(err=>{
      if(err.code === 1){
        // folder not present, creating new folder
        this.file.createDir(this.file.externalRootDirectory, ConstantProvider.appFolderName, false)
        .then(data =>{
          this.messageProvider.showSuccessToast(ConstantProvider.messages.folderCraetedSuccessfully)
        })
        .catch(err=> {
          this.messageProvider.showErrorToast(err.message)
        })
      }
    })




  }

}
