/**
 * This interface is going to deal with properties we need to write preloaded data
 * @author Ratikanta
 * @since 1.1.0
 * 
 * @interface IObjectToWriteInFile
 */
interface IObjectToWriteInFile{
    users: IUser[];
    patients: IPatient[];
    bfExpressions: IBFExpression[];
    feedExpressions: IFeed[];
    bfsps: IBFSP[];
    bfpds: IBFPD[];
    latestPatientId: number;
}