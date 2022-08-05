# Introduction

This tool is used to help market maker users to `initialize zkex account` and `activate zk layer2 account`.

# Quick Overview (features)

- [x] Register zkex account
- [x] Active layer2 account
- [x] Get testnet token from faucet

# How to build
  * Update configure file and set layer2 endpoint to `L2_HOST` in `conf/index.ts`
    ```javascript
    export const L2_HOST = 'http://xxx.xxx.xxx.xxx:yyyy'
    ```
  * Update configure file and set zkex api endpoint to `ZKEX_API_URL` in `conf/index.ts`
    ```javascript
    export const ZKEX_API_URL = 'http://xxx.xxx.xxx.xxx:yyyy'
    ```
    
  * Install [nvm](https://github.com/nvm-sh/nvm)
  * Install node >= 14.16.0
    ```shell
    nvm install 14.16.0
    nvm use 14.16.0
    ```
  * Install yarn
    ```shell
    npm install -g yarn
    ```
  * Build
    ```shell
    yarn 
    ```

# Register and Active Interaction
  * run `yarn dev`

  
  * Enter your PrivateKey 
    ```shell
    ERROR You must be import web3 wallet first.
    Secret file saved D:\zkex-mm-tools\.secret.json
    Enter your PrivateKey
  
  
    !!! Input your privateKey and Press Enter.
    ```

  * Load account state
    ```shell
    Load account state ...
    Account id is null, deposit first.


    !!! This account is not actived on layer2, you should deposit tokens to your layer2 account and active it first.
    ```
   
  * Choose a network (Support "Polygon Mumbai Testnet" and "AVAX Testnet")
    ```shell
    Choose a network (Use arrow keys)
    > Polygon
      Avalanche
      < back

    !!! Avalanche is strongly recommended, Choose it. 
    ```
  
  * Check gas balance 
    ```shell
    Insufficient gas balances.
    Choose a network (Use arrow keys)
    > Polygon
      Avalanche
      < back

    !!! If gas balances is insufficient, transfer AVAX to this address until you can check your AVAX balance.
    ```
  
  * Choose a token
    ```shell
    Choose a token (Use arrow keys)
    > AVAX
      JOE
      USDC

    !!! Select JOE and press enter
    ```
  
  * Check token balance (if no balance, go to mint)
    ```shell
    Choose a token JOE
    Selected JOE 0x7f8e17f6f6ed8ca649abe28f7236f6b08b6a14e1
    Load token balances ...
    Insufficient balances. Send mint transactions now. Please wait ...
    Mint tx hash 0x54318818bf07e859907b04bf2e595140fc017e378ae2cdc6ce06dab99e80bdd8
    JOE balances 100000000000000000000000000
    ```
  
  * Enter a amount to deposit
    ```shell
    Enter a amount to deposit:

    !!! Press 1000000 and Enter

    Send transaction request ...
    Transaction sended, wait receipt ...
    Deposit success.
    ```
  
  * Activate (if L2 received token)
    ```shell
    Account is locked, activate now, wait ...
    ZKEX trading enabled. ZKEX Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhmNzBkMmRiZWRlM2U1MjFkMzE4YWFkOGQ1ZDkxYjczNWZhN2Q2MmQ4IiwiZXhwaXJlZEF0IjoxNjU5NjY4ODQzLCJpZCI6MzIsInB1YmtleSI6IjQ2NmNiMWEzNzFiYTE3YjZlYjJjNTUzYzdjYTZhMjBhMTgxNTk2ZjViODM1MDZiNWI5ZmQ3ODE4Y2IwYWY2OTMifQ.IfBkR0jI-FWOGweJTjHPRPZalTx9bGJ0wqGlz0-ojIc
    ```

# Check and Query Interaction
  
  * Run `yarn dev`
    ```shell
    Choose a action. (Current: 0xf70d2dBeDe3E521D318aad8D5d91B735Fa7d62d8) (Use arrow keys)
    > 1) Your Wallets
      2) Account Doctor
      3) Account Info
      4) Balances
      5) Deposit
    ```
  
  * Choose a wallet (Use arrow keys)
    ```shell
    Choose a wallet (Use arrow keys)
    > 0xf70d2dBeDe3E521D318aad8D5d91B735Fa7d62d8
      New Wallet
      < back

    !!! Choose another wallet or create a new wallet.
    ```
  
  * Account Doctor
    ```shell
    Load account state ...
    Account is deposited.
    Account is activated.
    ZKEX trading enabled. ZKEX Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHhmNzBkMmRiZWRlM2U1MjFkMzE4YWFkOGQ1ZDkxYjczNWZhN2Q2MmQ4IiwiZXhwaXJlZEF0IjoxNjU5NjY5NzMxLCJpZCI6MzIsInB1YmtleSI6IjQ2NmNiMWEzNzFiYTE3YjZlYjJjNTUzYzdjYTZhMjBhMTgxNTk2ZjViODM1MDZiNWI5ZmQ3ODE4Y2IwYWY2OTMifQ.kNO4hx4dqhtVLpQIjwRDp6Jk3GNU3eW228r-LukR6EM

    !!! Check account state in layer2, and query account login jwt-token in zkex
    ```
  
  * Account Info
    ```shell
    ┌───────────────┬─────────────────────────────────────────────────┐
    │    (index)    │                     Values                      │
    ├───────────────┼─────────────────────────────────────────────────┤
    │   AccountId   │                       12                        │
    │  PubKeyHash   │ 'sync:fbb9c3a1db37b5db5a6a57b4a59a5ace4c751919' │
    │ AccountStatus │                   'Activated'                   │
    └───────────────┴─────────────────────────────────────────────────┘

    !!! Check account state and query account id in layer2
    ```
  
  * Balances
    ```shell
    ┌───────────────┬──────────────────────────────┐
    │    (index)    │             JOE              │
    ├───────────────┼──────────────────────────────┤
    │ ZKEX Balances │ '10000000000000000000000000' │
    └───────────────┴──────────────────────────────┘

    !!! Query account token balances in layer2
    ```
  
  * Deposit
    ```shell
    !!! Choose network and token and then deposit.
    ```

