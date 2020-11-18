import { Component, OnInit, SimpleChanges, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/entity/User';
import { UserSqlService } from 'src/app/service/user-sql.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { FromTableColumnAndDataToObject } from "src/app/util/FromTableColumnAndDataToObject";
import { MatTableDataSource } from '@angular/material/table';
import { CommonUIService } from 'src/app/common/common-ui.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    tableName: string;
    tableData: User[];
    dataSource;
    dataColumns: string[];
    displayedColumns: string[];
    selection = new SelectionModel(true, []);
    dataFormControl = new FormControl();
    multi = false;
  
    constructor(
      private commonUI: CommonUIService,
      private tableSql: UserSqlService
    ) { }
   
    ngOnInit(): void {
      this.findAll();
    }
  
    switchDate(column){
      switch(column){
      case "lastPasswordModifyTime":
  
            return true;
          default:
            return false;
      }
    }
    isDate(value){
      return value instanceof Date;
    }
  
    findAll() {
      this.tableSql.getAllUser()
        .subscribe((datas: User[]) => {
          this.tableData = datas;
          const firstDataIndex = 0;
          this.dataColumns = Object.keys(datas[firstDataIndex]);
          this.displayedColumns = ["select", ...this.dataColumns];
          this.tableData.map(data => {
            this.dataColumns.map(column => {
              this.switchDate(column) ? data[column] = new Date(data[column]) : "";
            })
          })
      
          this.dataSource = new MatTableDataSource(this.tableData);
        })
    }
  
    delete() {
      const selectedRows: User[] = this.selection.selected;
  
      const deleteDialogRef = this.commonUI.showDeleteConfirmWith("是否删除当前行？")
      deleteDialogRef.afterClosed()
        .subscribe( result => {
          if(result){
            selectedRows.map(row => {
              console.log(row)
              this.tableSql.deleteUser(row).subscribe(_ => {
                  this.log("删除成功"); this.findAll();
                  this.masterToggle();
                  this.masterToggle();
                })
            });
          }
        })
    }
    update() {
        const user = this.selection.selected[0] as User;
        if(!user) this.log("请选择用户")
        const data = {
            id: user.id,
            roles: user.roles,
            username: user.username,
            level: user.level
        }
        const dialogRef = this.commonUI.showUserForm(data);
        dialogRef.afterClosed().subscribe((data) => {
            if(data){
                console.log(data)
                const newUser: User = data as User;
                console.log(newUser)
                user.roles = newUser.roles;
                user.level = newUser.level;
                this.tableSql.updateUser(user).subscribe(
                    _ => {
                        this.findAll();
                        this.masterToggle();
                        this.masterToggle();
                    }
                )
            }
        })
    }
    insert(){
        const dialogRef = this.commonUI.showUserForm(new Object() as User);
        this.log("新增")
    }
    importData(){
      this.log("导入数据")
    }
    exportData(){
      this.log("导出数据")
    }
  
  
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    masterToggle() {
      this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  
    log(msg, action=null){
      action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
    }
  

}
