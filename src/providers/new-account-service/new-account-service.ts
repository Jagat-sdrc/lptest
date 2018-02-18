import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


/**
 * This service will only provide service to new user component
 * 
 * @author Jagat Bandhu
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class NewAccountServiceProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  /**
   * @author Jagat Bandhu
   * @since 0.0.1
   * @param IUser the user which we need to save in the database.
   */
  saveNewUser(user: IUser) : Promise<IDBOperationStatus>{
    let promise : Promise<IDBOperationStatus> = new Promise((resolve, reject) => {
      let dbOperationStatus: IDBOperationStatus = {
        isSuccess: false,
        message: ""
      }
      this.storage.get(ConstantProvider.dbKeyNames.users)
      .then((val) => {

        let users: IUser[] = [];
        if(val != null){
          users = val
          users = this.validateNewEntryAndUpdate(users, user)          
          this.storage.set(ConstantProvider.dbKeyNames.users, users)
          .then(data=>{
            dbOperationStatus.isSuccess = true;
            resolve(dbOperationStatus)
          })
          .catch(err=>{
            dbOperationStatus.isSuccess = false;
            dbOperationStatus.message = err.message;
            reject(dbOperationStatus);    
          })

        }else{
          users.push(user)
          this.storage.set(ConstantProvider.dbKeyNames.users, users)
          .then(data=>{
            dbOperationStatus.isSuccess = true;
            resolve(dbOperationStatus)
          })
          .catch(err=>{
            dbOperationStatus.isSuccess = false;
            dbOperationStatus.message = err.message;
            reject(dbOperationStatus);    
          })
          
        }                
      }).catch(err=>{
        dbOperationStatus.isSuccess = false;
        dbOperationStatus.message = err.message;
        reject(dbOperationStatus);
      })
    
    });
    return promise;
  }

  /**
   * This method will check whether we have the record with given user id, date and time.
   * If all the attribute value will match, this will splice that record and append incoming record.
   * Because it has come for an update.
   * 
   * If record does not match, this will just push the input record with existing once
   * 
   * @author Jagat Bandhu
   * @since 0.0.1
   * @param users All the existing users
   * @param user incoming user
   * @returns IUser[] modified user
   */
  private validateNewEntryAndUpdate(users: IUser[], user: IUser): IUser[]{

    let index = users.findIndex(d =>d.email === user.email);
    if(index >= 0){
      //record found, need to splice and enter new
      users.splice(index,1);
    }
    users.push(user)    
    return users;

  }
/**
 * This mthod is going to return all areas
 * @author Ratikanta
 * @since 0.0.1
 * @returns {Observable <IArea[]>} All areas
 * @memberof NewAccountServiceProvider
 */
getAllAreas(): Observable <IArea[]>{
    return this.http.get("./assets/data.json").map((response: Response) => {
      return (response as any).areaDetails
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

}
