import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConstantProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConstantProvider {

  static FeedingTypeIds: IFeedingMethods = {
    feedingMethodTypeId: 1
  }

  static dbKeyNames: IDBKeyNames = {
   feedExpression: "feedExpression"  
  } 

  constructor(public http: HttpClient) {
  }

}
