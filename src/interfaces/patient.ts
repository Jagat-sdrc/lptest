/**
 * This interface is going to keep all the attributes of a patient
 * @author Jagat Bandhu
 * @since 0.0.1
 */
interface IPatient{
    babyCode: string;
    babyCodeHospital: string;
    babyOf: string;
    mothersAge: number;
    deliveryDate: string;
    deliveryTime: string;
    deliveryMethod: number;
    babyWeight: number;
    gestationalAgeInWeek: number;
    mothersPrenatalIntent: number;
    parentsKnowledgeOnHmAndLactation: number;
    timeTillFirstExpressionInHour: string;
    timeTillFirstExpressionInMinute: string;
    inpatientOrOutPatient: number;
    admissionDateForOutdoorPatients: string;
    babyAdmittedTo: number;
    nicuAdmissionReason: number;
    dischargeDate: string;
    isSynced: boolean;
    syncFailureMessage: string;
    userId: string;
    createdDate: string;
    updatedDate: string;
    uuidNumber: string;
}
