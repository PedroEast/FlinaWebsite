import { TableDefined } from "../bean/Defined";

export const exampleTableObj: TableDefined = {
    tableName: "table_name",
    columns: [
      {
        field: "id",
        type: "int",
        Null: "NO",
        key: "PRI",
        Default: null,
        extra: null
      },
      {
        field: "name",
        type: "varchar",
        Null: "NO",
        key: "PRI",
        Default: null,
        extra: null
      }
    ],
    createTable: `CREATE TABLE \`table_name\` (
      \`id\` int(11) NOT NULL,
      \`name\` varchar(255) DEFAULT NULL,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`
  }