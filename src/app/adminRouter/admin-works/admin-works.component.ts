import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { FlowDefined } from 'src/app/bean/Defined';
import { UpdateWorksIdListRequest } from 'src/app/bean/Request';
import { MessageResponse } from 'src/app/bean/Response';

import { CommonUIService } from 'src/app/common/common-ui.service';
import { User } from 'src/app/entity/User';
import { UserMeta } from 'src/app/entity/UserMeta';
import { Works } from 'src/app/entity/Works';
import { ProjectFlowService } from 'src/app/service/project-flow.service';
import { UserMetaSqlService } from 'src/app/service/user-meta-sql.service';
import { WorksSqlService } from 'src/app/service/works-sql.service';
import { testArray, testObj } from 'src/app/util/TestNull';

@Component({
  selector: 'app-admin-works',
  templateUrl: './admin-works.component.html',
  styleUrls: ['./admin-works.component.scss']
})
export class AdminWorksComponent implements OnInit {
    ids = [];
    blackList = [];
    worksCount = 0;
    submitWorksCount = 0;
    isProgressCircleShow = false;
    tableData: Works[];
    styleEnum = ["古典诗词", "现代诗", "文章"]
    filterForm = new FormGroup({
        "all": new FormControl(),
        "submit": new FormControl(),
        "enable": new FormControl(),
        "waitEdit": new FormControl(),
        "startTime": new FormControl(),
        "endTime": new FormControl(),
        "style": new FormControl(),
        "limited": new FormControl(),
    }); 
    constructor(
        private commonUI: CommonUIService,
        private tableSql: WorksSqlService,
        private router: Router,
        private adapter: DateAdapter<any>,
        private flowApi: ProjectFlowService,
        private userMetaApi: UserMetaSqlService
    ) { }

    ngOnInit(): void {
        this.testAuth();
        this.getBlackList();
        this.findAllInfo();
        this.showCount();
        this.commonUI.setTimeZone(null);
        this.getFlow();
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

    getBlackList() {
        this.userMetaApi.getAllUserMeta().subscribe(
            (userMetas: UserMeta[]) => {
                this.blackList = [];
                for (let index = 0; index < userMetas.length; index++) {
                    const userMeta = userMetas[index];
                    if(userMeta.enable){
                        this.blackList.push(userMeta.studentId)
                    }

                }
                console.log(this.blackList)
            }
        )
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
                if(!data.selectStatus){
                    this.log("暂未进入该流程");
                    this.router.navigate(["/admin"])
                }
                
            }
        )
    }

    idsInit() {
        this.ids = [];
        const datas: Works[] = this.tableData as Works[];
        datas.forEach(
            (works: Works) => {
               this.ids.push(works.id);
            }
        )
    }

    showCount() {
        this.tableSql.getCount().subscribe(
            data => this.worksCount = data
        )
        this.tableSql.getSubmitCount().subscribe(
            data => this.submitWorksCount = data
        )
    }

    switchDate(column){
        switch(column){
            case "createdTime":
            case "latestModifyTime":
            case "editedTime":
            case "startTime":
            case "endTime":
              return true;
            default:
              return false;
        }
    }
    isModify(time) {
        // console.log(typeof time, typeof new Date(0))
        // console.log(time, new Date(0), time === new Date(0), time.toString() == new Date(0).toString())
        return time.toString() != new Date(0).toString()
    }

    findAllInfo() {
        this.isProgressCircleShow = true;
        this.tableSql.getAllWorksInfo().subscribe(
            (datas: Works[]) => {
                this.isProgressCircleShow = false;
                this.tableData = datas;
                this.deleteBlackWorks();
                console.log(this.tableData)
                const firstDataIndex = 0;
                const dataColumns = Object.keys(this.tableData[firstDataIndex]);
                this.tableData.map(data => {
                    dataColumns.map(column => {
                    this.switchDate(column) ? data[column] = new Date(data[column]) : "";
                })
                
            })
        }) 
    }
    private deleteBlackWorks() {
        for (let index = this.tableData.length-1; index >=0; index--) {
            const data = this.tableData[index];
            this.blackList.map(
                (black: string) => {
                    if(data.authorStuId == black) {
                        console.log(index)
                        this.tableData.splice(index, 1)
                    }
                }
            )
            
        }
    }

    setWorksStatus(waitSetAttr: string, setStatus: boolean){
        if(testArray(this.ids)){
            this.log("未选择作品");
            return;
        }
        const idsRequest: UpdateWorksIdListRequest = {
            ids: this.ids,
            waitSetAttr,
            setStatus
        }
        
        this.tableSql.updateWorksIdList(idsRequest).subscribe(
            _ => {
                this.findAllInfo();
            }
        )
    }
    export(){
        console.log(this.ids);
        this.isProgressCircleShow = true;
        this.tableSql.getExportFile(this.ids).subscribe(
            (msg: MessageResponse) => {
                this.isProgressCircleShow = false;
                // console.log(msg.data)
                const url = "flina-document.zip";

                this.tableSql.downloadFile(url);
            }
        )
    }

    filterChange(){
        // console.log(this.filterForm.value)
        const all = this.filterForm.get("all").value;
        const submit = this.filterForm.get("submit").value;
        const enable = this.filterForm.get("enable").value;
        const waitEdit = this.filterForm.get("waitEdit").value;
        const startTime = this.filterForm.get("startTime").value;
        const endTime = this.filterForm.get("endTime").value;
        const style = this.filterForm.get("style").value;
        const limited = this.filterForm.get("limited").value;
        this.idsInit()
        // 排除条件
        if(submit){
            this.tableData.map(
                (works: Works) => {
                    if(!works.submit){
                        this.remove(works.id)
                    }
                }
            )
        }

        if(enable){
            this.tableData.map(
                (works: Works) => {
                    if(!works.enable){
                        this.remove(works.id)
                    }
                }
            )
        }

        if(waitEdit){
            this.tableData.map(
                (works: Works) => {
                    if(!works.waitEdit){
                        this.remove(works.id)
                    }
                }
            )
        }

        if(startTime){
            this.tableData.map(
                (works: Works) => {
                    console.log("last < startTime, created < stastTime")
                    console.log(works.latestModifyTime < startTime, works.createdTime < startTime)
                   
                    if(works.latestModifyTime.toString() == new Date(0).toString()){
                        console.log(111)
                        if(works.createdTime < startTime){

                            this.remove(works.id)
                        }
                    }else {
                        if(works.latestModifyTime < startTime){
                            console.log(222)
                            this.remove(works.id)
                        }
                    }
                    
                }
            )
        }

        if(endTime){
            this.tableData.map(
                (works: Works) => {
                    console.log("last > endTime, created > endTime")
                    console.log(works.latestModifyTime > endTime, works.createdTime > endTime)
                    if(works.latestModifyTime.toString() == new Date(0).toString()){
                        if(works.createdTime > endTime){
                            this.remove(works.id)
                        }
                    }else {
                        if(works.latestModifyTime > endTime){
                            this.remove(works.id)
                        }
                    }
                    
                }
            )
        }

        if(style){
            this.tableData.map(
                (works: Works) => {
                    if(works.style != style){
                        this.remove(works.id)
                    }
                }
            )
        }
        console.log(this.ids)
        console.log(limited)
        if(limited > 0){
            const valueCount = new Object();
            this.tableData.map(
                (works: Works) => {
                    const stuId = works.authorStuId;
                    console.log(stuId)
                    console.log(testObj(valueCount[works.authorStuId]))
                    if(testObj(valueCount[works.authorStuId])){
                        valueCount[works.authorStuId] = 1;
                    }else if(valueCount[works.authorStuId] <= limited){
                        valueCount[works.authorStuId]++;
                    }else{
                        this.remove(works.id)
                    }
                }
            )
            console.log(valueCount);
        }
        console.log(this.ids)

    }

    private log(msg: string, action=null){
        action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
    }

    private remove(id){
        this.ids.map(
            (idInArr, index) => {
                if(idInArr == id){
                    this.ids.splice(index, 1);
                }
            }
        )
    }
    
    

}
