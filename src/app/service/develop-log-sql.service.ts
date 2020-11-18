import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { catchError, map, retry, tap } from 'rxjs/operators';

import { DevelopLog } from "../entity/DevelopLog";
import { coder_api, zuul_gateway, getLatestJsonHttpOptions, getLatestDownloadFileHttpOptions, admin_api} from "src/app/config/HttpConfig";
import { CommonUIService } from '../common/common-ui.service';
import { CommonHandleErrorUtil } from '../util/CommonHandleErrorUtil';
import { CommonHTTPService } from '../common/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class DevelopLogSqlService {
    private api: string = admin_api + "/developLog";
    private options = getLatestJsonHttpOptions();
    
    constructor(
        private http: HttpClient,
        private commonHttp: CommonHTTPService
    ) {  }
  
    addDevelopLog(developLog: DevelopLog): Observable<DevelopLog> {
      return this.http.post<DevelopLog>(this.api, developLog, this.options).pipe(
        retry(3),
        tap((newDevelopLog: DevelopLog) => console.log(`added developLog success.`)),
        catchError(this.commonHttp.handleError<DevelopLog>('addDevelopLog()'))
      );
    }
    updateDevelopLog(developLog: DevelopLog): Observable<any> {
      return this.http.put(this.api, developLog, this.options).pipe(
        retry(3),
        tap(_ => console.log(`updated developLog id=${developLog.id} success.`)),
        catchError(this.commonHttp.handleError<any>('updateDevelopLog()'))
      );
    }
    deleteDevelopLog(developLog: DevelopLog | number): Observable<DevelopLog> {
      const id = typeof developLog === 'number' ? developLog : developLog.id;
     
      const url = `${this.api}/${id}`;
      return this.http.delete<DevelopLog>(url, this.options).pipe(
        retry(3),
        tap(_ => console.log(`deleted developLog id=${id} success.`)),
        catchError(this.commonHttp.handleError<DevelopLog>('deleteDevelopLog()'))
      );
    }
    getAllDevelopLog(): Observable<DevelopLog[]> {
      const url = `${this.api}/all`;
      return this.http.get<DevelopLog[]>(url, this.options).pipe(
          retry(3),
          tap(_ => console.log(`fetched all DevelopLog success.`)),
          catchError(this.commonHttp.handleError<DevelopLog[]>(`getAllDevelopLog()`, []))
        );
    }
    getDevelopLogBy(id: number): Observable<DevelopLog> {
      const url = `${this.api}/${id}`;
      return this.http.get<DevelopLog>(url, this.options).pipe(
          retry(3),
          tap(_ => console.log(`fetched developLog id=${id} success.`)),
          catchError(this.commonHttp.handleError<DevelopLog>(`getDevelopLog() id=${id}`))
        );
    }
}
  
