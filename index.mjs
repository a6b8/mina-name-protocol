import { BatchUpdate } from "./src/BatchUpdate.mjs"
import { PrivateKey, PublicKey, Mina, Field } from 'snarkyjs'
import fs from 'fs'
import md5 from 'md5'


const test = {
    'sender': '{{alice}}',
    'payload': {
        'operation': 'update',
        'name': 'meow.test',
        'sources': [
            {
                'provider': 'ipfs',
                'id': 'ipfs://...',
                'source': 'ipfs://...2'
            }
        ],
        'roles': [
            {
                'provider': 'ord',
                'id': 'B62qkJ3BSoHtxd7ndHuETioVPEfG4VcNUA7p4x2Y1PfK3dPrgG2qyEa',
                'role': 'Contributor',
                'address': 'B62qkJ3BSoHtxd7ndHuETioVPEfG4VcNUA7p4x2Y1PfK3dPrgG2qyEb'
            }
        ]
    }
}


const batchupdate = new BatchUpdate()
const batch = batchupdate
    .init()
    .singleToBatchUpdate( { 'payload': test['payload'] } )

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


config['path'] = Object
    .entries( config['path'] )
    .reduce( ( acc, a, index ) => {
        const [ key, value ] = a
        const p = `.mina/${key}/${value['path']}`
        acc[ key ] = {
            'path': value['path'],
            'content': JSON.parse( fs.readFileSync( p, 'utf-8' ) )
        }
        return acc
    }, {} )


console.log( 'TRANSACTION' )

console.log( '  Set Network' )
const node = 'https://proxy.berkeley.minaexplorer.com/graphql' 
const Berkeley = Mina.BerkeleyQANet( node )
Mina.setActiveInstance( Berkeley )


console.log( '  Import' )
const { Main } = await import( './workdir/build/default.mjs' )
const destination = PrivateKey.fromBase58( 
    config['path']['contracts']['content']['data']['address']['private']
)

const deployer = PrivateKey.fromBase58(
    config['path']['deployers']['content']['data']['address']['private']
)

console.log( '  Compile' )
await Main.compile()

console.log( '  App Instance' )
const zkAppInstance = new Main( destination.toPublicKey() )

console.log( '  Payload')

const memo = `{"p":"mns","name":"abcd.test"}`
const hash = md5( memo )
const numericHash = parseInt( hash, 16 ) % 100000000

console.log( `    ${memo}` )
console.log( `    ${numericHash}` )

console.log( '  Transaction' )
const txn1 = await Mina.transaction(
    {
        'feePayerKey': deployer, 
        'fee': 100_000_000,
        'memo': memo//JSON.stringify( test['payload'] )
    },
    () => { zkAppInstance.mns( Field( numericHash ) ) }
)

console.log( '  Prove' )
await txn1.prove()
const result = await txn1
    .sign( [ deployer ] )
    .send()

console.log( 'result', result )


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
