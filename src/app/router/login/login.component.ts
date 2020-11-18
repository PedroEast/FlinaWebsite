import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import { SignUpResponse, SignInResponse, MessageResponse } from '../../bean/Response';
import { CommonUIService } from '../../common/common-ui.service';
import { useAnimation } from '@angular/animations';
import { testStr } from 'src/app/util/TestNull';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    isProgressCircleShow = false;
    isCloseTip = true;
    ua = navigator.userAgent.toLowerCase();
    isTip: boolean = false;
    isForgetPasswordShow: boolean = false;
    isSignUpShow: boolean = false;
    signupForm = new FormGroup({
        "email": new FormControl("", Validators.required),
        "username": new FormControl("", Validators.required),
        "password" : new FormControl()
    });
    signinForm = new FormGroup({
        "username": new FormControl("", Validators.required),
        "password" : new FormControl("", Validators.required),
        "rememberPassword": new FormControl()
    });

    forgetPasswordForm = new FormGroup({
        "username": new FormControl("", Validators.required),
        "email": new FormControl("", Validators.required),
        "code": new FormControl("", Validators.required),
        "password" : new FormControl("", Validators.required)
    });

    constructor(
        private loginService: LoginService,
        private router: Router,
        private commonUI: CommonUIService
    ) {   }

    ngOnInit(): void {
        if(this.QQorWechat()){
            this.isTip = true;
        }
    }
    closeTip() {
        this.isTip = false;
    }
    private QQorWechat() {
        let result = false;
        const ua = navigator.userAgent.toLowerCase();
        console.log(ua)
        const reg1 = /MicroMessenger/i;
        const reg2 = /WeiBo/i;
        console.log(reg1.test(ua) || reg2.test(ua))
        if(reg1.test(ua) || reg2.test(ua)){
            result = true;
        }else if(ua.includes("mobile mqqbrowser")){
            result = true;
        }else if(ua.includes('iphone') || ua.includes('mac')){
            if(ua.includes("qq")){
                result = true;
            }
        }
        return result;
    }


    tabSignUp(){
        this.isSignUpShow = !this.isSignUpShow;
    }
    tabForgetPassword(){
        this.isForgetPasswordShow = !this.isForgetPasswordShow;
    }

    signUp(value){
        // console.log(this.signupForm.valid)
        const invalid = !this.signupForm.valid || testStr(this.signupForm.get("username").value) 
            || testStr(this.signupForm.get("password").value) || testStr(this.signupForm.get("email").value);
        if(invalid){
            this.log("请填写必填项");
            return;
        }
        this.isProgressCircleShow = true;
        this.loginService.signUp(value)
            .subscribe((data: SignUpResponse) => {
                this.isProgressCircleShow = false;
                if(data.state){
                    this.signinForm = new FormGroup({
                        "username": new FormControl(value["username"], Validators.required),
                        "password" : new FormControl(value["password"]),
                        "rememberPassword": new FormControl(true)
                    });
                    this.tabSignUp();
                }
            })
    }

    signIn(value){
        // console.log(this.signinForm.valid)
        if(!this.signinForm.valid){
            this.log("请填写必填项");
            return;
        }

        this.isProgressCircleShow = true;
        // console.log(value)
        if(value.rememberPassword) {
            this.rememberPassword(value);
            delete value.rememberPassword
        }
        this.loginService.signIn(value)
            .subscribe((data: SignInResponse) => {
                this.isProgressCircleShow = false;
                if(data.user){            
                    console.log(data.user)
                    this.log(`登陆成功`);
                    this.router.navigate(["/user/"])
                }
            })
    }
    
    requestCode(){
        const value = this.forgetPasswordForm.value['email'];
        // console.log(value)
        if(!value || value.trim() == ""){
            this.log("请输入邮箱");
            return;
        }
        this.isProgressCircleShow = true;
        if(this.validateEmail(value)){
        this.loginService.requestCode(value)
            .subscribe((res: MessageResponse) => {
                this.isProgressCircleShow = false;
                this.log("请求验证码成功")
                this.forgetPasswordForm.get("code").setValue( res.data.trim())
                
            })
        }
    }
    
    resetPassword(value){
        if(!value) return;
        // console.log(this.forgetPasswordForm.valid)
        if(!this.forgetPasswordForm.valid){
            this.log("请填写必填项");
            return;
        }

        this.isProgressCircleShow = true;
        this.loginService.resetPassword(value)
            .subscribe((res: MessageResponse) => {
                this.isProgressCircleShow = false;
                this.log(res.data)
                this.tabForgetPassword();
                
            })
    }
    
    private validateEmail(value: string) {
        return true;
    }

    private rememberPassword(value: object) {
        if(value == null || value == undefined) return;
        window.localStorage.setItem("flina-username", value['username']);
        window.localStorage.setItem("flina-password", value['password']);
    }
    // 代理模式
    log(message: string, action = "") {
        this.commonUI.showSnackBarWith(message, action);
    }
}