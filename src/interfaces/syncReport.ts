/**
 * @author - Naseem Akhtar (naseem@sdrc.co.in)
 * @since - 0.0.1
 * 
 * This interface is used while receiving the data from the server after sync.
 *  
 */


interface ISyncReport{
    userSyncSuccess: number;
    userSyncFailed: number;
    patientSyncSuccess: number;
    patientSyncFailed: number;
    bfExpressionSyncSuccess: number;
    bfExpressionSyncFailed: number;
    feedSyncSuccess: number;
    feedSyncFailed: number;
    bfspSyncSuccess: number;
    bfspSyncFailed: number;
    bfpdSyncSuccess: number;
    bfpdSyncFailed: number;
}