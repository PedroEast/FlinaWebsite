import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UploadConfirmComponent } from '../router/upload-confirm/upload-confirm.component';
import { DeleteConfirmComponent } from '../router/delete-confirm/delete-confirm.component';
import { DevelopLog } from '../entity/DevelopLog';
import { User } from '../entity/User';
import { DelevopLogFormComponent } from '../router/delevop-log-form/delevop-log-form.component';
import { UserFormComponent } from '../router/user-form/user-form.component';
import { DateAdapter } from '@angular/material/core';

/**
 * 公共组件调用服务，典型例子是调用轻提示
 */
@Injectable({
  providedIn: 'root'
})
export class CommonUIService {
  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private adapter: DateAdapter<any>
    ) { }

  showSnackBarWith(message, action="我知道了"){
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  showDeleteConfirmWith(content,title="删除"){
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '300px',
      data: { title, content}
    });
    return dialogRef;
  }

  showUploadWith(acceptFileType: string[], title="上传文件"){
    const dialogRef = this.dialog.open(UploadConfirmComponent, {
      width: '300px',
      data: {acceptFileType, title }
    });
    return dialogRef;
  }

  showUserForm(data: any) {
    const dialogRef = this.dialog.open(UserFormComponent, {
        width: '300px',
        data: data
      });
    return dialogRef;
  }

  showDevelopLogForm(data: DevelopLog) {
    const dialogRef = this.dialog.open(DelevopLogFormComponent, {
        width: '500px',
        data: data
      });
    return dialogRef;
  }

  setTimeZone(timeZone){
      if(timeZone == null) {
        this.adapter.setLocale("ch-ZH");
        return;
      }
      this.adapter.setLocale(timeZone)
  }

  copyToClip(word: string, successMessage: string){
    const input = document.createElement('input')
    input.setAttribute('readonly', 'readonly')
    input.setAttribute('value', word)
    document.body.appendChild(input)
    input.setSelectionRange(0, 9999)
    input.select()
    if (document.execCommand('Copy')) {
      // document.execCommand('Copy');
      this.showSnackBarWith(successMessage);
      
    }
    document.body.removeChild(input)
  }
}
