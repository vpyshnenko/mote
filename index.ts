import {Mote,  map, filter, reduce} from './mote'

const m1 = new Mote<number>()
const m2 = map<number, number>(m1, x => 2*x)
const m3 = map<number, number>(m2, x => x +1)
const isEven =  x => x % 2 === 0
const isOdd = x => x % 2 === 1
const m4 = filter<number>(m3, isEven)
const m5 = filter<number>(m3, isOdd)
const m6 = reduce(m1, (acc, v) => acc + v, 0)

m1.push(5)
m1.push(6)
