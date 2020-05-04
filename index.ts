import {Mote,  map} from './mote'

const m1 = new Mote<number>()
const m2 = map<number, number>(m1, x => 2*x)
const m3 = map<number, number>(m2, x => x +1)
m1.push(10)
