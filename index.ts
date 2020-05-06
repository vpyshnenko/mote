import {Mote,  map, filter, reduce, merge, take, combine, interval, delay} from './mote'

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

const m7 = new Mote<number>()
const m8 = new Mote<number>()
const m9 = merge([m7, m8, m3])

m7.push(1)
m8.push(2)
m7.push(3)
m1.push(7)

const m10 = new Mote<number>()
const m11 = take(m10, 3)
m10.push(101);
m10.push(102);
m10.push(103);
m10.push(104);
m10.push(105);


const m12 = new Mote<number>()
m12.push(3)
const m13 = new Mote<number>()
m13.push(4)



const m14 = combine([m12, m13], (a, b) => a + b)
m12.push(4)
const m15 = interval(1000, 5)
const m16 = reduce(m15, (acc, v) => acc + v, 0)
const m17 = delay(m15, 900)

