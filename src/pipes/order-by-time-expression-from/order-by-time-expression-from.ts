import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * This pipe will deal with ordering the entries with respect to time in BfExpression forms
 * @author Naseem Akhtar
 * @since 0.0.1
 */
@Pipe({
  name: 'orderByTimeExpressionFrom',
})
export class OrderByTimeExpressionFromPipe implements PipeTransform {
  constructor(private datePipe: DatePipe){}

  transform(expressionForm: IBFExpression[], ...args): IBFExpression[] {


    if(expressionForm != undefined && expressionForm != null && expressionForm.length > 0){

      let date = new Date(expressionForm[0].dateOfExpression) 
      expressionForm.sort((a: IBFExpression, b: IBFExpression) => {

        let dateString = this.datePipe.transform(date, 'dd-MM-yyyy');
        let day = parseInt(dateString.split('-')[0])
        let month = parseInt(dateString.split('-')[1])
        let year = parseInt(dateString.split('-')[2])

        let hourOfA = parseInt(a.timeOfExpression.split(':')[0])
        let minuteOfA = parseInt(a.timeOfExpression.split(':')[1])

        let hourOfB = parseInt(b.timeOfExpression.split(':')[0])
        let minuteOfB = parseInt(b.timeOfExpression.split(':')[1])


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
      return expressionForm
    }
    return expressionForm
  }
}
