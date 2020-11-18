import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { User } from 'src/app/entity/User';
import { Works } from 'src/app/entity/Works';
import { WorksSqlService } from 'src/app/service/works-sql.service';

@Component({
  selector: 'app-admin-editor',
  templateUrl: './admin-editor.component.html',
  styleUrls: ['./admin-editor.component.scss']
})
export class AdminEditorComponent implements OnInit {
    isProgressCircleShow;
    numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9];
    data: Works;
    @Input() index;
    @Input() datas;
    @Input() scence;
    @Output() over =  new EventEmitter();
    isEdit;
    constructor(
        private commonUI: CommonUIService,
        private tableSql: WorksSqlService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.isProgressCircleShow = false;
        this.data = this.datas[this.index];
        const id = this.data.id;
        this.findWorks(id);
        this.isEdit = false;
        if(this.scence == "评分") this.isEdit = true;
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
        this.isProgressCircleShow = true;
        this.tableSql.getWorksBy(id).subscribe(data =>{
            this.isProgressCircleShow = false;
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
            console.log(this.data.content)
            
            // console.log(data.latestModifyTime)
        })
    }

    back(event){
        event.stopPropagation();
        // console.log(this.index);
        // console.log(!this.checkInArr(this.index))
        if(!this.checkInArr(this.index - 1)) {
            this.log("前面没有作品啦");
            return;
        }
        this.data = this.datas[this.index--];
        const id = this.data.id;
        this.findWorks(id);
        
    }

    setStyle(event, style){
        event.stopPropagation();
        this.data.style = style;
        this.setEditor()
        // console.log(this.data);
        this.tableSql.updateAdminWorks(this.data).subscribe(
            _ => {
                this.next(null)
            }
        )
    }

    setScore(event, score){
        event.stopPropagation();
        // console.log(score);

        // console.log(this.data.content)
        this.data.editorScore = score;
        this.setEditor();
        this.tableSql.updateAdminWorks(this.data).subscribe(
            _ => {
                this.next(null);
            }
        )
    }

    private setEditor() {
        const userStr = window.localStorage.getItem("flina-user-save")
        // console.log(userStr)
        if( userStr){
            const user: User = JSON.parse(userStr);
            this.data.editorId = user.id;
            this.data.editorName = user.username;
            this.data.editedTime = new Date();
        }
    }

    next(event){
        if(event) event.stopPropagation();
        console.log(this.index);
        console.log(!this.checkInArr(this.index))
        if(!this.checkInArr(this.index + 1)){
            this.log("后面没有作品啦");
            this.over.emit();
            return false;
        } 
        this.data = this.datas[this.index++];
        const id = this.data.id;
        this.findWorks(id);
        
    
    }

    private checkInArr(index) {
        const length = this.datas.length;
        return index >= 0 && index <= length - 1;
    }

    private log(msg: string, action=null){
        action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
    }
}
