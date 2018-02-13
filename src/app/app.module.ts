import { FeedPage } from './../pages/feed/feed';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { RegisteredPatientPage } from '../pages/registered-patient/registered-patient';
import { SinglePatientSummaryPage } from '../pages/single-patient-summary/single-patient-summary';
import { VurnerableBabiesPage } from '../pages/vurnerable-babies/vurnerable-babies';
import { BabyDashboardPage } from '../pages/baby-dashboard/baby-dashboard';
import { ExpressoinFormPage } from '../pages/expressoin-form/expressoin-form';
import { AddPatientPage } from '../pages/add-patient/add-patient';
import { CreateNewAccountPage } from '../pages/create-new-account/create-new-account';
import { DatePicker } from '@ionic-native/date-picker';
import { ExpressionTimeFormPage } from '../pages/expression-time-form/expression-time-form';
import { IonicStorageModule } from '@ionic/storage';
import { PatientServiceProvider } from '../providers/patient-service/patient-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { FeedExpressionServiceProvider } from '../providers/feed-expression-service/feed-expression-service';
import { ConstantProvider } from '../providers/constant/constant';
import { HttpClientModule } from '@angular/common/http';
import { MessageProvider } from '../providers/message/message';
import { AddNewPatientServiceProvider } from '../providers/add-new-patient-service/add-new-patient-service';
import { ExpressionNewFormPage } from '../pages/expression-new-form/expression-new-form';
import { FeedDateListPage } from '../pages/feed-date-list/feed-date-list';
import { FeedDateListServiceProvider } from '../providers/feed-date-list-service/feed-date-list-service';
import { DatePipe } from '@angular/common';
import { OrderByDatePipe } from '../pipes/order-by-date/order-by-date';
import { AddNewExpressionBfServiceProvider } from '../providers/add-new-expression-bf-service/add-new-expression-bf-service';
import { ExpressionBfDateProvider } from '../providers/expression-bf-date/expression-bf-date';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    AddPatientPage,
    RegisteredPatientPage,
    SinglePatientSummaryPage,
    VurnerableBabiesPage,
    BabyDashboardPage,
    ExpressoinFormPage,
    CreateNewAccountPage,
    ExpressionTimeFormPage,
    FeedPage,
    ExpressionNewFormPage,
    FeedDateListPage,
    OrderByDatePipe
    
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot({
      name: '_mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    AddPatientPage,
    RegisteredPatientPage,
    SinglePatientSummaryPage,
    VurnerableBabiesPage,
    BabyDashboardPage,
    ExpressoinFormPage,
    CreateNewAccountPage,
    ExpressionTimeFormPage,
    FeedPage,
    ExpressionNewFormPage,
    FeedDateListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PatientServiceProvider,
    UserServiceProvider,
    FeedExpressionServiceProvider,
    ConstantProvider,
    MessageProvider,
    AddNewPatientServiceProvider,
    FeedDateListServiceProvider,
    DatePipe,
    AddNewExpressionBfServiceProvider,
    ExpressionBfDateProvider
  ]
})
export class AppModule {}
