import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { zuul_gateway } from "src/app/config/HttpConfig";
import { SignUpResponse, SignInResponse, MessageResponse } from "src/app/bean/Response";
import { retry } from 'rxjs/operators';
import { CommonHTTPService } from '../common/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  private api: string = zuul_gateway
  private options = {headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
  
  constructor(
    private http: HttpClient,
    private commonHttp: CommonHTTPService
  ) {  }


  requestCode(value: any) {
    const requestCodeUrl = `${this.api}/api/requestCode`;
    return this.http.post<MessageResponse>(requestCodeUrl, value, this.options).pipe(
        retry(3),
        catchError(this.commonHttp.handleError('requestCode()'))
    )
  }

  resetPassword(value: any) {
    const requestCodeUrl = `${this.api}/api/resetPassword`;
    return this.http.post<MessageResponse>(requestCodeUrl, value, this.options).pipe(
        retry(3),
        catchError(this.commonHttp.handleError('requestCode()'))
    )
  }

  signIn(data) {
    const signInUrl = `${this.api}/api/signIn`;
    // const params = typeof(data)==='object' && String(data) !== '[object File]'? this.paramFormat(data): data;
    // console.log(params)
    window.localStorage.removeItem('jwt')

    return this.http.post(signInUrl, data, this.options).pipe(
      retry(3),
      tap((res: SignInResponse) => {
        const jwt =  res.jwt
        let jsonAuthoriztion  = jwt ? "Bearer " + jwt : "Bearer ";
        window.localStorage.setItem("jwt", jsonAuthoriztion)
        window.localStorage.setItem("flina-user-save", JSON.stringify(res.user));
      }),
     catchError(this.signInhandleError('signIn()'))
    );
  }

  private signInhandleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {  
      console.error(error); 
      this.commonHttp.log(`账户或密码错误，请`, "检查账户和密码");
      return of(result as T);
    };
  }

  signUp(data) {
    const signUpUrl = `${this.api}/api/signUp`
    return this.http.post(signUpUrl, data, this.options).pipe(
      retry(3),
      tap( (signUpRes: SignUpResponse) => {
        // this.log(`${JSON.stringify(signUpRes)}`);
        if(signUpRes.state){
          this.commonHttp.log(`${signUpRes.msg}，请`,`登录账户`);
        }else{
          this.commonHttp.log(`${signUpRes.msg}，请`,`注册新账户`);
        }
      }),
     catchError(this.commonHttp.handleError('addUser()'))
    );
  }

}
