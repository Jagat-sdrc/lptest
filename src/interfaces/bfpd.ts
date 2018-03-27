/**
 * This breast feed post discharge interface is going to help us entry expressions
 * @author Ratikanta
 * @since 0.0.1
 *
 * @interface IBFPD
 */
interface IBFPD{
    id:string;
    babyCode: string;
    userId: string;
    syncFailureMessage: string;
    isSynced: boolean;
    dateOfBreastFeeding: string;
    timeOfBreastFeeding: number;
    breastFeedingStatus: number;
    createdDate: string;
    updatedDate: string;
    uuidNumber: string;
}
