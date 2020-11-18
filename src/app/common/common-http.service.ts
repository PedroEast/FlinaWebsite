import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommonUIService } from "./common-ui.service";

/**
 * 公共http服务，典型例子是处理错误
 */
@Injectable({
  providedIn: 'root'
})
export class CommonHTTPService {

  constructor(
    private router: Router,
    private commonUI: CommonUIService
  ) { }

  handleError<T>(operation = 'operation', result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {  
            const errorStatusCode: number = error.status;
            // console.log(errorStatusCode)
            // 403被拒， 因为没有权限，跳转至登陆界面
            switch (errorStatusCode) {
                case 403: 
                    this.router.navigate(["/login"]);
                    this.log("登陆过期，请重新登陆");
                    break;
                case 404: 
                    this.log("找不到页面, 报告给我们, 我们会帮助解决");
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
        action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
    }
}


// 参考示例
// 每个http服务需要一个 api 和 options, http由Angular提供, 错误处理由commonHttp提供
// api: string = coder_api + "/database/";
// options: object = getLatestJsonHttpOptions();
// constructor(
//     private http: HttpClient,
//     private commonHttp: CommonHTTPService
// ) {  }