import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { MessageProvider } from '../message/message';
import { File } from '@ionic-native/file'
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

/**
 * This service will deal with all the preloaded data work
 * @since 1.1.0
 * @author Ratikanta
 * @export
 * @class PreloadDataServiceProvider
 */
@Injectable()
export class PreloadDataServiceProvider {

  file_name: string = 'preloaded-data.json';
  folder_name: string;

  constructor(private storage: Storage, private messageService: MessageProvider, 
  private file: File,
private http: HttpClient){}

  /**
   * This method is going to write data to file
   * @author Ratikanta
   * @since 1.1.0
   * 
   * @memberof PreloadDataServiceProvider
   */
  async writeDataToFile(){

    try{

      let objectToWriteInFile: IObjectToWriteInFile = {
        users: await this.storage.get(ConstantProvider.dbKeyNames.users),
        patients: await this.storage.get(ConstantProvider.dbKeyNames.patients),
        bfExpressions: await this.storage.get(ConstantProvider.dbKeyNames.bfExpressions),
        feedExpressions: await this.storage.get(ConstantProvider.dbKeyNames.feedExpressions),
        bfsps: await this.storage.get(ConstantProvider.dbKeyNames.bfsps),
        bfpds: await this.storage.get(ConstantProvider.dbKeyNames.bfpds),
        latestPatientId: await this.storage.get(ConstantProvider.dbKeyNames.latestPatientId)
      }

      console.log("objectToWriteInFile", objectToWriteInFile);

      let objectToWriteInFile_string= JSON.stringify(objectToWriteInFile);
      this.folder_name = ConstantProvider.appFolderName;
      await this.file.createFile(this.file.externalRootDirectory + "/" + this.folder_name, this.file_name, true)
      await this.file.writeFile(this.file.externalRootDirectory + "/" + this.folder_name, this.file_name, objectToWriteInFile_string,
          { replace: true, append: false })

     this.messageService.showSuccessToast("Done")     

    this.messageService.stopLoader();
  }catch(err){
    this.messageService.stopLoader();
    console.log(err)
  }


  }



  async checkAndPreloadData(){
    let users: IUser[]= await this.storage.get(ConstantProvider.dbKeyNames.users)
    if(!(users != null && users.length > 0)){
      //push all the data into respective keys
      let objectToWriteInFile: IObjectToWriteInFile = (await this.http.get("./assets/preloaded-data.json").toPromise()) as IObjectToWriteInFile 
      await this.storage.set(ConstantProvider.dbKeyNames.users, objectToWriteInFile.users)
      await this.storage.set(ConstantProvider.dbKeyNames.patients, objectToWriteInFile.patients)
      await this.storage.set(ConstantProvider.dbKeyNames.bfExpressions, objectToWriteInFile.bfExpressions)
      await this.storage.set(ConstantProvider.dbKeyNames.feedExpressions, objectToWriteInFile.feedExpressions)
      await this.storage.set(ConstantProvider.dbKeyNames.bfsps, objectToWriteInFile.bfsps)
      await this.storage.set(ConstantProvider.dbKeyNames.bfpds, objectToWriteInFile.bfpds)
      await this.storage.set(ConstantProvider.dbKeyNames.latestPatientId, objectToWriteInFile.latestPatientId)

      this.messageService.showSuccessToast("Data loaded from file")  

    }
  }



}
