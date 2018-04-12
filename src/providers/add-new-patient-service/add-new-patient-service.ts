import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { UserServiceProvider } from '../user-service/user-service';
import { PppServiceProvider } from '../ppp-service/ppp-service';
import { UtilServiceProvider } from '../util-service/util-service';

/**
 * This service will help in fetching the drop down values and other important objects from the 
 * mobile DB which are related to add new patient form.
 * 
 * This service will also help in saving new patient forms and updating existing patients.
 * 
 * @author Jagat Bandhu
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class AddNewPatientServiceProvider {
  constructor(
    public http: HttpClient,
    private storage: Storage,
    private userService: UserServiceProvider,
    private datePipe: DatePipe,private pppServiceProvider: PppServiceProvider,
    private utilService: UtilServiceProvider
  ) {}

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

  /**
   * @author - Ratikanta
   * @param error - this returns the error that occured while making http call
   * 
   * This method handles the error that occurs while making a http call
   */
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
  saveNewPatient(patient: IPatient, uniquePatientIdToUpdate: number): Promise < any > {
    let promise = new Promise((resolve, reject) => {
      patient.createdDate = patient.createdDate === null ?
        this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss') : patient.createdDate;
      patient.updatedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      patient.uuidNumber = this.utilService.getUuid();
      let patients: IPatient[] = [];
      this.storage.get(ConstantProvider.dbKeyNames.patients)
      .then((val) => {
        if(val != null){
          patients = val
          patients = this.validateNewEntryAndUpdate(patients, patient)
        }else{
          patients.push(patient)
        }
      })
      .then(()=>{
        this.storage.set(ConstantProvider.dbKeyNames.patients, patients)
        .catch(err=>{
          patient.createdDate = null
          reject(err.message);
        })
      })
      .then(()=>{
        if(uniquePatientIdToUpdate){
          this.storage.set(ConstantProvider.dbKeyNames.latestPatientId, uniquePatientIdToUpdate)
          .then(()=>{
            resolve()
          })
        }else{
          this.pppServiceProvider.deleteSpsRecord(patient.babyCode)
          resolve()
        }
      })
      .catch(err=>{
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
   * @author Ratikanta
   * @since 1.0.0
   */
  getBabyId(): Promise < IUniquePatientId > {
    return new Promise < IUniquePatientId > ((resolve, reject) => {
      let babyId = "";
      this.getInsitutionName().subscribe(institutionName => {
        babyId =
          (institutionName[0] as IArea).shortName.toUpperCase() +
          this.datePipe.transform(new Date(), "ddMMyyHHmm");
        this.storage
          .get(ConstantProvider.dbKeyNames.latestPatientId)
          .then(dbBabyId => {
            if (dbBabyId != null) {
              let stringBabyId = ++dbBabyId + "";
              let uniquePatientId: IUniquePatientId = {
                id: null,
                idNumber: dbBabyId
              }
              switch (stringBabyId.length) {
                case 1:
                  uniquePatientId.id = babyId +"00" + stringBabyId;
                  break;
                case 2:
                uniquePatientId.id = babyId +"0" + stringBabyId;
                  break;
                default:
                uniquePatientId.id = babyId + stringBabyId;
                  break;
              }
              resolve(uniquePatientId);

            } else {
              let stringBabyId = 1 + "";
              let uniquePatientId: IUniquePatientId = {
                id: null,
                idNumber: 1
              }
              switch (stringBabyId.length) {
                case 1:
                  uniquePatientId.id = babyId +"00" + stringBabyId;
                  break;
                case 2:
                uniquePatientId.id = babyId +"0" + stringBabyId;
                  break;
                default:
                uniquePatientId.id = babyId + stringBabyId;
                  break;
              }
              resolve(uniquePatientId);
            }
          });
      });
    });
  }
}
