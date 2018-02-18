/**
 * This interface is going to keep the sync result
 * @author Ratikanta
 * @since 0.0.1 
 * @interface ISyncResult
 */
interface ISyncResult{
    failureUsers: IFailureUser[];
    failurePatients: IFailurePatient[];
    failureBFExpressions: IFailureBFExpression[];
    failureFeedExpressions: IFailureFeedExpression[];
    failureBFSPs: IFailureBFSP[];
    failureBFPDs: IFailureBFPD[];
}