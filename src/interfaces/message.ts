/**
 * This interface will help use show messages to user when needed
 * @author Ratikanta
 * @since 0.0.1 
 * @interface IMessage
 */
interface IMessage{
    invalidCredentials: string;
    enterDateOfExpression: string;
    enterTimeOfExpression: string;
    enterTypeOfExpression: string;
    enterLocOfExpression: string;
    enterVolumeOfMilkFromLeft: string;
    enterVolumeOfMilkFromRight: string;
    enterValidVolumeOfMilk: string;
    forgotPasswordMessage: string;
    registrationSuccessful: string;
    enterTypeOfBFExpression: string;
    noUserFound: string;
    userConstruction: string;
    babyUnderWeight: string;
    babyOverWeight: string;
}