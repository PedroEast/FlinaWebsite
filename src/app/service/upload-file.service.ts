import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, retry, catchError } from 'rxjs/operators';
import { zuul_gateway, getLatestUploadFileHttpOptions } from 'src/app/config/HttpConfig';
import { CommonHTTPService } from '../common/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

    private api = zuul_gateway+ "/api/upload";
    private options = getLatestUploadFileHttpOptions();
  
    constructor(
        private http: HttpClient,
        private commonHttp: CommonHTTPService
    ) {  }
  
    postUploadFile(fileList: [], targetPath:string) {
      const formData = new FormData();
      fileList.map((file, index) => {
        formData.append('files', file);
      })
      formData.append("targetPath", targetPath)
    //   console.log(this.options)
      return this.http.post<Message>(this.api, formData, this.options)
        .pipe(
          tap((msg: Message) => {
              console.log(JSON.stringify(msg));
          }),
          catchError(this.commonHttp.handleError<Message>(`uploadFile() error`))
        );
    }
  
}
