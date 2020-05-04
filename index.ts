import {Mote,  map, filter} from './mote'

const m1 = new Mote<number>()
const m2 = map<number, number>(m1, x => 2*x)
const m3 = map<number, number>(m2, x => x +1)
const isEven =  x => x % 2 === 0
const isOdd = x => x % 2 === 1
const m4 = filter<number>(m3, isEven)
const m5 = filter<number>(m3, isOdd)
m1.push(10)
