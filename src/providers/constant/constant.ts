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
    outbornPatient: "outbornPatient",
    vaginal: "vaginal",
    csection: "csection",
    other: "other",
    unknown: "unknown",
  } 

  static passwordFormat = "@123#!"

  static typeDetailsIds = {
    inbornPatient: 12,
    outbornPatient: 13,
    vaginal: 1,
    csection: 2,
    other: 3,
    unknown: 4,
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
    babyGestational: "Gestational age in weeks is more than the age (28-32 age). Do you want to proceed with the entry?",
    motherAge: "Mother's delivery age is more than the normal age (15-49 age). Do you want to proceed with the entry?",
    supportivePracticeBfsp: "Please select the supportive practice performed for breastfeeding",
    personWhoPerformedBfsp: "Please select the person who performed for BFSP",
    durationOfBfsp: "Please enter a valid duration for BFSP performed",
    deleted: 'Deleted successfully!',
    recordNotFound: 'Record not found!',
    noDataFound: 'No data found!',
    serverErrorContactAdmin: 'Server error, please contact admin!',
    noDataToSync: 'No data to sync!',
    enterDateOfBfsp: 'Please enter date of BFSP',
    enterTimeOfBfsp :'Please enter time of BFSP',
    stateAlert: 'Please select the country before selecting state',
    districtAlert: 'Please select the state before selecting district',
    institutionAlert: 'Please select the district before selecting insitution',
    saveSuccessfull: 'Save Successfully',
    info: 'Info',
    warning: 'Warning',
    deletePatient: 'Do you want to delete the selected Patient record?',
    duplicateTime: 'Duplicate time',
    enterDateOfFeed: 'Please enter date of feed',
    enterTimeOfFeed :'Please enter time of feed',
    methodOfFeed: 'Please enter method of feed',
    ommVolumne: 'Please enter omm volume',
    dhmVolume: 'Please enter dhm volume',
    formulaVolume: 'Please enter formula volume',
    animalMilkVolume: 'Please enter animal milk voulme',
    otherVolume: 'Please enter other voulme',
    locationWhereFeedOccured: 'Please enter location where feed occured',
    babyWeight: 'Please enter weight of the baby',
    emailIdExists: 'Email id exists!',
    dateOfBfpd: 'Please enter date of breastfeeding post discharge',
    bfStatusPd: 'Please enter breastfeeding status post discharge'
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

  static datePickerType: IDatePickerType = {
    deliveryDate: "deliveryDate",
    dischargeDate: "dischargeDate",
    addmissionDate: "addmissionDate"
  }
  
  constructor(public http: HttpClient) {
  }



}
