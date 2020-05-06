export class Mote <T>{
  static count: number = 0;
  name: string;
  currentValue: T;
  children: Mote<any>[];
  parents: Mote<any>[];
  fn: any;
  enabled: boolean;
  logEnabled: boolean;
  constructor(){
    this.name = `m${++Mote.count}`
    this.currentValue = undefined
    this.parents = []
    this.children = []
    this.logEnabled = true
    this.enabled = true

  }
  enable(val: boolean){
    this.enabled = val
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
    if(this.enabled){
      this.setNewValue(val)
      this.children.forEach(m => m.eval(this))
    }
  }
  eval(source){
    if(this.enabled){
      const args = this.parents.map(p => p.currentValue)
      if(this.fn){
        this.fn.call(this, source)
      }
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

export function combine<T>(sources: Mote<any>[], fn): Mote<T>{
  const mote = new Mote<T>()
  sources.forEach(s => {
    mote.addParent(s)
    s.addChild(mote)
  })
  const fun = function(source){
    const newValue = fn.apply(this, this.parents.map(p => p.currentValue))
    this.push(newValue)
  }
  mote.addFn(fun)
  return mote
}

export function interval(period: number, n: number=Number.MAX_SAFE_INTEGER): Mote<number>{
  const mote = new Mote<number>()
  let i = 0
  let id
  const fun = () => {
    if(++i <= n){
      mote.push(i)
    } else {
      clearInterval(id)
    }
  }
  mote.addFn(fun)
  id = setInterval(fun, period)
  return mote
}

export function delay<T>(source: Mote<T>, time: number): Mote<T>{
  const mote = new Mote<T>()
  mote.addParent(source)
  source.addChild(mote)
  const fun = () => {
    const newValue = source.currentValue
    setTimeout(() => {
     mote.push(newValue)
    }, time)
  }
  mote.addFn(fun)
  return mote
}

export function throttleTime<T>(source: Mote<T>, time: number): Mote<T>{
  const mote = new Mote<T>()
  mote.addParent(source)
  source.addChild(mote)
  const fun = () => {
    if(mote.enabled){
      const newValue = source.currentValue
      mote.push(newValue)
      mote.enable(false)
      setTimeout(() => {
        mote.enable(true)
      }, time)

    }
  }
  mote.addFn(fun)
  return mote
}







