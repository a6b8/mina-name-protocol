import fs from 'fs'


export class BatchUpdate {
    #config
    #tests
    #state


    constructor() {
        this.#config = {
            'mns': {
                'name': 'mns',
                'splitter': '::',
                'version': '0.01',
                'receiver': '{{sender}}',
            },

            'operations': {
                'single': [ 'create', 'update', 'delete' ],
                'batch': [ 'batch' ]
            },
            'main': {
                //'required': true,
                'operations': [ 'create', 'delete' ],
                'type': 'single',
                'identifier': 'name',
                'validations': [
                    {
                        //'required': true,
                        'key': 'name',
                        'value': 'regex__domainName'
                    }
                ]
            },
            'additionals': {
                'sources': {
                    //'required': false,
                    'operations': [ 'create', 'update', 'delete' ],
                    'type': 'array',
                    'identifier': 'source',
                    'validations': [
                        {
                            //'required': true,
                            'key': 'provider',
                            'value': 'regex__sourceProvider'
                        },
                        {
                            //'required': true,
                            'key': 'id',
                            'value': 'regex__sourceURL'
                        },
                        {
                            //'required': true,
                            'key': 'source',
                            'value': 'regex__sourceURL'
                        }
                    ]
                },
                'roles': {
                    //'required': false,
                    'operations': [ 'create', 'update', 'delete' ],
                    'type': 'array',
                    'identifier': 'owner',
                    'validations': [
                        {
                            //'required': true,
                            'key': 'role',
                            'value': 'regex__role'
                        },
                        {
                            //'required': true,
                            'key': 'id',
                            'value': 'regex__minaAddress'
                        },
                        {
                            //'required': true,
                            'key': 'address',
                            'value': 'regex__minaAddress'
                        }
                    ]
                }
            },
            'regex': {
                'domainName': "\w+\.test",
                'minaAddress': "^B62[a-km-zA-HJ-NP-Z1-9]{52}$",
                'sourceType': "SmartContract|Memo",
                'sourceProvider': "ipfs|ord",
                'sourceURL': "[.\\d]+",
                'role': "Owner|Contributor"
            }
        }

        return true
    }


    init() {
        this.#state = {
            'accounts': {}
        }
        return this
    }


    singleToBatchUpdate( { payload } ) {
        const commands = this.#commandToBatchCommands( { payload } )
        const name = payload['name']
        const batch = this.#getBatchCommand( { commands, name } )
        return batch
    }


    #getBatchCommand( { commands, name } ) {
        const struct = {
            'project': 'mns::0.01',
            'operation': 'batch',
            'name': name,
            'batch': commands
        }
        return struct
    }
 

    #commandToBatchCommands( { payload } ) {
        if( !Object.hasOwn( payload, 'operation' ) ) {
            console.log( `Payload has not key 'operation'.` )
            process.exit( 1 )
        }

        if( !this.#config['operations']['single'].includes( payload['operation'] ) ) {
            console.log( `Payload uses a wrong 'operation' key (${payload['operation']}).` )
            process.exit( 1 )
        }

        let messages = {}
        const commands = [
         //   [ 'name', this.#config['main'], [ payload ] ],
            [ 'sources', this.#config['additionals']['sources'], payload['sources'] ],
            [ 'roles', this.#config['additionals']['roles'], payload['roles'] ]
        ]
            .reduce( ( acc, a, index ) => {
                const [ key, validation, groups ] = a

                if( groups !== undefined ) {
                    messages = groups
                        .reduce( ( aaa, group, pindex ) => {
                            const [ valid, messages ] = this.#validateKey( {
                                'validation': validation,
                                'object': group
                            } )
                            
                            !Object.hasOwn( aaa, key ) ? aaa[ key ] = [] : ''
                            aaa[ key ].push( messages )
                            aaa[ key ] = aaa[ key ].flat( 1 )
                            
                            if( valid ) {
                                const struct = {
                                    'key': key,
                                    'operation': payload['operation']
                                }

                                const cmd = validation['validations']
                                    .reduce( ( abb, b, rindex ) => {
                                        abb[ b['key'] ] = group[ b['key'] ]
                                        return abb
                                    }, struct )

                                acc.push( cmd )
                            }

                            return aaa
                        }, {} )
                } else {
                    // console.log( 'not found')
                }

                return acc
            }, [] )

        Object
            .entries( messages )
            .forEach( ( a, index ) => {
                const [ key, values ] = a

                values
                    .forEach( ( value, rindex ) => {
                        index === 0 ? console.log( `  ${key}` ) : ''
                        console.log( `  - ${value}` )
                    } ) 
            } )

        return commands
    }


    #validateKey( { validation, object } ) {
        let messages = []

        const result = validation['validations']
            .map( a => {
                const { required, key, value } = a 
                const checks = {
                    'key': false,
                    'value': false,
                    'overall': false
                }

                if( Object.hasOwn( object, key ) ) {
                    checks['key'] = true 
                } else {
                    const msg = `Key: ${key} not found.`
                    messages.push( msg )
                }

                if( checks['key'] ) {
                    const regex = this.#keyPathToValue( { 
                        'data': this.#config, 
                        'keyPath': value
                    } )

                    if( object[ key ].match( regex ) !== null ) {
                        checks['value'] = true
                    } else {
                        const msg2 = `Value ${key}, ${object[ key ]} is not valid (${regex}).`
                        messages.push( msg2 )
                    }
                }

                if( checks['key'] && checks['value'] ) {
                    checks['overall'] = true
                } else {
                    checks['overall'] = false
                }

                return checks
            } )

        return [ result, messages ]
    }


    #keyPathToValue( { data, keyPath, separator='__' } ) {
        if( typeof keyPath !== 'string' ) {
            return undefined
        }
    
        const result = keyPath
            .split( separator )
            .reduce( ( acc, key, index ) => {
                if( !acc ) return undefined
                if( !acc.hasOwnProperty( key ) ) return undefined
                acc = acc[ key ]
                return acc
            }, data )
    
        return result
    }
}



