import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { catchError, retry, tap } from 'rxjs/operators';
import { coder_api, getLatestJsonHttpOptions, getLatestDownloadFileHttpOptions} from "src/app/config/HttpConfig";
import { FileDefined } from '../bean/Defined';
import { FullStackAutoRequest } from '../bean/Request';
import { MessageResponse } from '../bean/Response';
import { CommonHTTPService } from '../common/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class FullstackAutoService {
 
  private api: string = coder_api + "/fullstack";
  private options: object = getLatestJsonHttpOptions();
  private downloadOptions: object = getLatestDownloadFileHttpOptions();
  
  constructor(
    private http: HttpClient,
    private commonHttp: CommonHTTPService
  ) {  }


  make(request: FullStackAutoRequest) {
    const apiUrl = this.api + "/onPostToGenerate";
    return this.http.post<MessageResponse>(apiUrl, request, this.options).pipe(
        retry(3),
        catchError(this.commonHttp.handleError<MessageResponse>('make()'))
      );
  }

  view(request: FullStackAutoRequest) {
    const apiUrl = this.api + "/onPostToPreview";
    console.log(apiUrl)
    return this.http.post<FileDefined[]>(apiUrl, request, this.options).pipe(
        retry(3),
        catchError(this.commonHttp.handleError<string>('view()'))
      );
  }

  downloadFile(fileUrl: string) {
    fileUrl = coder_api + "/" + fileUrl;
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
