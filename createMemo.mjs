
import { PrivateKey, PublicKey, Mina, Field } from 'snarkyjs'
import fs from 'fs'
import { Inscription } from './src/Inscription.mjs'


function addPath( { path } ) {
    const result = Object
        .entries( path )
        .reduce( ( acc, a, index ) => {
            const [ key, value ] = a
            const p = `.mina/${key}/${value['path']}`
            acc[ key ] = {
                'path': value['path'],
                'content': JSON.parse( fs.readFileSync( p, 'utf-8' ) )
            }
            return acc
        }, {} )
    return result
}


function addState( { config } ) {
    const state = {
        'accounts': {}
    }
    state['accounts'] = [
        [ 'destination', 'contracts' ],
        [ 'deployer', 'deployers' ]
    ]
        .reduce( ( acc, a, index ) => {
            const [ newKey, oldKey ] = a
            acc[ newKey ] = PrivateKey.fromBase58( 
                config['path'][ oldKey ]['content']['data']['address']['private']
            )

            return acc
        }, {} )

    return state
}


const config = {
    'path': {
        'contracts': {
            'path': 'default--1691966956.json',
            'content': null
        },
        'deployers': {
            'path': 'default--1691962167.json',
            'content': null
        }
    }
}


console.log( 'CREATE MEMO' )
console.log( '  Add Path' )
config['path'] = addPath( { 'path': config['path'] } )
const state = addState( { config } )

console.log( '  Set Network' )
const node = 'https://proxy.berkeley.minaexplorer.com/graphql' 
const Berkeley = Mina.BerkeleyQANet( node )
Mina.setActiveInstance( Berkeley )

console.log( '  Payload')

const memo = 'aaaa.test' //`{"p":"mns","name":"aaaa.test"}`
const inscription = new Inscription( memo )

console.log( `    ${memo}` )
console.log( `    ${inscription.getNumericHash()}` )
console.log( `    ${inscription.getBase58()}` )

console.log( '  Import' )
const { Main } = await import( './workdir/build/default.mjs' )

console.log( '  Compile' )
await Main.compile()

console.log( '  App Instance' )
const zkAppInstance = new Main( state['accounts']['destination'].toPublicKey() )

console.log( '  Transaction' )

const n = inscription.getNumericHash()
const txn1 = await Mina.transaction(
    {
        'feePayerKey': state['accounts']['deployer'], 
        'fee': 100_000_000,
        'memo': memo //JSON.stringify( test['payload'] )
    },
    () => { zkAppInstance.mns( Field( inscription.getNumericHash( n ) ) ) }
)

console.log( '  Prove' )
await txn1.prove()
const result = await txn1
    .sign( [ state['accounts']['deployer'] ] )
    .send()


console.log( '  Hash' )
console.log( '    ', result.hash() )

console.log( '  Waiting...' )
await result.wait()




/*
const deployTxn = await this.#snarkyjs.Mina.transaction(
    {
        'feePayerKey': struct['deployer']['encodedPrivate'], 
        'fee': struct['transaction']['fee']
    },
    () => {
        this.#snarkyjs.AccountUpdate
            .fundNewAccount( struct['deployer']['encodedPrivate'] )

        zkApp.deploy( {
            'zkappKey': struct['destination']['encodedPrivate'], 
            'verificationKey': this.#contract['verificationKey'],
            'zkAppUri': 'hello-world'
        } )

        zkApp.init( 
            struct['destination']['encodedPrivate'] 
        )
    }
)

const response =  await deployTxn
    .sign( [ 
        struct['deployer']['encodedPrivate'],
        struct['destination']['encodedPrivate']
    ] )
    .send()

console.log( Main )
*/

/*
const zkApp = new this.#contract['class']( 
    struct['destination']['encodedPrivate'].toPublicKey()
)

const deployTxn = await this.#snarkyjs.Mina.transaction(
    {
        'feePayerKey': struct['deployer']['encodedPrivate'], 
        'fee': struct['transaction']['fee']
    },
    () => {
        this.#snarkyjs.AccountUpdate
            .fundNewAccount( struct['deployer']['encodedPrivate'] )

        zkApp.deploy( {
            'zkappKey': struct['destination']['encodedPrivate'], 
            'verificationKey': this.#contract['verificationKey'],
            'zkAppUri': 'hello-world'
        } )

        zkApp.init( 
            struct['destination']['encodedPrivate'] 
        )
    }
)

const response =  await deployTxn
    .sign( [ 
        struct['deployer']['encodedPrivate'],
        struct['destination']['encodedPrivate']
    ] )
    .send()


*/
