import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowDefined } from 'src/app/bean/Defined';
import { UserViewReponse } from 'src/app/bean/Response';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { User } from 'src/app/entity/User';
import { UserMeta } from 'src/app/entity/UserMeta';
import { ProjectFlowService } from 'src/app/service/project-flow.service';
import { UserMetaSqlService } from 'src/app/service/user-meta-sql.service';
import { UserSqlService } from 'src/app/service/user-sql.service';

@Component({
  selector: 'app-admin-person',
  templateUrl: './admin-person.component.html',
  styleUrls: ['./admin-person.component.scss']
})
export class AdminPersonComponent implements OnInit {
    tableHead = ["id", "姓名", "学号", "联系方式", "邮箱", "学院", "身份", "级别", "黑名单", "操作"]
    tableData: UserViewReponse[];
    isProgressCircleShow = false;
    constructor(
        private flowApi: ProjectFlowService,
        private commonUI: CommonUIService,
        private router: Router,
        private userApi: UserSqlService,
        private userMetaApi: UserMetaSqlService,
        
    ) { }

    ngOnInit(): void {
        this.testAuth();
        this.getFlow();
        this.commonUI.setTimeZone(null);
        this.getUserView();
    }
    testAuth() {
        const userStr = window.localStorage.getItem("flina-user-save")
        if( userStr){
            const user: User = JSON.parse(userStr);
            console.log(user.level)
            if(user.level < 10){
                this.log("权限不足")
                this.router.navigate(["/admin"])
            }
        }
    }
    getUserView() {
        this.isProgressCircleShow = true;
        this.userApi.getAllUserView().subscribe(
            (datas: UserViewReponse[]) => {
                this.isProgressCircleShow = false;
                this.tableData = datas;
            }
        )
    }

    switchDate(column){
        switch(column){
            case "startTime":
            case "endTime":
              return true;
            default:
              return false;
        }
    }
    getFlow() {
        this.isProgressCircleShow = true;
        this.flowApi.getProjectFlow().subscribe(
            (data: FlowDefined) => {
                this.isProgressCircleShow = false;
                const dataColumns = Object.keys(data);
                dataColumns.map(column => {
                    this.switchDate(column) ? data[column] = new Date(data[column]) : "";
                });
                if(!data.authStatus){
                    this.log("暂未进入该流程")
                    this.router.navigate(["/admin"])
                }
                
            }
        )
    }

    changeBlack(userView: UserViewReponse){
        this.userMetaApi.getUserMetaBy(userView.id).subscribe(
            (userMetas: UserMeta[]) => {
                if(userMetas.length == 0) return;
                const userMeta = userMetas[0];
                console.log(userMeta)
                userMeta.enable = true;
                this.userMetaApi.updateUserMeta(userMeta).subscribe(
                    _ => {
                        this.ngOnInit();
                    }
                )
            }
        )
    }

    changeWhite(userView: UserViewReponse){
        this.userMetaApi.getUserMetaBy(userView.id).subscribe(
            (userMetas: UserMeta[]) => {
                if(userMetas.length == 0) return;
                const userMeta = userMetas[0];
                console.log(userMeta)
                userMeta.enable = false;
                this.userMetaApi.updateUserMeta(userMeta).subscribe(
                    _ => {
                        this.ngOnInit();
                    }
                )
            }
        )
    }

    changeRoleAuth(userView: UserViewReponse){
        console.log(userView)
        const data = {
            id: userView.id,
            roles: userView.roles,
            username: userView.name,
            level: userView.level
        }
        const dialogRef = this.commonUI.showUserForm(data);
        dialogRef.afterClosed().subscribe((data) => {
            if(data){
                console.log(data)
                const newUser: User = data as User;
                console.log(newUser);
                this.userApi.getUserBy(newUser.id).subscribe(
                    (user: User) => {
                        user.roles = newUser.roles;
                        user.level = newUser.level;
                        this.userApi.updateUser(user).subscribe(
                            _ => {
                                this.ngOnInit();
                            }
                        )
                    }
                )
            }
        })
    }

    private log(msg: string, action=null){
        action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
    }
}
