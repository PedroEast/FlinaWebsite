import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { catchError, map, retry, tap } from 'rxjs/operators';

import { UserMeta } from "../entity/UserMeta";
import { user_api, getLatestJsonHttpOptions, getLatestDownloadFileHttpOptions, admin_api} from "../config/HttpConfig";
import { CommonHTTPService } from '../common/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserMetaSqlService {

    private api: string = user_api + "/userMeta";
    private adminApi: string = admin_api + "/userMeta";
    private options: object = getLatestJsonHttpOptions();
    constructor(
        private http: HttpClient,
        private commonHttp: CommonHTTPService
    ) {  }

    addUserMeta(userMeta: UserMeta): Observable<UserMeta> {
        return this.http.post<UserMeta>(this.api, userMeta, this.options).pipe(
            retry(3),
            tap((newUserMeta: UserMeta) => console.log(`added userMeta success.`)),
            catchError(this.commonHttp.handleError<UserMeta>('addUserMeta()'))
        );
    }
    updateUserMeta(userMeta: UserMeta): Observable<any> {
        return this.http.put(this.api, userMeta, this.options).pipe(
            retry(3),
            tap(_ => console.log(`updated userMeta id=${userMeta.id} success.`)),
            catchError(this.commonHttp.handleError<any>('updateUserMeta()'))
        );
    }
    deleteUserMeta(userMeta: UserMeta | number): Observable<UserMeta> {
        const id = typeof userMeta === 'number' ? userMeta : userMeta.id;
        const url = `${this.api}/${id}`;
        return this.http.delete<UserMeta>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`deleted userMeta id=${id} success.`)),
            catchError(this.commonHttp.handleError<UserMeta>('deleteUserMeta()'))
        );
    }
    getAllUserMeta(): Observable<UserMeta[]> {
        const url = `${this.adminApi}/all`;
        return this.http.get<UserMeta[]>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched all UserMeta success.`)),
            catchError(this.commonHttp.handleError<UserMeta[]>(`getAllUserMeta()`, []))
        );
    }
    getUserMetaBy(id: number): Observable<UserMeta[]> {
        const url = `${this.api}/${id}`;
        return this.http.get<UserMeta[]>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched userMeta id=${id} success.`)),
            catchError(this.handleError<UserMeta[]>(`getUserMeta() id=${id}`))
        );
    }

    handleError<T>(operation = 'operation', result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {  
            const errorStatusCode: number = error.status;
            // console.log(errorStatusCode)
            // 403被拒， 因为没有权限，跳转至登陆界面
            switch (errorStatusCode) {
                case 403: 
                    this.log("登陆过期，请重新登陆");
                    break;
                case 404: 
                    this.log("找不到页面, 报告给我们, 我们会帮助解决");
                    break;
                case 500: 
                    this.log("请完善用户资料");
                    break;
                default:
                    this.log("似乎出错了，报告给我们，我们会帮助解决");
            }
            console.log(`${operation} failed: ${error.message}`);
            console.error(error); 
            return of(result as T);
        };
    }
    
    log(msg: string, action=null){
        action ? this.commonHttp.log(msg, action) : this.commonHttp.log(msg);
    }
}
