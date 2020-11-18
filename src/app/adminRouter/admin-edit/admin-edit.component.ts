import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowDefined } from 'src/app/bean/Defined';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { User } from 'src/app/entity/User';
import { Works } from 'src/app/entity/Works';
import { ProjectFlowService } from 'src/app/service/project-flow.service';
import { WorksSqlService } from 'src/app/service/works-sql.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent implements OnInit {
    flow: FlowDefined;
    scence;
    isEditBlocksShow;
    waitEditDatas;
    waitEdit = [];
    ancient  = [];
    modern = [];
    article = [];
    tableData;
    isProgressCircleShow = false;
    constructor(
        private commonUI: CommonUIService,
        private tableSql: WorksSqlService,
        private router: Router,
        private flowApi: ProjectFlowService,
    ) { }

    ngOnInit(): void {
        this.testAuth();
        this.isEditBlocksShow = true;
        this.findAllInfo();
        this.commonUI.setTimeZone(null);
        this.scence = "评分";
        this.getFlow();
    }

    testAuth() {
        const userStr = window.localStorage.getItem("flina-user-save")
        if( userStr){
            const user: User = JSON.parse(userStr);
            if(user.level < 2){
                this.log("权限不足")
                this.router.navigate(["/admin"])
            }
        }
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
               
            }
        )
    }
    findAllInfo() {
        this.isProgressCircleShow = true;
        this.tableSql.getAllWorksInfo().subscribe(
            (datas: Works[]) => {
                this.isProgressCircleShow = false;
                this.tableData = datas;
                console.log(this.tableData)
                const firstDataIndex = 0;
                const dataColumns = Object.keys(this.tableData[firstDataIndex]);
                this.tableData.map(data => {
                    dataColumns.map(column => {
                    this.switchDate(column) ? data[column] = new Date(data[column]) : "";
                })
                this.distruteWorksStyles();
                
            })
        }) 
    }

    distruteWorksStyles() {
        this.waitEdit = [];
        this.ancient = [];
        this.modern = [];
        this.article = [];
        const datas: Works[] = this.tableData;
        datas.map(
            (data: Works) => {
                if(data.waitEdit) {
                    this.waitEdit.push(data);
                    switch(data.style) {
                        case "古典诗词":
                            this.ancient.push(data);
                            break;
                        case "近代诗":
                        case "近代诗歌":
                        case "现代诗":
                            this.modern.push(data);
                            break;
                        case "文章":
                            this.article.push(data);
                            break;
                    }
                }
            }
        )
    }

    editBlockClick(event, target){
        event.stopPropagation();
        // 分类
        if(target == "waitEdit"){
            if(!this.flow.classStatus){
                this.log("暂未进入该流程")
                return;
            }
        }else {
            if(!this.flow.editStatus) {
                this.log("暂未进入该流程")
                return;
            }
        }
        switch(target) {
            case "waitEdit":
                this.waitEditDatas = this.waitEdit;
                this.scence = "分类";
                break;
            case "ancient":
                this.waitEditDatas = this.ancient;
                this.scence = "评分";
                break;
            case "modern":
                this.waitEditDatas = this.modern;
                this.scence = "评分";
                break;
            case "article":
                this.waitEditDatas = this.article;
                this.scence = "评分";
                break;
        }
        // console.log(this.waitEditDatas)
        if(this.waitEditDatas.length == 0) {
            this.log("该项没有作品以待审理")
            return;
        }
        this.isEditBlocksShow = false;
    }


    private log(msg: string, action=null){
        action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
    }
}
