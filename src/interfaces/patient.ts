/**
 * This interface is going to keep all the attributes of a patient
 * @author Jagat Bandhu
 * @since 0.0.1 
 */
interface IPatient{
    patientId: string;
    babyCode: string;
    mothersName: string;
    mothersAge: number;
    deliveryDate: string;
    deliveryTime: string;
    deliveryMethod: number;
    babysWeight: number;
    gestationalAge: number;
    intentProvideMilk: number;
    hmLactation: number;
    firstExpTime: string;
    inpatientOutpatient: number;
    admissionDate: string;
    babyAdmitted: number;
    nicuAdmission: number;
}