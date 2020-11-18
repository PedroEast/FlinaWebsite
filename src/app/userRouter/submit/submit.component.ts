import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { User } from 'src/app/entity/User';
import { testStr, testObj, testArray } from 'src/app/util/TestNull';
import { UserMetaSqlService } from 'src/app/service/user-meta-sql.service';
import { WorksSqlService } from 'src/app/service/works-sql.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
    isProgressCircleShow = false;
    styleEnum = ["古典诗词", "现代诗", "文章"]
    poetryForm = new FormGroup({
        "id": new FormControl(),
        "title": new FormControl("标题",Validators.required),
        "content": new FormControl("", Validators.required),
        "style": new FormControl("古典诗词", Validators.required),
        "authorId": new FormControl(),
        "authorStuId": new FormControl(),
        "enable": new FormControl(),
        "submit": new FormControl(),
        "waitEdit": new FormControl(),
        "createdTime": new FormControl(),
        "latestContent": new FormControl(),
        "latestModifyTime": new FormControl(),
        "editorId": new FormControl(),
        "editorName": new FormControl(),
        "editedTime": new FormControl(),
        "editorScore": new FormControl(),
    });
    userMetaForm = new FormGroup({
        "id": new FormControl(),
        "authorId": new FormControl(""),
        "name": new FormControl("",Validators.required),
        "studentId": new FormControl("", Validators.required),
        "college": new FormControl("", Validators.required),
        "concat": new FormControl("", Validators.required),
        "enable": new FormControl(""),
    });
    constructor(
        private commonUI: CommonUIService,
        private router: Router,
        private userMetaSql: UserMetaSqlService,
        private worksSql: WorksSqlService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.setUserMeta();
        this.setWorks();
    }
    setWorks() {
        const id = this.route.snapshot.paramMap.get("id");
        console.log(id, testStr(id))
        if(!testStr(id)){
            this.findWorks(id);
        }
    }
    findWorks(id) {
        this.worksSql.getWorksBy(id).subscribe(data =>{
            console.log(data)
            this.poetryForm.setValue(data);
            const content: HTMLDivElement = document.querySelector("#input-text-area");
            content.innerHTML = data.content;
            console.log(content)
        })
    }
    setUserMeta() {
        const userStr = window.localStorage.getItem("flina-user-save")
        if( userStr){
            const user: User = JSON.parse(userStr);
            this.isProgressCircleShow = true;
            this.userMetaSql.getUserMetaBy(user.id).subscribe(data => {
                this.isProgressCircleShow = false;
                console.log(data)
                if(data){
                    this.userMetaForm.setValue(data[0])
                }
            })
            
        }
        
    }

    save(){
        // console.log(this.poetryForm.value)
        if ( this.checkNull() ) {
            this.log("以上均为必填项");
            return;
        }
        this.isProgressCircleShow = true;
        this.setUser();
        this.setDefault();
        this.poetryForm.get("submit").setValue(false);
        this.userMetaSql.updateUserMeta(this.userMetaForm.value).subscribe();
        // console.log(this.poetryForm.get("id").value)
        if(this.poetryForm.get("id").value){
            this.poetryForm.get("latestModifyTime").setValue(new Date());
            this.worksSql.updateWorks(this.poetryForm.value).subscribe(_ => {
                this.log("修改成功");
                this.isProgressCircleShow = false;
                this.router.navigate(["/user/poetry-list"])
            });
        }else {
            this.poetryForm.get("createdTime").setValue(new Date());
            this.worksSql.addWorks(this.poetryForm.value).subscribe(_ => {
                this.log("提交成功");
                this.isProgressCircleShow = false;
                this.router.navigate(["/user/poetry-list"])
            });
        }
    }
    
    submit(){
        // console.log(this.poetryForm.value)
        if ( this.checkNull() ) {
            this.log("以上均为必填项");
            return;
        }
        this.isProgressCircleShow = true;
        this.setUser();
        this.setDefault();
        this.poetryForm.get("submit").setValue(true);
        this.userMetaSql.updateUserMeta(this.userMetaForm.value).subscribe();
        // console.log(this.poetryForm.get("id").value)
        if(this.poetryForm.get("id").value){
            this.poetryForm.get("latestModifyTime").setValue(new Date());
            this.worksSql.updateWorks(this.poetryForm.value).subscribe(_ => {
                this.log("修改成功");
                this.isProgressCircleShow = false;
                this.router.navigate(["/user/poetry-list"])
            });
        }else {
            this.poetryForm.get("createdTime").setValue(new Date());
            this.worksSql.addWorks(this.poetryForm.value).subscribe(_ => {
                this.log("提交成功");
                this.isProgressCircleShow = false;
                this.router.navigate(["/user/poetry-list"])
            });
        }
    }
    
    private checkNull(): boolean {
        // console.log(this.poetryForm.get("content").value)
        const inputTextNode: HTMLDivElement = document.querySelector("#input-text-area")
        let text = inputTextNode.innerHTML;
        if(testStr(text)) text = "";
        console.log(text)
        const rawText = this.getRawText(text);
        this.poetryForm.get("content").setValue(text);
        console.log(!this.poetryForm.valid , !this.userMetaForm.valid , testStr(rawText))
        if(!this.poetryForm.valid || !this.userMetaForm.valid || testStr(rawText) ) {
            return true;
        }
        return false;
    }
    private getRawText(text: string) {
        let reg = /\s+/gi;
        let rawText = text.replace(reg, "");
        // console.log(rawText);

        reg = /<\S*?>/gi
        rawText = rawText.replace(reg, "");
        rawText = rawText.replace(/&nbsp;/g, "")
        // console.log(rawText);
        return rawText;
    }
    private setUser() {
        const userStr = window.localStorage.getItem("flina-user-save")
        // console.log(userStr)
        if( userStr){
            const user: User = JSON.parse(userStr);
            this.poetryForm.get("authorId").setValue(user.id);
            this.userMetaForm.get("authorId").setValue(user.id);
        }
    }
    private setDefault() {
        this.poetryForm.get("enable").setValue(true);
       
        this.poetryForm.get("authorStuId").setValue(this.userMetaForm.get("studentId").value);
    }

    private log(msg: string, action=null){
        action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
    }
}
