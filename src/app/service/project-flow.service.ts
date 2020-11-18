import { Injectable } from '@angular/core';
import { admin_api, getLatestJsonHttpOptions } from '../config/HttpConfig';
import { Observable, of } from "rxjs";
import { catchError, map, retry, tap } from 'rxjs/operators';
import { FlowDefined } from '../bean/Defined';
import { HttpClient } from '@angular/common/http';
import { CommonHTTPService } from '../common/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class ProjectFlowService {
    private api: string = admin_api + "/projectFlow";
    private options: object = getLatestJsonHttpOptions();
    constructor(
        private http: HttpClient,
        private commonHttp: CommonHTTPService
    ) { }

    updateProjectFlow(projectFlow: FlowDefined): Observable<any> {
        return this.http.put(this.api, projectFlow, this.options).pipe(
          retry(3),
          tap(_ => console.log(`updated projectFlow success.`)),
          catchError(this.commonHttp.handleError<any>('updateProjectFlow()'))
        );
    }

    getProjectFlow(): Observable<FlowDefined> {
        const url = this.api;
        return this.http.get<FlowDefined>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched projectFlow success.`)),
            catchError(this.commonHttp.handleError<FlowDefined>(`getProjectFlow()`))
        );
    }
}
