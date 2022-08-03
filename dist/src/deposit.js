"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceOf = exports.mint = exports.deposit = exports.isMappingToken = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const inquirer_1 = __importDefault(require("inquirer"));
const zklink_js_sdk_1 = require("zklink-js-sdk");
const index_1 = require("./http/index");
const index_2 = require("./index");
const network_1 = require("./network");
const providers_1 = require("./providers");
const secret_1 = require("./secret");
const tokens_1 = require("./tokens");
const wallet_1 = require("./wallet");
function isMappingToken(tokenId) {
    return tokenId >= 17 && tokenId <= 31;
}
exports.isMappingToken = isMappingToken;
function deposit() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentAccount = yield (0, secret_1.getCurrentAccount)();
            const currentNetwork = yield (0, network_1.getCurrentNetwork)();
            const linkId = (0, providers_1.getNetworkLinkId)(currentNetwork);
            const web3Wallet = yield (0, wallet_1.createWeb3Wallet)(currentNetwork);
            console.log('🚀 Load Gas balances ...');
            const gasBalances = yield web3Wallet.getBalance();
            if (gasBalances.isZero()) {
                console.log(chalk_1.default.red(`Insufficient gas balances.`));
                (0, network_1.resetCurrentNetwork)();
                return yield deposit();
            }
            console.log(chalk_1.default.greenBright('🌹 Gas balances'), (0, utils_1.formatEther)(gasBalances));
            const token = yield (0, tokens_1.chooseToken)(currentNetwork);
            const tokenAddress = (0, tokens_1.getTokenAddressByLinkId)(token, linkId);
            console.log(chalk_1.default.greenBright('Selected'), token.symbol, tokenAddress);
            console.log('🚀 Load token balances ...');
            let balances = yield balanceOf(tokenAddress, web3Wallet);
            if (balances.isZero()) {
                console.log(chalk_1.default.yellow(`Insufficient balances. Send mint transactions now. Please wait ...`));
                balances = yield mint(tokenAddress, web3Wallet);
            }
            console.log(chalk_1.default.greenBright(`🌹 ${token.symbol} balances`), balances.toString());
            const answers = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'amount',
                    message: 'Enter a amount to deposit:',
                },
            ]);
            const linkWallet = yield (0, wallet_1.createLinkWallet)(web3Wallet);
            const linkProvider = yield (0, wallet_1.createLinkProvider)();
            const linkContract = zklink_js_sdk_1.LinkContract.fromEthSigner(linkProvider, web3Wallet);
            const approved = (0, tokens_1.isZeroAddress)(tokenAddress) || (0, tokens_1.isGasAddress)(tokenAddress)
                ? true
                : yield linkContract.isERC20DepositsApproved(tokenAddress, yield web3Wallet.getAddress(), linkId);
            console.log('🚀 Send transaction request ...');
            const tx = yield linkWallet.depositToSyncFromEthereum({
                subAccountId: 1,
                depositTo: yield web3Wallet.getAddress(),
                amount: (0, utils_1.parseEther)(answers.amount),
                token: tokenAddress,
                linkChainId: linkId,
                mapping: isMappingToken(token.id),
                approveDepositAmountForERC20: !approved,
            });
            console.log('🚀 Transaction sended, wait receipt ...');
            const receipt = yield tx.awaitReceipt(linkId);
            if (receipt === null || receipt === void 0 ? void 0 : receipt.executed) {
                if ((_a = receipt === null || receipt === void 0 ? void 0 : receipt.block) === null || _a === void 0 ? void 0 : _a.committed) {
                    console.log(chalk_1.default.greenBright('Deposit success.'));
                    // listener.dispatch('deposit')
                }
                else {
                    console.log(chalk_1.default.red('ERROR: Deposit fail.'));
                }
            }
            const state = yield (0, index_1.fetchAccountState)(currentAccount.address);
        }
        catch (e) {
            if (e.message === index_2.actionBack) {
                return yield deposit();
            }
        }
    });
}
exports.deposit = deposit;
function mint(tokenAddress, web3Wallet) {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = new ethers_1.Contract(tokenAddress, ['function mint(address, uint256)'], web3Wallet);
        const tx = yield contract.mint(yield web3Wallet.getAddress(), (0, utils_1.parseEther)('100000000'));
        console.log('Mint tx hash', tx.hash);
        const wait = yield web3Wallet.provider.waitForTransaction(tx.hash, 10);
        const balances = yield balanceOf(tokenAddress, web3Wallet);
        return balances;
    });
}
exports.mint = mint;
function balanceOf(tokenAddress, web3Wallet) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentAccount = yield (0, secret_1.getCurrentAccount)();
        const contract = new ethers_1.Contract(tokenAddress, ['function balanceOf(address) view returns (uint256)'], web3Wallet);
        const balances = yield contract.balanceOf(currentAccount.address);
        return balances;
    });
}
exports.balanceOf = balanceOf;
