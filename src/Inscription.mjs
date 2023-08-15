import bs58 from 'bs58'
import md5 from 'md5';


export class Inscription {
    #state


    constructor( string ) {
        this.#state = {
            'jsonString': string,
            'base58': null,
            'numericHash': null
        }

        this.#state['base58'] = this.encodeBase58( string )
        this.#state['numericHash'] = this.encodeNumericHash( string )

        return true
    }


    getBase58() {
        return this.#state['base58']
    }


    getNumericHash() {
        return this.#state['numericHash']
    }


    encodeBase58( string ) {
        const bytes = Buffer.from( string, 'utf-8' )
        const encodedString = bs58.encode( bytes )
        return encodedString
    }


    encodeBase582( inputString ) {
        const bytes = Buffer.from(inputString, 'utf-8');
        const encodedString = bs58.encode(bytes);
    
        // Pad the encoded string to ensure it's 32 bytes long
        const padding = '0'.repeat(32 - encodedString.length);
        const encoded32Bytes = padding + encodedString;
    
        return encoded32Bytes;
    }


    encodeNumericHash( string ) {
        const hash = md5( string )
        const numericHash = parseInt( hash, 16 ) % 100000000
        return numericHash
    }


    decodeBase58( encodedString ) {
        const decodedBuffer = bs58.decode( encodedString )
        const decodedString = decodedBuffer.toString( 'utf8' )

        const characterString = decodedString
            .split( ',' )
            .map( code => String.fromCharCode( code ) ).join( '' ) 

        return characterString
    }

/*
    decodeNumericHash( numericHash ) {
        const hexHash = numericHash.toString( 16 )
        const originalValue = md5( hexHash )

        return originalValue
    }
*/
}