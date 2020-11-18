import { Component, OnInit, SimpleChanges, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { TableDefined } from 'src/app/bean/Defined';
import { TableSqlService } from 'src/app/service/table-sql.service';
import { FromTableColumnAndDataToObject } from "src/app/util/FromTableColumnAndDataToObject";
import { CommonUIService } from 'src/app/common/common-ui.service';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.scss']
})
export class DataViewerComponent implements OnInit {

  table: any;
  tableName: string;
  tableData: Object[];
  dataSource;
  dataColumns: string[];
  displayedColumns: string[];
  selection = new SelectionModel(true, []);
  dataFormControl = new FormControl();
  multi = false;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableSql: TableSqlService,
    private commonUI: CommonUIService
  ) { }
  // 初始化逻辑
  ngOnInit(): void {
    const tableStr = this.route.snapshot.paramMap.get("table");
    this.table = JSON.parse(tableStr)
    if(!this.table) this.router.navigate(["app/tableViewer"])
    console.log(this.table)
    this.findAllBy(this.table);
  }

  isDate(value){
    return value instanceof Date;
  }

  findAllBy(table: TableDefined) {
    if(!table) return;
    this.tableSql.findAllBy(table.tableName)
      .subscribe((data: Object[]) => {
        console.log(data)
        this.tableName = table.tableName;
        this.tableData = FromTableColumnAndDataToObject.dealWith(table.columns, data);
        const firstDataIndex = 0;
        this.dataColumns = Object.keys(this.tableData[firstDataIndex]);
        this.displayedColumns = ["select", ...this.dataColumns];
        this.tableData.map(datas => {
          this.dataColumns.map(column => {
            this.isDate(data[column]) ? data[column] = new Date(data[column]) : "";
          })
        })
        // console.log(this.tableData)
        this.dataSource = new MatTableDataSource(this.tableData);
      })
  }


  // 选择框逻辑
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

  // 过滤器逻辑
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  downloadFile(row: Object) {
    console.log(row);
  }
  uploadFile(row: Object) {
    console.log(row);
  }
  delete(row: Object) {
    console.log(row);
  }
  update(row: Object) {
    console.log(row);
  }

  multiEdit(editTxt: string){
    // if(!editTxt) return;
    // const selectedRows = this.selection.selected;
    // console.log(selectedRows);
    // if(selectedRows.length === 0 ) {this.log("还未选择数据"); return}
    // if(!this.multi) {this.edit(selectedRows[0], editTxt); return}
    // selectedRows.map(row => this.edit(row, editTxt));
  }

  insert(){
    this.log("新增")
  }

  uploadData(){
    this.log("上传数据")
  }
  downloadData(){
    this.log("下载数据")
  }

  // 轻提示逻辑
  log(msg, action=null){
    action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
  }

}
