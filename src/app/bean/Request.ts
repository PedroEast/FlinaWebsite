export interface FullStackAutoRequest {
    createTableStr: string;
    daoApi: string;
    backendApi: string;
    frontendApi: string;
}
export interface UpdateWorksIdListRequest {
    ids: number[];
    waitSetAttr: string;
    setStatus: boolean;
}