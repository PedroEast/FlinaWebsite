import { Component, Input, OnInit } from '@angular/core';
import { Works } from 'src/app/entity/Works';

@Component({
  selector: 'app-admin-edit-preview',
  templateUrl: './admin-edit-preview.component.html',
  styleUrls: ['./admin-edit-preview.component.scss']
})
export class AdminEditPreviewComponent implements OnInit {
    isEditPreviewShow;
    index;
    data;
    isEdit;
    classCount;
    editCount;
    @Input() scence;
    @Input() datas;

    constructor() { }

    ngOnInit(): void {
        this.isEdit = false;
        if(this.scence == "评分") this.isEdit = true;
        this.isEditPreviewShow = true;
        this.showCount();
    }
    showCount() {
        this.editCount = 0;
        this.classCount = 0;
        this.datas.map(
            (data: Works) => {
                if(data.editorId){
                    this.classCount++;
                }
                if(data.editorScore) {
                    this.editCount++;
                }
            }
        )
    }

    editWork(event, index){
        event.stopPropagation();
        this.index = index;
        this.isEditPreviewShow = false;
    }

    editOver(){
        this.isEditPreviewShow = true;
    }



}
