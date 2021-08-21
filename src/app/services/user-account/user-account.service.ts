import { EndpointService } from './../endpoints/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  private headers: HttpHeaders;
  private formHeaders: HttpHeaders;
  editProfileUrl: string;
  getUserUrl: string;
  enableTwoFaUrl: string;
  disableTwoFaUrl: string;
  changePasswordUrl: string;
  getAnyUserUrl: string;

  constructor(private http: HttpClient, private endpoint: EndpointService) {
    this.headers = this.endpoint.headers();
    this.formHeaders = this.endpoint.headers(true);
    this.editProfileUrl = this.endpoint.apiHost + '/v1/editProfile'; 
    this.getUserUrl = this.endpoint.apiHost + '/user'; 
    this.getAnyUserUrl = this.endpoint.apiHost + '/getUser/'; 
    this.enableTwoFaUrl = this.endpoint.apiHost + '/v1/enableTwoWayAuth'; 
    this.disableTwoFaUrl = this.endpoint.apiHost + '/v1/disableTwoWayAuth'; 
    this.changePasswordUrl = this.endpoint.apiHost + '/v1/changePassword/'; 
  }

  editProfile(profile: any, photo: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('profile', photo);
      formData.append('firstname', profile.firstname);
      formData.append('lastname', profile.lastname);
      formData.append('country', profile.country);
      formData.append('phone', profile.phone);
      formData.append('usertype', profile.usertype);
      formData.append('dob', profile.dob);
      formData.append('gender', profile.gender);

      const url = this.editProfileUrl;
      this.http.post<any>(url, formData, { headers: this.formHeaders }).subscribe(
        res => {
          console.log('edit_profile_ok: ', res);
          resolve(res);
        },
        err => {
          console.error('edit_profile_error: ', err);
          reject(err);
        }
      );
    });
  }

  getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.getUserUrl;
      this.http.get<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_user_ok: ', res);
          resolve(res);
        },
        err => {
          console.log('get_user_error: ', err);
          reject(err);
        }
      );
    });
  }

  getAnyUser(user_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = this.getAnyUserUrl + user_id;
      this.http.post<any>(url, { headers: this.headers}).subscribe(
        res => {
          console.log('get_events369_user_ok: ', res);
          resolve(res);
        },
        err => {
          console.log('get_events369_user_error: ', err);
          reject(err);
        }
      );
    });
  }

  enableTwoFA(phone: any): Promise<any> {
    console.log(phone);
    console.log(this.enableTwoFaUrl);
    return new Promise((resolve, reject) => {     
      this.http.post<any>(this.enableTwoFaUrl, JSON.stringify(phone), { headers: this.headers}).subscribe(
        res => {
          console.log('edit_event_ok: ', res);
          resolve(res);
        },
        err => {
          console.error('edit_event_error: ', err);
          reject(err);
        }
      );
    });
  }

  disableTwoFa(): Promise<any> {
    console.log(this.disableTwoFaUrl);
    return new Promise((resolve, reject) => {     
      this.http.post<any>(this.disableTwoFaUrl, {}, { headers: this.headers}).subscribe(
        res => {
          console.log('disable_twofa_ok: ', res);
          resolve(res);
        },
        err => {
          console.error('disable_twofa_error: ', err);
          reject(err);
        }
      );
    });
  }

  changePassword(password: any, userId: any): Promise<any> {
    console.log(password);
    let url = this.changePasswordUrl + userId;
    return new Promise((resolve, reject) => {     
      this.http.post<any>(url, JSON.stringify(password), { headers: this.headers}).subscribe(
        res => {
          console.log('edit_event_ok: ', res);
          resolve(res);
          // if (_.toLower(res.message) == 'ok') {
          //   resolve(true);            
          // }
          // else {
          //   resolve(false);
          // }
        },
        err => {
          console.error('edit_event_error: ', err);
          reject(err);
        }
      );
    });
  }

}
