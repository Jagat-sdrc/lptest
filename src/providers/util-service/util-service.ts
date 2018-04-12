import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';

/**
 * This service is going help us in common util stuffs
 *
 * @class UtilServiceProvider
 * @since 1.2.0
 * @author Ratikanta
 */
@Injectable()
export class UtilServiceProvider {

  typeDetails: ITypeDetails[] = [];
  areas: IArea[] = [];
  uuidNumber: string;
  constructor(private http: HttpClient,private device: Device){}



  /**
   * This method is going to return type detail name from a id
   *
   * @param {number} id Type detail id
   * @memberof UtilServiceProvider
   * @return Type details name, string
   * @author Ratikanta
   */
  getTypeDetailName(id: number): string{

    return (this.typeDetails.filter(d=> d.id === id))[0].name

  }

  /**
   * This method is going to set the property variable's default value
   *
   * @memberof UtilServiceProvider
   * @since 1.2.0
   * @author Ratikanta
   */
  setDefaults(){
    //Setting type details
    this.http.get("./assets/data.json")
    .subscribe(data=>{
      this.typeDetails = (data as any).typeDetails
      this.areas = (data as any).areaDetails
    })
  }

  /**
   * This method is going to return area name from a id
   *
   * @param {number} areaId area id
   * @memberof UtilServiceProvider
   * @return area name, string
   * @author Ratikanta
   */
  getAreaNameById(areaId: number): string{
    return (this.areas.filter(d=> d.id === areaId))[0].name
  }

  /**
   * This method is going to return area short name from an id
   *
   * @param {number} areaId area id
   * @memberof UtilServiceProvider
   * @return area short name, string
   * @author Ratikanta
   */
  getAreaShortNameById(areaId: number): string{
    return (this.areas.filter(d=> d.id === areaId))[0].shortName
  }

  /**
   * This method will return the Universally unique identifier of the specific device
   *
   * @author Jagat Bandhu
   * @since 1.2.0
   */
  getUuid(){
    return this.uuidNumber
  }

  /**
   * This method set the Universally unique identifier of the specific device in uuidNumber variable
   *
   * @author Jagat Bandhu
   * @since 1.2.0
   */
  setUuid() {
    this.uuidNumber = this.device.uuid
  }
}
