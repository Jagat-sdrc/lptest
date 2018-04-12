import { Pipe, PipeTransform } from '@angular/core';

/**
 * @author - Ratikanta Pradhan
 * @since - 0.0.1 
 * 
 * This pipe is used to search the babies by using various attributes of a baby
 * like babyCode, mother name etc.
 */

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(patients: IPatient[], ...args): IPatient[] {

    let searchText = args[0];
    if (patients != undefined && patients != null && searchText != undefined && searchText != null) {

      return patients.filter(patient => {
        let count = 0;
        if (patient.babyCode.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
          count++;
        }
        if(patient.babyOf != null && patient.babyOf != undefined && patient.babyOf != ""){
          if (patient.babyOf.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
            count++;
          }
        }else{
          count++;
        }
        if(patient.babyCodeHospital != null && patient.babyCodeHospital != undefined && patient.babyCodeHospital != ""){
          if (patient.babyCodeHospital.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
            count++;
          }
        }else{
          count++;
        }
        if(count === 3){
          return false
        }else{
          return true;
        }

      })

    } else {
      return patients
    }

  }
}
