/**
 * @author - Naseem Akhtar (naseem@sdrc.co.in)
 * @since - 0.0.1
 * @interface - IParamToExpresssionPage
 * 
 * This interface is used while sending baby details from one page to another using {@see NavParams}
 */

interface IParamToExpresssionPage {
    babyCode: string;
    babyCodeByHospital: string;
    deliveryDate: string;
    deliveryTime: string;
    dischargeDate?: string;
}