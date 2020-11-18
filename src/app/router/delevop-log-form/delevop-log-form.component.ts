import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DevelopLog } from 'src/app/entity/DevelopLog';
import { User } from 'src/app/entity/User';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { DevelopLogSqlService } from 'src/app/service/develop-log-sql.service';

@Component({
  selector: 'app-delevop-log-form',
  templateUrl: './delevop-log-form.component.html',
  styleUrls: ['./delevop-log-form.component.scss']
})
export class DelevopLogFormComponent implements OnInit {
   
    developLogForm = new FormGroup({
        "id":  new FormControl(),
        "target": new FormControl("",Validators.required),
        "notice": new FormControl("", Validators.required),
        "device": new FormControl("PC", Validators.required),
        "resolution": new FormControl({value: "", disabled: true}, Validators.required),
        "browser": new FormControl("", Validators.required),
        "network": new FormControl("", Validators.required),
        "roles": new FormControl({value: "", disabled: true}, Validators.required),
        "username": new FormControl({value: "", disabled: true}, Validators.required),
        "createdTime":new FormControl(),
        "modifiedTime":new FormControl(),
        });
    constructor(
      public dialogRef: MatDialogRef<DelevopLogFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DevelopLog
      ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    ngOnInit(): void {
        if(this.data){
            this.developLogForm.setValue(this.data);
        }else{
            this.setUser();
        }
        this.setDefault();
    }
    private setUser() {
        const userStr = window.localStorage.getItem("flina-user-save")
        // console.log(userStr)
        if( userStr){
            const user: User = JSON.parse(userStr);
            this.developLogForm.get("roles").setValue(user.roles);
            this.developLogForm.get("username").setValue(user.username);
        }
    }
    private setDefault() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const resolution = width + "*" + height;
        this.developLogForm.get("resolution").setValue(resolution);
        
        let myBrowser: string = this.getMyBrowser();
        let ua = navigator.userAgent;
        this.developLogForm.get("notice").setValue(ua);
        if(this.testNull(myBrowser)) myBrowser = "未知的浏览器";
        this.developLogForm.get("browser").setValue(myBrowser);
        let myNetWork: string = this.getNetworkType();
        if(this.testNull(myBrowser)) myBrowser = "未知的网络环境";
        this.developLogForm.get("network").setValue(myNetWork);
    }

    clear(formControl: AbstractControl){
        formControl.setValue("");
    }
    private testNull(str: string) {
        return str === null || str === undefined || str.trim() === "";
     }
    private getMyBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1
                && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari = userAgent.indexOf("Safari") > -1
                && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
        var isChrome = userAgent.indexOf("Chrome") > -1
                && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
    
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return "IE7";
            } else if (fIEVersion == 8) {
                return "IE8";
            } else if (fIEVersion == 9) {
                return "IE9";
            } else if (fIEVersion == 10) {
                return "IE10";
            } else if (fIEVersion == 11) {
                return "IE11";
            } else {
                return "0";
            }//IE版本过低
            return "IE";
        }
        if (isOpera) {
            return "Opera";
        }
        if (isEdge) {
            return "Edge";
        }
        if (isFF) {
            return "FF";
        }
        if (isSafari) {
            return "Safari";
        }
        if (isChrome) {
            return "Chrome";
        }
    }

    private getNetworkType() {
        var ua = navigator.userAgent;
        // console.log(ua)
        var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
        networkStr = networkStr.toLowerCase().replace('nettype/', '');
        var networkType;
        switch(networkStr) {
            case 'wifi':
                networkType = 'wifi';
                break;
            case '4g':
                networkType = '4g';
                break;
            case '3g':
                networkType = '3g';
                break;
            case '3gnet':
                networkType = '3g';
                break;
            case '2g':
                networkType = '2g';
                break;
            default:
                networkType = 'other';
        }
        return networkStr;
    }
   

}
