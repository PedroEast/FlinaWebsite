import { Observable, of } from 'rxjs';
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from '@angular/router';
import { CommonUIService } from "../common/common-ui.service";

export class CommonHandleErrorUtil {
  constructor(
    private router: Router,
    private commonUI: CommonUIService
    ) { }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {  
      const erroeStatusCode: number = error.status;
      // console.log(erroeStatusCode)
      // 403被拒， 因为没有权限，跳转至登陆界面
      switch (erroeStatusCode) {
          case 403: 
            this.router.navigate(["/login"]);
            this.log("登陆过期，请重新登陆");
            break;
        default:
            this.log("似乎出错了，报告给我们，我们会帮助解决");
      }
      console.log(`${operation} failed: ${error.message}`);
      console.error(error); 
     
      return of(result as T);
    };
  }
  log(msg, action=null){
    action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
  }

}