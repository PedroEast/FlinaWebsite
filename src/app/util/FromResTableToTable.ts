import { ColumnDefined, ResTableDefined, TableDefined } from '../bean/Defined';
export class FromResTableToTable{
    constructor(){}
    
    static dealWith(resTables: ResTableDefined[]){
        // console.log(resTables)
        let result: TableDefined[] = [];
        resTables.map(restable=> {
          // console.log(table.columns)
          let table: TableDefined;
        //   const newColumns: ColumnDefined[] = [];
        //   restable.columns.map(column => {
        //     const newColumnDefined: ColumnDefined = {
        //       Field: column[0],
        //       Type: column[1],
        //       Null: column[2],
        //       Key: column[3],
        //       Default: column[4],
        //       Extra: column[5]
        //     }
        //     newColumns.push(newColumnDefined);
        //   });
        //   console.log(restable)
          const tableNameIndex = 0;
          const createTableIndex = 1;
          // console.log(restable.createTable)
          // console.log(restable.createTable.pop())
          table = {
              tableName: restable.tableName,
              columns: restable.columns,
              createTable: restable.createTable.pop()[createTableIndex]
          }
          result.push(table);
        })
        return result;
    }
}