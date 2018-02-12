/**
 * This is an interface which will contain all details of feed
 * @author Ratikanta
 * @since 0.0.1
 */

interface IFeed{
    babyId: string,
    userId: string,
    dateOfFeed: string,
    timeOfFeed: string,
    methodOfFeed: number,
    OMMVolume: number,
    DHMVolume: number,
    formulaVolume: number,
    otherVolume: number,
    babyWeight: number
}