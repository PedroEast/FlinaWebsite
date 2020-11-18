import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, retry, tap } from 'rxjs/operators';
import { coder_api, getLatestJsonHttpOptions} from "src/app/config/HttpConfig";
import { ColumnDefined, ResTableDefined } from "src/app/bean/Defined";
import { CommonHTTPService } from 'src/app/common/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class TableSqlService {

  private api: string = coder_api + "/database/";
  private options: object = getLatestJsonHttpOptions();
  
  constructor(
    private http: HttpClient,
    private commonHttp: CommonHTTPService
    ) {  }
  
  showTables(): Observable<object> {
    const url = this.api + "onGetTableList";
    return this.http.get<object>(url,this.options)
      .pipe(
        retry(3),
        catchError(this.commonHttp.handleError<object>('getTableNameAndColumn', []))
      );
  }

  showTablesColumnsAndCreateTable(): Observable<ResTableDefined[]> {
    const url = this.api + "onGetTableDefinedList";
    // console.log(url)
    console.log(this.options) 
    return this.http.get<ResTableDefined[]>(url, this.options)
      .pipe(
        retry(3),
        catchError(this.commonHttp.handleError<ResTableDefined[]>('getTableNameAndColumn', []))
      );
  }

  showColumnsBy(tableName: string): Observable<object> {
    const url = this.api + "onGetColumn";
    const opt = this.options;
    const params = new HttpParams();
    params.append("tableName", tableName)
    opt["params"] = params;

    return this.http.get<object>(url, opt)
      .pipe(
        retry(3),
        catchError(this.commonHttp.handleError<object>('getTableColumn', []))
      );
  }

  findAllBy(tableName: string): Observable<object[]> {
    const url = this.api + "OnGetData";
    const opt = this.options;
    const params = new HttpParams();
    params.append("tableName", tableName)
    opt["params"] = params;
    return this.http.get<object[]>(url, opt)
      .pipe(
        retry(3),
        catchError(this.commonHttp.handleError<object[]>('seleteTableData', []))
      );
  }

  showCreateTableBy(tableName: string) {
    if(!tableName) return;
    const url = this.api + "OnGetCreateTableStr";
    const opt = this.options;
    const params = new HttpParams();
    params.append("tableName", tableName)
    opt["params"] = params;
    return this.http.get<object>(url, opt)
        .pipe(
            retry(3),
            catchError(this.commonHttp.handleError<object>('showCreateTableBy', []))
        );
   }

  dropBy(tableName: string): Observable<object>{
    const url = this.api + "OnDeleteTable";
    const opt = this.options;
    const params = new HttpParams();
    params.append("tableName", tableName)
    opt["params"] = params;
    return this.http.delete<object>(url, opt)
      .pipe(
        retry(3),
        catchError(this.commonHttp.handleError<object>('deleteTable', []))
      );
  }

  
}


