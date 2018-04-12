import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConstantProvider } from '../constant/constant';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { HttpErrorResponse } from '@angular/common/http/src/response';

/**
 * @author - Subhadarshini Patra
 * @since - 0.0.1
 * 
 * This service helps to fetch the drop down options for breast feed expression forms. 
 */
@Injectable()
export class AddNewExpressionBfServiceProvider {

  constructor(public http: HttpClient) {
  }
/**
   * This method should return method of BF expression lists
   * 
   * @author Subhadarshini Patra
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewExpressionBfServiceProvider
   */
  getMethodOfExpressionBF(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.MethodOfExpressionBfTypeId.methodOfExpressionBfTypeId)
           })
        .catch(this.handleError);
  }
  /**
   * This method should return location of expression lists
   * 
   * @author Subhadarshini Patra
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewExpressionBfServiceProvider
   */
  getLocationOfExpressionBF(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.LocationOfExpressionBfTypeId.locationOfExpressionBfTypeId)
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
