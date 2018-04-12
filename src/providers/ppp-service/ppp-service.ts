import { Injectable } from '@angular/core';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';

/**
 *  This service is used to fetch list of patients who are performing poorly
 *
 * @author Jagat Bandhu
 * @author Naseem Akhtar(naseem@sdrc.co.in)
 * @since 1.2.0
 */
@Injectable()
export class PppServiceProvider {

  typeDetails: ITypeDetails[];
  constructor(public storage: Storage) {
  }

  /**
   * This method will set true for idEdtited status in sps while updating the form
   *
   * @author Jagat Bandhu
   * @since 1.1.0
   * @param babyCode
   */
  async deleteSpsRecord(babyCode: string){
    let spsData : ISps[] = [];
    await this.storage.get(ConstantProvider.dbKeyNames.sps)
    .then(data =>{
      spsData = data
      if(spsData != null && spsData.length > 0){
        let index = spsData.findIndex(d=>d.babyCode == babyCode)
        if(index >= 0){
          spsData.splice(spsData.findIndex(d=> d.babyCode === babyCode), 1)
          this.storage.set(ConstantProvider.dbKeyNames.sps,spsData)
        }
      }
    })
  }
}
