/**
 * This is an interface which will contain all details of BF expression
 * @author Subhadarshani
 * @author Ratikanta
 * @since 0.0.1
 */

interface IBFExpression{
    id:string;
    babyCode: string;
    userId: string;
    dateOfExpression: string;
    timeOfExpression: string;
    methodOfExpression: number;
    locationOfExpression: number;
    volOfMilkExpressedFromLR: number;//0-300ml
    syncFailureMessage: string;
    isSynced: boolean;
    createdDate: string;
    updatedDate: string;
    uuidNumber: string;
}
