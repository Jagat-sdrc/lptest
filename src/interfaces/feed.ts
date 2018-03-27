/**
 * This is an interface which will contain all details of feed
 * @author Ratikanta
 * @since 0.0.1
 */

interface IFeed{
    id:string;
    babyCode: string;
    userId: string;
    dateOfFeed: string;
    timeOfFeed: string;
    methodOfFeed: number;
    ommVolume: number;
    dhmVolume: number;
    formulaVolume: number;
    animalMilkVolume: number;
    otherVolume: number;
    locationOfFeeding: number;
    babyWeight: number;
    syncFailureMessage: string;
    isSynced: boolean;
    createdDate: string;
    updatedDate: string;
    uuidNumber: string;
}
