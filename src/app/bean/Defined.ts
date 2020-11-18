export interface FileDefined {
    fileName: string;
    fileData: string;
}

export interface PathDefined {
    path: string;
    files: string[];
    folders: PathDefined[];
}

/**
 * 命名规范 frontEndApi + backEndApi + backEndSqlApi
 */
export interface FullstackSolutionDefined {
    solutionId: string;
    backEndDevice: string;
    backEndLanguage: string;
    backEndApi: string;
    backEndSql: string;
    backEndSqlApi: string;
    frontEndDevice: string;
    frontEndLanguage: string;
    frontEndApi: string;
}

export interface ColumnDefined {
    field: string;
    type: string;
    Null: string;
    key: string;
    Default: string;
    extra: string;
}

export interface ResTableDefined {
    tableName: string;
    columns: ColumnDefined[];
    createTable: [];
}

export interface TableDefined {
    tableName: string;
    columns: ColumnDefined[];
    createTable: string;
}

export interface NavLinkDataDefined {
    linkName: string;
    linkRouter: string;
    linkIcon: string;
}

export interface FlowDefined {
    startTime: Date;
    endTime: Date;
    // 选取阶段
    selectStatus: boolean;
    // 授权阶段，审稿组组成阶段
    authStatus: boolean;
    // 分类阶段，审稿前准备阶段
    classStatus: boolean;
    // 审理阶段
    editStatus: boolean;
}