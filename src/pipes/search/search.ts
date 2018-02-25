import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
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
      

      // sortPatient:sortBy


      return patients.filter(patient => {
        let count = 0;
        if (patient.babyCode.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
          count++;
        }
        if (patient.babyOf.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
          count++;
        }
        if (patient.babyCodeHospital.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
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
