import { EndpointService } from './../endpoints/endpoint.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  public redirectUrl: any = null;
  // public isLoggedIn: boolean = false;

  private headers: HttpHeaders;  
  private baseUrl = 'http://events369.logitall.biz/api/';
  public facebookAuthUrl = 'http://events369.logitall.biz/api/auth/facebook';
  public googleAuthUrl = 'http://events369.logitall.biz/api/auth/google';
  private sendMagicUrl = 'http://events369.logitall.biz/api/sendmagiclink';

  constructor(
    private http: HttpClient,
    private endpoint: EndpointService
    ) { 
      this.headers = this.endpoint.headers();
    
    }

  regsiterUser(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register', user);      
  }

  loginUser(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'loginIAM', user);
  }

  authenticatePhone(code: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'twoWayAuthenticationVerification/' + sessionStorage.getItem('user_id') + '/' + code + '/' + sessionStorage.getItem('user_phone'), {});      
  }

  resendPhoneCode(): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'sendTwoWayAuthenticationCode/' + sessionStorage.getItem('user_id') + '/' + sessionStorage.getItem('user_phone'), {});      
  }

  accountRecovery(user: any): Observable<any> {
    console.log(user);
    return this.http.post<any>(this.baseUrl + 'forgotPassword', user);      
  }

  resetPassword(password: any, ecncryption: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'resetPassword/' + ecncryption, password);      
  }

  singupEmail(body: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'registerIAM', body);      
  }

  singupMoreInfo(body: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'complete_registration/' + sessionStorage.getItem('registration_id'), body);      
  }

  resendActivationLink(ecncryption: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'resend_verification_link/' + ecncryption, {});      
  }

  resendActivation(): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'resend_verification_link/' + sessionStorage.getItem('registration_id') , {});      
  }

  resendRecoveryLink(ecncryption: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'resend_pass_reset_link/' + ecncryption, {});      
  }

  resendRecovery() {
    return this.http.post<any>(this.baseUrl + 'resend_pass_reset_link/' + sessionStorage.getItem('registration_id'), {});
  }
  
  editProfileLink(profile: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'v1/editProfile', profile);      
  }

  // signUpWithFacebook(): Observable<any> {
  //   return this.http.get<any>(this.facebookAuthUrl);      
  // }
  sendMagicLink(body: any): Observable<any> {
    return this.http.post<any>(this.sendMagicUrl, body);  
  }  

  isLoggedIn() {
    return !!sessionStorage.getItem('x_auth_token');
  }

}
