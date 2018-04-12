import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { Observable } from 'rxjs/Observable';

/**
 * @author - Naseem Akhtar (naseem@sdrc.co.in)
 * @since - 0.0.1
 * 
 * This service will be used to fecth the mobile DB related data for 
 * the breast feed post discharge menu component.
 */

@Injectable()
export class BfPostDischargeMenuServiceProvider {

  constructor(public http: HttpClient) {
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

  /**
   * @author - Ratikanta
   * @param error - this returns the error that occured while making http call
   * 
   * This method handles the error that occurs while making a http call
   */
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
