/**
 * This interface is going to maintain the format in which the data will be
 * received from the back-end
 * @author Ratikanta
 * @author Naseem Akhtar (naseem@sdrc.co.in)
 * @since 1.0.1
 * @interface ISyncResult
 */
interface ISyncResult{
    users: IUser[];
    patients: IPatient[];
    bfExpressions: IBFExpression[];
    feedExpressions: IFeed[];
    bfsps: IBFSP[];
    bfpds: IBFPD[];
    syncStatus: number;
}