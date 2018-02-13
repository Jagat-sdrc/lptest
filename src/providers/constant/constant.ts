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
  
  static FeedingTypeIds: IFeedingMethods = {
    feedingMethodTypeId: 1
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

  static DeliveryMethodTypeIds: IDeliveryMethods = {
    deliveryMethodTypeId: 7
  }
  static MethodOfExpressionBfTypeId: IMethodOfExpressionBF = {
    methodOfExpressionBfTypeId: 8
  }
  static LocationOfExpressionBfTypeId: ILocationOfExpressionBF = {
    locationOfExpressionBfTypeId: 9
  }

  static dbKeyNames: IDBKeyNames = {
    feedExpression: "feedExpression",
    bfExpression:"bfExpression",
    patient: "patient",
    country: "country",
    state: "state",
    institution: "institution"
  }
  
  constructor(public http: HttpClient) {
  }

}
