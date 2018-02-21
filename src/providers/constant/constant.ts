import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * This component will keep all the constant values
 * @author Ratikanta 
 * @since 0.0.1 
 */
@Injectable()
export class ConstantProvider {

  /*
  validation messages
  @author:subhadarshani@sdrc.co.in
*/
  
  static DeliveryMethodTypeIds: IDeliveryMethods = {
    deliveryMethodTypeId: 1
  }

  static MotherPrenatalMilkTypeIds: IMotherPrenatalMilk = {
    motherPrenatalMilkTypeId: 2
  }

  static HmAndLactationTypeIds: IHmAndLactation = {
    hmAndLactationTypeId: 3
  }

  static InpatientoutpatientTypeIds: IInpatientoutpatient = {
    inpatientoutpatientTypeId: 4
  }

  static BabyAdmittedToTypeIds: IBabyAdmittedTo = {
    babyAdmittedToTypeId: 5
  }

  static NICAdmissionReasonTypeIds: INICAdmissionReason = {
    nicAdmissionReasonTypeId: 6
  }

  static MethodOfExpressionBfTypeId: IMethodOfExpressionBF = {
    methodOfExpressionBfTypeId: 7
  }

  static LocationOfExpressionBfTypeId: ILocationOfExpressionBF = {
    locationOfExpressionBfTypeId: 8
  }

  static BFSupportivePracticesTypeId: IBFSupportivePractices = {
    bfSupportivePracticesTypeId: 9
  }

  static PersonWhoPerformedBSFPTypeId: IPersonWhoPerformedBSFP = {
    personWhoPerformedBSFPTypeId: 10
  }

  static FeedingTypeIds: IFeedingMethods = {
    feedingMethodTypeId: 11,
    locationOfFeeding: 14
  }

  static TimeOfBreastFeedingPostDischargeTypeId: ITimeOfBreastFeedingPostDischarge = {
    timeOfBreastFeedingPostDischargeTypeId: 12
  }

  static BFStatusPostDischargeTypeId: IBFStatusPostDischarge = {
    bfStatusPostDischargeTypeId: 13
  }

  static dbKeyNames: IDBKeyNames = {
    users: "users",
    patients: "patients",
    bfExpressions:"bfExpressions",
    feedExpressions: "feedExpressions",    
    bfsps: "bfsps",
    bfpds: 'bfpds'
  }

  static patientSortBy: IPatientSortBy = {
    deliveryDate: "deliveryDate",
    deliveryTime: "deliveryTime",
    weight: "weight",
    inbornPatient: "inbornPatient",
    outbornPatient: "outbornPatient"
  } 

  static passwordFormat = "@123#!"

  static typeDetailsIds = {
    inbornPatient: 12,
    outbornPatient: 13
  }

  /**
   * This static variable will be used to interact with server for synchronization and other purposes.
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * @since 0.0.1
   */
  static serverUrls:any = {
    SERVER_STATUS: 'http://devserver.sdrc.co.in:8095/lactation/serverStatus',
    // SYNCHRONIZE: 'http://devserver.sdrc.co.in:8095/lactation/sync'
    SYNCHRONIZE: 'http://localhost:8080/sync'
  };

  static postDischargeMenu: number = 12;

  static messages: IMessage = {
    enterDateOfExpression: 'Please enter date of expression',
    enterTimeOfExpression :'Please enter time of expression',
    enterTypeOfExpression:'Please enter method of expression',
    enterLocOfExpression:'Please enter location of expression',
    enterVolumeOfMilkFromLeft:'Please enter volume of milk expressed from left',
    enterVolumeOfMilkFromRight:'Please enter volume of milk expressed from right',
    enterValidVolumeOfMilk:'Please enter the volume of milk expressed from left breast (in ml, range 0-300)',
    invalidCredentials: 'Invalid credentials!',
    forgotPasswordMessage: 'Send an email to abc@ahi.com from your email requesting for your password.',
    registrationSuccessful: 'Registration successful',
    enterTypeOfBFExpression: 'Please enter method of BF expression',
    noUserFound: 'No user found, please register!',
    userConstruction: "Under construction!",
    babyUnderWeight: "Baby's weight is less than the normal weight range (500-4000 grams). Do you want to proceed with the entry?",
    babyOverWeight: "Baby's weight is more than the normal weight range (500-4000 grams). Do you want to proceed with the entry?",
    supportivePracticeBfsp: "Please select the supportive practice performed for breastfeeding",
    personWhoPerformedBfsp: "Please select the person who performed for BFSP",
    durationOfBfsp: "Please enter a valid duration for BFSP performed",
    deleted: 'Deleted successfully!',
    recordNotFound: 'Record not found!',
    noDataFound: 'No data found!',
    serverErrorContactAdmin: 'Server error, please contact admin!',
    noDataToSync: 'No data to sync!'
  };
  
/**
 * Area levels
 * @author Ratikanta
 * @since 0.0.1 
 * @static
 * @type {IAreaLevel}
 * @memberof ConstantProvider
 */
static areaLevels: IAreaLevel ={
    country: 1,
    state: 2,
    district: 3,
    institute: 5
  }
  
  constructor(public http: HttpClient) {
  }

}
