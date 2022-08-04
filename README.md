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

# Run and Interaction (TODO)
  ```shell
  yarn start
  ```

  1. Enter a PrivateKey
  2. Check account state
  3. Choose a network (Support "Polygon Mumbai Testnet" and "AVAX Testnet")
  4. Check gas balance (if no gas balance, stop process)
  5. Choose a token
  6. Check token balance (if no balance, go to mint)
  7. Enter a amount to deposit
  8. Activate (if L2 received token)
