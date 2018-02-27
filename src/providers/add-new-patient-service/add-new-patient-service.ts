<<<<<<< HEAD
import {
  HttpClient
} from "@angular/common/http";
import {
  Injectable
} from "@angular/core";
import {
  Observable
} from "rxjs/Observable";
import {
  HttpErrorResponse
} from "@angular/common/http/src/response";
import {
  ErrorObservable
} from "rxjs/observable/ErrorObservable";
import {
  ConstantProvider
} from "../constant/constant";
import {
  Storage
} from "@ionic/storage";
import {
  UserServiceProvider
} from "../user-service/user-service";
import {
  DatePipe
} from "@angular/common";
=======
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
>>>>>>> 2e7b549d219e247231865b132f9e56a8e631d3f8

/**
 * This service will only provide service to Feed component
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@Injectable()
export class AddNewPatientServiceProvider {
<<<<<<< HEAD
  constructor(
    public http: HttpClient,
    private storage: Storage,
    private userService: UserServiceProvider,
    private datePipe: DatePipe
  ) {}
=======

  constructor(public http: HttpClient,private storage: Storage, private datePipe: DatePipe) {
  }
>>>>>>> 2e7b549d219e247231865b132f9e56a8e631d3f8

  /**
   * This method should return delivery method lists
   *
   * @author Jagat Bandhu
   * @returns {Observable<ITypeDetails[]>}
   * @memberof AddNewPatientServiceProvider
   */
  getDeliveryMethod(): Observable < ITypeDetails[] > {
    return this.http
      .get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.filter(
          d =>
          d.typeId ===
          ConstantProvider.DeliveryMethodTypeIds.deliveryMethodTypeId
        );
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
  getMotherParenatalMilk(): Observable < ITypeDetails[] > {
    return this.http
      .get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.filter(
          d =>
          d.typeId ===
          ConstantProvider.MotherPrenatalMilkTypeIds.motherPrenatalMilkTypeId
        );
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
  getHmAndLactation(): Observable < ITypeDetails[] > {
    return this.http
      .get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.filter(
          d =>
          d.typeId ===
          ConstantProvider.HmAndLactationTypeIds.hmAndLactationTypeId
        );
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
  getInpatientOutpatient(): Observable < ITypeDetails[] > {
    return this.http
      .get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.filter(
          d =>
          d.typeId ===
          ConstantProvider.InpatientoutpatientTypeIds
          .inpatientoutpatientTypeId
        );
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
  getBabyAdmittedTo(): Observable < ITypeDetails[] > {
    return this.http
      .get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.filter(
          d =>
          d.typeId ===
          ConstantProvider.BabyAdmittedToTypeIds.babyAdmittedToTypeId
        );
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
  getNICAdmissionReason(): Observable < ITypeDetails[] > {
    return this.http
      .get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).typeDetails.filter(
          d =>
          d.typeId ===
          ConstantProvider.NICAdmissionReasonTypeIds.nicAdmissionReasonTypeId
        );
      })
      .catch(this.handleError);
  }

  private handleError(error: HttpErrorResponse) {
    let messageToUser;
    if (error.error instanceof ErrorEvent) {
      messageToUser = `An error occurred: ${error.error.message}`;
    } else {
      messageToUser =
        `Backend error, code ${error.status}, ` + `message: ${error.message}`;
    }
    return new ErrorObservable(messageToUser);
  }

  /**
   * @author Jagat Bandhu
   * @since 0.0.1
   * @param IPatient the patient which we need to save in the database.
   */
  saveNewPatient(patient: IPatient): Promise < any > {
    let promise = new Promise((resolve, reject) => {
<<<<<<< HEAD
      this.storage
        .get(ConstantProvider.dbKeyNames.patients)
        .then(val => {
          let patients: IPatient[] = [];
          if (val != null) {
            patients = val;
            patients = this.validateNewEntryAndUpdate(patients, patient);
            this.storage
              .set(ConstantProvider.dbKeyNames.patients, patients)
              .then(data => {
                resolve();
              })
              .catch(err => {
                reject(err.message);
              });
          } else {
            patients.push(patient);
            this.storage
              .set(ConstantProvider.dbKeyNames.patients, patients)
              .then(data => {
                resolve();
              })
              .catch(err => {
                reject(err.message);
              });
          }
        })
        .catch(err => {
          reject(err.message);
        });
=======
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
    
>>>>>>> 2e7b549d219e247231865b132f9e56a8e631d3f8
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
  private validateNewEntryAndUpdate(
    patients: IPatient[],
    patient: IPatient
  ): IPatient[] {
    let index = patients.findIndex(d => d.babyCode === patient.babyCode);
    if (index >= 0) {
      //record found, need to splice and enter new
      patients.splice(index, 1);
    }
    patients.push(patient);
    return patients;
  }

  /**
   * This method will return the patients list from the db based on the baby code
   *
   * @author Jagat Bandhu
   * @since 0.0.1
   * @param babyCode
   */
  findByBabyCode(babyCode: string): Promise < IPatient > {
    let promise: Promise < IPatient > = new Promise((resolve, reject) => {
      this.storage
        .get(ConstantProvider.dbKeyNames.patients)
        .then(data => {
          data = (data as IPatient[]).filter(d => d.babyCode === babyCode);
          resolve(data[0]);
        })
        .catch(err => {
          reject(err.message);
        });
    });
    return promise;
  }

  /**
   * This method will get the instiution list based on the userDetails institution id
   *
   * @author Jagat Bandhu Sahoo
   * @since 0.0.1
   */
  getInsitutionName() {
    return this.http
      .get("./assets/data.json")
      .map((response: Response) => {
        return (response as any).areaDetails.filter(
          d => d.id === this.userService.getUser().institution
        );
      })
      .catch(this.handleError);
  }

  /**
   * This method will return promise of string
   *
   * @author Jagat Bandhu Sahoo
   * @since 1.0.0
   */
  getBabyId(): Promise < string > {
    return new Promise < string > ((resolve, reject) => {
      let babyId = "";
      this.getInsitutionName().subscribe(institutionName => {
        babyId =
          (institutionName[0] as IArea).shortName.toUpperCase() +
          this.datePipe.transform(new Date(), "ddMMyyyyHHmm");
        this.storage
          .get(ConstantProvider.dbKeyNames.latestPatientId)
          .then(dbBabyId => {
            if (dbBabyId != null) {
              dbBabyId++
              this.storage
                .set(ConstantProvider.dbKeyNames.latestPatientId, dbBabyId)
                .then(data => {
                  let stringBabyId = dbBabyId + "";
                  switch (stringBabyId.length) {
                    case 1:
                      resolve(babyId +"00" + stringBabyId);
                      break;
                    case 2:
                      resolve(babyId +"0" + stringBabyId);
                      break;
                    default:
                      resolve(babyId + stringBabyId);
                      break;
                  }
                  resolve();
                });
            } else {
              this.storage
                .set(ConstantProvider.dbKeyNames.latestPatientId, 1)
                .then(data => {
                  let stringBabyId = 1 + "";
                  switch (stringBabyId.length) {
                    case 1:
                      resolve(babyId +"00" + stringBabyId);
                      break;
                    case 2:
                      resolve(babyId +"0" + stringBabyId);
                      break;
                    default:
                      resolve(babyId + stringBabyId);
                      break;
                  }
                  resolve();
                });
            }
          });
      });
    });
  }
}
