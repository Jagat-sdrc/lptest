import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import "rxjs/Rx";
import { ConstantProvider } from '../constant/constant';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

/**
 * This service will only provide service to Feed component
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class FeedExpressionServiceProvider {

  constructor(public http: HttpClient) {   
  }

  

  /**
   * This method should return feeding method lists
   * 
   * @author Ratikanta
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof FeedExpressionServiceProvider
   */
  getFeedingMethods(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.FeedingTypeIds.feedingMethodTypeId)
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
