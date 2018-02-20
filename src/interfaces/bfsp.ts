/**
 * This breast feed supportive practice interface is going to help us entry expressions
 * @author Ratikanta
 * @author Naseem Akhtar
 * @since 0.0.1
 * 
 * @interface IBFSP
 */
interface IBFSP{
    id: string;
    babyCode: string;
    babyCodeHospital: string;
    dateOfBFSP: string;
    timeOfBFSP: string;
    bfspPerformed: number;
    personWhoPerformedBFSP: number;
    bfspDuration: number;
    userId: string;
    syncFailureMessage: string;
    isSynced: boolean;
    dateOfFeed: string;
    timeOfFeed: string;
    spPerformed: number;
    personPerformed: number;
    duration: number;//minute.second
}