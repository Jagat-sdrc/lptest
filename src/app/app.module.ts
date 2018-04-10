import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatePicker } from '@ionic-native/date-picker';
import { IonicStorageModule } from '@ionic/storage';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { FeedExpressionServiceProvider } from '../providers/feed-expression-service/feed-expression-service';
import { ConstantProvider } from '../providers/constant/constant';
import { HttpClientModule } from '@angular/common/http';
import { MessageProvider } from '../providers/message/message';
import { AddNewPatientServiceProvider } from '../providers/add-new-patient-service/add-new-patient-service';
import { FeedDateListServiceProvider } from '../providers/feed-date-list-service/feed-date-list-service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AddNewExpressionBfServiceProvider } from '../providers/add-new-expression-bf-service/add-new-expression-bf-service';
import { SyncServiceProvider } from '../providers/sync-service/sync-service';
import { SaveExpressionBfProvider } from '../providers/save-expression-bf/save-expression-bf';
import { RegisteredPatientServiceProvider } from '../providers/registered-patient-service/registered-patient-service';
import { NewAccountServiceProvider } from '../providers/new-account-service/new-account-service';
import { BfSupportivePracticeServiceProvider } from '../providers/bf-supportive-practice-service/bf-supportive-practice-service';
import { BfspDateListServiceProvider } from '../providers/bfsp-date-list-service/bfsp-date-list-service';
import { BfPostDischargeMenuServiceProvider } from '../providers/bf-post-discharge-menu-service/bf-post-discharge-menu-service';
import { BfPostDischargeServiceProvider } from '../providers/bf-post-discharge-service/bf-post-discharge-service';
import { BFExpressionDateListProvider } from '../providers/bf-expression-date-list-service/bf-expression-date-list-service';
import { AppVersion } from '@ionic-native/app-version';
import { SearchPipe } from '../pipes/search/search';
import { SortPatientPipe } from '../pipes/sort-patient/sort-patient';
import { ExportServiceProvider } from '../providers/export-service/export-service';
import { PapaParseModule, PapaParseService } from 'ngx-papaparse';
import { File } from '@ionic-native/file';
import { UtilServiceProvider } from '../providers/util-service/util-service';
import { SinglePatientSummaryServiceProvider } from '../providers/single-patient-summary-service/single-patient-summary-service';
import { PppServiceProvider } from '../providers/ppp-service/ppp-service';
import { Device } from '@ionic-native/device';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot({
      name: 'lactation',
         driverOrder: ['sqlite', 'indexeddb', 'websql'],

    }),
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
        platforms: {
          android: {
            tabsPlacement: 'top'
          },
          ios: {
            tabsPlacement: 'top'
          },
          windows:
          {
            tabsPlacement: 'top'
          }
        }
      }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    PapaParseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserServiceProvider,
    FeedExpressionServiceProvider,
    ConstantProvider,
    MessageProvider,
    AddNewPatientServiceProvider,
    FeedDateListServiceProvider,
    DatePipe,
    AddNewExpressionBfServiceProvider,
    SyncServiceProvider,
    BFExpressionDateListProvider,
    SaveExpressionBfProvider,
    UserServiceProvider,
    RegisteredPatientServiceProvider,
    NewAccountServiceProvider,
    BfSupportivePracticeServiceProvider,
    BfspDateListServiceProvider,
    BfPostDischargeMenuServiceProvider,
    BfPostDischargeServiceProvider,
    AppVersion,
    SearchPipe,
    SortPatientPipe,
    ExportServiceProvider,
    PapaParseService,
    File,
    UtilServiceProvider,
    SinglePatientSummaryServiceProvider,
    DecimalPipe,
    PppServiceProvider,
    Device
  ]
})
export class AppModule {}
