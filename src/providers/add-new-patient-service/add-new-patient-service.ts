import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';

/**
 * This service will only provide service to Feed component
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@Injectable()
export class AddNewPatientServiceProvider {

  constructor(public http: HttpClient) {
  }

  /**
   * This method should return feeding method lists
   * 
   * @author Jagat Bandhu
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewPatientServiceProvider
   */
   getDeliveryMethod(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.DeliveryMethodTypeIds.deliveryMethodTypeId)
           })
        .catch(this.handleError);
  }

  getMotherParenatalMilk(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.MotherPrenatalMilkTypeIds.motherPrenatalMilkTypeId)
           })
        .catch(this.handleError);
  }

  getHmAndLactation(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.HmAndLactationTypeIds.hmAndLactationTypeId)
           })
        .catch(this.handleError);
  }

  getInpatientOutpatient(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.InpatientoutpatientTypeIds.inpatientoutpatientTypeId)
           })
        .catch(this.handleError);
  }

  getBabyAdmittedTo(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.BabyAdmittedToTypeIds.babyAdmittedToTypeId)
           })
        .catch(this.handleError);
  }

  getNICAdmissionReason(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.NICAdmissionReasonTypeIds.nicAdmissionReasonTypeId)
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
