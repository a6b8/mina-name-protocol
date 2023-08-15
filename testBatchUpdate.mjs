import { BatchUpdate } from './src/BatchUpdate.mjs'

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