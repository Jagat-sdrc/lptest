import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';

/**
 * This service will help BFSPList component
 * @author Naseem Akhtar
 * @since 0.0.1
 */

@Injectable()
export class BfspDateListServiceProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  getBFSPDateList(babyCode: string): Promise < string[] > {

    let promise: Promise < string[] > = new Promise((resolve, reject) => {

      this.storage.get(ConstantProvider.dbKeyNames.bfsps)
        .then(data => {
          if (data != null) {
            data = (data as IBFSP[]).filter(d => d.babyCode === babyCode)

            //Checking if there is any data belong to the patient id or not
            if ((data as IBFSP[]).length > 0) {
              let dates: string[] = [];
              (data as IBFSP[]).forEach(d => {
                dates.push(d.dateOfBFSP)
              });

              //removing duplicates
              dates = Array.from(new Set(dates))

              resolve(dates)
            } else {
              resolve([]);
            }

          } else {
            resolve([]);
          }

        })
        .catch(err => {
          reject(err.message);
        })


    });
    return promise;
  }
}
