
export const testArray = (array) => {
    return array === null || array === undefined || array.length ===0;
}
export const testObj = (obj: object) => {
    return  obj === null || obj === undefined;
}
export const testStr = (str: string) => {
     return str === null || str === undefined || str.trim() === "";
}
export const testId = (id: number) => {
     return id == null || id == undefined;
}