/**
 * This interface is going to be sent to the server for sync
 * @author Ratikanta
 * @since 0.0.1 
 * @interface ISyncObject
 */
interface ISyncObject{
    users: IUser[];
    patients: IPatient[];
    bfExpressions: IBFExpression[];
    feedExpressions: IFeed[];
    bfsps: IBFSP[];
    bfpds: IBFPD[];
    instituteId: number;
}