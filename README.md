# Mina Name System (Experiment)

This repository serves as an experiment, and all included implementations will likely be revised at a later point. It serves as a playground to advance the idea of an Inscription-Based Name System for Mina.

## Table of Contents

- [Mina Name System (Experiment)](#mina-name-system-experiment)
  - [Table of Contents](#table-of-contents)
  - [Full](#full)
    - [Operations](#operations)
    - [Single Struct](#single-struct)
      - [Project](#project)
      - [Name](#name)
      - [Sources](#sources)
      - [sRoles](#sroles)
    - [Batch Update](#batch-update)
  - [Minimal](#minimal)
    - [Test Memo](#test-memo)
    - [Fetch Memo](#fetch-memo)

## Full

### Operations

Operations are the core of a command; they define how the command will be handled.

| NR | NAME    | STRUCT |
|:---|:--------|:-------|
| 1  | create  | single |
| 2  | update  | single |
| 3  | delete  | single |
| 4  | batch   | batch  |

### Single Struct

| NR | KEY     | REQUIRED | TYPE           | OPERATIONS          |
|:---|:--------|:---------|:---------------|:--------------------|
| A  | project | `true`   | `string`       |                     |
| B  | name    | `true`   | `string`       | create, delete      |
| C  | sources | `false`  | `array object` | create, update, delete |
| D  | roles   | `false`  | `array object` | create, update, delete |

**Example**

```json
{
    "project": "mns::0.01",
    "operation": "create",
    "name": "meow.test",
    "sources": [
        {
            "provider": "ipfs",
            "source": "ipfs://..."
        }
    ],
    "roles": [
        {
            "role": "Owner",
            "address": "B62..."
        }
    ]
}
```

#### Project

This key determines which parser is responsible for the command. The provided string includes the following components.

| NR | NAME        | REGEX       | DESCRIPTION                |
|:---|:------------|:------------|:---------------------------|
| 1  | project tag | `mns`       | A designated abbreviation for Mina Contract System |
| 2  | splitter    | `::`        | A splitter separates the project tag from the version number |
| 3  | version     | `\d+\.\d{2}`| The version number of the protocol for proper evaluation |

**Example:**

```json
{
    "project": "mns::0.01"
}
```

#### Name

The name cannot be updated; it can only be deleted after creation. This field defines the name of the entry.

| NR | KEY  | REQUIRED | REGEX      | ID |
|:---|:-----|:---------|:-----------|:---|     
| 1  | name | `true`   | `\w+\.test`| `X` |

#### Sources

This field can be used to link references to Smart Contracts. Additional fields can be considered, and validation dependencies based on the provider might also be taken into account.

| NR | KEY      | REQUIRED | REGEX         | ID |
|:---|:---------|:---------|:--------------|:---|   
| 1  | provider | `true`   | `ipfs\|ord`   |    |
| 2  | source   | `true`   | `[.\\d]+`     | `X` |

**Example:**

```json
{
    ...
    "sources": [
        {
            "provider": "ipfs",
            "source": "ipfs://..."
        }
        ...
    ]
}
```

> The key "sources" is optional, but if used, 1 and 2 must be passed as a JSON structure.

#### sRoles

Roles can be defined here, allowing for the distribution of data management.

| NR | KEY    | REQUIRED | REGEX               | ID |
|:---|:-------|:---------|:--------------------|:---|     
| 1  | role   | `true`   | `owner\|contributor`|    |
| 2  | address| `true`   | `^B62[a-km-zA-HJ-NP-Z1-9]{52}$`| `X` |

**Example**

```json
{
    ...
    "roles": [
        {
            "role": "Owner",
            "address": "B62..."
        }
    ]
}
```

> The key "roles" is optional, but if used, 1 and 2 must be passed as a JSON structure.

### Batch Update

Here, various operations can be mixed together, saving space while still allowing for efficient reading.

Example:

```json
{
    "project": "mns::0.01",
    "operation": "batch",
    "name": "meow.test",
    "batch": [
        {
            "operation": "create",
            "key": "sources",
            "provider": "ipfs",
            "source": "ipfs://123445556"
        },
        {
            "operation": "update",
            "key": "sources",
            "id": "ipfs://123445556",
            "provider": "ord",
            "source": "ord/123456789"
        },
        {
            "operation": "delete",
            "key": "sources",
            "id": "ipfs://123445556"
        },
        {
            "operation": "create",
            "key": "roles",
            "role": "owner",
            "address": "B62...abc"
        },
        {
            "operation": "update",
            "key": "roles",
            "id": "B62...abc",
            "role": "contributor",
            "address": "B62...xyz"
        },
        {
            "operation": "delete",
            "key": "roles",
            "id": "B62...abc"
        }
    ]
}
```

## Minimal

### Test Memo
Only 32 bytes are possible
> https://mothereff.in/byte-counter

Encoding with bs58:
> https://github.com/MinaProtocol/mina/pull/7079#issuecomment-746868482

Example
    - E4YfGWVZK4c946WaUWKU1TVBHkjij17A5NK71qnkfgzDEoPfnHzME  
    aaaa.test

First Name
> https://berkeley.minaexplorer.com/transaction/5JtugaKzy5ms55HpVhzBgpDxCAfeFmu2ju11ffWqJAUJpPhztAXJ

Contract
> https://berkeley.minaexplorer.com/wallet/B62qkvW2gDNdzwnUtM7Zx8dLA8TRNf9MeuycEs5bL46HVCjnZwNMWh5

User
> https://berkeley.minaexplorer.com/wallet/B62qkJ3BSoHtxd7ndHuETioVPEfG4VcNUA7p4x2Y1PfK3dPrgG2qyEa


### Fetch Memo

Get Address by Name


Known: Name
- NumericHash 24144640
- Memo: E4ZNHV411wMefbDqatmQPx8ZMZYg3cGHm5nCQ9kqy2mBBngMJ2BzX


```
query MyQuery {
  events(sortBy: BLOCKHEIGHT_DESC, query: {event_in: "24144640", zkAppCommandHash: {zkappCommand: {accountUpdates: {body: {publicKey: "B62qkvW2gDNdzwnUtM7Zx8dLA8TRNf9MeuycEs5bL46HVCjnZwNMWh5"}}, memo: "E4ZNHV411wMefbDqatmQPx8ZMZYg3cGHm5nCQ9kqy2mBBngMJ2BzX"}}}) {
    zkAppCommandHash {
      zkappCommand {
        accountUpdates {
          body {
            events
            publicKey
          }
        }
        memo
        feePayer {
          body {
            publicKey
          }
        }
      }
      blockHeight
      dateTime
    }
  }
}
```


Get Name by Address

Known: Address

```
query MyQuery {
  zkapps(sortBy: BLOCKHEIGHT_DESC, query: {zkappCommand: {feePayer: {body: {publicKey: "B62qkJ3BSoHtxd7ndHuETioVPEfG4VcNUA7p4x2Y1PfK3dPrgG2qyEa"}}, accountUpdates: {body: {publicKey: "B62qkvW2gDNdzwnUtM7Zx8dLA8TRNf9MeuycEs5bL46HVCjnZwNMWh5"}}}}) {
    zkappCommand {
      accountUpdates {
        body {
          events
          publicKey
        }
      }
      memo
    }
  }
}
```