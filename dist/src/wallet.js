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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeb3Wallet = exports.createLinkWallet = exports.createLinkProvider = exports.linkWallet = exports.linkProvider = exports.web3Wallet = void 0;
const ethers_1 = require("ethers");
const zklink_js_sdk_1 = require("zklink-js-sdk");
const index_1 = require("../conf/index");
const network_1 = require("./network");
const providers_1 = require("./providers");
const secret_1 = require("./secret");
function createLinkProvider() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.linkProvider = yield zklink_js_sdk_1.Provider.newHttpProvider(index_1.L2_HOST);
        return exports.linkProvider;
    });
}
exports.createLinkProvider = createLinkProvider;
function createLinkWallet(web3Signer) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.linkProvider = yield createLinkProvider();
        exports.linkWallet = yield zklink_js_sdk_1.Wallet.fromEthSigner(web3Signer, exports.linkProvider);
        return exports.linkWallet;
    });
}
exports.createLinkWallet = createLinkWallet;
function createWeb3Wallet(providerName) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentAccount = yield (0, secret_1.getCurrentAccount)();
        if (!providerName) {
            providerName = yield (0, network_1.getCurrentNetwork)();
        }
        const web3Provider = (0, providers_1.getProvider)(providerName);
        exports.web3Wallet = new ethers_1.ethers.Wallet(currentAccount.privateKey, web3Provider);
        return exports.web3Wallet;
    });
}
exports.createWeb3Wallet = createWeb3Wallet;
