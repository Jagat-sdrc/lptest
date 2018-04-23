import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';

/**
 * This service is going to deal with user related stuffs
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class UserServiceProvider {

  user: IUser;
  constructor(public http: HttpClient,private storage: Storage) {}

  /**
   * This method set user details in user variable
   *
   * @author Ratikanta
   * @since 0.0.1
   */
  setUser(user: IUser){
    this.user = user;
  }

  /**
   * This method will return the user
   *
   * @author Ratikanta
   * @since 0.0.1
   */
  getUser(){
    return this.user;
  }


  /**
 * This method will return a valid user details, if it is exist in the database.
 *
 * @author Jagat Bandhu
 * @since 0.0.1
 * @param email
 */
  getUserValidation(email: string): Promise<IUser>{
  let promise: Promise<IUser> = new Promise((resolve, reject)=>{
    this.storage.get(ConstantProvider.dbKeyNames.users)
    .then(data=>{
      if(data != null){
        data = (data as IUser[]).filter(d => (d.email === email.toLowerCase()));
        if(data.length != 0){
          resolve(data[0]);
        }else{
          reject(ConstantProvider.messages.invalidCredentials)
        }
      }else{
        reject(ConstantProvider.messages.noUserFound)
      }
    })
    .catch(err=>{
      reject(err.message)
    })
  });
  return promise;
}
}
