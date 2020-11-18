import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { FlowDefined } from 'src/app/bean/Defined';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { User } from 'src/app/entity/User';
import { ProjectFlowService } from 'src/app/service/project-flow.service';

@Component({
  selector: 'app-admin-flow',
  templateUrl: './admin-flow.component.html',
  styleUrls: ['./admin-flow.component.scss']
})
export class AdminFlowComponent implements OnInit {
    isProgressCircleShow = false;
    flow: FlowDefined;
    flowForm = new FormGroup({
        "startTime": new FormControl(),
        "endTime": new FormControl(),
        "selectStatus": new FormControl(),
        "authStatus": new FormControl(),
        "classStatus": new FormControl(),
        "editStatus": new FormControl(),
    }); 
    constructor(
        private flowApi: ProjectFlowService,
        private commonUI: CommonUIService,
        private router: Router,
        
    ) { }

    ngOnInit(): void {
        this.testAuth();
        this.getFlow();
        this.commonUI.setTimeZone(null);
    }
    testAuth() {
        const userStr = window.localStorage.getItem("flina-user-save")
        if( userStr){
            const user: User = JSON.parse(userStr);
            if(user.level < 3){
                this.log("权限不足")
                this.router.navigate(["/admin"])
            }
        }
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
                this.flow = data;
                this.flowForm.setValue(this.flow)
            }
        )
    }
    filterChange(){
        console.log(this.flowForm.value)
        this.isProgressCircleShow = true;
        this.flowApi.updateProjectFlow(this.flowForm.value).subscribe(
            _ => {
                this.isProgressCircleShow = false;
            }
        );
    }
    private log(msg: string, action=null){
        action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
    }
}
