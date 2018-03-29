/**
 * This interface will keep the format in which we will send data to BF expression entry page
 * @author Subhadarshani
 * @since 0.0.1
 */
interface IDataForBFEntryPage{
    babyCode: string;
    selectedDate: string;
    isNewExpression: boolean;
    deliveryDate: string;
    deliveryTime: string;
    dischargeDate: string;
}