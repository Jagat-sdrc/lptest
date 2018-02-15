import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * This service will only provide service to Registered Patient component
 * 
 * @author Jagat Bandhu
 * @since 0.0.1
 */
@Injectable()
export class RegisteredPatientServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RegisteredPatientServiceProvider Provider');
  }

}
