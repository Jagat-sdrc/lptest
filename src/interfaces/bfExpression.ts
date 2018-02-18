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
    durationOfExpression: number;
    methodOfExpression: string;
    locationOfExpression: string;
    volOfMilkExpressedFromLR: number;
    isSynced: boolean;  
}