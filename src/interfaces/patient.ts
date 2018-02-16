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
    timeTillFirstExpression: string;
    inpatientOrOutPatient: number;
    admissionDateForOutdoorPatients: string;
    babyAdmittedTo: number;
    nicuAdmissionReason: number;
}