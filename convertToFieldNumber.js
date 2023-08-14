const md5 = require( 'md5' )

const inputString = '{"p":"mns","name":"meow.test"}'
const hash = md5( inputString )

const numericHash = parseInt( hash, 16 ) % 100000000 

console.log( numericHash ) 