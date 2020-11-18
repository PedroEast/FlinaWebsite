import { TableColumn } from '../bean/TableColumn';

/**
 * 字符串拼接类 使用字符串进行拼接
 * 被fileService调用后封装为GenerateFile对象{ fileName, fileData }
 * 本类只提供fileData部分
 */

export class FromTableNameAndColumnsToFileData {


  constructor() { }

  gernerateAngularCompoentTsFile(tableName: string, tableNameLink: string, underscoreTable: TableColumn[]): string {
    let tableNameHump = this.underscoreToHump(tableName);
    let tableNameBigHump = this.littleHumpToBig(tableNameHump);
    const selector = `'app-${tableNameLink}'`;
    const templateUrl = `'./${tableNameLink}.component.html'`
    const styleUrls = `['./${tableNameLink}.component.scss']`
    const caseDate = this.getCaseDate(this.gernerateAngularEntity(tableName, underscoreTable))
    let result =
`import { Component, OnInit, SimpleChanges, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ${tableNameBigHump} } from 'src/app/entity/${tableNameBigHump}';
import { ${tableNameBigHump}SqlService } from 'src/app/service/${tableNameLink}-sql.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { FromTableColumnAndDataToObject } from "src/app/utils/FromTableColumnAndDataToObject";
import { MatTableDataSource } from '@angular/material/table';
// 公共组件服务，在angular生成服务代码中写明了源码
import { CommonUIService } from 'src/app/service/common-ui.service';
// Message: const { content } = data; 只有一个content属性的bean
import { Message } from 'src/app/bean/Message';
// Note 需要在app.module.ts注册后才能使用

@Component({
  selector: ${selector},
  templateUrl: ${templateUrl},
  styleUrls: ${styleUrls}
})
export class ${tableNameBigHump}Component implements OnInit {
  tableName: string;
  tableData: ${tableNameBigHump}[];
  dataSource;
  dataColumns: string[];
  displayedColumns: string[];
  selection = new SelectionModel(true, []);
  dataFormControl = new FormControl();
  multi = false;

  constructor(
    private commonUI: CommonUIService,
    private tableSql: ${tableNameBigHump}SqlService
  ) { }
  // about init
  ngOnInit(): void {
    this.findAll();
  }
  // about date style
  switchDate(column){
    switch(column){
${caseDate}
          return true;
        default:
          return false;
    }
  }
  isDate(value){
    return value instanceof Date;
  }

  findAll() {
    this.tableSql.getAll${tableNameBigHump}()
      .subscribe((datas: ${tableNameBigHump}[]) => {
        // console.log(datas)
        this.tableData = datas;
        const firstDataIndex = 0;
        this.dataColumns = Object.keys(this.tableData[firstDataIndex]);
        this.displayedColumns = ["select", ...this.dataColumns];
        this.tableData.map(data => {
          this.dataColumns.map(column => {
            // console.log( data[column], this.switchDate(column))
            this.switchDate(column) ? data[column] = new Date(data[column]) : "";
          })
        })
        // console.log(this.tableData)
        this.dataSource = new MatTableDataSource(this.tableData);
      })
  }

  // about sql
  downloadExtraFile() {
    const selectedRows: ${tableNameBigHump}[] = this.selection.selected;
    if(selectedRows.length === 0 ) {this.log("还未选择数据"); return}
    if(!this.multi && selectedRows.length > 1 ) {this.log("禁止多行下载附件"); return}
    const row = selectedRows[0];
    this.tableSql.downloadExtraFile(row.id)
      .subscribe((data: Message) => {
        if(data.content){
          // console.log(data.content)
          this.tableSql.getExtraZipFile(data.content, row.id);
        }
      })
  }
  uploadExtraFile() {
    const selectedRows: ${tableNameBigHump}[] = this.selection.selected;
    if(selectedRows.length === 0 ) {this.log("还未选择数据"); return}
    if(!this.multi && selectedRows.length > 1 ) {this.log("禁止多行上传附件"); return}
    const row = selectedRows[0]
    const uploadFileDialogRef =this.commonUI.showUploadWith(['img','audio',"video","docx"]);
    uploadFileDialogRef.afterClosed()
      .subscribe( fileList =>{
        if(fileList && fileList!== 0){
          this.tableSql.uploadExtraFile(row.id, fileList)
            .subscribe(_ => console.log("success"))
        }
      })
  }
  delete() {
    const selectedRows: ${tableNameBigHump}[] = this.selection.selected;
    if(selectedRows.length === 0 ) {this.log("还未选择数据"); return}
    // Multi-line irrelevant
    const deleteDialogRef = this.commonUI.showDeleteConfirmWith("是否删除当前行？")
    deleteDialogRef.afterClosed()
      .subscribe( result => {
        if(result){
          selectedRows.map(row => {
            console.log(row)
            this.tableSql.deleteTbAdmInfo(row)
            .subscribe(_ => {this.log("删除成功"); this.findAll();})
          });
        }
      })
  }
  update() {
    this.log("更新")
  }
  insert(){
    this.log("新增")
  }
  importData(){
    this.log("导入数据")
  }
  exportData(){
    this.log("导出数据")
  }

  // about table filter
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // about UI checked group
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

  // about UI tip
  log(msg, action=null){
    action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
  }

}
`
    return result;
  }

  gernerateAngularCompoentScssFile(): string {
    let result =
`@import "src/styles.scss";

.actions{
    background-color: white;
    color: $card-bg;
    padding: 0 1em;
}
table{
    width: 100%;
    border-radius: 4px;
}
`
    return result;
  }
  gernerateAngularCompoentHtmlFile(): string {
    let result =
`<div class="actions">
<mat-form-field class="filter">
  <input matInput type="text"  placeholder="filter" (keyup)="applyFilter($event.target.value)">
</mat-form-field>

<button mat-button (click)='insert()'>新增</button>
<button [disabled]="multi" mat-button matTooltip="禁止多行修改" (click)="update()">修改</button>
<button mat-button color="warn" (click)="delete()">删除</button>
<button [disabled]="multi" mat-button matTooltip="禁止多行上传附件" (click)="uploadExtraFile()">上传附件</button>
<button [disabled]="multi" mat-button matTooltip="禁止多行下载附件" (click)="downloadExtraFile()">下载附件</button>
<button mat-button (click)="importData()">导入数据</button>
<button mat-button (click)="exportData()">导出数据</button>
<mat-slide-toggle [(ngModel)]="multi">多行操作模式</mat-slide-toggle>
</div>

<table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="selection.toggle(row)"></tr>

  <!-- Checkbox Column -->
  <ng-container matColumnDef="select">
    <th mat-header-cell *matHeaderCellDef>
      <mat-checkbox   (change)="$event ? masterToggle() : null" [checked]="selection.hasValue() && isAllSelected()"
        [indeterminate]="selection.hasValue() && !isAllSelected()">
      </mat-checkbox>
    </th>
    <td mat-cell *matCellDef="let row">
      <mat-checkbox   (click)="$event.stopPropagation()" (change)="$event ? selection.toggle(row) : null" [checked]="selection.isSelected(row)">
      </mat-checkbox>
    </td>
  </ng-container>
  <!--  Column -->
  <ng-container *ngFor="let columnName of dataColumns" [matColumnDef]="columnName">
    <th mat-header-cell *matHeaderCellDef>{{columnName}}</th>
    <td mat-cell *matCellDef="let element">
      <div *ngIf="!isDate(element[columnName])">{{element[columnName]}}</div>
      <div *ngIf="isDate(element[columnName])">{{element[columnName] | date: "yyyy-MM-dd"}}</div>
    </td>
  </ng-container>
</table>
`
    return result;
  }

  gernerateAngularService(tableName: string) {

    let tableNameHump = this.underscoreToHump(tableName);
    let tableNameBigHump = this.littleHumpToBig(tableNameHump);
    let result =
`import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable, of } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { ${tableNameBigHump} } from "../entity/${tableNameBigHump}";
import { Message } from "../bean/Message";
import { backEndAPIAddress ,jwt,  jsonHttpOptions, postFileOptions, staticResource} from "../config/HttpConfig";
// 依赖的公共常量
// export const backEndAPIAddress = "http://localhost:8080/api/";
// export const jwt = window.localStorage.getItem("jwt")
// export let jsonHttpOptions = jwt ? {headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': jwt})}: {headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
import { CommonUIService } from '../service/common-ui.service';
/* 依赖的公共轻提示组件服务
@Injectable({providedIn: 'root'})
export class CommonUIService {
  constructor(
    public snackBar: MatSnackBar,
  ) { }

  showSnackBarWith(message, action="我知道了"){
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
} */
import { CommonHandleErrorUtil } from '../utils/CommonHandleErrorUtil';
/* 依赖的公共异常处理器
export class CommonHandleErrorUtil{
  constructor(
    private router: Router,
    private commonUI: CommonUIService
  ) { }
  handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
    console.error(error);
    const erroeStatusCode: number = error.error.status;
  // 403被拒， 因为没有权限，跳转至登陆界面
    if(erroeStatusCode === 403) this.router.navigate(["login"],{})
    this.log(\`\${operation} failed: \${error.message}\`);
    return of(result as T);
  };
}
  log(msg, action=null){
    action ? this.commonUI.showSnackBarWith(msg, action) : this.commonUI.showSnackBarWith(msg);
  }
} */
// 本服务
@Injectable({
  providedIn: 'root'
})
export class ${tableNameBigHump}SqlService extends CommonHandleErrorUtil {
  tableurl: string = backEndAPIAddress + "admin/${tableNameHump}";
  constructor(
    private http: HttpClient,
    private myrouter: Router,
    private mycommonUI: CommonUIService
    ) { super(myrouter, mycommonUI) }

  add${tableNameBigHump}(${tableNameHump}: ${tableNameBigHump}): Observable<${tableNameBigHump}> {
    return this.http.post<${tableNameBigHump}>(this.tableurl, ${tableNameHump}, jsonHttpOptions).pipe(
      tap((new${tableNameBigHump}: ${tableNameBigHump}) => console.log(\`added ${tableNameHump} success.\`)),
      catchError(this.handleError<${tableNameBigHump}>('add${tableNameBigHump}()'))
    );
  }
  update${tableNameBigHump}(${tableNameHump}: ${tableNameBigHump}): Observable<any> {
    return this.http.put(this.tableurl, ${tableNameHump}, jsonHttpOptions).pipe(
      tap(_ => console.log(\`updated ${tableNameHump} id=\${${tableNameHump}.id} success.\`)),
      catchError(this.handleError<any>('update${tableNameBigHump}()'))
    );
  }
  delete${tableNameBigHump}(${tableNameHump}: ${tableNameBigHump} | number): Observable<${tableNameBigHump}> {
    const id = typeof ${tableNameHump} === 'number' ? ${tableNameHump} : ${tableNameHump}.id;
    const url = \`\${this.tableurl}/\${id}\`;
    return this.http.delete<${tableNameBigHump}>(url, jsonHttpOptions).pipe(
      tap(_ => console.log(\`deleted ${tableNameHump} id=\${id} success.\`)),
      catchError(this.handleError<${tableNameBigHump}>('delete${tableNameBigHump}()'))
    );
  }
  getAll${tableNameBigHump}(): Observable<${tableNameBigHump}[]> {
    return this.http.get<${tableNameBigHump}[]>(this.tableurl, jsonHttpOptions)
      .pipe(
        tap(_ => console.log(\`fetched all ${tableNameBigHump} success.\`)),
        catchError(this.handleError<${tableNameBigHump}[]>(\`getAll${tableNameBigHump}()\`, []))
      );
  }
  get${tableNameBigHump}By(id: number): Observable<${tableNameBigHump}> {
    const url = \`\${this.tableurl}/\${id}\`;
    return this.http.get<${tableNameBigHump}>(url, jsonHttpOptions)
      .pipe(
        tap(_ => console.log(\`fetched ${tableNameHump} id=\${id} success.\`)),
        catchError(this.handleError<${tableNameBigHump}>(\`get${tableNameBigHump}() id=\${id}\`))
      );
  }

  uploadExtraFile(id: number, fileList: []) {
    const url = \`\${this.tableurl}/uploadExtra/\${id}\`;
    const formData = new FormData();
    fileList.map((file, index) => {
      formData.append('files', file);
    })
    return this.http.post(url, formData, postFileOptions)
      .pipe(
        tap(_ => console.log(\`fetched tbAdmInfo id=\${id} success.\`)),
        catchError(this.handleError(\`uploadExtraFile() id=\${id}\`))
      );
  }

  downloadExtraFile(id: number) {
    const url = \`\${this.tableurl}/downloadExtra/\${id}\`;
    return this.http.get<Message>(url, jsonHttpOptions)
      .pipe(
        tap(_ => console.log(\`fetched tbAdmInfo id=\${id} success.\`)),
        catchError(this.handleError<Message>(\`downloadExtraFile() id=\${id}\`))
      )
  }

  getExtraZipFile(fileUrl: string, id: number) {
    fileUrl = staticResource + fileUrl;
    this.http.get(fileUrl, {headers: jsonHttpOptions.headers, observe: 'response', responseType: 'blob'}).pipe(
      tap(_ => console.log('fetched fileUrl')),
      catchError(this.handleError('generateFile()'))
    ).subscribe((response: HttpResponse<Blob>) => {
      console.log(response)
      const fileRename = '${tableName}?id=' + id +'.zip';
      const fileType = 'application/zip'
      this.downloadFile(response.body,  fileRename, fileType);
      this.mycommonUI.showSnackBarWith("正在下载");
    });
  }

  downloadFile(data: Blob, fileRename: string, fileType: string) {
    const file = new Blob([data],{type: fileType});
    const dataUrl = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.id = 'tempId';
    document.body.appendChild(a);
    a.download = fileRename;
    a.href = dataUrl;
    a.click();
    const tempA = document.getElementById('tempId');
    if (tempA) {
      tempA.parentNode.removeChild(tempA);
    }
  }
}
`
    return result;
  }
  gernerateAngularEntity(tableName: string, underscoreTable: TableColumn[]) {
    let result = ``;
    let {littleHumpResults, bigHumpResults} = this.columnsToHump(underscoreTable);
    let tableNameHump = this.underscoreToHump(tableName);
    let tableNameBigHump = this.littleHumpToBig(tableNameHump)
    result += `export interface ${tableNameBigHump}{\n`
    littleHumpResults.map((column, index) => {
      let varType = this.dataSourceToTsType(column.Type);
      result += `\t${column.Field}: ${varType};\n`
    });
    result += `}\n`
    return result;
  }


  gernerateController(tableName: string) {
    let tableNameHump = this.underscoreToHump(tableName);
    let tableNameBigHump = this.littleHumpToBig(tableNameHump);
    let result =
`import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("api/admin/${tableNameHump}")
public class ${tableNameBigHump}Controller {
    @Autowired
    private ${tableNameBigHump}Service ${tableNameHump}Service;
    @PostMapping
    //@PreAuthorize("hasRole('admin')") // 用户权限控制 还可以是@PreAuthorize("hasAuthority('read')")等
    public void add${tableNameBigHump}(@RequestBody ${tableNameBigHump} ${tableNameHump}) { ${tableNameHump}Service.save(${tableNameHump}); }
    @PutMapping
    public void update${tableNameBigHump}(@RequestBody ${tableNameBigHump} ${tableNameHump}) {${tableNameHump}Service.update(${tableNameHump});}
    @DeleteMapping("{id}")
    public void delete${tableNameBigHump}By(@PathVariable int id){${tableNameHump}Service.deleteById(id);}
    @GetMapping
    public List<${tableNameBigHump}> getAll${tableNameBigHump}() { return ${tableNameHump}Service.findAll(); }
    @GetMapping("{id}")
    public Optional<${tableNameBigHump}> get${tableNameBigHump}By(@PathVariable int id) { return ${tableNameHump}Service.findById(id); }
    //@PostMapping("/getLikeBy") // The filter is implemented on the front end, and the back end no longer needs fuzzy query
    //public List<${tableNameBigHump}> get${tableNameBigHump}LikeBy(@RequestBody ${tableNameBigHump} ${tableNameHump}) { return ${tableNameHump}Service.findLikeBy(user); }

    // The file with the same name is repeatedly uploaded, and the result is overwritten
    @PostMapping("uploadExtra/{id}")
    public Message uploadExtraFiles(@PathVariable int id, @RequestParam("files") MultipartFile[] files){
        Message result = new Message("success");
        String tableName = "${tableNameHump}";
        ${tableNameHump}Service.dealWithUploadExtraFiles(files, tableName, id);
        return result;
    }

    @GetMapping("downloadExtra/{id}")
    public Message downloadExtraFiles(@PathVariable int id){
        Message result;
        String targetPath = "${tableNameHump}/zip/" + id + ".zip";
        result = new Message(targetPath);
        return result;
    }
}`
    return result;
  }

  gernerateService(tableName: string) {
    let tableNameHump = this.underscoreToHump(tableName);
    let tableNameBigHump = this.littleHumpToBig(tableNameHump);
    let result =
`import java.util.List;
import java.util.Optional;

public interface ${tableNameBigHump}Service {
    public void save(${tableNameBigHump} ${tableNameHump});
    public void deleteById(int id);
    public List<${tableNameBigHump}> findAll();
    public void update(${tableNameBigHump} ${tableNameHump});
    public Optional<${tableNameBigHump}> findById(int id);
    //filter在前端得以实现，后端就不再需要模糊查询
    //List<${tableNameBigHump}> getLikeBy(${tableNameBigHump} ${tableNameHump});
    public void dealWithUploadExtraFiles(MultipartFile[] files, String tableName, int id);
}`;
    return result;
  }

  gernerateServiceImpl(tableName: string) {
    let tableNameHump = this.underscoreToHump(tableName);
    let tableNameBigHump = this.littleHumpToBig(tableNameHump);
    let result =
`import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import me.dongqinglin.auto.util.FileUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ${tableNameBigHump}ServiceImpl implements ${tableNameBigHump}Service {

    @Value("\${prosonal-file-server}")
    private String uploadFilePath;

    @Autowired
    private ${tableNameBigHump}DAO ${tableNameHump}Dao;

    public void save(${tableNameBigHump} ${tableNameHump}){${tableNameHump}Dao.save(${tableNameHump});}
    public void update(${tableNameBigHump} ${tableNameHump}){${tableNameHump}Dao.save(${tableNameHump});}
    public void deleteById(int id){${tableNameHump}Dao.deleteById(id);}
    public List<${tableNameBigHump}> findAll(){return ${tableNameHump}Dao.findAll();}
    public Optional<${tableNameBigHump}> findById(int id){return ${tableNameHump}Dao.findById(id);}
    //filter在前端得以实现，后端就不再需要模糊查询
    //List<${tableNameBigHump}> findLikeBy(${tableNameBigHump} ${tableNameHump}){return ${tableNameHump}Dao.findLikeBy列名大驼峰(${tableNameHump}.get${tableNameBigHump}by列名大驼峰());}
    public void dealWithUploadExtraFiles(MultipartFile[] files, String tableName, int id){
        if(files.length == 0 ) System.out.println("None file.");
        String IDFolder = uploadFilePath + tableName +"/" + id + "/";
        String ZipFolder = uploadFilePath + tableName  + "/zip/";
        FileUtil.makeDir(IDFolder);
        FileUtil.makeDir(ZipFolder);
        for (int i = 0; i < files.length; i++) {
            try {
                MultipartFile file = files[i];
                String fileName = file.getOriginalFilename();
                // System.out.println(fileName);
                file.transferTo(new File(IDFolder + fileName));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        String zipFileName = ZipFolder + id + ".zip";
        FileUtil.zipFiles(IDFolder,zipFileName);
    }
}`
    return result;
  }

  gernerateDao(tableName: string) {
    let tableNameHump = this.underscoreToHump(tableName);
    let tableNameBigHump = this.littleHumpToBig(tableNameHump);
    let result =
`import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ${tableNameBigHump}DAO extends JpaRepository<${tableNameBigHump},Integer> {
    //filter在前端得以实现，后端就不再需要模糊查询
    //@Query(value = "select * from ${tableName} as t where t.列名 like %?1%",nativeQuery = true)
    //List<${tableNameBigHump}> findLikeBy列名大驼峰(String 列名小驼峰);
}`
    return result;
  }
  /**
   * 生成实体类
   * @param tableName
   * @param underscoreTable
   */
  generateEntityByTable(tableName: string, underscoreTable: TableColumn[]) {
    let result = ``;
    let {littleHumpResults, bigHumpResults} = this.columnsToHump(underscoreTable);
    let tableNameHump = this.underscoreToHump(tableName);
    let tableNameBigHump = this.littleHumpToBig(tableNameHump)
    console.log(underscoreTable)
    // console.log(tableName, underscoreTable, littleHumpResults,bigHumpResults)
    // package
    result += "package 替换成包名;\n"
    // import
    result += `import javax.persistence.*;\nimport java.math.*;\nimport java.sql.*;\n`
    // class
    result += `@Entity(name="${tableName}")\n@Table(name="${tableName}")\npublic class ${tableNameBigHump} {\n`
    // columns
    underscoreTable.map((element, index) => {
      const type = element.Type;
      const varType = this.dataSourceToJavaType(type);
      const filed = element.Field;
      switch (element.Key) {
        case "PRI":
          // id
          result +=
          `\t@Id\n\t@GeneratedValue(strategy= GenerationType.AUTO)\n\t// GenerationType有四种可能值分别是AUTO,INDENTITY,SEQUENCE 和 TABLE。\n\tprivate ${varType} ${this.underscoreToHump(filed)};\n`
          break;
        case "UNI":
          result +=
          `\t@Column(name="${element.Field}", unique=true, insertable=true, updatable=true, columnDefinition="varchar(60)")\n\tprivate ${varType} ${littleHumpResults[index].Field};\n`
          break;
        case "MUL":
          result +=
          `\t@ManyToOne\n\t@JoinColumn(name = "${element.Field}")\n\tprivate ${bigHumpResults[index].Field} ${littleHumpResults[index].Field};\n`
          break;
        default:
          const nullable = element.Null === "YES" ? true : false;
          result +=
          `\t@Column(name="${element.Field}", nullable=${nullable}, insertable=true, updatable=true, columnDefinition="${type}")\n\tprivate ${varType} ${littleHumpResults[index].Field};\n`
          break;
      }
    })
    result += `\t//getter方法使用了链式编程，写法如：tableNameHump.setParam1(...).setParam2(...);`
    // getter and setter
    bigHumpResults.map((element, index) => {
      const field = this.doulbeUpperCaseToLowerCase(element.Field);

      const type = element.Type;
      const varType = this.dataSourceToJavaType(type);
      result += `\tpublic void${tableNameBigHump} set${field}(${varType} ${littleHumpResults[index].Field}){this.${littleHumpResults[index].Field} = ${littleHumpResults[index].Field};return this;}\n`
      result += `\tpublic ${varType} get${field}(){return this.${littleHumpResults[index].Field};}\n`
    })
    result += `}`
    return result;
  }


  doulbeUpperCaseToLowerCase(field: string) {
    if(!field) return;
    // console.log(field)
    let result;
    const firstLetter = field[0];
    const secondLetter = field[1];
    const firstLetterIsUpperCase = upperLetterToNumber(firstLetter) >= 0 && upperLetterToNumber(firstLetter) < 26 ;
    const secondLetterIsUpperCase = upperLetterToNumber(secondLetter) >= 0 && upperLetterToNumber(secondLetter) < 26;
    result = firstLetterIsUpperCase && secondLetterIsUpperCase ? firstLetter.toLowerCase() + field.substring(1, field.length): field;
    // console.log(result)
    return result;
  }

  /**
   * 数据库类型和java类型映射
   * @param type 数据库类型Type
   */
  dataSourceToJavaType(type: string) {
    if(type.indexOf("bit")!== -1){
      return "Boolean"
    }else if(type.indexOf("tinyint")!== -1){
      return "Byte"
    }else if(type.indexOf("bigint")!== -1){
      return "Long"
    }else if(type.indexOf("int")!== -1){
      return "Integer"
    }else if(type.indexOf("char")!== -1) {
      return "String"
    }else if(type.indexOf("double")!== -1) {
      return "Double"
    }else if(type.indexOf("binary")!== -1) {
      return "byte[]"
    }else if(type.indexOf("datetime")!== -1) {
      return "Timestamp"
    }else if(type.indexOf("date")!== -1) {
      return "Date"
    }else if(type.indexOf("timestamp")!== -1) {
      return "Timestamp"
    }else if(type.indexOf("time")!== -1) {
      return "Time"
    }else if(type.indexOf("decimal")!== -1) {
      return "BigDecimal"
    }
  }
  dataSourceToTsType(type: string) {
    if(type.indexOf("bit")!== -1){
      return "boolean"
    }else if(type.indexOf("tinyint")!== -1){
      return "number"
    }else if(type.indexOf("bigint")!== -1){
      return "number"
    }else if(type.indexOf("int")!== -1){
      return "number"
    }else if(type.indexOf("char")!== -1) {
      return "string"
    }else if(type.indexOf("double")!== -1) {
      return "number"
    }else if(type.indexOf("binary")!== -1) {
      return "number[]"
    }else if(type.indexOf("datetime")!== -1) {
      return "Date"
    }else if(type.indexOf("date")!== -1) {
      return "Date"
    }else if(type.indexOf("timestamp")!== -1) {
      return "Date"
    }else if(type.indexOf("time")!== -1) {
      return "Date"
    }else if(type.indexOf("decimal")!== -1) {
      return "number"
    }
  }
  /**
   * 下划线转连字符
   * @param underscoreStr 下划线字符串
   */
  underscoreToLink(underscoreStr: string){
    if(!underscoreStr) return;
    if(underscoreStr.trim().indexOf("_") === -1){
      // console.log("需要接收一个下划线分割的字符串")
      // return underscoreStr;
      // throw new Error("需要接收一个下划线分割的字符串");
      return underscoreStr;
    }else{
      let result = underscoreStr.replace(/_/g, "-");
      return result;
    }
  }
  /**
   * 下划线分割变作小驼峰
   * @param underscoreStr
   */
  underscoreToHump(underscoreStr){
    if(underscoreStr.trim().indexOf("_") === -1){
      // console.log("需要接收一个下划线分割的字符串")
      return underscoreStr;
      throw new Error("需要接收一个下划线分割的字符串");
    }else{
      let result = ""
      while(underscoreStr.indexOf("_") !== -1){
        let underscoreIndex = underscoreStr.indexOf("_");
        result += underscoreStr.substring(0,underscoreIndex);
        let lowercaseLetter = underscoreStr[underscoreIndex + 1];
        // underscoreStr[underscoreIndex + 1] = lowercaseLetter.toUpperCase();
        underscoreStr = lowercaseLetter.toUpperCase() + underscoreStr.substring(underscoreIndex + 2);
      }
      result += underscoreStr;
      // console.log(result,underscoreStr);
      return result;
    }
  }
  /**
   * 小驼峰转大驼峰
   * @param littleHumpStr 小驼峰字符串
   */
  littleHumpToBig(littleHumpStr){
    let result = littleHumpStr.charAt(0).toUpperCase() + littleHumpStr.substring(1);
    return result;
  }





   /**
   * 列转驼峰
   * @param table
   */
  columnsToHump(table: TableColumn[]) {
    let littleHumpResults = []
    let bigHumpResults = []
    table.map(column => {
      let littleHumpResult = Object.assign({}, column);
      let bigHumpResult = Object.assign({}, column);
      littleHumpResult.Field = this.underscoreToHump(column.Field);
      bigHumpResult.Field = this.littleHumpToBig(littleHumpResult.Field);
      littleHumpResults.push(littleHumpResult)
      bigHumpResults.push(bigHumpResult);
    })
    return {littleHumpResults, bigHumpResults};
  }
  getCaseDate(angularEntity: string) {
    if(!angularEntity) return;
    let result = ''
    const lines: string[] = angularEntity.split("\n");

    for(let i = lines.length - 1 ; i >= 0; i--){
      let line: string = lines[i]
      if(line.includes("Date")){
        line = line.trim()
        line = line.replace(/: Date;/, "");
        line = `\tcase "${line}":\n`
        result += line;
      }else{
        lines.splice(i, 1);
      }
    }
    return result;
  }


}



/**
 * 字母转字典顺序
 * @param {string} upperLetter 大写字母
 */
const upperLetterToNumber = (upperLetter) => {
  let upperLetterASCIICode = upperLetter.charCodeAt()
  return upperLetterASCIICode-65;
}
const lowerLetterToNumber = (lowerLetter) => {
  let lowerLetterASCIICode = lowerLetter.charCodeAt()
  return lowerLetterASCIICode-97;
}

const numberToUpperLetter = (num) => {
  return String.fromCharCode(num+65)
}

const numberToLowerLetter = (num) => {
  return String.fromCharCode(num+97)
}
