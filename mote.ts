export class Mote <T>{
  static count: number = 0;
  name: string;
  currentValue: T;
  children: Mote<any>[];
  parents: Mote<any>[];
  fn: any;
  logEnabled: boolean;
  constructor(){
    this.name = `m${++Mote.count}`
    this.currentValue = undefined
    this.parents = []
    this.children = []
    this.logEnabled = true

  }
  addParent<R>(n: Mote<R>){
    this.parents.push(n)
  }
  addChild<R>(n: Mote<R>){
    this.children.push(n)
  }
  addFn(fn){
    this.fn = fn
  }
  setNewValue(val: T){
    this.currentValue = val
    this.log(val)
  }

  log(val){
    if(this.logEnabled){
      console.log(this.name, ': ', val )
    }
  }
  push(val: T){
    this.setNewValue(val)
    this.children.forEach(m => m.eval())
  }
  eval(){
    const args = this.parents.map(p => p.currentValue)
    this.fn.apply(this, args)
}
}

export function map<T,R>(mote1: Mote<T>, fn: (x: T) => R ): Mote<R> {
  const mote2 = new Mote<R>()
  mote2.addParent(mote1)
  mote1.addChild(mote2)
  const fun = function(v){
    const newVal = fn(v)
    this.push(newVal)
  }
  mote2.addFn(fun)
  return mote2
} 

export function filter<T>(mote1: Mote<T>, fn: (x: T) => boolean ): Mote<T> {
  const mote2 = new Mote<T>()
  mote2.addParent(mote1)
  mote1.addChild(mote2)
  const fun = function(v){
    const res = fn(v)
    if(res){
      this.push(v)
    }
  }
  mote2.addFn(fun)
  return mote2
} 




