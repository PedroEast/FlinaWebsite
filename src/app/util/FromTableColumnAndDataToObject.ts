import { ColumnDefined } from "../bean/Defined";

export class FromTableColumnAndDataToObject {
    
    static dealWith(columns: ColumnDefined[], datas: Object[]){
        if(columns.length === 0 || datas.length === 0) return;
        let result = []
        const columnsCount = columns.length;
        const datasCount = datas.length;
        if(columnsCount === 1) {
            // console.log(1)
            datas.map(data => {
                const obj = new Object();
                const FieldIndex = 0;
                const Field = columns[FieldIndex].field
                obj[Field] = data;
                result.push(obj)
            });
        }else{
            // console.log(2)
            datas.map((data, index) => {
                const obj = new Object();
                
                for (let index = 0; index < columns.length; index++) {
                    const FieldIndex = index;
                    const Field = columns[FieldIndex].field
                    obj[Field] = data[FieldIndex];
                }
                result.push(obj)
            });
        }
        // console.log(columns, datas, result);
        return result;
    }
}