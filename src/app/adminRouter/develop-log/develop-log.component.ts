import { Component, OnInit, SimpleChanges, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DevelopLog } from 'src/app/entity/DevelopLog';
import { DevelopLogSqlService } from 'src/app/service/develop-log-sql.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonUIService } from 'src/app/common/common-ui.service';

@Component({
  selector: 'app-develop-log',
  templateUrl: './develop-log.component.html',
  styleUrls: ['./develop-log.component.scss']
})
export class DevelopLogComponent implements OnInit {

    isProgressCircleShow = false;
    tableName: string;
    tableData: DevelopLog[];
    dataSource;
    dataColumns: string[];
    displayedColumns: string[];
    selection = new SelectionModel(true, []);
    dataFormControl = new FormControl();
    multi = false;
  
    constructor(
      private commonUI: CommonUIService,
      private tableSql: DevelopLogSqlService
    ) { }
   
    ngOnInit(): void {
      this.findAll();
    }
  
    switchDate(column){
      switch(column){
      case "createdTime":
      case "modifiedTime":
  
            return true;
          default:
            return false;
      }
    }
    isDate(value){
      return value instanceof Date;
    }
  
    findAll() {
        this.isProgressCircleShow = true;
      this.tableSql.getAllDevelopLog()
        .subscribe((datas: DevelopLog[]) => {
            this.isProgressCircleShow = false;
          this.tableData = datas;
          const firstDataIndex = 0;
          this.dataColumns = Object.keys(this.tableData[firstDataIndex]);
          this.displayedColumns = ["select", ...this.dataColumns];
          this.tableData.map(data => {
            this.dataColumns.map(column => {
              this.switchDate(column) ? data[column] = new Date(data[column]) : "";
            })
          })
          this.dataSource = new MatTableDataSource(this.tableData);
        })
    }
    update(developLog: DevelopLog) {
        if(developLog == null) {
            console.log(this.selection.selected)
            developLog = this.selection.selected[0] as DevelopLog;
        }
        const dialogRef = this.commonUI.showDevelopLogForm(developLog);
        dialogRef.afterClosed().subscribe((data) => {
            if(data){
                console.log(data)
                const developLog: DevelopLog = data as DevelopLog;
                developLog.modifiedTime = new Date();
                // console.log(developLog)
                this.isProgressCircleShow = false;
                this.tableSql.updateDevelopLog(developLog).subscribe(
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
      const dialogRef = this.commonUI.showDevelopLogForm(null);
      dialogRef.afterClosed().subscribe((data) => {
          if(data){
            console.log(data)
            const developLog: DevelopLog = data as DevelopLog;
            developLog.createdTime = new Date();
            // console.log(developLog)
            this.tableSql.addDevelopLog(developLog).subscribe(
                _ => {
                    this.findAll();
                }
            )
          }
      })
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

    copyToClip(word) {
        this.commonUI.copyToClip(word,'主题复制成功');
    }
  
  }
  