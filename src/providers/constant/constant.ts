import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConstantProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConstantProvider {

  /*
  validation messages
  @author:subhadarshani@sdrc.co.in
*/
  
  static FeedingTypeIds: IFeedingMethods = {
    feedingMethodTypeId: 1
  }

  constructor(public http: HttpClient) {
  }

}
