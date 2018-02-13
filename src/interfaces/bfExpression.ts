/**
 * This is an interface which will contain all details of BF expression
 * @author Subhadarshani
 * @since 0.0.1
 */

interface IBF{
    patientId: string;
    babyCode: string;
    userId: string;
    dateOfExpression: string;
    timeOfExpression: string;
    durationOfExpression: number;
    methodOfExpression: number;
    locationOfExpression: number;
    volOfMilkExpressedFromL: number;
    volOfMilkExpressedFromR: number;
    babyWeight: number;
}