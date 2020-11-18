import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { User } from 'src/app/entity/User';
import { Works } from 'src/app/entity/Works';
import { WorksSqlService } from 'src/app/service/works-sql.service';

@Component({
  selector: 'app-poetry-list',
  templateUrl: './poetry-list.component.html',
  styleUrls: ['./poetry-list.component.scss']
})
export class PoetryListComponent implements OnInit {
    isProgressCircleShow = false;
    tableData: Works[];
    constructor(
        private commonUI: CommonUIService,
        private tableSql: WorksSqlService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.findAll();
    }

    switchDate(column){
        switch(column){
            case "createdTime":
            case "latestModifyTime":
            case "editedTime":
        
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

    findAll() {
        this.isProgressCircleShow = true;
        const userStr = window.localStorage.getItem("flina-user-save")
        if( userStr){
            const user: User = JSON.parse(userStr);
            this.tableSql.getPoetryByAuthorId(user.id).subscribe(
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
                    
                })
              })
        }
        
    }

    modify(event, id) {
        event.stopPropagation();
        console.log(id)
        this.router.navigate(["/user/poetry-detail", {id} ],)
    }
    delete(event, id) {
        event.stopPropagation();
        const dialog = this.commonUI.showDeleteConfirmWith("是否删除本作品?");
        dialog.afterClosed().subscribe(
            data => {
                if(data) {
                    const userStr = window.localStorage.getItem("flina-user-save")
                    if( userStr){
                        const user: User = JSON.parse(userStr);
                        this.tableSql.deleteWorks(id, user.id).subscribe(_ => {this.findAll()})
                    }
                }
            }
        )
    }
    showDetail(event, id){
        event.stopPropagation();
        this.router.navigate(["/user/poetry-detail", {id} ],)
        console.log(333)
    }
}
