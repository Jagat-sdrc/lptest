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

  setUser(user: IUser){
    this.user = user;
  }

  getUser(){
    return this.user;
  }
  

  /**
 * This method will 
 * 
 * @author Jagat Bandhu
 * @since 0.0.1
 * @param email 
 */
  getUserValidation(email: string): Promise<IUser>{
  let promise: Promise<IUser> = new Promise((resolve, reject)=>{
    this.storage.get(ConstantProvider.dbKeyNames.user)
    .then(data=>{
        data = (data as IUser[]).filter(d => (d.emailAddress === email));
        if(data.length != 0){
          resolve(data[0]);
        }else{
          reject("Invalid Credential")
        }
    })
    .catch(err=>{
      reject(err.message)
    })
  });
  return promise;
}
}
