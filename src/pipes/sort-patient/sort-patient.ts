import { Pipe, PipeTransform } from '@angular/core';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * This pipe will sort the given list of data based on sort by
 *
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@Pipe({
  name: 'sortPatient',
})
export class SortPatientPipe implements PipeTransform {


  transform(patients: IPatient[], ...args): IPatient[] {

    if(patients != undefined && patients != null && patients.length > 0){
      switch(args[0]){
        case (ConstantProvider.patientSortBy.deliveryDate || ConstantProvider.patientSortBy.deliveryTime):
        patients.sort((a: IPatient, b: IPatient) => {
          let dayOfA = parseInt(a.deliveryDate.split('-')[2])
          let monthOfA = parseInt(a.deliveryDate.split('-')[1])
          let yearOfA = parseInt(a.deliveryDate.split('-')[0])

          let dayOfB = parseInt(b.deliveryDate.split('-')[2])
          let monthOfB = parseInt(b.deliveryDate.split('-')[1])
          let yearOfB = parseInt(b.deliveryDate.split('-')[0])

          let hourOfA = parseInt(a.deliveryTime.split(':')[0])
          let minuteOfA = parseInt(a.deliveryTime.split(':')[1])

          let hourOfB = parseInt(b.deliveryTime.split(':')[0])
          let minuteOfB = parseInt(b.deliveryTime.split(':')[1])

          let dateOfA: Date = new Date(yearOfA, monthOfA, dayOfA, hourOfA, minuteOfA)
          let dateOfB: Date = new Date(yearOfB, monthOfB, dayOfB, hourOfB, minuteOfB)

          if (dateOfA < dateOfB) {
            return 1;
          } else if (dateOfA > dateOfB) {
            return -1;
          } else {
            return 0;
          }
        });
        break;
        case ConstantProvider.patientSortBy.weight:
          patients.sort((a: IPatient, b: IPatient) => {
            let weightOfA: number = a.babyWeight;
            let weightOfB: number = b.babyWeight;
            weightOfA = parseInt(weightOfA+"");
            weightOfB = parseInt(weightOfB+"");
            if (weightOfA < weightOfB) {
              return 1;
            } else if (weightOfA > weightOfB) {
              return -1;
            } else {
              return 0;
            }
          });
        break;
        case ConstantProvider.patientSortBy.inPatient:
        if((patients.filter(d => d.inpatientOrOutPatient === ConstantProvider.typeDetailsIds.inPatient)).length > 0){
          patients.sort((a: IPatient, b: IPatient) => {
            if (a.inpatientOrOutPatient === ConstantProvider.typeDetailsIds.inPatient) {
              return -1;
            } else {
              return 1;
            }
          });
        }else{
          patients = [];
        }
        break;
        case ConstantProvider.patientSortBy.outPatient:
        if((patients.filter(d => d.inpatientOrOutPatient === ConstantProvider.typeDetailsIds.outPatient)).length > 0){
          patients.sort((a: IPatient, b: IPatient) => {
            if (a.inpatientOrOutPatient === ConstantProvider.typeDetailsIds.outPatient) {
              return -1;
            } else {
              return 1;
            }
          });
        }else{
          patients = [];
        }
        break;
        case ConstantProvider.patientSortBy.vaginal:
        if((patients.filter(d => d.deliveryMethod === ConstantProvider.typeDetailsIds.vaginal)).length > 0){
          patients.sort((a: IPatient, b: IPatient) => {
            if (a.deliveryMethod === ConstantProvider.typeDetailsIds.vaginal) {
              return -1;
            } else {
              return 1;
            }
          });
        }else{
          patients = [];
        }
        break;
        case ConstantProvider.patientSortBy.csection:
        if((patients.filter(d => d.deliveryMethod === ConstantProvider.typeDetailsIds.csection)).length > 0){
          patients.sort((a: IPatient, b: IPatient) => {
            if (a.deliveryMethod === ConstantProvider.typeDetailsIds.csection) {
              return -1;
            } else {
              return 1;
            }
          });
        }else{
          patients = [];
        }
        break;
        case ConstantProvider.patientSortBy.other:
        if((patients.filter(d => d.deliveryMethod === ConstantProvider.typeDetailsIds.other)).length > 0){
          patients.sort((a: IPatient, b: IPatient) => {
            if (a.deliveryMethod === ConstantProvider.typeDetailsIds.other) {
              return -1;
            } else {
              return 1;
            }
          });
        }else{
          patients = [];
        }
        break;
        case ConstantProvider.patientSortBy.unknown:
        if((patients.filter(d => d.deliveryMethod === ConstantProvider.typeDetailsIds.unknown)).length > 0){
          patients.sort((a: IPatient, b: IPatient) => {
            if (a.deliveryMethod === ConstantProvider.typeDetailsIds.unknown) {
              return -1;
            } else {
              return 1;
            }
          });
        }else{
          patients = [];
        }
        break;
      }
      return patients;
    }
  }
}
