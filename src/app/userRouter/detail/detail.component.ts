import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/entity/User';
import { UserMeta } from 'src/app/entity/UserMeta';
import { UserMetaSqlService } from 'src/app/service/user-meta-sql.service';
import { UserSqlService } from 'src/app/service/user-sql.service';
import { testObj } from 'src/app/util/TestNull';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    user: User;
    userMeta: UserMeta;
    userMetaForm = new FormGroup({
        "id": new FormControl(),
        "username": new FormControl({value: "", disabled: true} ),
        "email": new FormControl({value: "", disabled: true} ),
        "name": new FormControl("",Validators.required),
        "studentId": new FormControl("", Validators.required),
        "college": new FormControl("", Validators.required),
        "concat": new FormControl("", Validators.required),
    });
    constructor(
        private userMetaApi: UserMetaSqlService,
        private userApi: UserSqlService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.getUserInfo();
    }
    getUserInfo() {
        const userStr = window.localStorage.getItem("flina-user-save")
            if( userStr){
                this.user = JSON.parse(userStr);
            }
        this.userMetaApi.getUserMetaBy(this.user.id).subscribe(
            (userMetas: UserMeta[]) =>{
                if(userMetas.length != 0){
                    this.userMeta = userMetas.pop();
                }
                this.setValue();
            }
        )
    }
    setValue() {
        console.log(111)
        let data;
        if(!testObj(this.userMeta)){
            data = {
                "id": this.user.id,
                "username": this.user.username,
                "email": this.user.email,
                "name": this.userMeta.name,
                "studentId": this.userMeta.studentId,
                "college": this.userMeta.college,
                "concat": this.userMeta.concat,
            }
        }else {
            data = {
                "id": this.user.id,
                "username": this.user.username,
                "email": this.user.email,
                "name": "",
                "studentId": "",
                "college": "",
                "concat": "",
            }
        }
        // console.log(data)
        
        this.userMetaForm.setValue(data);
    }

    save(){
        console.log("111")
        this.user.email = this.userMetaForm.get("email").value;
        console.log(this.userMeta)
        if(testObj(this.userMeta)){
            this.userMeta = {
                id: null,
                authorId: this.user.id,
                name: "",
                studentId: "",
                college: "",
                concat: "",
                enable: false
            }
        }
        this.userMeta.name = this.userMetaForm.get("name").value;
        this.userMeta.studentId = this.userMetaForm.get("studentId").value;
        this.userMeta.college = this.userMetaForm.get("college").value;
        this.userMeta.concat = this.userMetaForm.get("concat").value;
        this.userMetaApi.updateUserMeta(this.userMeta).subscribe(
            _ => this.ngOnInit()
        );
       
    }
    signOut(){
        this.router.navigate(["/"])
    }

}
