import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { FeedExpressionServiceProvider } from '../feed-expression-service/feed-expression-service';
import { OrderByTimeExpressionFromPipe } from '../../pipes/order-by-time-expression-from/order-by-time-expression-from';
import { MessageProvider } from '../message/message';
import { OrderByTimePipe } from '../../pipes/order-by-time/order-by-time';

/*
  Generated class for the SinglePatientSummaryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SinglePatientSummaryServiceProvider {

  babyBasicDetails: IBabyBasicDetails;
  typeDetails: ITypeDetails[] = [];

  constructor(public http: HttpClient, private datePipe: DatePipe,private storage: Storage,
    private feedExpressionService: FeedExpressionServiceProvider, private decimal: DecimalPipe,
    private messageService: MessageProvider) {
  }

  /**
 * This mthod is going to return all areas
 * @author Jagat
 * @since 0.0.1
 * @returns {Observable <ITypeDetails[]>} All areas
 * @memberof SinglePatientSummaryServiceProvider
 */
  fetchTypeDetails(): Observable <ITypeDetails[]> {
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
     return dates;
  }

  /**
   * This method will return all mother related data of sps
   *
   * @author Jagat Bandhu Sahoo
   * @author Naseem Akhtar
   * @since 1.1.0
   * @param deliveryDate
   * @param dischargeDate
   */
  async getMotherRelatedData(deliveryDate: any,dischargeDate: any,babyCode: string){
      // getting dates between delivery date and discharge date(if available) / current date
      let dates = await this.getAllDatesTillDate(deliveryDate,dischargeDate);

      // fetching all breastfeed expressions
      let bfExpressions: IBFExpression[] = await this.storage.get(ConstantProvider.dbKeyNames.bfExpressions);
      let expressions: IBFExpression[] = [];
      let motherRelatedDataList : IMotherRelatedData[] = [];

      //checking if expression available in the application, then find expressions for the selected baby.
      if(bfExpressions != null && bfExpressions.length > 0)
        expressions = bfExpressions.filter(d => d.babyCode === babyCode)

      //declaring variables
      let comeToVolume7Day = 'No';
      let comeToVolume14Day = 'No';
      let comeToVolume7DayCount = 0;
      let comeToVolume14DayCount = 0;

      let dummyData: IMotherRelatedData = {
        slNo: null,
        date: null,
        expAndBfEpisodePerday: null,
        ofWhichBf: null,
        totalDailyVolume: null,
        nightExp: null
      };
      /**
       * iterating through each date between delivery date and
       * discharge date(if available) / current date
       */
      for (let index = 0; index < dates.length; index++) {
        let milkComeInForSingleDay = false;
        let motherRelatedData: IMotherRelatedData = {
          slNo: index+1,
          date: null,
          expAndBfEpisodePerday: null,
          ofWhichBf: null,
          totalDailyVolume: null,
          nightExp: null
        };

        motherRelatedData.date = dates[index];

        //if length = 0, then set all values to '-'
        if(expressions.length > 0) {
          /**
           *finding expressions for a particular date and baby
           *if no expression found for that particular date then set all the mother
           *related values to '-'
           */
          let expressionByDate: IBFExpression[] = expressions.filter(d =>d.dateOfExpression === dates[index])
          if(expressionByDate.length > 0) {

            // ordering all the records, because we have to check consecutive records.
            expressionByDate = new OrderByTimeExpressionFromPipe().transform(expressionByDate)
            motherRelatedData.expAndBfEpisodePerday =  String(expressionByDate.length)

            let totalVolumeMilk = 0
            let nightExpressionCount = 0

            /**
             * checking if not the last record, then continue.
             * This iteraton is to calculate the expressions that happened next
             * day morning before 5 am.
             */
            if(dates.length - (index+1) > 0){
              let nextDayExpressions = expressions.filter(d =>d.dateOfExpression === dates[index+1])
              if(nextDayExpressions.length > 0){
                nextDayExpressions.forEach(d => {
                  let nextDayHour = parseInt(d.timeOfExpression.split(':')[0])
                  if(nextDayHour < 5)
                    nightExpressionCount++
                })
              }
            }

            let noOfBfExpression = 0;
            for (let i = 0; i < expressionByDate.length; i++) {

              //calculating no. of breast feed expressions that have occured for that day
              if(expressionByDate[i].methodOfExpression === ConstantProvider.typeDetailsIds.breastfeed)
                noOfBfExpression++

              //calculating AvgCount volume of milk for a particular day
              if(expressionByDate[i].volOfMilkExpressedFromLR != null)
                totalVolumeMilk = Number(expressionByDate[i].volOfMilkExpressedFromLR) + totalVolumeMilk

              /**
               * Calculating the night expressions that have occured in the present date
               * within 22:00 to 23:59 hours
               */
              let currentTime = expressionByDate[i].timeOfExpression;
              let hourCurrent = parseInt(currentTime.split(':')[0])
              if(hourCurrent > 21){
                  nightExpressionCount++
              }

              /**
               * The following block of code is to check the first 4 days of record
               * and compute the logic for come to volume for that particular day.
               */
              if(index <= 3 && expressionByDate[i].volOfMilkExpressedFromLR != null &&
                expressionByDate[i].volOfMilkExpressedFromLR > 20 && !milkComeInForSingleDay
                && ((expressionByDate.length - (i+1)) > 1)) {
                  let k = 0
                  let trueCount = 2
                  for (let j = i+1; j < expressionByDate.length; j++) {
                    if(expressionByDate[j].volOfMilkExpressedFromLR === null ||
                      expressionByDate[j].volOfMilkExpressedFromLR <= 20) {
                        trueCount--
                    }
                    if(k === 1)
                      break;
                    k++
                  }

                  if(trueCount === 2)
                    milkComeInForSingleDay = true
              }
            }

            if(index <= 3 && milkComeInForSingleDay === true)
              motherRelatedData.totalDailyVolume = 'Yes ('+ String(totalVolumeMilk) + ')'
            else if(index <= 3 && milkComeInForSingleDay === false)
              motherRelatedData.totalDailyVolume = 'No ('+ String(totalVolumeMilk) + ')'
            else
              motherRelatedData.totalDailyVolume = String(totalVolumeMilk)

            motherRelatedData.ofWhichBf = String(noOfBfExpression)
            motherRelatedData.nightExp = String(nightExpressionCount)

            if(index >3 && index < 7){
              if(totalVolumeMilk > 350)
                comeToVolume7DayCount++
            }

            let isConsecutive = true
            if(index > 3 && index < 14 && comeToVolume14DayCount < 3) {
              if(totalVolumeMilk > 500)
                comeToVolume14DayCount++
              else if(comeToVolume14DayCount > 0)
                comeToVolume14DayCount--
            }

          }else {
            motherRelatedData.expAndBfEpisodePerday = '-'
            motherRelatedData.ofWhichBf = '-'
            motherRelatedData.totalDailyVolume = '-';
            motherRelatedData.nightExp = '-';
          }

        }else{
          motherRelatedData.expAndBfEpisodePerday = '-'
          motherRelatedData.ofWhichBf = '-'
          motherRelatedData.totalDailyVolume = '-';
          motherRelatedData.nightExp = '-';
          comeToVolume7Day = '-';
          comeToVolume14Day = '-';
        }

        if(comeToVolume7DayCount > 2)
          comeToVolume7Day = 'Yes'

        if(comeToVolume14DayCount > 2)
          comeToVolume14Day = 'Yes';

        motherRelatedDataList.push(motherRelatedData)

        //preparing two new object in an array to push into mother related data array for
        //come to volume option
        if(index === 6 || index === 13)
          motherRelatedDataList.push(dummyData)
      }

      let obj = {
        motherRelatedList: motherRelatedDataList,
        comeToVolume7Day: comeToVolume7Day,
        comeToVolume14Day: comeToVolume14Day
      }

      return obj;
  }

  //Together Detail Code starts here

  /**
   * This method will return all together data of sps
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   * @param deliveryDate
   * @param dischargeDate
   * @param babyCode
   */
  async getTogetherData(deliveryDate: any,dischargeDate: any,babyCode: string){
      let dates = await this.getAllDatesTillDate(deliveryDate,dischargeDate);
      let bsfp: IBFSP[] = await this.storage.get(ConstantProvider.dbKeyNames.bfsps);
      let bsfpExpression: IBFSP[] = []
      let togetherDataList : ITogetherData[] = [];
      if(bsfp != null && bsfp.length > 0)
      bsfpExpression = bsfp.filter(d => d.babyCode === babyCode)
      let totalTimeInKMCTotal = 0;
      let totalQuantutyInKMCTotal = 0;
      let noOfOralCareCountTotal = 0;
      let noOfNNSCountTotal = 0;

      let totalTimeInKMCAvgCount = 0;
      let totalQuantutyInKMCAngCount = 0;
      let noOfOralCareCountAvgCount = 0;
      let noOfNNSCountAvgCount = 0;

        for (let index = 0; index < dates.length; index++) {
          let togetherData: ITogetherData = {
            date: null,
            dailyTotalTimeInKMC: null,
            noOfOralCare:null,
            noOfNNS: null
          }
          let countDailyTotalQuantityInKMC = 0;
          togetherData.date = dates[index];
          let totalTimeInKMC;
          let totalQuantutyInKMC;
          let noOfOralCareCount;
          let noOfNNSCount;

          if(bsfpExpression != null){

          totalTimeInKMC = bsfpExpression.filter(d =>d.dateOfBFSP === dates[index]
          && d.bfspPerformed == ConstantProvider.typeDetailsIds.kmc).length;

          if(totalTimeInKMC > 0){
            totalTimeInKMCTotal = totalTimeInKMC + totalTimeInKMCTotal
            totalTimeInKMCAvgCount++;
            totalTimeInKMC = String(totalTimeInKMC);
          }else{
            totalTimeInKMC = "-";
          }

          let dailyTotalTimeInKMC = bsfpExpression.filter(d =>d.dateOfBFSP === dates[index]
            && d.bfspPerformed == ConstantProvider.typeDetailsIds.kmc);
          for (let index = 0; index < dailyTotalTimeInKMC.length; index++) {
            if(dailyTotalTimeInKMC[index].bfspDuration != null){
              countDailyTotalQuantityInKMC = Number(dailyTotalTimeInKMC[index].bfspDuration) + countDailyTotalQuantityInKMC;
            }
          }

          if(countDailyTotalQuantityInKMC > 0){
            totalQuantutyInKMCTotal = countDailyTotalQuantityInKMC + totalQuantutyInKMCTotal;
            totalQuantutyInKMCAngCount++;
            totalQuantutyInKMC = String(countDailyTotalQuantityInKMC);
          }else{
            totalQuantutyInKMC = "-"
          }

          if(totalTimeInKMC == "-" && totalQuantutyInKMC == "-"){
            togetherData.dailyTotalTimeInKMC = "-";
          }else{
            togetherData.dailyTotalTimeInKMC = totalTimeInKMC+"("+totalQuantutyInKMC+")";
          }


          noOfOralCareCount= bsfpExpression.filter(d =>d.dateOfBFSP === dates[index]
          && d.bfspPerformed == ConstantProvider.typeDetailsIds.oral).length;

          if(noOfOralCareCount > 0){
            noOfOralCareCountTotal = noOfOralCareCount + noOfOralCareCountTotal
            noOfOralCareCountAvgCount++
            togetherData.noOfOralCare = String(noOfOralCareCount);
          }else{
            togetherData.noOfOralCare = "-";
          }

          noOfNNSCount= bsfpExpression.filter(d =>d.dateOfBFSP === dates[index]
          && d.bfspPerformed == ConstantProvider.typeDetailsIds.nns).length;

          if(noOfNNSCount > 0){
            noOfNNSCountTotal = noOfNNSCount + noOfNNSCountTotal
            noOfNNSCountAvgCount++
            togetherData.noOfNNS = String(noOfNNSCount);
          }else{
            togetherData.noOfNNS = "-";
          }
        }
        togetherDataList.push(togetherData);
        if(index+1 == dates.length){
          let togetherData: ITogetherData = {
            date: null,
            dailyTotalTimeInKMC: null,
            noOfOralCare:null,
            noOfNNS: null
          }
          togetherData.dailyTotalTimeInKMC = totalTimeInKMCAvgCount > 0?String(this.decimal.transform((totalTimeInKMCTotal/totalTimeInKMCAvgCount),'1.2-2')
          )+"("+String(this.decimal.transform((totalQuantutyInKMCTotal/totalQuantutyInKMCAngCount),'1.2-2')
          )+")":null;
          togetherData.noOfOralCare = noOfOralCareCountAvgCount > 0?String(this.decimal.transform((noOfOralCareCountTotal/noOfOralCareCountAvgCount),'1.2-2')
          ):null;
          togetherData.noOfNNS = noOfNNSCountAvgCount > 0?String(this.decimal.transform((noOfNNSCountTotal/noOfNNSCountAvgCount),'1.2-2')
          ):null;
          togetherDataList.push(togetherData);
        }
      }
      return togetherDataList;
  }

  //Infant related Detail Code starts here

  /**
   * This method will return all infant related data of sps
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   * @param deliveryDate
   * @param dischargeDate
   * @param babyCode
   */
  async getInfantRelatedData(deliveryDate: any,dischargeDate: any,babyCode: string,babyWeight: number){
    let dates = await this.getAllDatesTillDate(deliveryDate,dischargeDate);
    let feedData: IFeed[] = await this.storage.get(ConstantProvider.dbKeyNames.feedExpressions);
    let feedDataExpression: IFeed[] = [];
    let infantRelatedDataList : IInfantRelated[] = [];
    if(feedData != null && feedData.length > 0)
    feedDataExpression = feedData.filter(d => d.babyCode === babyCode)

    let dailyDoseOMMTotal = 0;
    let percentageOMMTotal = 0;
    let percentageDHMTotal = 0;
    let percentageFormulaTotal = 0;
    let percentageAnimalMilkTotal = 0;
    let percentageOtherTotal = 0;
    let percentageWeightTotal = 0;

    let dailyDoseOMMAvgCount = 0;
    let percentageOMMAvgCount = 0;
    let percentageDHMAvgCount = 0;
    let percentageFormulaAvgCount = 0;
    let percentageAnimalMilkAvgCount = 0;
    let percentageOtherAvgCount = 0;
    let percentageWeghtAvgCount = 0;

    for (let index = 0; index < dates.length; index++) {
      let infantRelatedData: IInfantRelated = {
        date: null,
        dailyDoseOMM: null,
        percentageOMM: null,
        percentageDHM: null,
        percentageFormula: null,
        percentageAnimalMilk: null,
        percentageOther: null,
        percentageWeght: null
      }
      infantRelatedData.date = dates[index];
      let dailyDoseOMM = 0;
      let dailyDHM = 0;
      let dailyFormula = 0;
      let dailyAnimalMilk = 0;
      let dailyOther = 0;
      let sumofTotalDailyfeed = 0;
      let latestbabyWeight = babyWeight;
      if(feedDataExpression != null){

      let oralCareVolume = feedDataExpression.filter(d =>d.dateOfFeed === dates[index])
      for (let i = 0; i < oralCareVolume.length; i++) {
        if(oralCareVolume[i].ommVolume != null)
        dailyDoseOMM = Number(oralCareVolume[i].ommVolume) + dailyDoseOMM;
      }

      for (let i = 0; i < oralCareVolume.length; i++) {
        if(oralCareVolume[i].dhmVolume != null)
        dailyDHM = Number(oralCareVolume[i].dhmVolume) + dailyDHM;
      }

      for (let i = 0; i < oralCareVolume.length; i++) {
        if(oralCareVolume[i].formulaVolume != null)
        dailyFormula = Number(oralCareVolume[i].formulaVolume) + dailyFormula;
      }

      for (let i = 0; i < oralCareVolume.length; i++) {
        if(oralCareVolume[i].animalMilkVolume != null)
        dailyAnimalMilk = Number(oralCareVolume[i].animalMilkVolume) + dailyAnimalMilk;
      }

      for (let i = 0; i < oralCareVolume.length; i++) {
        if(oralCareVolume[i].otherVolume != null)
        dailyOther = Number(oralCareVolume[i].otherVolume) + dailyOther;
      }

      //checking baby weight
      let weightExp = feedDataExpression.filter(d =>d.dateOfFeed === dates[index]);
      weightExp = new OrderByTimePipe().transform(weightExp)
      for (let i = 0; i < weightExp.length; i++) {
        if(weightExp[i].babyWeight != null && weightExp[i].babyWeight > 0){
          latestbabyWeight = (weightExp[i].babyWeight);
          babyWeight = latestbabyWeight;
          break;
        }
      }

      if(latestbabyWeight > 0){
        percentageWeightTotal = Number(latestbabyWeight) + percentageWeightTotal
        percentageWeghtAvgCount++
        infantRelatedData.percentageWeght = String(latestbabyWeight);
      }else{
        infantRelatedData.percentageWeght = "-";
      }

      if(dailyDoseOMM > 0 && latestbabyWeight != null){
        let dailyDoseOMMRound = this.decimal.transform((dailyDoseOMM/latestbabyWeight)*1000,'1.2-2');
        dailyDoseOMMTotal = Number(dailyDoseOMMRound) + dailyDoseOMMTotal
        dailyDoseOMMAvgCount++
        infantRelatedData.dailyDoseOMM = String(dailyDoseOMMRound);
      }else{
        infantRelatedData.dailyDoseOMM = "-";
      }

      sumofTotalDailyfeed = dailyDoseOMM + dailyDHM + dailyFormula + dailyAnimalMilk + dailyOther;

      if(dailyDoseOMM == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageOMM = "-";
      }else if(dailyDoseOMM == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageOMM = null;
      }else{
        let dailyDoseOMMRound = this.decimal.transform((dailyDoseOMM/sumofTotalDailyfeed)*100,'1.2-2');
        percentageOMMTotal = Number(dailyDoseOMMRound) + percentageOMMTotal
        percentageOMMAvgCount++
        infantRelatedData.percentageOMM = String(dailyDoseOMMRound);
      }

      if(dailyDHM == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageDHM = "-";
      }else if(dailyDHM == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageDHM = null;
      }else{
        let dailyDoseDHMRound = this.decimal.transform((dailyDHM/sumofTotalDailyfeed)*100,'1.2-2');
        percentageDHMTotal = Number(dailyDoseDHMRound) + percentageDHMTotal
        percentageDHMAvgCount++
        infantRelatedData.percentageDHM = String(dailyDoseDHMRound);
      }

      if(dailyFormula == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageFormula = "-";
      }else if(dailyFormula == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageFormula = null;
      }else{
        let dailyDoseFormulaRound = this.decimal.transform((dailyFormula/sumofTotalDailyfeed)*100,'1.2-2');
        percentageFormulaTotal = Number(dailyDoseFormulaRound) + percentageFormulaTotal
        percentageFormulaAvgCount++
        infantRelatedData.percentageFormula = String(dailyDoseFormulaRound);
      }

      if(dailyAnimalMilk == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageAnimalMilk = "-";
      }else if(dailyAnimalMilk == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageAnimalMilk = null;
      }else{
        let dailyDoseAnimalMilkRound = this.decimal.transform((dailyAnimalMilk/sumofTotalDailyfeed)*100,'1.2-2');
        percentageAnimalMilkTotal = Number(dailyDoseAnimalMilkRound) + percentageAnimalMilkTotal
        percentageAnimalMilkAvgCount++
        infantRelatedData.percentageAnimalMilk = String(dailyDoseAnimalMilkRound);
      }

      if(dailyOther == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageOther = "-";
      }else if(dailyOther == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageOther = null;
      }else{
        let dailyDoseOtherRound = this.decimal.transform((dailyOther/sumofTotalDailyfeed)*100,'1.2-2');
        percentageOtherTotal = Number(dailyDoseOtherRound) + percentageOtherTotal
        percentageOtherAvgCount++
        infantRelatedData.percentageOther = String(dailyDoseOtherRound);
      }
    }

    infantRelatedDataList.push(infantRelatedData)
    if(index+1 == dates.length){
      let infantRelatedData: IInfantRelated = {
        date: null,
        dailyDoseOMM: null,
        percentageOMM: null,
        percentageDHM: null,
        percentageFormula: null,
        percentageAnimalMilk: null,
        percentageOther: null,
        percentageWeght: null
      }
      infantRelatedData.dailyDoseOMM = dailyDoseOMMAvgCount > 0?String(this.decimal.transform((dailyDoseOMMTotal/dailyDoseOMMAvgCount),'1.2-2')):null;
      infantRelatedData.percentageOMM = percentageOMMAvgCount > 0?String(this.decimal.transform((percentageOMMTotal/percentageOMMAvgCount),'1.2-2')):null;
      infantRelatedData.percentageDHM = percentageDHMAvgCount > 0?String(this.decimal.transform((percentageDHMTotal/percentageDHMAvgCount),'1.2-2')):null;
      infantRelatedData.percentageFormula = percentageFormulaAvgCount > 0?String(this.decimal.transform((percentageFormulaTotal/percentageFormulaAvgCount),'1.2-2')):null;
      infantRelatedData.percentageAnimalMilk = percentageAnimalMilkAvgCount > 0?String(this.decimal.transform((percentageAnimalMilkTotal/percentageAnimalMilkAvgCount),'1.2-2')):null;
      infantRelatedData.percentageOther = percentageOtherAvgCount > 0?String(this.decimal.transform((percentageOtherTotal/percentageOtherAvgCount),'1.2-2')):null;
      infantRelatedData.percentageWeght = percentageWeghtAvgCount > 0?String(this.decimal.transform((percentageWeightTotal/percentageWeghtAvgCount),'1.2-2')):null;
      infantRelatedDataList.push(infantRelatedData)
    }

    }
    return infantRelatedDataList;
  }

  //Basic Baby Detail Code starts here


  /**
   * This service method is called as soon as user taps on single patient summary of any baby.
   * This service will compute basic data of seleted baby and return it to the basic page for
   * rendering. (Basic page of SPS is loaded by default)
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @param babyDetails - Registration details of baby which the user has selected
   * @param typeDetails - to fetch the dropdown options
   */
  setBabyDetails(babyDetails: IPatient, typeDetails: ITypeDetails[]) {
    //initializing the baby details variable
    this.resetBasicBabyDetails();
    this.babyBasicDetails.deliveryDate = babyDetails.deliveryDate;
    this.babyBasicDetails.dischargeDate = babyDetails.dischargeDate;
    this.babyBasicDetails.weight = babyDetails.babyWeight;
    this.babyBasicDetails.admissionDateForOutdoorPatients = babyDetails.admissionDateForOutdoorPatients;

    //finding the value for the id of baby admitted to in type details array
    this.babyBasicDetails.babyAdmittedTo = (babyDetails.babyAdmittedTo != null && babyDetails.babyAdmittedTo.toString() != '') ?
      typeDetails[typeDetails.findIndex(d => d.id === babyDetails.babyAdmittedTo)].name : null;
    this.babyBasicDetails.babyCode = babyDetails.babyCode;

    //finding delivery method name in type details array
    this.babyBasicDetails.deliveryMethod = (babyDetails.deliveryMethod != null && babyDetails.deliveryMethod.toString() != '') ?
      typeDetails[typeDetails.findIndex(d => d.id === babyDetails.deliveryMethod)].name : null;

    this.babyBasicDetails.gestationalAgeInWeek = babyDetails.gestationalAgeInWeek;

    //finding inpatient or outpatient in type details array
    this.babyBasicDetails.inpatientOrOutPatient = (babyDetails.inpatientOrOutPatient != null && babyDetails.inpatientOrOutPatient.toString() != '') ?
      typeDetails[typeDetails.findIndex(d => d.id === babyDetails.inpatientOrOutPatient)].name : null;

    this.babyBasicDetails.mothersPrenatalIntent = (babyDetails.mothersPrenatalIntent != null && babyDetails.mothersPrenatalIntent.toString() != '') ?
      typeDetails[typeDetails.findIndex(d => d.id === babyDetails.mothersPrenatalIntent)].name : null;

    this.babyBasicDetails.parentsInformedDecision = (babyDetails.parentsKnowledgeOnHmAndLactation != null && babyDetails.parentsKnowledgeOnHmAndLactation.toString() != '') ?
      typeDetails[typeDetails.findIndex(d => d.id === babyDetails.parentsKnowledgeOnHmAndLactation)].name : null;

      //As reasons can be multiple so extracting each reason id and iterating through typedetail to get its name.
    let x = (babyDetails.nicuAdmissionReason != null && babyDetails.nicuAdmissionReason.toString() != '') ? babyDetails.nicuAdmissionReason.toString().split(',') : null;
    if(x != null && x.length > 0){
      for (let index = 0; index < x.length; index++) {
        this.babyBasicDetails.reasonForAdmission += typeDetails[typeDetails.findIndex(d => d.id === +x[index])].name + ", ";
      }
      this.babyBasicDetails.reasonForAdmission = this.babyBasicDetails.reasonForAdmission.slice(0, this.babyBasicDetails.reasonForAdmission.length - 2);
    }

    /**
     * time till first enteral feed can be known by accessing the log feeds for that baby.
     * hence the feed service is being called and then data is being set.
     * compositionOfFirstEnteralFeed and time spent in NICU  is also being set
     */
    this.feedExpressionService.getTimeTillFirstEnteralFeed(babyDetails.babyCode,babyDetails.deliveryDate,
      babyDetails.deliveryTime)
      .then(data=>{
        if(data){
          this.babyBasicDetails.timeTillFirstEnteralFeed  = data.timeTillFirstEnteralFeed;
          this.babyBasicDetails.compositionOfFirstEnteralFeed = data.compositionOfFirstEnteralFeed;

          this.babyBasicDetails.timeSpentInNicu = data.timeSpentInNICU;
        }
      })

      //setting days spent in hospital, discharge date - delivery date
    if(babyDetails.dischargeDate != null && babyDetails.dischargeDate != ''){
      let tempDateSplitter = babyDetails.dischargeDate.split('-');
      let tempDeliveryDate = babyDetails.deliveryDate.split('-');

      let tempDischargeDate = new Date(+tempDateSplitter[2],+tempDateSplitter[1]-1,+tempDateSplitter[0]);
      let deliveryDate = new Date(+tempDeliveryDate[2],+tempDeliveryDate[1]-1,+tempDeliveryDate[0])
      let diff = Math.abs(tempDischargeDate.getTime() - deliveryDate.getTime());
      let diffDays = Math.ceil(diff / (1000 * 3600 * 24));

      this.babyBasicDetails.timeSpentInHospital = diffDays+1;
    }

      //checking if time in hour and time in minute are present then only display the time
    let tempTimeTillFirstExpHrs = '00'
    let tempTimeTillFirstExpMin = '00'
    if(babyDetails.timeTillFirstExpressionInHour != null && babyDetails.timeTillFirstExpressionInHour != '')
      tempTimeTillFirstExpHrs = babyDetails.timeTillFirstExpressionInHour

    if(babyDetails.timeTillFirstExpressionInMinute != null && babyDetails.timeTillFirstExpressionInMinute != '')
      tempTimeTillFirstExpMin = babyDetails.timeTillFirstExpressionInMinute

    this.babyBasicDetails.timeTillFirstExpression = tempTimeTillFirstExpHrs + ':' + tempTimeTillFirstExpMin

    this.typeDetails = typeDetails

    return this.babyBasicDetails;
  }

  /**
   * @author - Naseem Akhtar
   * @since - 1.0.1
   * If other tabs in the single patient summary need baby details,
   * they can fetch it through this method
   * baby details is being set when basic page is loaded.
   */
  getBabyDetails() {
    return this.babyBasicDetails
  }

  /**
   * @author - Naseem Akhtar
   * @since - 1.0.1
   * If other tabs in the single patient summary need type details,
   * they can fetch it through this method
   * Type details is being set when basic page is loaded.
   */
  getTypeDetails() {
    return this.typeDetails
  }

  // Exclusive BF code starts from here.

  /**
   * This method will structure the data coming in for display in the exclusive breastfeed page
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @param bfpdList - list of bf that can be captured after discharge
   * @param bfpdBabyData - no of records for the selected child or baby
   */
  fetchSpsExclusiveBfData(bfpdList: ITypeDetails[], bfpdBabyData: IBFPD[], babyDetails: IPatient) {
    let exclusiveBfList: IExclusiveBf[] = [];
    let typeDetails = this.getTypeDetails();

    /**
     * if data present for, then find the data for particular time frame and set
     * them accordinlgy.
     *
     * else set null in all the time frame.
     */

    if(bfpdBabyData.length > 0){
      bfpdList.forEach(a => {
        let b: IBFPD = bfpdBabyData.find(c => c.timeOfBreastFeeding === a.id)
        let c: IExclusiveBf = {
          name: a.name,
          date: b != undefined ? b.dateOfBreastFeeding : null,
          status: (b != undefined && b.breastFeedingStatus != null)
            ? typeDetails.find(d => d.id === b.breastFeedingStatus).name : null
        }
        exclusiveBfList.push(c);
      })
    }else{
      bfpdList.forEach(a => {
        let b: IExclusiveBf = {
          name: a.name,
          date: null,
          status: null
        }
        exclusiveBfList.push(b);
      })
    }

    //Adding hospital discharge exclusively as it is not present in the above list
    let hospitalDischarge: IExclusiveBf = {
      name: 'Hospital discharge',
      date: null,
      status: null
    }

    if(babyDetails.dischargeDate != null && babyDetails.dischargeDate != ''){
      hospitalDischarge.date = babyDetails.dischargeDate
      this.feedExpressionService.getHospitalDischargeDataForExclusiveBf(babyDetails.babyCode,
        babyDetails.dischargeDate)
        .then(data => hospitalDischarge.status = data)
        .catch(error => this.messageService.showErrorToast(error))
    }

    exclusiveBfList.splice(0,0,hospitalDischarge)

    return exclusiveBfList;
  }

  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * resetting basic baby details.
   */
  resetBasicBabyDetails(){
    this.babyBasicDetails = {
      babyCode: null,
      gestationalAgeInWeek: null,
      deliveryMethod: null,
      inpatientOrOutPatient: null,
      parentsInformedDecision: null,
      timeTillFirstExpression: null,
      timeTillFirstEnteralFeed: null,
      admissionDateForOutdoorPatients: null,
      mothersPrenatalIntent: null,
      compositionOfFirstEnteralFeed: null,
      babyAdmittedTo: null,
      reasonForAdmission: '',
      timeSpentInNicu: null,
      timeSpentInHospital: null,
      createdDate: null,
      updatedDate: null,
      createdBy: null,
      updatedBy: null,
      deliveryDate: null,
      dischargeDate: null,
      weight: null
    };
  }

}
