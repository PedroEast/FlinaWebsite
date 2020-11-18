import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { User } from 'src/app/entity/User';
import { Works } from 'src/app/entity/Works';
import { WorksSqlService } from 'src/app/service/works-sql.service';

@Component({
  selector: 'app-poetry-list-detail',
  templateUrl: './poetry-list-detail.component.html',
  styleUrls: ['./poetry-list-detail.component.scss']
})
export class PoetryListDetailComponent implements OnInit {
    data: Works;
    constructor(
        private route: ActivatedRoute,
        private commonUI: CommonUIService,
        private tableSql: WorksSqlService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get("id");
        console.log(id)
        this.findWorks(id);
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
    
    findWorks(id) {
        this.tableSql.getWorksBy(id).subscribe(data =>{
            console.log(data)
            const dataColumns = Object.keys(data);
          
            dataColumns.map(column => {
                this.switchDate(column) ? data[column] = new Date(data[column]) : "";
            })
            this.data = data;
            const content: HTMLDivElement = document.querySelector("#poetry-content");
            content.contentEditable = "true";
            content.innerHTML = data.content;
            content.contentEditable = "false"
            console.log(data.latestModifyTime)
        })
    }

    modify() {
        const id = this.data.id;
        console.log(this.data.id)
        this.router.navigate(["/user/submit", {id} ],)
    }

    delete() {
        const dialog = this.commonUI.showDeleteConfirmWith("是否删除"+ this.data.title + "?");
        dialog.afterClosed().subscribe(data => {
            if(data) {
                const id = this.data.id;
                const userStr = window.localStorage.getItem("flina-user-save")
                if( userStr){
                    const user: User = JSON.parse(userStr);
                    this.tableSql.deleteWorks(id, user.id).subscribe(_ => {this.router.navigate(["/user/poetry-list"])})
                }
            }
        })
    }

}
