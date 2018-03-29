/**
 * This interface will keep the format in which we will send data to Feed expression entry page
 * @author Ratikanta
 * @since 0.0.1
 */
interface IDataForFeedEntryPage{
    babyCode: string;
    selectedDate: string;
    isNewExpression: boolean;
    deliveryDate: string;
    deliveryTime: string;
    dischargeDate: string;
}