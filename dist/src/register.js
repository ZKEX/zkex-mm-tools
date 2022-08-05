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
exports.register = void 0;
const ethers_1 = require("ethers");
const wallet_1 = require("./wallet");
const node_fetch_1 = __importDefault(require("node-fetch"));
const conf_1 = require("../conf");
const providers_1 = require("./providers");
const chalk_1 = __importDefault(require("chalk"));
function register() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const web3Wallet = yield (0, wallet_1.createWeb3Wallet)(providers_1.ProviderNames.Avalanche);
            const linkWallet = yield (0, wallet_1.createLinkWallet)(web3Wallet);
            const pubkey = yield ((_a = linkWallet.signer) === null || _a === void 0 ? void 0 : _a.pubKey());
            const address = yield web3Wallet.getAddress();
            const message = 'Sign this message to confirm you are the owner of this wallet.\nNOTE: Please check this website ends with "app.zkex.com".';
            const messageBytes = ethers_1.utils.toUtf8Bytes(message);
            const signature = yield web3Wallet.signMessage(message);
            if (pubkey) {
                const res = yield (0, node_fetch_1.default)(`${conf_1.ZKEX_API_URL}/users`, {
                    method: 'POST',
                    body: JSON.stringify({
                        pubkey: pubkey.replace(/^0x/, ''),
                        address,
                        message,
                        signature,
                    }),
                });
                console.log(chalk_1.default.greenBright('ZKEX trading enabled.'), 'ZKEX Token:', chalk_1.default.gray(res.headers.get('Access-Token')));
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.register = register;
