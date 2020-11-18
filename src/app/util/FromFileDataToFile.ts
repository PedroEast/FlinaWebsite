import { GenerateFile } from "../bean/File";
import { FromTableNameAndColumnsToFileData } from './FromTableNameAndColumnsToFileData';
import { TableColumn } from '../bean/TableColumn';
/**
 * 文件封装，封装为GenerateFile类型{ fileName, fileData }
 * 其中fileData交由FromTableNameAndColumnsToFileData来进行
 **/
export class FromFileDataToFile {


  constructor(private strService: FromTableNameAndColumnsToFileData) { }

  gernerateAngularCompoentTsFile(tableName: string, underscoreTable: TableColumn[]) {
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameLink = this.strService.underscoreToLink(tableName);
    result.fileName = `${tableNameLink}.component.ts`;
    result.fileData = this.strService.gernerateAngularCompoentTsFile(tableName, tableNameLink, underscoreTable);
    return result;
  }
  gernerateAngularCompoentScssFile(tableName: string) {
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameLink = this.strService.underscoreToLink(tableName);
    result.fileName = `${tableNameLink}.component.scss`;
    result.fileData = this.strService.gernerateAngularCompoentScssFile();
    return result;
  }
  gernerateAngularCompoentHtmlFile(tableName: string) {
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameLink = this.strService.underscoreToLink(tableName);
    result.fileName = `${tableNameLink}.component.html`;
    result.fileData = this.strService.gernerateAngularCompoentHtmlFile();
    return result;
  }

  gernerateAngularEntity(tableName: string, underscoreTable: TableColumn[]){
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameBigHump = this.strService.littleHumpToBig(this.strService.underscoreToHump(tableName));
    result.fileName = `${tableNameBigHump}.ts`;
    result.fileData = this.strService.gernerateAngularEntity(tableName, underscoreTable);
    return result;
  }

  generateEntityByTable(tableName: string, underscoreTable: TableColumn[]){
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameBigHump = this.strService.littleHumpToBig(this.strService.underscoreToHump(tableName));
    result.fileName = `${tableNameBigHump}.java`;
    result.fileData = this.strService.generateEntityByTable(tableName, underscoreTable);
    return result;
  }

  gernerateAngularService(tableName: string){
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameBigHump = this.strService.underscoreToLink(tableName);
    result.fileName = `${tableNameBigHump}.service.ts`;
    result.fileData = this.strService.gernerateAngularService(tableName);
    return result;
  }

  gernerateController(tableName: string){
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameBigHump = this.strService.littleHumpToBig(this.strService.underscoreToHump(tableName));
    result.fileName = `${tableNameBigHump}Controller.java`;
    result.fileData = this.strService.gernerateController(tableName);
    return result;
  }

  gernerateService(tableName: string){
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameBigHump = this.strService.littleHumpToBig(this.strService.underscoreToHump(tableName));
    result.fileName = `${tableNameBigHump}Service.java`;
    result.fileData = this.strService.gernerateService(tableName);
    return result;
  }

  gernerateServiceImpl(tableName: string){
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameBigHump = this.strService.littleHumpToBig(this.strService.underscoreToHump(tableName));
    result.fileName = `${tableNameBigHump}ServiceImpl.java`;
    result.fileData = this.strService.gernerateServiceImpl(tableName);
    return result;
  }

  gernerateDao(tableName: string){
    let result: GenerateFile = {fileName: null, fileData: null};
    const tableNameBigHump = this.strService.littleHumpToBig(this.strService.underscoreToHump(tableName));
    result.fileName = `${tableNameBigHump}DAO.java`;
    result.fileData = this.strService.gernerateDao(tableName);
    return result;
  }
}
