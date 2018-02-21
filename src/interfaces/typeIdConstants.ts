/**
 * This file contains the interfaces of Typeids
 * @author Ratikanta
 * @author Naseem Akhtar
 * @since 0.0.1
 */

interface IDeliveryMethods{
    deliveryMethodTypeId: number
}

interface IMotherPrenatalMilk{
    motherPrenatalMilkTypeId: number
}

interface IHmAndLactation{
    hmAndLactationTypeId: number
}

interface IInpatientoutpatient{
    inpatientoutpatientTypeId: number
}

interface IBabyAdmittedTo{
    babyAdmittedToTypeId: number
}

interface INICAdmissionReason{
    nicAdmissionReasonTypeId: number
}

interface IMethodOfExpressionBF{
    methodOfExpressionBfTypeId: number
}

interface ILocationOfExpressionBF{
    locationOfExpressionBfTypeId: number
}

interface IBFSupportivePractices{
    bfSupportivePracticesTypeId: number
}

interface IPersonWhoPerformedBSFP{
    personWhoPerformedBSFPTypeId: number
}

interface IFeedingMethods{
    feedingMethodTypeId: number;
    locationOfFeeding: number;
}

interface ITimeOfBreastFeedingPostDischarge{
    timeOfBreastFeedingPostDischargeTypeId: number
}

interface IBFStatusPostDischarge{
    bfStatusPostDischargeTypeId: number
}