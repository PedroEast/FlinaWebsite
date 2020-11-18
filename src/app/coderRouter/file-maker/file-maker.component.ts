import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FullstackAutoService } from "src/app/service/fullstack-auto.service";
import { TableSqlService } from 'src/app/service/table-sql.service';
import { CommonUIService } from 'src/app/common/common-ui.service';
import { FileTabViewerComponent } from 'src/app/router/file-tab-viewer/file-tab-viewer.component';

import { FullStackAutoRequest } from 'src/app/bean/Request';
import { MessageResponse } from 'src/app/bean/Response';
import { fullStackAutoSolutionsObj } from "src/app/config/FullStackAutoConfig";
import { FileDefined, FullstackSolutionDefined } from "src/app/bean/Defined";


@Component({
  selector: 'app-file-maker',
  templateUrl: './file-maker.component.html',
  styleUrls: ['./file-maker.component.scss']
})
export class FileMakerComponent implements OnInit {
  fullStackSolutions: FullstackSolutionDefined[];
  sourceSelectName: string;
  tableFormGroup: FormGroup;
  fullStackFormGroup: FormGroup;
  request;

  constructor(
    private _formBuilder: FormBuilder,
    private tableSql: TableSqlService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private commonUI: CommonUIService,
    private fileService: FullstackAutoService
    ) { }

  ngOnInit() {
 
    const createTableStr = this.route.snapshot.paramMap.get("createTableStr");
    console.log(createTableStr)
    this.tableFormGroup = this._formBuilder.group({
      sourceSelect: [false],
      tableName: [{value: '', disabled: true}, Validators.required],
      createTable: ["", Validators.required]
    });
    this.tableFormGroup.get("createTable").setValue(createTableStr)
    
    this.fullStackSolutions = fullStackAutoSolutionsObj;
    const solution = new Object();
    this.fullStackSolutions.map(FullStackSolulation => {
      const value = `${FullStackSolulation.frontEndApi}->${FullStackSolulation.backEndApi}->${FullStackSolulation.backEndSqlApi}`
      solution[FullStackSolulation.solutionId] = value;
    })
    this.fullStackFormGroup = this._formBuilder.group(solution);
    this.sourceSelectName = "数据表名";
  }

  sourceSelect(value){
    // console.log(value)
    value ? this.tableFormGroup.get('tableName').enable() : this.tableFormGroup.get('createTable').enable();
    value ? this.tableFormGroup.get('createTable').disable() : this.tableFormGroup.get('tableName').disable();
  }

  async viewGernerateFile(){
    // 过滤未选择生成策略的情况
    const fullStackSolution = this.fullStackFormGroup.value;
    const flag = Object.values(fullStackSolution).reduce((accumulator, currentValue) => accumulator || currentValue);
    // console.log(flag)
    if(flag){
        // console.log(fullStackSolution);
        // 涉及异步的，均交由处理链进行处理
        this.dealChainGetCreateTableStr();
    }
  }

  private dealChainGetCreateTableStr() {
    let createTable = "";
    const isLocalModel = this.tableFormGroup.get('sourceSelect').value
    switch (isLocalModel){
      case false: 
        createTable = this.tableFormGroup.get("createTable").value;
        this.dealChainGenerateFile(createTable);
        break;
      case true:
        const tableName = this.tableFormGroup.get("tableName").value;
        this.tableSql.showCreateTableBy(tableName)
          .subscribe(data => {
            const createTableIndex = 1;
            console.log(data);
            createTable = data[0][createTableIndex];
            this.dealChainGenerateFile(createTable);
          })
        break;
    }
  }
  private dealChainGenerateFile(createTable: string) {
    console.log(createTable)
    const solution = this.fullStackFormGroup.value;
    const solutionStr: string = Object.values(solution)[0].toString();
    console.log(solutionStr);
    const solutionStrList = solutionStr.split("->")
    const frontendApi = solutionStrList[0];
    const backendApi = solutionStrList[1];
    const daoApi = solutionStrList[2];

    if(!frontendApi || !backendApi || !daoApi || !createTable){
       return;
    }
    const request: FullStackAutoRequest = {
        daoApi,
        backendApi,
        frontendApi,
        createTableStr: createTable
    }
    this.request = request;
    this.fileService.view(request)
      .subscribe((data: FileDefined[]) => {
        if(data && data.length != 0) {
            this.showDialog(data);
        }
    })
  }
  

  showDialog(autoCode: FileDefined[]) {
    const dialogRef = this.dialog.open(FileTabViewerComponent, {
      width: '1000px',
      data: {title: "预览", contents: autoCode}
    });

    dialogRef.afterClosed().subscribe(result => {
     if(result){
      console.log("点击了下载按钮")
      this.fileService.make(this.request)
        .subscribe((data: MessageResponse) => {
            console.log(data)
            if(data.code == 200){
                this.fileService.downloadFile(data.data);
            }else if(data.code == 502){
                this.fileService.downloadFile("flina.zip");
            }
        })
     }
    });
  }

  showHelp(){
    this.commonUI.showSnackBarWith(`点击了帮助按钮`, `我知道了`)
  }
  showEmail(){
    this.commonUI.showSnackBarWith(`点击了帮助按钮`, `我知道了`)
  }

  select(){
    console.log(this.fullStackFormGroup.value)
  }

  
}
