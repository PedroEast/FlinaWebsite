import { Component, OnInit } from '@angular/core';
import { UploadFileService } from 'src/app/service/upload-file.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

    fileNode;
    files;
    fileType: string[];
    inputFileType: string;
    targetFolder: string;
    isAvaliableUploadbtn: boolean;

    constructor(
       private fileService: UploadFileService
    ) {  }

    ngOnInit(): void {
        this.fileType = [""];
        this.inputFileType = this.getAcceptFileTypeStr(this.fileType);
        this.fileNode = document.querySelector('#file')
        this.files = [];
        this.isAvaliableUploadbtn = false;
    }

    onClickFilePicker() {
        // console.log("点击了上传按钮")
        
        this.fileNode.click();
    }
    onChangeSelectFiles(){
        // this.fileNode.files = [];
        this.files =  this.objToArray(this.fileNode.files);
        // console.log(this.files)
    }
    onClickdeleteFile(index: number){
        console.log(index)
        // console.log(this.files);
        this.files.splice(index, 1)
        // console.log(this.fileNode.files);
        this.fileNode.value = null;
        // console.log(this.fileNode)
        // console.log(this.fileNode.files);
        // console.log(this.fileNode.value);
    }
    onClickUpload(){
        // console.log(this.targetFolder)
        // console.log(this.files);
        if(!this.files || !this.files.length || this.files.length == 0) return;
        if(!this.targetFolder) this.targetFolder = "";
        this.targetFolder = this.targetFolder.trim();
        this.isAvaliableUploadbtn = true;
        this.fileService.postUploadFile(this.files, this.targetFolder)
            .subscribe(_ => {
                this.files = []
                window.alert("上传成功")
                this.isAvaliableUploadbtn = false;
            });
    }

    private objToArray(res: object): object[] {
        const arr = []
        for (const key in res) {
            if (res.hasOwnProperty(key)) {
            const element = res[key];
            arr.push(element);
            } 
        }
        return arr;
    }

    private getAcceptFileTypeStr(fileType: string[]): string {
        if(!fileType || fileType.length === 0) return;
        let result = ""
        let tempArr = []
        fileType.map(type => {
            switch(type){
            case "audio":
            case "video":
            case "image":
                tempArr.push(type + "/*")
                break;
            case "img":
                tempArr.push('image/*');
                break;
            case "vedio":
                tempArr.push("video");
                console.log("大哥，video拼写成了vedio，幸好小弟帮你改好了");
                break;
            default: 
                tempArr.push("." +  type);
                break;
            }
        })
        result = tempArr.join(",")
        return result;
    }

}
