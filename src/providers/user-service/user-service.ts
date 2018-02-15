import { Injectable } from '@angular/core';

/**
 * This service is going to deal with user related stuffs
 * @author Ratikanta
 * @since 0.0.1
 */
@Injectable()
export class UserServiceProvider {

  private userId: string;
  constructor() {}

  setUserId(userId: string){
    this.userId = userId
  }

  getUserId(): string{
    return this.userId
  }

}
