
export class DataStructure {
  
  constructor(
  ) { }
  // 算法逻辑
  

  static arrayToObj(array: any[]){
    const obj = new Object();
    array.map(key => {obj[key]=null})
    return obj;
  }

  static objToArray(res: object): object[] {
    const arr = []
    for (const key in res) {
      if (res.hasOwnProperty(key)) {
        const element = res[key];
        arr.push(element);
      } 
    }
    return arr;
  }

  // 算法逻辑
  isObjectValueEqual = (a, b) => {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      return false;
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i]
      var propA = a[propName]
      var propB = b[propName]
      if ((typeof (propA) === 'object')) {
        if (this.isObjectValueEqual(propA, propB)) {
          // return true     这里不能return ,后面的对象还没判断
        } else {
          return false
        }
      } else if (propA !== propB) {
        return false
      } else { }
    }
    return true
  }

}
