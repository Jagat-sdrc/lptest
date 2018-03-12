import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';

/*
  Generated class for the SinglePatientSummaryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SinglePatientSummaryServiceProvider {

  constructor(public http: HttpClient, private datePipe: DatePipe,private storage: Storage) {
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

  /**
   * This method is will return the list of dates calculated from the given parameters.
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   * @param deliveryDate
   * @param dischargeDate
   */
  async getAllDatesTillDate(deliveryDate: any,dischargeDate: any){
    let dates: string[] = [];
    let noOfDay;
    let currentDate = this.datePipe.transform(new Date(),"dd-MM-yyyy");

    let dayOfA = parseInt(deliveryDate.split('-')[0])
    let monthOfA = parseInt(deliveryDate.split('-')[1])-1
    let yearOfA = parseInt(deliveryDate.split('-')[2])

      if(dischargeDate != "" && dischargeDate != null){

        let dayOfB = parseInt(dischargeDate.split('-')[0])
        let monthOfB = parseInt(dischargeDate.split('-')[1])-1
        let yearOfB = parseInt(dischargeDate.split('-')[2])

        let dateOfA: Date = new Date(yearOfA, monthOfA, dayOfA)
        let dateOfB: Date = new Date(yearOfB, monthOfB, dayOfB)

        noOfDay = dateOfB.getTime() - dateOfA.getTime()

      }else{

        let dayOfB = parseInt(currentDate.split('-')[0])
        let monthOfB = parseInt(currentDate.split('-')[1])-1
        let yearOfB = parseInt(currentDate.split('-')[2])

        let dateOfA: Date = new Date(yearOfA, monthOfA, dayOfA)
        let dateOfB: Date = new Date(yearOfB, monthOfB, dayOfB)

        noOfDay = dateOfB.getTime() - dateOfA.getTime()
      }

      let noOfDays = (noOfDay / (1000*60*60*24))
      noOfDays++;

      for (let index = 0; index < noOfDays; index++) {
        dates.push(deliveryDate)

        let dayOf = parseInt(deliveryDate.split('-')[0])
        let monthOf = parseInt(deliveryDate.split('-')[1])-1
        let yearOf= parseInt(deliveryDate.split('-')[2])

        var myDates = new Date(yearOf,monthOf,dayOf);
        var nextDay = new Date(myDates);
        deliveryDate = this.datePipe.transform(nextDay.setDate(myDates.getDate()+1),"dd-MM-yyyy")
      }
      console.log(dates);
     return dates;
  }

  /**
   * This method will return all mother related data in promise
   *
   * @author Jagat Bandhu Sahoo
   * @since 1.1.0
   * @param deliveryDate
   * @param dischargeDate
   */
  async getMotherRelatedData(deliveryDate: any,dischargeDate: any,babyCode: string){
      let dates = await this.getAllDatesTillDate(deliveryDate,dischargeDate);
      let expressions = await this.storage.get(ConstantProvider.dbKeyNames.bfExpressions);
      let motherRelatedDataList : IMotherRelatedData[] = [];

      for (let index = 0; index < dates.length; index++) {
        let motherRelatedData: IMotherRelatedData = {
          date: "",
          expAndBfEpisodPerday: 0,
          ofWhichBf: 0,
          totalDailyVolumn: 0,
          nightExp: 0
        }
        motherRelatedData.date = dates[index];
        motherRelatedData.expAndBfEpisodPerday = (expressions as IBFExpression[]).filter(d =>d.babyCode === babyCode && d.dateOfExpression === dates[index]).length
        motherRelatedData.ofWhichBf = (expressions as IBFExpression[]).filter(d =>d.babyCode === babyCode && d.dateOfExpression === dates[index] &&
        d.methodOfExpression == ConstantProvider.typeDetailsIds.breastfeed).length
        let totalExpression = (expressions as IBFExpression[]).filter(d =>d.babyCode === babyCode && d.dateOfExpression === dates[index])
        let totalVolumeMilk = 0;
        let count = 0;
        for (let index = 0; index < totalExpression.length; index++) {
          if(totalExpression[index].volOfMilkExpressedFromLR != null){
            totalVolumeMilk = parseInt(totalExpression[index].volOfMilkExpressedFromLR) + totalVolumeMilk;
          }
          console.log(totalExpression[index].timeOfExpression)
          let startTime = '22:00';
          let  endTime = '04:00';

          let currentTime = totalExpression[index].timeOfExpression;

          let hourCurrent = parseInt(currentTime.split(':')[0])
          if(hourCurrent > 21 || hourCurrent < 5){
            count++
          }
        }
        motherRelatedData.totalDailyVolumn = totalVolumeMilk;
        motherRelatedData.nightExp = count;
        motherRelatedDataList.push(motherRelatedData)
      }

      return motherRelatedDataList;
  }


}
