
import { Inscription } from './src/Inscription.mjs'


const string = `aaaa.test                       `;
const inscription = new Inscription( string )

console.log( 'ENCODE' )
console.log( '  inscription        ', string )
console.log( '  Base58             ', inscription.getBase58( string ) )
console.log( '  NumericHash        ', inscription.getNumericHash( string ) )

console.log( 'DECODE' )
console.log( '  inscription        ', string )
console.log( '  Base58             ', inscription.decodeBase58( inscription.getBase58( string ) ) )
// console.log( '  NumericHash        ', inscription.decodeNumericHash( inscription.getNumericHash( string ) ) )


// https://garethtdavies.medium.com/prototyping-a-coda-blockchain-explorer-dbe5c12b4ae2

// E4YfGWVZK4c946WaUWKU1TVBHkjij17A5NK71qnkfgzDEoPfnHzME
// aaaa.test

const test = inscription.decodeBase58( 'E4YfGWVZK4c946WaUWKU1TVBHkjij17A5NK71qnkfgzDEoPfnHzME' ) 
console.log( 'decoded', test )
const test2 = inscription.encodeBase58( test )
console.log( 'encoded', test2 )


// https://github.com/MinaProtocol/mina/pull/7079#issuecomment-746868482