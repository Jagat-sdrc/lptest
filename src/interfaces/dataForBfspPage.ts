/**
 * This interface will keep the format in which we will send data to BFSP entry page
 * @author Naseem Akhtar
 * @since 0.0.1
 */
interface IDataForBfspPage{
    babyCode: string;
    selectedDate: string;
    isNewBfsp: boolean;
    deliveryDate: string;
    deliveryTime: string;
    dischargeDate: string;
}