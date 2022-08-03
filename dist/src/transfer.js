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
exports.transfer = void 0;
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("ethers/lib/utils");
const network_1 = require("./network");
const secret_1 = require("./secret");
const tokens_1 = require("./tokens");
const wallet_1 = require("./wallet");
function transfer() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentAccount = yield (0, secret_1.getCurrentAccount)();
        const currentNetwork = yield (0, network_1.getCurrentNetwork)();
        const web3Wallet = yield (0, wallet_1.createWeb3Wallet)(currentNetwork);
        console.log('🚀 Load Gas balances ...');
        const gasBalances = yield web3Wallet.getBalance();
        if (gasBalances.isZero()) {
            console.log(chalk_1.default.red(`Insufficient gas balances.`));
        }
        console.log(chalk_1.default.greenBright('🌹 Gas balances'), (0, utils_1.formatEther)(gasBalances));
        const token = yield (0, tokens_1.chooseToken)(currentNetwork);
        const linkWallet = yield (0, wallet_1.createLinkWallet)(web3Wallet);
    });
}
exports.transfer = transfer;
