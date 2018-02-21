import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { DatePipe } from '@angular/common';

/**
 * This service will help BFSPList component
 * @author Naseem Akhtar
 * @since 0.0.1
 */

@Injectable()
export class BfspDateListServiceProvider {

  constructor(public http: HttpClient, private storage: Storage, private datePipe: DatePipe) {
  }

  getBFSPDateList(babyCode: string): Promise < string[] > {

    let promise: Promise < string[] > = new Promise((resolve, reject) => {

      let dbOperationStatus: IDBOperationStatus = {
        isSuccess: false,
        message: ""
      }

      this.storage.get(ConstantProvider.dbKeyNames.bfsps)
        .then(data => {
          if (data != null) {
            data = (data as IBFSP[]).filter(d => d.babyCode === babyCode)

            //Checking if there is any data belong to the patient id or not
            if ((data as IBFSP[]).length > 0) {
              let dates: string[] = [];
              (data as IBFSP[]).forEach(d => {
                dates.push(this.datePipe.transform(new Date(d.dateOfBFSP), 'dd-MM-yyyy'))
              });

              //removing duplicates
              dates = Array.from(new Set(dates))

              resolve(dates)
            } else {
              dbOperationStatus.isSuccess = false;
              dbOperationStatus.message = "No data found";
              reject(dbOperationStatus);
            }

          } else {
            dbOperationStatus.isSuccess = false;
            dbOperationStatus.message = "No data found";
            reject(dbOperationStatus);
          }

        })
        .catch(err => {
          dbOperationStatus.isSuccess = false;
          dbOperationStatus.message = err.message;
          reject(dbOperationStatus);
        })


    });
    return promise;
  }
}
