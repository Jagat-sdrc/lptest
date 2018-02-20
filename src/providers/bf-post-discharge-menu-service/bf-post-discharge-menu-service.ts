import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the BfPostDischargeMenuServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BfPostDischargeMenuServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello BfPostDischargeMenuServiceProvider Provider');
  }

  /**
   * This function will fetch the menu for post discarge menu.
   * @author - Naseem Akhtar
   * @since - 0.0.1
   */
  getPostDischargeMenu(): Observable < ITypeDetails[] >{
    return this.http.get("./assets/data.json").map((response: Response) => {
      return (response as any).
        typeDetails.filter(menu => menu.typeId == ConstantProvider.postDischargeMenu);
    })
    .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {

    let messageToUser;
    if (error.error instanceof ErrorEvent) {
      messageToUser = `An error occurred: ${error.error.message}`;
    } else {
      messageToUser = `Backend error, code ${error.status}, ` +
        `message: ${error.message}`;
    }
    return new ErrorObservable (messageToUser);
  };

}
