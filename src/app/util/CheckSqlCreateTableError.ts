
export class CheckSqlCreateTableError{
    static dealWith(sqlCreateTxt: string){
        if(!sqlCreateTxt) return;
        let result = false;
        const {existTableName, existTableColumns} = this.checkSqlCreateTableTxt(sqlCreateTxt);
        result = existTableColumns && existTableColumns;
        return result;
    }
    static checkSqlCreateTableTxt(sqlCreateTxt: string) {
        if(!sqlCreateTxt) return;
        let result = {existTableName: false, existTableColumns: false}
        const rows = sqlCreateTxt.split("\n");
        rows.map((row, index) => {
            console.log(row, index, /^\s*$/.test(row))
            if(/^\s*$/.test(row)) rows.splice(index, 1);
        })
        rows.pop();
        const tableNameTxt = rows.shift();
        const tableColumnsTxt = rows;
        // console.log(tableColumnsTxt, tableNameTxt)
        result.existTableName = this.checkTableNameTxt(tableNameTxt);
        result.existTableColumns = this.checkTableColumnsTxt(tableColumnsTxt);
        return result;
    }
    static checkTableNameTxt(tableNameTxt: string): boolean {
        if(!tableNameTxt) return;
        let result = true;
        const startQuoteIndex = tableNameTxt.indexOf("`");
        const endQuoteIndex = tableNameTxt.lastIndexOf("`");
        result = startQuoteIndex !== -1 && endQuoteIndex !== -1 
        return result;
        
    }
    static checkTableColumnsTxt(tableColumnsTxts: string[]): boolean {
        if(!tableColumnsTxts || tableColumnsTxts.length === 0)  return;
        // console.log(tableColumnsTxts)
        let result: boolean = true;
        tableColumnsTxts.map(tableColumnsTxt => {
            const startQuoteIndex = tableColumnsTxt.indexOf("`");
            const endQuoteIndex = tableColumnsTxt.lastIndexOf("`");
            const leftRoundBracketIndex = tableColumnsTxt.indexOf("(");
            tableColumnsTxt = tableColumnsTxt.toUpperCase();
            const isNull = tableColumnsTxts.indexOf("NOT NULL")
            result = result && startQuoteIndex !== -1 && endQuoteIndex !== -1 && leftRoundBracketIndex !== -1
                && isNull !== -1;
            result = result || ((startQuoteIndex !== -1 && endQuoteIndex !== -1) &&(tableColumnsTxt.indexOf("FOREIGN KEY") !== -1 || tableColumnsTxt.indexOf("PRIMARY KEY") !== -1 || tableColumnsTxt.indexOf("UNIQUE") !== -1))
        })
        return result
    }
}