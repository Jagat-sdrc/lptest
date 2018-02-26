import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * This pipe will deal with ordering the entries with respect to time
 * @author Ratikanta
 * @since 0.0.1
 */
@Pipe({
  name: 'orderByTime',
})
export class OrderByTimePipe implements PipeTransform {
  
  constructor(private datePipe: DatePipe){}

  transform(feedExpressions: IFeed[], ...args): IFeed[] {


    if(feedExpressions != undefined && feedExpressions != null && feedExpressions.length > 0){

      let date = feedExpressions[0].dateOfFeed
      feedExpressions.sort((a: IFeed, b: IFeed) => {

        let day = parseInt(date.split('-')[0])
        let month = parseInt(date.split('-')[1])
        let year = parseInt(date.split('-')[2])

        let hourOfA = parseInt(a.timeOfFeed.split(':')[0])
        let minuteOfA = parseInt(a.timeOfFeed.split(':')[1])

        let hourOfB = parseInt(b.timeOfFeed.split(':')[0])
        let minuteOfB = parseInt(b.timeOfFeed.split(':')[1])


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
      return feedExpressions

    }
    return feedExpressions
  }
}
