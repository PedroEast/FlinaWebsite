import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';

import { ColumnDefined, ResTableDefined, TableDefined } from 'src/app/bean/Defined';
import { CommonUIService } from "src/app/common/common-ui.service";
import { TableSqlService } from 'src/app/service/table-sql.service';
import { FromResTableToTable } from "src/app/util/FromResTableToTable";
import { exampleTableObj } from "src/app/config/ExampleSqlEditableConfig";
import { CheckSqlCreateTableError } from 'src/app/util/CheckSqlCreateTableError';

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { 'forbiddenName': { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-table-viewer',
  templateUrl: './table-viewer.component.html',
  styleUrls: ['./table-viewer.component.scss']
})
export class TableViewerComponent implements OnInit {

  isProgressCircleShow: boolean = true;
  newTable: TableDefined;
  tables: TableDefined[];
  isProgress: boolean;
  isEditModel: boolean;
  tableFormControl = new FormControl("", [forbiddenNameValidator(/admin/i)])
  sqlInputFormControl = new FormControl("");
  // 初始化逻辑
  constructor(
    private commonUI: CommonUIService,
    private tableSql: TableSqlService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.isEditModel = false;
    this.newTable = exampleTableObj;
    // console.log(this.newTable);
    this.sqlInputFormControl.setValue(this.newTable.createTable);
    this.showTablesAndColumns();
    
  }

  showTablesAndColumns() {
    this.tableSql.showTablesColumnsAndCreateTable()
      .subscribe((tables: ResTableDefined[]) => {
        const newTables: TableDefined[] = FromResTableToTable.dealWith(tables)
        this.tables = newTables;
        this.isProgress = false;
        this.isProgressCircleShow = false;
        console.log(newTables)
      })
  }

  // 事件逻辑
  dropBy(tableName: string){
    const dialogRef  = this.commonUI.showDeleteConfirmWith(`是否删除数据表${tableName}?`)
    dialogRef.afterClosed()
      .subscribe(result => {
        if(result){
          this.isProgress = true;
          this.tableSql.dropBy(tableName)
            .subscribe(_ => {
              this.showTablesAndColumns();
              this.commonUI.showSnackBarWith(`删除数据表${tableName}成功`, "我知道了")
            })
          }
      })
  }

  tabIsEditModel(createTableStr: string){
    this.isEditModel = !this.isEditModel;
    this.sqlInputFormControl.setValue(createTableStr)
  }

  runSqlNative(value){
    console.log(value)
  }

  sqlInputChange(event: any){
    const key: string = event.key;
    // console.log(event.keyCode)
    // console.log(key);
    const value = this.sqlInputFormControl.value;
    if(!value) return;
    console.log(CheckSqlCreateTableError.dealWith(value));
    
    if(!CheckSqlCreateTableError.dealWith(value)) return;
    console.log(this.sqlInputFormControl.value)
    // todo from CreateTableToTable
  }

  whenPanelOpen(){
    this.isEditModel = false;
    this.sqlInputFormControl.setValue("")
  }

  // 跳转页面
  generateFile(createTableStr){
    if(!createTableStr && createTableStr.trim() == ""){ createTableStr = this.newTable.createTable}
    this.router.navigate(["coder/file-maker", {createTableStr: createTableStr}],)
  }

  findAllBy(table: string){
    this.router.navigate(["coder/data-viewer", {table: JSON.stringify(table)}],)
  }

  // 代理模式
  log(message: string, action = "") {
    this.commonUI.showSnackBarWith(message, action);
  }

  copyToClip(word) {
    this.commonUI.copyToClip(word,'数据表名复制成功');
  }

}
