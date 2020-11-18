
import { TableColumn } from '../bean/TableColumn';
import { GenerateFile } from '../bean/File';
import { FromFileDataToFile } from './FromFileDataToFile';
import { FromTableNameAndColumnsToFileData } from './FromTableNameAndColumnsToFileData';

export class FromCreateTableToGenerateFile {
    static strService: FromTableNameAndColumnsToFileData = new FromTableNameAndColumnsToFileData(); 
    static fileService: FromFileDataToFile = new FromFileDataToFile(FromCreateTableToGenerateFile.strService);
    constructor(){}

    static dealWith(createTable: string, fullStackSolutions: object){
        if(!createTable || !fullStackSolutions ) return;
        // console.log(createTable, fullStackSolutions)
        const {tableName, tableColumns} = this.dealWithCreateTableTxt(createTable);
        let result = []
        Object.keys(fullStackSolutions).map(index => {
            let fullStackFiles: GenerateFile[] = [];
            const fullStackSolution = fullStackSolutions[index]
            const fullStackSolutionList = fullStackSolution.split("->");
            const frontEndApiIndex = 0;
            const backEndApiIndex = 1;
            const backEndSqlApiIndex = 2;
            const frontEndFiles: GenerateFile[] = this.generateFrontEndApiFile(fullStackSolutionList[frontEndApiIndex], tableName, tableColumns)
            const backEndFiles: GenerateFile[] = this.generateBackEndApiFile(fullStackSolutionList[backEndApiIndex], tableName, tableColumns)
            const backEndSqlFiles: GenerateFile[] = this.generateBackEndSqlApiFile(fullStackSolutionList[backEndSqlApiIndex], tableName, tableColumns)
            // console.log(fullStackSolution)
            fullStackFiles = fullStackFiles.concat(frontEndFiles).concat(backEndFiles).concat(backEndSqlFiles);
            result = result.concat(fullStackFiles)
        })
        return result;
        
    }

    static  generateFrontEndApiFile(frontEndApiFileType: string, tableName: string, tableColumns: TableColumn[]){
        if(!frontEndApiFileType || !tableColumns || tableColumns.length === 0) return;
        let result: GenerateFile[] = []
        switch(frontEndApiFileType){
            case "angular": 
                console.log("angular")
                const angularEntityFile = this.fileService.gernerateAngularEntity(tableName, tableColumns);
                const angualrServiceFile = this.fileService.gernerateAngularService(tableName);
                const angularComponentHtmlFile = this.fileService.gernerateAngularCompoentHtmlFile(tableName);
                const angularComponentScssFile = this.fileService.gernerateAngularCompoentScssFile(tableName);
                const angularComponentTsFile = this.fileService.gernerateAngularCompoentTsFile(tableName,tableColumns);
                result.push(angularComponentTsFile);
                result.push(angularComponentHtmlFile);
                result.push(angularComponentScssFile);
                result.push(angualrServiceFile);
                result.push(angularEntityFile);
                return result;
                break;
        } 
    }

    static  generateBackEndApiFile(backEndApiFile: string, tableName: string, tableColumns: TableColumn[]){
        if(!backEndApiFile || !tableColumns || tableColumns.length === 0) return;
        let result: GenerateFile[] = []
        switch(backEndApiFile){
            case "spring boot": 
                console.log('spring boot')
                const springBootControllerFile = this.fileService.gernerateController(tableName);
                const springBootControllerFileServiceFile = this.fileService.gernerateService(tableName);
                const springBootControllerFileImplServiceFile = this.fileService.gernerateServiceImpl(tableName);

                result.push(springBootControllerFile);
                result.push(springBootControllerFileServiceFile);
                result.push(springBootControllerFileImplServiceFile);
                return result;
                break;
        } 
    }

    static  generateBackEndSqlApiFile(backEndSqlApiFile: string, tableName: string, tableColumns: TableColumn[]){
        if(!backEndSqlApiFile || !tableColumns || tableColumns.length === 0) return;
        let result: GenerateFile[] = []
        switch(backEndSqlApiFile){
            case "hibernate": 
                console.log("hibernate")
                const hibernateDaoFile = this.fileService.gernerateDao(tableName);
                const hibernateEntityFile = this.fileService.generateEntityByTable(tableName, tableColumns);
                result.push(hibernateDaoFile);
                result.push(hibernateEntityFile);
                return result;
                break;
        } 
    }

    static  dealWithCreateTableTxt(createTable: string) {
        if(!createTable) return;
        createTable = createTable.trim();
        let result = {tableName: "", tableColumns: []}
        const rows = createTable.split("\n");
        rows.map((row, index) => {
            // console.log(row, index, /^\s*$/.test(row))
            if(/^\s*$/.test(row)) rows.splice(index, 1);
        })
        rows.pop();
        const tableNameTxt = rows.shift();
        const tableColumnsTxt = rows;
        // console.log(tableColumnsTxt, tableNameTxt)
        result.tableName = this.dealWithTableNameTxt(tableNameTxt);
        result.tableColumns = this.dealWithTableColumnsTxt(tableColumnsTxt);
        return result;
        
    }
    static dealWithTableColumnsTxt(tableColumnsTxts: string[]) {
        if(!tableColumnsTxts || tableColumnsTxts.length === 0)  return;
        // console.log(tableColumnsTxts)
        let result: TableColumn[] = []
        tableColumnsTxts.map((tableColumnsTxt: string) => {
            let column: TableColumn = null;
            const startQuoteIndex = tableColumnsTxt.indexOf("`");
            const endQuoteIndex = tableColumnsTxt.lastIndexOf("`");
            const leftRoundBracketIndex = tableColumnsTxt.indexOf("(");
            const columnName  = tableColumnsTxt.substring(startQuoteIndex + 1, endQuoteIndex).trim();
            const columnType = tableColumnsTxt.substring(endQuoteIndex + 1, leftRoundBracketIndex).trim();
            tableColumnsTxt = tableColumnsTxt.toUpperCase();
            // console.log(tableColumnsTxt, tableColumnsTxt.indexOf("NOT NULL") !== -1 , tableColumnsTxts.indexOf("NOT NULL") !== -1 ? "NO" : "YES");
            const isNull = tableColumnsTxt.indexOf("NOT NULL") !== -1 ? "NO" : "YES"
            // console.log(tableColumnsTxt, columnName, columnType);
            column = {Field: columnName, Type: columnType, Null: isNull, Key: null, Default: null, Extra: null }
            const existIndex = tableColumnsTxt.indexOf("PRIMARY KEY") !== -1 || tableColumnsTxt.indexOf("UNIQUE")!== -1 || tableColumnsTxt.indexOf("FOREIGN KEY") !== -1
            // console.log(existIndex)
            existIndex ? "" : result.push(column)
        })

        tableColumnsTxts.map(tableColumnsTxt => {
            
            const startQuoteIndex = tableColumnsTxt.indexOf("`");
            const endQuoteIndex = tableColumnsTxt.lastIndexOf("`");
            const columnName  = tableColumnsTxt.substring(startQuoteIndex + 1, endQuoteIndex).trim();
            let currentTableColumn: TableColumn;
            result.map(tableColumn => {tableColumn.Field === columnName ? currentTableColumn = tableColumn: ''});
            // console.log(tableColumnsTxt, result, currentTableColumn)
            tableColumnsTxt = tableColumnsTxt.toUpperCase();
            tableColumnsTxt.indexOf("PRIMARY KEY") !== -1 ?  currentTableColumn.Key = "PRI" : '';
            tableColumnsTxt.indexOf("UNIQUE") !== -1 ?  currentTableColumn.Key = "UNI" : '';
            tableColumnsTxt.indexOf("FOREIGN KEY") !== -1 ?  currentTableColumn.Key = "PRI" : '';
        })

        // console.log(result);
        return result;
        
    }
    static dealWithTableNameTxt(tableNameTxt: string) {
        if(!tableNameTxt) return;
        // console.log(tableNameTxt)
        let result: string = "";
        const startQuoteIndex = tableNameTxt.indexOf("`");
        const endQuoteIndex = tableNameTxt.lastIndexOf("`");
        const tableName  = tableNameTxt.substring(startQuoteIndex + 1, endQuoteIndex);
        result = tableName
        // console.log(result)
        return result;
    }
}
