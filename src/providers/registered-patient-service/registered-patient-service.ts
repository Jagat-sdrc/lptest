import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { SearchPipe } from '../../pipes/search/search';
import { PppServiceProvider } from '../ppp-service/ppp-service';

/**
 * This service will only provide service to Registered Patient component
 *
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@Injectable()
export class RegisteredPatientServiceProvider {

  patients: IPatient[];

  constructor(private storage: Storage, private searchPipe: SearchPipe,private pppService: PppServiceProvider){}

  /**
   * @author - Naseem Akhtar
   * @param babyCode The baby code of the patient to which we are going to delete
   */
  deletePatient(babyCode: string): Promise<any>{
    let promise: Promise<any> = new Promise((resolve, reject)=>{
      this.storage.get(ConstantProvider.dbKeyNames.patients)
      .then(data=>{
        (data as IPatient[]).splice((data as IPatient[]).findIndex(d=> d.babyCode === babyCode), 1)
        this.pppService.deleteSpsRecord(babyCode);
        this.storage.set(ConstantProvider.dbKeyNames.patients, data)
        .then(()=>{
          //delete from breastfeed expression
          this.storage.get(ConstantProvider.dbKeyNames.bfExpressions)
          .then(data=>{
            if(data != null && data.length > 0){
              data = (data as IBFExpression[]).filter(d => d.babyCode != babyCode)
              this.storage.set(ConstantProvider.dbKeyNames.bfExpressions, data)
            }
          })
        })
        .then(()=>{
          //delete from breastfeed supportive practise expression
          this.storage.get(ConstantProvider.dbKeyNames.bfsps)
          .then(data=>{
            if(data != null && data.length > 0){
              data = (data as IBFSP[]).filter(d=> d.babyCode != babyCode);
              this.storage.set(ConstantProvider.dbKeyNames.bfsps, data)
            }
          })
        })
        .then(()=>{
          //delete from feed expression
          this.storage.get(ConstantProvider.dbKeyNames.feedExpressions)
          .then(data=>{
            if(data != null && data.length > 0){
              data = (data as IFeed[]).filter(d=> d.babyCode != babyCode);
              this.storage.set(ConstantProvider.dbKeyNames.feedExpressions, data)
            }
          })
        })
        .then(()=>{
          //delete from breastfeed post-discharge expression
          this.storage.get(ConstantProvider.dbKeyNames.bfpds)
          .then(data=>{
            if(data != null && data.length > 0){
              data = (data as IBFPD[]).filter(d=> d.babyCode != babyCode);
              this.storage.set(ConstantProvider.dbKeyNames.bfpds, data)
              // if(index >= 0){
              //   (data as IBFPD[]).splice(index, 1)
              // }
            }
          })
        })
        .then(()=>{
          resolve()
        })
        .catch(err=>{
          reject(err.message)
        })
      })
      .catch(err=>{
        reject(err.message)
      })
    })
    return promise;
  }

  /**
   * This method will return a promise of Patient data from database
   *
   * @author Jagat Bandhu Sahoo
   * @since 0.0.1
  */
  findAllPatients():Promise<IPatient[]>{
    let promise: Promise<IPatient[]> = new Promise((resolve, reject)=>{
      this.storage.get(ConstantProvider.dbKeyNames.patients)
      .then(data=>{
        if(data != null){
          this.patients = data;
          resolve(data)
        }else{
          resolve([])
        }
      })
      .catch(err=>{
        reject(err.message)
      })
    })
    return promise;
  }
  /**
   * This method will help us getting searched patients
   * @param patients The whole patient list from which we have search
   * @param searchTerm The string to which we will search
   * @author Ratikanta
   * @since 0.0.1
  */
  getSearchedPatients(searchTerm: string): IPatient[]{

    return this.searchPipe.transform(this.patients, searchTerm)
  }
}
