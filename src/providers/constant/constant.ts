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

  static FeedingTypeIds: IFeedingMethods = {
    feedingMethodTypeId: 11
  }

  static dbKeyNames: IDBKeyNames = {
    feedExpression: "feedExpression",
    bfExpression:"bfExpression",
    patient: "patient",
    user: "user",
    country: "country",
    state: "state",
    institution: "institution"
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
    inbornPatient: 14,
    outbornPatient: 15
  }
  
  constructor(public http: HttpClient) {
  }

}
