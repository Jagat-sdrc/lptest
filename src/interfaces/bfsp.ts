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
    dateOfBFSP: string;
    timeOfBFSP: string;
    bfspPerformed: number;
    personWhoPerformedBFSP: number;
    bfspDuration: number;
    userId: string;
    syncFailureMessage: string;
    isSynced: boolean;
    createdDate: string;
    updatedDate: string;
    uuidNumber: string;
}
