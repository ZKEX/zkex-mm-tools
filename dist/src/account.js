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
exports.accountState = exports.balances = void 0;
const secret_1 = require("./secret");
const index_1 = require("./http/index");
const chalk_1 = __importDefault(require("chalk"));
const wallet_1 = require("./wallet");
const network_1 = require("./network");
const deposit_1 = require("./deposit");
const providers_1 = require("./providers");
function balances() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentAccount = yield (0, secret_1.getCurrentAccount)();
        const state = yield (0, index_1.fetchAccountState)(currentAccount.address);
        return state.result.committed.balances;
    });
}
exports.balances = balances;
function accountState() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentAccount = yield (0, secret_1.getCurrentAccount)();
        console.log('🚀 Load account state ...');
        const state = yield (0, index_1.fetchAccountState)(currentAccount.address);
        const web3Wallet = yield (0, wallet_1.createWeb3Wallet)(providers_1.ProviderNames.Polygon);
        const linkWallet = yield (0, wallet_1.createLinkWallet)(web3Wallet);
        if (state.result.id) {
            console.log(chalk_1.default.greenBright('Account is deposited.'));
        }
        else {
            console.log(chalk_1.default.red('Account id is null, deposit first.'));
            yield (0, deposit_1.deposit)();
        }
        if (yield linkWallet.isSigningKeySet()) {
            console.log(chalk_1.default.greenBright('Account is activated.'));
        }
        else {
            console.log(chalk_1.default.yellow('Account is locked, activate now, wait ...'));
            const currentNetwork = yield (0, network_1.getCurrentNetwork)();
            const linkId = (0, providers_1.getNetworkLinkId)(currentNetwork);
            const chainId = (0, providers_1.getNetworkChainId)(currentNetwork);
            const { mainContract } = yield linkWallet.provider.getContractAddress(linkId);
            const transaction = yield linkWallet.setSigningKey({
                linkChainId: linkId,
                verifyingContract: mainContract,
                chainId,
                ethAuthType: 'ECDSA',
                feeToken: '',
                fee: 0,
            });
            yield transaction.awaitReceipt();
            const isSigningKeySet = yield linkWallet.isSigningKeySet();
        }
    });
}
exports.accountState = accountState;
