const base58 = require( 'bs58' )

const encodedString = "E4ZNHV411wMefbDqatmQPx8ZMZYg3cGHtJSnoFphUWWjEYoZynA75"
const decodedBuffer = base58.decode( encodedString )
const decodedString = decodedBuffer.toString( 'utf8' )

const characterString = decodedString
    .split( ',' )
    .map( code => String.fromCharCode( code ) ).join( '' ) 


console.log( characterString )