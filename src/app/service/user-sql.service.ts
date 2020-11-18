import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, retry, tap } from 'rxjs/operators';

import { User } from "../entity/User";
import { coder_api, admin_api, zuul_gateway, getLatestJsonHttpOptions, getLatestDownloadFileHttpOptions, user_api} from "src/app/config/HttpConfig";
import { CommonHTTPService } from '../common/common-http.service';
import { UserViewReponse } from 'src/app/bean/Response';

@Injectable({
  providedIn: 'root'
})
export class UserSqlService {
    private api: string = coder_api + "/user";
    private admin_api = admin_api + "/user"
    private user_api = user_api + "/user"
    private options = getLatestJsonHttpOptions();

    constructor(
        private http: HttpClient,
        private commonHttp: CommonHTTPService
    ) {  }

    addUser(user: User): Observable<User> {
      return this.http.post<User>(this.api, user, this.options).pipe(
        retry(3),
        tap((newUser: User) => console.log(`added user success.`)),
        catchError(this.commonHttp.handleError<User>('addUser()'))
      );
    }
    updateUser(user: User): Observable<any> {
      return this.http.put(this.api, user, this.options).pipe(
        retry(3),
        tap(_ => console.log(`updated user id=${user.id} success.`)),
        catchError(this.commonHttp.handleError<any>('updateUser()'))
      );
    }
    deleteUser(user: User | number): Observable<User> {
      const id = typeof user === 'number' ? user : user.id;
    
      const url = `${this.api}/${id}`;
      return this.http.delete<User>(url, this.options).pipe(
        retry(3),
        tap(_ => console.log(`deleted user id=${id} success.`)),
        catchError(this.commonHttp.handleError<User>('deleteUser()'))
      );
    }
    getAllUser(): Observable<User[]> {
      const url = `${this.api}/all`
      return this.http.get<User[]>(url, this.options).pipe(
          retry(3),
          tap(_ => console.log(`fetched all User success.`)),
          catchError(this.commonHttp.handleError<User[]>(`getAllUser()`, []))
        );
    }
    getUserBy(id: number): Observable<User> {
      const url = `${this.api}/${id}`;
      return this.http.get<User>(url, this.options).pipe(
          retry(3),
          tap(_ => console.log(`fetched user id=${id} success.`)),
          catchError(this.commonHttp.handleError<User>(`getUser() id=${id}`))
        );
    }
    
    getAllUserView(): Observable<UserViewReponse[]> {
        const url = `${this.admin_api}/all`
        return this.http.get<UserViewReponse[]>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched all User success.`)),
            catchError(this.commonHttp.handleError<UserViewReponse[]>(`getAllUser()`, []))
          );
      }
}