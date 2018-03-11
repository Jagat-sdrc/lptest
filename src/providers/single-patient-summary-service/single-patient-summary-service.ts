import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { DatePipe } from '@angular/common';

/*
  Generated class for the SinglePatientSummaryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SinglePatientSummaryServiceProvider {

  constructor(public http: HttpClient, private datePipe: DatePipe) {
    console.log('Hello SinglePatientSummaryServiceProvider Provider');
  }

  /**
 * This mthod is going to return all areas
 * @author Jagat
 * @since 0.0.1
 * @returns {Observable <ITypeDetails[]>} All areas
 * @memberof SinglePatientSummaryServiceProvider
 */
  getTypeDetails(): Observable <ITypeDetails[]>{
    return this.http.get("./assets/data.json").map((response: Response) => {
      return (response as any).typeDetails
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

  getAllDatesTillDate(deliveryDate: any,dischargeDate: any){
    let dates = [];
    let noOfDay;
    let currentDate = this.datePipe.transform(new Date(),"dd-MM-yyyy");

    let dayOfA = parseInt(deliveryDate.split('-')[0])
    let monthOfA = parseInt(deliveryDate.split('-')[1])
    let yearOfA = parseInt(deliveryDate.split('-')[2])

    if(dischargeDate != "" && dischargeDate != null){

      let dayOfB = parseInt(dischargeDate.split('-')[0])
      let monthOfB = parseInt(dischargeDate.split('-')[1])
      let yearOfB = parseInt(dischargeDate.split('-')[2])
  
      let dateOfA: Date = new Date(yearOfA, monthOfA, dayOfA)
      let dateOfB: Date = new Date(yearOfB, monthOfB, dayOfB)
  
      noOfDay = dateOfB.getTime() - dateOfA.getTime()
      

    }else{

      let dayOfB = parseInt(currentDate.split('-')[0])
      let monthOfB = parseInt(currentDate.split('-')[1])
      let yearOfB = parseInt(currentDate.split('-')[2])
  
      let dateOfA: Date = new Date(yearOfA, monthOfA, dayOfA)
      let dateOfB: Date = new Date(yearOfB, monthOfB, dayOfB)
  
      noOfDay = dateOfB.getTime() - dateOfA.getTime()
    }

      let noOfDays = ((noOfDay / (1000*60*60*24)) % 7)
      noOfDays++;
      console.log(noOfDays)
      
      for (let index = 0; index < noOfDays; index++) {
        dates.push(deliveryDate)
        deliveryDate = this.datePipe.transform(deliveryDate,"dd-MM-yyyy")
        var myDates = new Date(deliveryDate);
        var nextDay = new Date(myDates);
        deliveryDate = this.datePipe.transform(nextDay.setDate(myDates.getDate()+1),"dd-MM-yyyy")
      }
      console.log("dates: "+dates);
      
  }


}
