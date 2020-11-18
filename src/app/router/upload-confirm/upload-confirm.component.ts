import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { DataStructure } from "src/app/util/DataStructure";
@Component({
  selector: 'app-upload-confirm',
  templateUrl: './upload-confirm.component.html',
  styleUrls: ['./upload-confirm.component.scss']
})
export class UploadConfirmComponent implements OnInit{
  fileNode;
  files;
  url: string;
  title: string;
  fileType: string[];
  inputFileType: string;
  yes: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<UploadConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}
  ngOnInit(): void {

    this.title = this.data.title;
    this.fileType = this.data.acceptFileType;
    this.inputFileType = this.getAcceptFileTypeFromFileTypeArr(this.fileType);
    this.fileNode = document.querySelector('#file')
    this.files = this.fileNode.files;
  }

  // ['img','audio',"video","docx"] 数组语法是进行的封装，是为了方便使用
  // 一个以英文句号（"."）开头的合法的不区分大小写的文件名扩展名。例如： .jpg，.pdf 或 .doc。
  // 一个不带扩展名的 MIME 类型字符串。
  // 字符串 audio/*， 表示“任何音频文件”。
  // 字符串 video/*，表示 “任何视频文件”。
  // 字符串 image/*，表示 “任何图片文件”。
  // 用英文逗号隔开，如<input type="file" accept="image/*,.pdf">
  getAcceptFileTypeFromFileTypeArr(fileType: string[]): string {
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
  upload() {
    // console.log("点击了上传按钮")
    // console.log(this.url)
    this.fileNode.click();
  }
  fileEdit(){
    this.files =  DataStructure.objToArray(this.fileNode.files);
    // console.log(this.files)
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteFile(index: number){
    // console.log(index)
    // console.log(this.files);
    this.files.splice(index, 1)
    // console.log(this.files);

  }
}
