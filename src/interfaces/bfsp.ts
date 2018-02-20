/**
 * This breast feed supportive practice interface is going to help us entry expressions
 * @author Ratikanta
 * @since 0.0.1
 * 
 * @interface IBFSP
 */
interface IBFSP{
    id:string;
    babyCode: string;
    userId: string;
    syncFailureMessage: string;
    isSynced: boolean;
    dateOfFeed: string;
    timeOfFeed: string;
    spPerformed: number;
    personPerformed: number;
    duration: number;//minute.second
}