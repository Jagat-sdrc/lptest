import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AddNewPatientPage } from '../pages/add-new-patient/add-new-patient';
import { RegisteredPatientPage } from '../pages/registered-patient/registered-patient';
import { SinglePatientSummaryPage } from '../pages/single-patient-summary/single-patient-summary';
import { VurnerableBabiesPage } from '../pages/vurnerable-babies/vurnerable-babies';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    AddNewPatientPage,
    RegisteredPatientPage,
    SinglePatientSummaryPage,
    VurnerableBabiesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    AddNewPatientPage,
    RegisteredPatientPage,
    SinglePatientSummaryPage,
    VurnerableBabiesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
