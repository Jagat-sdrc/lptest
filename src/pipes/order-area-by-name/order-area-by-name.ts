import { Pipe, PipeTransform } from '@angular/core';

/**
 * @author - Naseem Akhtar (naseem@sdrc.co.in)
 * 
 * This pipe will be used to order area drop downs in ascending order.
 */
@Pipe({
  name: 'orderAreaByName',
})
export class OrderAreaByNamePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(areas: IArea[], ...args): IArea[] {
    if(areas != undefined && areas != null && areas.length > 0){
      areas.sort((area1: IArea, area2: IArea) => {
        var area1Name = area1.name.toLowerCase(), area2Name = area2.name.toLowerCase()
        if (area1Name < area2Name) //sort string ascending
          return -1 
        if (area1Name > area2Name)
          return 1
        return 0 //default return value (no sorting)
      })

      return areas
    }
  }
}
