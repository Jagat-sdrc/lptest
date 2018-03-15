import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { MessageProvider } from '../message/message';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file'
import { DatePipe } from '@angular/common';


/**
 * This provider is going to deal with codes which are going to help in exporting data to csv
 * 
 * @export
 * @class ExportServiceProvider
 * @since 1.2.0
 * @author Ratikanta
 */
@Injectable()
export class ExportServiceProvider {

  dataToExport;
  folder_name;
  file_name;
  constructor(private papa: PapaParseService, private messageService: MessageProvider,
    private storage: Storage, private file: File, private datePipe: DatePipe) { }

  /**
   * This method is going to have all the business logic to export data from app to android device root folder
   * @since 1.2.0
   * @author Ratikanta
   */
  async export() {
    await this.setDataToExport()
    let result = await this.createFolderAndFile()
    if (result)
      await this.writeDataToFile()
  }

  /**
   * 
   * This method is going to set the data which we are going to export
   * @memberof ExportServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  async setDataToExport() {


    let data: any[] = []
    //making the data object
    this.dataToExport = {
      data: data
    }

    data = await this.getPatients(data)
    data = await this.getBFExpressions(data)
    data = await this.getBFSPs(data)
    data = await this.getFeedExpressions(data)
    data = await this.getBFPDs(data)
    data = await this.getUsers(data)

    this.dataToExport.data = data;
  }


  /**
   * 
   * This method is going to create files and folders where we are going to keep the data
   * @memberof ExportServiceProvider
   * @returns Promise<boolean> value, returns true,  if folder and file both created successfully. 
   * Returns false if folder and file could ot create successfully
   * @since 1.2.0
   * @author Ratikanta
   */
  async createFolderAndFile(): Promise<boolean> {

    try {
      this.folder_name = ConstantProvider.appFolderName;
      this.file_name = 'Lactation ' + this.datePipe.transform(new Date(), 'dd-MM-yyyy HHmm') + ".csv"    

      //creating file       
      await this.file.createFile(this.file.externalRootDirectory + "/" + this.folder_name, this.file_name, true)
      return true
    } catch (err) {
      this.messageService.showErrorToast(ConstantProvider.messages.couldNotCreateFile)
      return false
    }


  }


  /**
   * 
   * This method is going to write the data into file
   * @memberof ExportServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  async writeDataToFile() {

    try {
      let csvData = this.papa.unparse(this.dataToExport);

      await this.file.writeFile(this.file.externalRootDirectory + "/" + this.folder_name, this.file_name, csvData,
        { replace: true, append: false })

      this.messageService.showSuccessToast(ConstantProvider.messages.dataExportSuccessful)
    } catch (err) {
      this.messageService.showErrorToast(ConstantProvider.messages.couldNotWriteToFile)
    }


  }


  /**
   * 
   * This method is going to give all patient records present in the database
   * @memberof ExportServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  async getPatients(data: any[]) {


    //setting header
    let row: any[] = []
    row.push("Patient data")
    data.push(row)

    row = []
    row.push('')
    data.push(row)

    //getting data from database
    let patients: IPatient[] = await this.storage.get(ConstantProvider.dbKeyNames.patients);
    if (patients != null) {

      //set headers
      row = []
      row.push('Baby ID')
      row.push('Baby ID by hospital')
      //need to right all the columns

      //Looping over patients and setting it in data
      patients.forEach(patient => {
        row = []

        //Setting all column value
        row.push(patient.babyCode)
        row.push(patient.babyCodeHospital)
        row.push(patient.mothersAge)
        row.push(patient.babyOf)

        //Pushing into data
        data.push(row)
      });
    } 

    return data
  }


  /**
   * 
   * This method is going to give all bf expression records present in the database
   * @memberof ExportServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  async getBFExpressions(data: any[]) {


    //setting header

    let row: any[] = []
    row.push('')
    data.push(row)

    row = []
    row.push("Breast feed expression")
    data.push(row)

    row = []
    row.push('')
    data.push(row)



    //getting bf expressions from database
    let bfExpressions: IBFExpression[] = await this.storage.get(ConstantProvider.dbKeyNames.bfExpressions);
    if (bfExpressions != null) {

      //Looping over bf expressions and setting it in data
      bfExpressions.forEach(bfExpression => {
        row = []

        //Setting all column value
        // row.push(patient.babyCode)
        // row.push(patient.babyCodeHospital)
        // row.push(patient.mothersAge)
        // row.push(patient.babyOf)

        //Pushing into data
        data.push(row)
      });
    }
    return data
  }


  /**
   * 
   * This method is going to give all BFSP records present in the database
   * @memberof ExportServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  async getBFSPs(data: any[]) {


    //setting header

    let row: any[] = []
    row.push('')
    data.push(row)

    row = []
    row.push("Breastfeeding supportive practice")
    data.push(row)

    row = []
    row.push('')
    data.push(row)



    //getting bf expressions from database
    let bfsps: IBFSP[] = await this.storage.get(ConstantProvider.dbKeyNames.bfsps);
    if (bfsps != null) {

      //Looping over bfsps and setting it in data
      bfsps.forEach(bfsp => {
        row = []

        //Setting all column value
        // row.push(patient.babyCode)
        // row.push(patient.babyCodeHospital)
        // row.push(patient.mothersAge)
        // row.push(patient.babyOf)

        //Pushing into data
        data.push(row)
      });
    }

    return data
  }



  /**
   * 
   * This method is going to give all log feed records present in the database
   * @memberof ExportServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  async getFeedExpressions(data: any[]) {

    

    //setting header

    let row: any[] = []
    row.push('')
    data.push(row)

    row = []
    row.push("Log feed")
    data.push(row)

    row = []
    row.push('')
    data.push(row)



    //getting log feed from database
    let feedExpressions: IFeed[] = await this.storage.get(ConstantProvider.dbKeyNames.feedExpressions);
    if (feedExpressions != null) {

      //Looping over feed expressions and setting it in data
      feedExpressions.forEach(feedExpression => {
        row = []

        //Setting all column value
        // row.push(patient.babyCode)
        // row.push(patient.babyCodeHospital)
        // row.push(patient.mothersAge)
        // row.push(patient.babyOf)

        //Pushing into data
        data.push(row)
      });
    }

    return data
  }


  /**
   * 
   * This method is going to give all BFPD records present in the database
   * @memberof ExportServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  async getBFPDs(data: any[]) {

    


    //setting header

    let row: any[] = []
    row.push('')
    data.push(row)

    row = []
    row.push("Breast feeding post discharge")
    data.push(row)

    row = []
    row.push('')
    data.push(row)



    //getting bf expressions post discharge from database
    let bfpds: IBFPD[] = await this.storage.get(ConstantProvider.dbKeyNames.bfpds);
    if (bfpds != null) {

      //Looping over bfpds and setting it in data
      bfpds.forEach(bfpd => {
        row = []

        //Setting all column value
        // row.push(patient.babyCode)
        // row.push(patient.babyCodeHospital)
        // row.push(patient.mothersAge)
        // row.push(patient.babyOf)

        //Pushing into data
        data.push(row)
      });
    }
    return data
  }



  /**
   * 
   * This method is going to give all patient records present in the database
   * @memberof ExportServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  async getUsers(data: any[]) {






    









    //setting header

    let row: any[] = []
    row.push('')
    data.push(row)

    row = []
    row.push("Users")
    data.push(row)

    row = []
    row.push('')
    data.push(row)



    //getting users from database
    let users: IUser[] = await this.storage.get(ConstantProvider.dbKeyNames.users);
    if (users != null) {

      //Looping over users and setting it in data
      users.forEach(user => {
        row = []

        //Setting all column value
        // row.push(patient.babyCode)
        // row.push(patient.babyCodeHospital)
        // row.push(patient.mothersAge)
        // row.push(patient.babyOf)

        //Pushing into data
        data.push(row)
      });
    }

    return data
  }



}
