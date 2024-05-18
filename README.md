## TODO

-- api
- returnPkforOrderId 

-- contract
- calculate_fee
- deploy mainnet

-- bot
- catchAll - split tasks - finalizeorder(spl + sol to owner) - deploy vps

-- ui
- stateModal: map orderStateData
- profile page: map orderData
- bumpModal serialize + create_order connect
- profile cancel_order connect

## Figma

https://www.figma.com/file/uPe3PT6KTe30fwZs9hSDEZ/Pumpers?type=design&node-id=56-94851&mode=design&t=qQSqptk1dlUISnsu-0

256744

--------

curl https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b -X POST -H "Content-Type: application/json" -d '
  {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTokenAccountsByOwner",
    "params": [
      "AN6L8aNtz783ob1fC2f3S5opqExNbJbiomSZ8KqNgABn",
      {
        "mint": "97f8gHv4EAta7EfynrmtEx1Cr5i3V6d4pwD4kpan5Hv1"
      },
      {
        "encoding": "jsonParsed"
      }
    ]
  }
'

- res -

{"jsonrpc":"2.0","result":{"context":{"apiVersion":"1.17.22","slot":266434444},"value":[{"account":{"data":{"parsed":{"info":{"isNative":false,"mint":"97f8gHv4EAta7EfynrmtEx1Cr5i3V6d4pwD4kpan5Hv1","owner":"AN6L8aNtz783ob1fC2f3S5opqExNbJbiomSZ8KqNgABn","state":"initialized","tokenAmount":{"amount":"33139860832723","decimals":6,"uiAmount":33139860.832723,"uiAmountString":"33139860.832723"}},"type":"account"},"program":"spl-token","space":165},"executable":false,"lamports":2039280,"owner":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","rentEpoch":18446744073709551615,"space":165},"pubkey":"C6VBE1CYDUoohkCfMhHCh7RQPBPyBe4fmJMSo5SPvEFv"}]},"id":1}
➜  ~