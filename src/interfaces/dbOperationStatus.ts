/**
 * This interface will help us give message to user.
 * If database operation will be successful, we will get isSuccess true, if operation
 * will be failure, we will get isSuccess false with error message
 * @author Ratikanta
 * @since 0.0.1
 */

interface IDBOperationStatus{
    isSuccess: boolean,
    message: string
}