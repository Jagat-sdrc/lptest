import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';

/**
 * This service will only provide service to Feed component
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@Injectable()
export class AddNewPatientServiceProvider {

  constructor(public http: HttpClient,private storage: Storage, private datePipe: DatePipe) {
  }

  /**
   * This method should return delivery method lists
   * 
   * @author Jagat Bandhu
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewPatientServiceProvider
   */
   getDeliveryMethod(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.DeliveryMethodTypeIds.deliveryMethodTypeId)
           })
        .catch(this.handleError);
  }

   /**
   * This method should return Mother's prenatal intent to provide milk lists
   * 
   * @author Jagat Bandhu
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewPatientServiceProvider
   */
  getMotherParenatalMilk(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.MotherPrenatalMilkTypeIds.motherPrenatalMilkTypeId)
           })
        .catch(this.handleError);
  }

   /**
   * This method should return Parent's knowledge on HM and lactation lists
   * 
   * @author Jagat Bandhu
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewPatientServiceProvider
   */
  getHmAndLactation(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.HmAndLactationTypeIds.hmAndLactationTypeId)
           })
        .catch(this.handleError);
  }

   /**
   * This method should return inpatiet outpatient lists
   * 
   * @author Jagat Bandhu
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewPatientServiceProvider
   */
  getInpatientOutpatient(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.InpatientoutpatientTypeIds.inpatientoutpatientTypeId)
           })
        .catch(this.handleError);
  }

   /**
   * This method should return baby admitted to lists
   * 
   * @author Jagat Bandhu
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewPatientServiceProvider
   */
  getBabyAdmittedTo(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.BabyAdmittedToTypeIds.babyAdmittedToTypeId)
           })
        .catch(this.handleError);
  }

   /**
   * This method should return nicu admission reason lists
   * 
   * @author Jagat Bandhu
   * @returns {Observable<ITypeDetails[]>} 
   * @memberof AddNewPatientServiceProvider
   */
  getNICAdmissionReason(): Observable<ITypeDetails[]> {

    return this.http.get("./assets/data.json").map((response: Response) => {
               return (response as any).typeDetails.filter(d => d.typeId === ConstantProvider.NICAdmissionReasonTypeIds.nicAdmissionReasonTypeId)
           })
        .catch(this.handleError);
  }

  

    private handleError(error: HttpErrorResponse) {

    let messageToUser;
    if (error.error instanceof ErrorEvent) {
      messageToUser = `An error occurred: ${error.error.message}`;
    } else {
      messageToUser = `Backend error, code ${error.status}, ` +
        `message: ${error.message}`;
    }
    return new ErrorObservable (messageToUser);
  };

  /**
   * @author Jagat Bandhu
   * @since 0.0.1
   * @param IPatient the patient which we need to save in the database.
   */
  saveNewPatient(patient: IPatient) : Promise<any>{
    let promise = new Promise((resolve, reject) => {
      patient.createdDate = patient.createdDate === null ? 
        this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss') : patient.createdDate;
      patient.updatedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.storage.get(ConstantProvider.dbKeyNames.patients)
      .then((val) => {
        let patients: IPatient[] = [];
        if(val != null){
          patients = val
          patients = this.validateNewEntryAndUpdate(patients, patient)          
          this.storage.set(ConstantProvider.dbKeyNames.patients, patients)
          .then(data=>{
            resolve()
          })
          .catch(err=>{
            patient.createdDate = null
            reject(err.message);    
          })
        }else{
          patients.push(patient)
          this.storage.set(ConstantProvider.dbKeyNames.patients, patients)
          .then(data=>{
            resolve()
          })
          .catch(err=>{
            patient.createdDate = null
            reject(err.message);    
          })
        }                
      }).catch(err=>{
        patient.createdDate = null
        reject(err.message);
      })
    
    });
    return promise;
  }


  /**
   * This method will check whether we have the record with given patient id, date and time.
   * If all the attribute value will match, this will splice that record and append incoming record.
   * Because it has come for an update.
   * 
   * If record does not match, this will just push the input record with existing once
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   * @param patients All the existing patients
   * @param patient incoming patient
   * @returns IPatient[] modified patient
   */
  private validateNewEntryAndUpdate(patients: IPatient[], patient: IPatient): IPatient[]{

    let index = patients.findIndex(d =>d.babyCode === patient.babyCode);
    if(index >= 0){
      //record found, need to splice and enter new
      patients.splice(index,1);
    }
    patients.push(patient)    
    return patients;

  }


/**
 * This method will return the patients list from the db based on the baby code
 * 
 * @author Jagat Bandhu
 * @since 0.0.1
 * @param babyCode 
 */
  findByBabyCode(babyCode: string): Promise<IPatient>{
    let promise: Promise<IPatient> = new Promise((resolve, reject)=>{
      this.storage.get(ConstantProvider.dbKeyNames.patients)
      .then(data=>{
          data = (data as IPatient[]).filter(d => (d.babyCode === babyCode));
          resolve(data[0]);
      })
      .catch(err=>{
        reject(err.message)
      })
    });
    return promise;
  }

  /**
   * This method will get the instiution list based on the userDetails institution id
   * 
   * @author Jagat Bandhu Sahoo
   * @since 0.0.1
   * @param instituteId
   */
  getInsitutionName(instituteId){
    return this.http.get("./assets/data.json").map((response: Response) => {
      return (response as any).areaDetails.filter(d =>(d.id === instituteId));
      })
    .catch(this.handleError);
  }

  

}
