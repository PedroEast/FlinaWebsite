import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpParams } from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { catchError, map, retry, tap } from 'rxjs/operators';

import { Works } from "../entity/Works";
import { admin_api, user_api,  getLatestJsonHttpOptions, getLatestDownloadFileHttpOptions} from "../config/HttpConfig";
import { CommonHTTPService } from "../common/common-http.service";
import { UpdateWorksIdListRequest } from '../bean/Request';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MessageResponse } from '../bean/Response';

@Injectable({
  providedIn: 'root'
})
export class WorksSqlService {

    private api: string = user_api + "/works";
    private adminApi = admin_api + "/works";
    private options: object = getLatestJsonHttpOptions();
    private downloadOptions: object = getLatestDownloadFileHttpOptions();
    constructor(
        private http: HttpClient,
        private commonHttp: CommonHTTPService
    ) {  }

    addWorks(works: Works): Observable<Works> {
        return this.http.post<Works>(this.api, works, this.options).pipe(
            retry(3),
            tap((newWorks: Works) => console.log(`added works success.`)),
            catchError(this.commonHttp.handleError<Works>('addWorks()'))
        );
    }
    getExportFile(ids: number[]): Observable<MessageResponse> {
        const url = `${this.adminApi}/export`;
        return this.http.post<MessageResponse>(url, ids ,this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched getExportFile success.`)),
            catchError(this.commonHttp.handleError<MessageResponse>(`getExportFile() `))
        );
    }
    updateWorks(works: Works): Observable<any> {
        return this.http.put(this.api, works, this.options).pipe(
            retry(3),
            tap(_ => console.log(`updated works id=${works.id} success.`)),
            catchError(this.commonHttp.handleError<any>('updateWorks()'))
        );
    }

    updateAdminWorks(works: Works): Observable<any> {
        return this.http.put(this.adminApi, works, this.options).pipe(
            retry(3),
            tap(_ => console.log(`updated works id=${works.id} success.`)),
            catchError(this.commonHttp.handleError<any>('updateWorks()'))
        );
    }

    updateWorksList(works: Works[]): Observable<any> {
        const url = `${this.adminApi}/list`;
        return this.http.put(url, works, this.options).pipe(
            retry(3),
            tap(_ => console.log(`updated works list success.`)),
            catchError(this.commonHttp.handleError<any>('updateWorksList()'))
        );
    }

    updateWorksIdList(idsRequest: UpdateWorksIdListRequest): Observable<any> {
        const url = `${this.adminApi}/idList`;
        return this.http.put(url, idsRequest, this.options).pipe(
            retry(3),
            tap(_ => console.log(`updated works list success.`)),
            catchError(this.commonHttp.handleError<any>('updateWorksList()'))
        );
    }

    deleteWorks(works: Works | number, authorId: number): Observable<Works> {
        const id = typeof works === 'number' ? works : works.id;
        console.log(authorId)
        const url = `${this.api}/${id}/${authorId}`;
        return this.http.delete<Works>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`deleted works id=${id} success.`)),
            catchError(this.commonHttp.handleError<Works>('deleteWorks()'))
        );
    }
    
    getAllWorks(): Observable<Works[]> {
        const url = `${this.adminApi}/all`;
        return this.http.get<Works[]>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched all Works success.`)),
            catchError(this.commonHttp.handleError<Works[]>(`getAllWorks()`, []))
        );
    }

    getAllWorksInfo(): Observable<Works[]> {
        const url = `${this.adminApi}/allInfo`;
        return this.http.get<Works[]>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched allInfo Works success.`)),
            catchError(this.commonHttp.handleError<Works[]>(`getAllWorksInfo()`, []))
        );
    }

    getCount(): Observable<number> {
        const url = `${this.adminApi}/count`;
        return this.http.get<number>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched count of Works success.`)),
            catchError(this.commonHttp.handleError<number>(`getCount()`))
        );
    }

    getSubmitCount(): Observable<number> {
        const url = `${this.adminApi}/submitCount`;
        return this.http.get<number>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched count of submit Works success.`)),
            catchError(this.commonHttp.handleError<number>(`getSubmitCount()`))
        );
    }

    getWorksBy(id: number): Observable<Works> {
        const url = `${this.api}/${id}`;
        return this.http.get<Works>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched works id=${id} success.`)),
            catchError(this.commonHttp.handleError<Works>(`getWorks() id=${id}`))
        );
    }

    getPoetryByAuthorId(authorId: number): Observable<Works[]> {
        const url = `${this.api}/author/${authorId}`;
        return this.http.get<Works[]>(url, this.options).pipe(
            retry(3),
            tap(_ => console.log(`fetched works id=${authorId} success.`)),
            catchError(this.commonHttp.handleError<Works[]>(`getWorks() id=${authorId}`))
        );
    }

    downloadFile(fileUrl: string) {
        fileUrl = admin_api + "/" + fileUrl;
        this.http.get(fileUrl, this.downloadOptions).pipe(
          retry(3),
          catchError(this.commonHttp.handleError('downloadFile()'))
        ).subscribe((response: HttpResponse<Blob>) => {
          console.log(response)
          this.renameFileChain(response.body, "zip", "flina.zip");
          this.commonHttp.log("正在下载");
        });
      }
    
    
      renameFileChain(data: Blob, type: string, newName: string) {
        const file = new Blob([data],{type: 'application/'+ type});
        const dataUrl = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.id = 'tempId';
        document.body.appendChild(a);
        a.download = newName;
        a.href = dataUrl;
        a.click();
        const tempA = document.getElementById('tempId');
        if (tempA) {
          tempA.parentNode.removeChild(tempA);
        }
      }
    
    

}
