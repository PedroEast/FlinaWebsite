import { HttpHeaders } from '@angular/common/http';

export let zuul_gateway = "http://dongqinglin.cn"
export let coder_api = "http://dongqinglin.cn/api/coder/pedro-coder"
export let admin_api = "http://dongqinglin.cn/api/admin/yufan-admin"
export let user_api = "http://dongqinglin.cn/api/user/yufan-user"
// export const jwt = window.localStorage.getItem("jwt")
export const getLatestJsonHttpOptions = () =>{
    let jsonHttpOptions = new Object();
    let jwt = getJwt();
    if(testJwt(jwt)){
        jsonHttpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': jwt})
        };
    }else {
        jsonHttpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json'})
        };
    }
    return jsonHttpOptions;
}

export const getLatestUploadFileHttpOptions = () =>{
    let uploadFileOptions = new Object();
    let jwt = getJwt();
    if(testJwt(jwt)){
        uploadFileOptions = {headers: new HttpHeaders({'Authorization': jwt})};
    }else {
        uploadFileOptions =  {headers: new HttpHeaders()};
    }
    
    return uploadFileOptions;
}

export const getLatestDownloadFileHttpOptions = () =>{
    let downloadFileOptions = new Object();
    let jwt = getJwt();
    if(testJwt(jwt)){
        downloadFileOptions = {
            headers: new HttpHeaders({'Authorization': jwt}), observe: 'response', responseType: 'blob'
        };
    }else {
        downloadFileOptions = {headers: new HttpHeaders(), observe: 'response', responseType: 'blob'};
    }
    return downloadFileOptions;
}

const testJwt = (jwt: string) => {
    if(jwt != null && jwt.trim() != ""){
        return true;
    }else {
        return false;
    }
}

const getJwt = () => {
    let jwt = window.localStorage.getItem("jwt");
    console.log(jwt);
    return jwt;
}

