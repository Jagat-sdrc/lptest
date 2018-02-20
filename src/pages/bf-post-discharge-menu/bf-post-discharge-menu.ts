import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BfPostDischargeMenuServiceProvider } from '../../providers/bf-post-discharge-menu-service/bf-post-discharge-menu-service';
import { MessageProvider } from '../../providers/message/message';

/**
 * This page will be used to navigate to bf post discharge form with the selected time of 
 * breastfeeding post discharge
 * @author - Naseem Akhtar
 * @since - 0.0.1
 */

@IonicPage()
@Component({
  selector: 'page-bf-post-discharge-menu',
  templateUrl: 'bf-post-discharge-menu.html',
})
export class BfPostDischargeMenuPage {

  babyCode: string;
  babyCodeHospital: string;
  menu: ITypeDetails[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bfPostDischargeMenuService: BfPostDischargeMenuServiceProvider,
    private messageService: MessageProvider) {
    this.babyCode = this.navParams.data.babyCode;
    this.babyCodeHospital = this.navParams.data.babyCodeByHospital;
  }

  ngOnInit(){
    this.bfPostDischargeMenuService.getPostDischargeMenu()
      .subscribe(data => {
        this.menu = data;
      }, error => {
        this.messageService.showErrorToast(error);
      })
  };

  goToPostDischargeForm(menuId: number){
    let dataForPostDischarge: IDataForPostDischargePage = {
      babyCode: this.babyCode,
      menuItemId: menuId,
      babyCodeHospital: this.babyCodeHospital
    };
    this.navCtrl.push('BfPostDischargePage', dataForPostDischarge);
  }

}
