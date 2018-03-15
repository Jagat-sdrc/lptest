/**
 * This inteface will describe the area levels
 * @author Naseem
 * @since 0.0.1 
 * @interface IBabyBasicDetails
 */

interface IBabyBasicDetails{
    babyCode: string;
    gestationalAgeInWeek: number;
    deliveryMethod: string;
    inpatientOrOutPatient: string;
    parentsInformedDecision: string;
    timeTillFirstExpression: string;
    timeTillFirstEnteralFeed: string;
    admissionDateForOutdoorPatients: string;
    mothersPrenatalIntent: string;
    compositionOfFirstEnteralFeed: number;
    babyAdmittedTo: string;
    reasonForAdmission: string;
    timeSpentInNicu: number;
    timeSpentInHospital: number;
    createdDate: string;
    updatedDate: string;
    createdBy: string;
    updatedBy: string;
    deliveryDate: string;
    dischargeDate: string;
}