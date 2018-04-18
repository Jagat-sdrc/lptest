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
    locationOfFeeding: 5
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
    bfpds: 'bfpds',
    latestPatientId: 'latestPatientId',
    sps: 'sps'
  }

  static patientSortBy: IPatientSortBy = {
    deliveryDateAscending: "deliveryDateAscending",
    deliveryDateDescending: "deliveryDateDescending"
  }

  static passwordFormat = "@123#!"

  static typeDetailsIds = {
    inPatient: 12,
    outPatient: 13,
    vaginal: 1,
    csection: 2,
    other: 3,
    unknown: 4,
    level3NICU: 14,
    level2SNCU: 15,
    level1NICU: 16,
    parenteralEnteral: 62,
    enteralOnly: 63,
    enteralOral: 64,
    oralCup: 65,
    breastfeed: 43,
    kmc: 53,
    nns: 54,
    oral: 55,
    logFeedBreastFeed: 66
  }

  /**
   * This static variable will be used to interact with server for synchronization and other purposes.
   * @author Naseem Akhtar (naseem@sdrc.co.in)
   * @since 0.0.1
   */
  static serverUrls:any = {
    SERVER_STATUS: 'http://prod1.sdrc.co.in/lactation/serverStatus',
    SYNCHRONIZE: 'http://prod1.sdrc.co.in/lactation/sync'
    // SERVER_STATUS: 'http://192.168.1.247:8080/serverStatus',
    // SYNCHRONIZE: 'http://192.168.1.247:8080/sync'
  };

  static postDischargeMenu: number = 12;

  /**
   * This following static messages is used to keep all the static messages
   * which further can be used in other components and services.
   * This would help us in maintaining the consistency of the message being displayed
   * in the app.
   *
   * @author Ratikanta
   * @author Jagat Bandhu
   * @author Naseem Akhtar (naseem@sdr.co.in)
   * @since -0.0.1
   */
  static messages: IMessage = {
    exportingData: 'Exporting data, please wait',
    dataExported: 'Data exported',
    enterDateOfExpression: 'Please enter date of expression',
    enterTimeOfExpression :'Please enter time of expression',
    enterTypeOfExpression:'Please enter method of expression',
    enterLocOfExpression:'Please enter location of expression',
    volumeOfMilkExpressedFromBreast:'Please enter valid volume of milk expressed from left and right breast (in ml)',
    enterValidVolumeOfMilk:'Please enter the volume of milk expressed from left breast (in ml, range 0-300)',
    invalidCredentials: 'Invalid credentials.',
    forgotPasswordMessage: 'Please send an email to <span class="forgot">vijaya.lakshmi@accessh.org</span> requesting your password. ',
    registrationSuccessful: 'Registration successful.',
    enterTypeOfBFExpression: 'Please enter method of BF expression',
    noUserFound: 'No user found, please register.',
    userConstruction: 'Under construction.',
    babyUnderWeight: "Baby's weight is less than the normal weight range (500-4000 grams). Do you want to proceed with the entry?",
    babyOverWeight: "The entered baby weight lies outside 400-6000 gms range. Do you want to proceed with the entry? ",
    babyGestational: "A normal gestational period ranges from 38 to 42 weeks. Do you want to proceed with the entry?",
    motherAge: "Reproductive age of women lies in the range between 14-60 years. Do you want to proceed with the entry?",
    supportivePracticeBfsp: "Please select the supportive practice performed for breastfeeding",
    personWhoPerformedBfsp: "Please select the person who performed for BFSP",
    durationOfBfsp: "Please enter a valid duration for BFSP performed",
    deleted: 'Deleted successfully.',
    recordNotFound: 'Record not found.',
    noDataFound: 'No data found.',
    serverErrorContactAdmin: 'Server error, please contact admin',
    noDataToSync: 'No data to sync.',
    enterDateOfBfsp: 'Please enter date of BFSP',
    enterTimeOfBfsp :'Please enter time of BFSP',
    stateAlert: 'Please select the country before selecting state',
    districtAlert: 'Please select the state before selecting district',
    institutionAlert: 'Please select the district before selecting insitution',
    saveSuccessfull: 'Saved successfully.',
    info: 'Infomation',
    warning: 'Warning',
    deletePatient: 'Do you want to delete the selected Patient record?',
    duplicateTime: 'Record for this particular time exists. Please visit the record created for this time to edit.',
    enterDateOfFeed: 'Please enter date of feed',
    enterTimeOfFeed :'Please enter time of feed',
    methodOfFeed: 'Please enter method of feed',
    ommVolumne: 'Please enter valid omm volume',
    dhmVolume: 'Please enter valid dhm volume',
    formulaVolume: 'Please enter valid formula volume',
    animalMilkVolume: 'Please enter valid animal milk voulme',
    otherVolume: 'Please enter valid other voulme',
    locationWhereFeedOccured: 'Please enter location where feed occured',
    babyWeight: 'Please enter weight of the baby',
    emailIdExists: 'Email id exists.',
    dateOfBfpd: 'Please enter date of breastfeeding post discharge',
    bfStatusPd: 'Please enter breastfeeding status post discharge',
    selectCountry: 'Select Country',
    selectState: 'Select State',
    selectDistrict: 'Select District',
    selectInstitute: 'Select Institute',
    emailNoted: 'Yes, I understand the process that would help me to receive my password via email.',
    selectCheckBox: 'Please select the checkbox',
    important: 'IMPORTANT',
    allFieldMandatory: 'Please fill all the mandatory fields.',
    exitApp: 'Are you sure you want to exit the app?',
    dischargeDateValidation: 'Discharge date cannot be less than Delivery date',
    checkInternetConnection: 'No internet connection. Please check your internet connectivity and try again',
    submitSuccessfull: 'Submitted successfully.',
    deleteForm: 'Are you sure you want to delete this record?',
    futureTime: 'Future time is not allowed',
    updateSuccessfull: 'Updated successfully.',
    dataExportSuccessful: 'Data exported successfully to the following file',
    couldNotCreateFile: 'Could not create export file',
    couldNotWriteToFile: 'Could not write data to export file',
    registeredPage: "registeredPage",
    singlePatientSummary: "singlePageSummarty",
    pastTime: 'Time before delivery time is not allowed',
    spsContentColorRed: 'sps-content-color-red',
    spsContentColorGreen: 'sps-content-color-green',
    spsContentColorYellow: 'sps-content-color-yellow',
    syncingPleaseWait: 'Syncing, please wait...',
    syncUnsuccessfull: 'Sync unsuccessfull',
    syncSuccessfull: 'Sync successfull',
    loading: 'Loading, please wait...',
    folderCraetedSuccessfully: 'Lactation folder created',
    twoWeeksPostDischarge: 13,
    oneMonthPostDischarge: 29,
    threeMonthsOfLife: 89,
    sixMonthsOfLife: 179
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

  static appFolderName: string = 'Lactation'

}
