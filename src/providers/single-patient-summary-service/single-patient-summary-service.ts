import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { FeedExpressionServiceProvider } from '../feed-expression-service/feed-expression-service';

/*
  Generated class for the SinglePatientSummaryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SinglePatientSummaryServiceProvider {

  babyBasicDetails: IBabyBasicDetails = {
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
  typeDetails: ITypeDetails[] = [];

  constructor(public http: HttpClient, private datePipe: DatePipe,private storage: Storage,
    private feedExpressionService: FeedExpressionServiceProvider, private decimal: DecimalPipe) {
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
      console.log(dates);
     return dates;
  }

  /**
   * This method will return all mother related data of sps
   *
   * @author Jagat Bandhu Sahoo
   * @since 1.1.0
   * @param deliveryDate
   * @param dischargeDate
   */
  async getMotherRelatedData(deliveryDate: any,dischargeDate: any,babyCode: string){
      let dates = await this.getAllDatesTillDate(deliveryDate,dischargeDate);
      let bfExpressions: IBFExpression[] = await this.storage.get(ConstantProvider.dbKeyNames.bfExpressions);
      let expressions: IBFExpression[] = [];
      let motherRelatedDataList : IMotherRelatedData[] = [];
      if(bfExpressions != null && bfExpressions.length > 0)
        expressions = bfExpressions.filter(d => d.babyCode === babyCode)


        for (let index = 0; index < dates.length; index++) {
          let motherRelatedData: IMotherRelatedData = {
            date: null,
            expAndBfEpisodPerday: null,
            ofWhichBf: null,
            totalDailyVolumn: null,
            nightExp: null
          };
          motherRelatedData.date = dates[index];

          if(expressions != null){
            motherRelatedData.expAndBfEpisodPerday = expressions.filter(d =>d.dateOfExpression === dates[index]).length
            motherRelatedData.ofWhichBf = expressions.filter(d =>d.dateOfExpression === dates[index] &&
            d.methodOfExpression == ConstantProvider.typeDetailsIds.breastfeed).length
            let totalExpression = (expressions as IBFExpression[]).filter(d =>d.babyCode === babyCode && d.dateOfExpression === dates[index])
            let totalVolumeMilk = 0;
            let count = 0;
            for (let index = 0; index < totalExpression.length; index++) {
              if(totalExpression[index].volOfMilkExpressedFromLR != null){
                totalVolumeMilk = Number(totalExpression[index].volOfMilkExpressedFromLR) + totalVolumeMilk;
              }
              let currentTime = totalExpression[index].timeOfExpression;

              let hourCurrent = parseInt(currentTime.split(':')[0])
              if(hourCurrent > 21 || hourCurrent < 5){
                count++
              }
            }
            motherRelatedData.totalDailyVolumn = totalVolumeMilk;
            motherRelatedData.nightExp = count;
          }
        motherRelatedDataList.push(motherRelatedData)
      }
      return motherRelatedDataList;
  }

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

        for (let index = 0; index < dates.length; index++) {
          let togetherData: ITogetherData = {
            date: null,
            dailyTotalTimeInKMC: null,
            dailyTotalQuantityInKMC: null,
            noOfOralCare:null,
            noOfNNS: null
          }
          let countDailyTotalQuantityInKMC = 0;
          togetherData.date = dates[index];
          if(bsfpExpression != null){
          togetherData.dailyTotalTimeInKMC = bsfpExpression.filter(d =>d.dateOfBFSP === dates[index]
          && d.bfspPerformed == ConstantProvider.typeDetailsIds.kmc).length;

          let dailyTotalTimeInKMC = bsfpExpression.filter(d =>d.dateOfBFSP === dates[index]
            && d.bfspPerformed == ConstantProvider.typeDetailsIds.kmc);
          for (let index = 0; index < dailyTotalTimeInKMC.length; index++) {
            if(dailyTotalTimeInKMC[index].bfspDuration != null){
              countDailyTotalQuantityInKMC = Number(dailyTotalTimeInKMC[index].bfspDuration) + countDailyTotalQuantityInKMC;
            }
          }
          togetherData.dailyTotalQuantityInKMC = countDailyTotalQuantityInKMC;

          togetherData.noOfOralCare = bsfpExpression.filter(d =>d.dateOfBFSP === dates[index]
          && d.bfspPerformed == ConstantProvider.typeDetailsIds.oral).length;

          togetherData.noOfNNS = bsfpExpression.filter(d =>d.dateOfBFSP === dates[index]
          && d.bfspPerformed == ConstantProvider.typeDetailsIds.nns).length;
        }
        togetherDataList.push(togetherData);
      }
      return togetherDataList;
  }

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

      let ommVolume = feedDataExpression.filter(d =>d.dateOfFeed === dates[index] &&
      (d.methodOfFeed === ConstantProvider.typeDetailsIds.parenteralEnteral ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOnly ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOral));
      for (let i = 0; i < ommVolume.length; i++) {
        if(ommVolume[i].ommVolume != null)
        dailyDoseOMM = Number(ommVolume[i].ommVolume) + dailyDoseOMM;
      }

      let dhmVolume = feedDataExpression.filter(d =>d.dateOfFeed === dates[index] &&
      (d.methodOfFeed === ConstantProvider.typeDetailsIds.parenteralEnteral ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOnly ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOral));
      for (let i = 0; i < dhmVolume.length; i++) {
        if(dhmVolume[i].dhmVolume != null)
        dailyDHM = Number(dhmVolume[i].dhmVolume) + dailyDHM;
      }

      let formulaVolume = feedDataExpression.filter(d =>d.dateOfFeed === dates[index] &&
      (d.methodOfFeed === ConstantProvider.typeDetailsIds.parenteralEnteral ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOnly ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOral));
      for (let i = 0; i < formulaVolume.length; i++) {
        if(formulaVolume[i].formulaVolume != null)
        dailyFormula = Number(formulaVolume[i].formulaVolume) + dailyFormula;
      }

      let animalMilkVolume = feedDataExpression.filter(d =>d.dateOfFeed === dates[index] &&
      (d.methodOfFeed === ConstantProvider.typeDetailsIds.parenteralEnteral ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOnly ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOral));
      for (let i = 0; i < animalMilkVolume.length; i++) {
        if(animalMilkVolume[i].animalMilkVolume != null)
        dailyAnimalMilk = Number(animalMilkVolume[i].animalMilkVolume) + dailyAnimalMilk;
      }

      let otherVolume = feedDataExpression.filter(d =>d.dateOfFeed === dates[index] &&
      (d.methodOfFeed === ConstantProvider.typeDetailsIds.parenteralEnteral ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOnly ||
      d.methodOfFeed === ConstantProvider.typeDetailsIds.enteralOral));
      for (let i = 0; i < otherVolume.length; i++) {
        if(otherVolume[i].otherVolume != null)
        dailyOther = Number(otherVolume[i].otherVolume) + dailyOther;
      }

      //checking baby weight
      let weightExp = feedDataExpression.filter(d =>d.dateOfFeed === dates[index]);
      for (let i = 0; i < weightExp.length; i++) {
        if(weightExp[i].babyWeight != null && weightExp[i].babyWeight > 0){
          latestbabyWeight = (weightExp[i].babyWeight);
          babyWeight = latestbabyWeight;
          break;
        }
      }

      if(latestbabyWeight > 0){
        infantRelatedData.percentageWeght = latestbabyWeight.toString();
      }else{
        infantRelatedData.percentageWeght = "-";
      }

      if(dailyDoseOMM > 0 && latestbabyWeight != null){
        let dailyDoseOMMRound = this.decimal.transform((dailyDoseOMM/latestbabyWeight)*1000,'1.2-2');
        infantRelatedData.dailyDoseOMM = dailyDoseOMMRound.toString();
      }else{
        infantRelatedData.dailyDoseOMM = "-";
      }

      sumofTotalDailyfeed = dailyDoseOMM + dailyDHM + dailyFormula + dailyAnimalMilk + dailyOther;

      if(dailyDoseOMM == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageOMM = "-";
      }else if(dailyDoseOMM == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageOMM = "";
      }else{
        infantRelatedData.percentageOMM = ((dailyDoseOMM/sumofTotalDailyfeed)*100).toString();
      }

      if(dailyDHM == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageDHM = "-";
      }else if(dailyDHM == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageDHM = "";
      }else{
        infantRelatedData.percentageDHM = ((dailyDHM/sumofTotalDailyfeed)*100).toString();
      }

      if(dailyFormula == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageFormula = "-";
      }else if(dailyFormula == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageFormula = "";
      }else{
        infantRelatedData.percentageFormula = ((dailyFormula/sumofTotalDailyfeed)*100).toString();
      }

      if(dailyAnimalMilk == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageAnimalMilk = "-";
      }else if(dailyAnimalMilk == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageAnimalMilk = "";
      }else{
        infantRelatedData.percentageAnimalMilk = ((dailyAnimalMilk/sumofTotalDailyfeed)*100).toString();
      }

      if(dailyOther == 0 && sumofTotalDailyfeed == 0){
        infantRelatedData.percentageOther = "-";
      }else if(dailyOther == 0 && sumofTotalDailyfeed > 0){
        infantRelatedData.percentageOther = "";
      }else{
        infantRelatedData.percentageOther = ((dailyOther/sumofTotalDailyfeed)*100).toString();
      }
    }

    infantRelatedDataList.push(infantRelatedData)

    }
    return infantRelatedDataList;
  }

  //Basic Baby Detail Code starts here


  /**
   * @author - Naseem Akhtar (naseem@sdrc.co.in)
   * @param babyDetails - Registration details of baby which the user has selected
   * @param typeDetails - to fetch the dropdown options
   */
  setBabyDetails(babyDetails: IPatient, typeDetails: ITypeDetails[]) {
    this.babyBasicDetails.deliveryDate = babyDetails.deliveryDate;
    this.babyBasicDetails.dischargeDate = babyDetails.dischargeDate;
    this.babyBasicDetails.weight = babyDetails.babyWeight;
    this.babyBasicDetails.admissionDateForOutdoorPatients = babyDetails.admissionDateForOutdoorPatients;
    this.babyBasicDetails.babyAdmittedTo = (babyDetails.babyAdmittedTo != null && babyDetails.babyAdmittedTo.toString() != '') ?
      typeDetails[typeDetails.findIndex(d => d.id === babyDetails.babyAdmittedTo)].name : null;
    this.babyBasicDetails.babyCode = babyDetails.babyCode;
    this.babyBasicDetails.compositionOfFirstEnteralFeed = 0;
    // this.babyBasicDetails.createdBy
    // this.babyBasicDetails.createdDate
    this.babyBasicDetails.deliveryMethod = (babyDetails.deliveryMethod != null && babyDetails.deliveryMethod.toString() != '') ?
      typeDetails[typeDetails.findIndex(d => d.id === babyDetails.deliveryMethod)].name : null;

    this.babyBasicDetails.gestationalAgeInWeek = babyDetails.gestationalAgeInWeek;
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

    this.babyBasicDetails.timeSpentInHospital = null
    this.babyBasicDetails.timeSpentInNicu = null

    this.feedExpressionService.getTimeTillFirstEnteralFeed(babyDetails.babyCode,babyDetails.deliveryDate,babyDetails.deliveryTime)
      .then(data=>{
        if(data){
          this.babyBasicDetails.timeTillFirstEnteralFeed  = data
        }
      })

      //checking if time in hour and time in minute are present then only display the time
    if((babyDetails.timeTillFirstExpressionInHour != null && babyDetails.timeTillFirstExpressionInHour != '') &&
      (babyDetails.timeTillFirstExpressionInMinute != null && babyDetails.timeTillFirstExpressionInMinute != ''))
      this.babyBasicDetails.timeTillFirstExpression = babyDetails.timeTillFirstExpressionInHour + ':' + babyDetails.timeTillFirstExpressionInMinute;

    this.typeDetails = typeDetails

    return this.babyBasicDetails;
  }

  /**
   * @author - Naseem Akhtar
   * @since - 1.0.1
   * If other tabs in the single patient summary need baby details,
   * they can fetch it through this method
   */
  getBabyDetails() {
    return this.babyBasicDetails
  }

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
  fetchSpsExclusiveBfData(bfpdList: ITypeDetails[], bfpdBabyData: IBFPD[]) {
    let exclusiveBfList: IExclusiveBf[] = [];
    let typeDetails = this.getTypeDetails();
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

    return exclusiveBfList;
  }

}
