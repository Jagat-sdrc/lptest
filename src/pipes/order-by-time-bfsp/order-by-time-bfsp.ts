import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * This pipe will deal with ordering the entries with respect to time in bfsp forms
 * @author Naseem Akhtar
 * @since 0.0.1
 */
@Pipe({
  name: 'orderByTimeBfsp'
})
export class OrderByTimeBfspPipe implements PipeTransform {
  constructor(private datePipe: DatePipe){}

  transform(bfsp: IBFSP[], ...args): IBFSP[] {


    if(bfsp != undefined && bfsp != null && bfsp.length > 0){

      let date = new Date(bfsp[0].dateOfBFSP) 
      bfsp.sort((a: IBFSP, b: IBFSP) => {

        let dateString = this.datePipe.transform(date, 'dd-MM-yyyy');
        let day = parseInt(dateString.split('-')[0])
        let month = parseInt(dateString.split('-')[1])
        let year = parseInt(dateString.split('-')[2])

        let hourOfA = parseInt(a.timeOfBFSP.split(':')[0])
        let minuteOfA = parseInt(a.timeOfBFSP.split(':')[1])

        let hourOfB = parseInt(b.timeOfBFSP.split(':')[0])
        let minuteOfB = parseInt(b.timeOfBFSP.split(':')[1])


        let dateOfA: Date = new Date(year, month, day, hourOfA, minuteOfA)
        let dateOfB: Date = new Date(year, month, day, hourOfB, minuteOfB)

        if (dateOfA < dateOfB) {
          return 1;
        } else if (a > b) {
          return -1;
        } else {
          return 0;
        }
      });
      return bfsp
    }
    return bfsp
  }
}
