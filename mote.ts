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
    this.children.forEach(m => m.eval(this))
  }
  eval(source){
    const args = this.parents.map(p => p.currentValue)
    if(this.fn){
      this.fn.call(this, source)
    }
  }
}

export function map<T,R>(source: Mote<T>, fn: (x: T) => R ): Mote<R> {
  const mote = new Mote<R>()
  mote.addParent(source)
  source.addChild(mote)
  const fun = function(){
    const newVal = fn(source.currentValue)
    this.push(newVal)
  }
  mote.addFn(fun)
  return mote
} 

export function filter<T>(source: Mote<T>, fn: (x: T) => boolean ): Mote<T> {
  const mote = new Mote<T>()
  mote.addParent(source)
  source.addChild(mote)
  const fun = function(){
    const newValue = source.currentValue
    const res = fn(newValue)
    if(res){
      this.push(newValue)
    }
  }
  mote.addFn(fun)
  return mote
}

export function reduce<T,R>(source: Mote<T>, fn: (acc: R, v:T) => R, initial: R): Mote<R> {
  const mote = new Mote<R>()
  mote.addParent(source)
  source.addChild(mote)
  const fun = function(){
    const acc = fn(this.currentValue, source.currentValue)
    this.push(acc)
  }
  mote.addFn(fun)
  mote.push(initial)
  return mote
}

export function merge<T>(sources: Mote<any>[]): Mote<T>{
  const mote = new Mote<T>()
  sources.forEach(s => {
    mote.addParent(s)
    s.addChild(mote)
  })
  const fun = function(source){
    this.push(source.currentValue)
  }
  mote.addFn(fun)
  return mote
}

export function take<T>(source: Mote<T>, n: number): Mote<T>{
  const mote = new Mote<T>()
  mote.addParent(source)
  source.addChild(mote)
  let i = 0
  const fun = function(){
    if(i++ < n) {
      this.push(source.currentValue)
    }
  }
  mote.addFn(fun)
  return mote
}





