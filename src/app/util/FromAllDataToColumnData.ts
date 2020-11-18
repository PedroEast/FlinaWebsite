import { ColumnDefined } from "../bean/sqlSystem";
export class FromAllDataToColumnData {
    constructor(){}
    static dealWith(datas:Object[],columns: ColumnDefined[]){
        // console.log(datas, columns);
        let result: Object[] = [];
        const fileds: string[] = [];
        columns.map(column => fileds.push(column.Field))
        datas.map(data => {
            // console.log(data)
            const obj = new Object();
            if(fileds.length === 1){
                obj[fileds[0]] = data;
            }else{
                fileds.map((filed, index) => {
                    obj[filed] = data[index];
                })
            }
            result.push(obj);
        })

        return result;
    }
}