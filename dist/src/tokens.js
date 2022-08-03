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
exports.getTokenAddressByLinkId = exports.chooseToken = exports.isGasAddress = exports.isZeroAddress = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const index_1 = require("./http/index");
const network_1 = require("./network");
const providers_1 = require("./providers");
function isZeroAddress(tokenAddress) {
    if (!tokenAddress) {
        return false;
    }
    return '0x0000000000000000000000000000000000000000' === tokenAddress;
}
exports.isZeroAddress = isZeroAddress;
function isGasAddress(tokenAddress) {
    if (!tokenAddress) {
        return false;
    }
    return '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() === tokenAddress.toLowerCase();
}
exports.isGasAddress = isGasAddress;
function chooseToken(providerName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!providerName) {
            providerName = yield (0, network_1.getCurrentNetwork)();
        }
        const tokens = yield (0, index_1.fetchTokens)();
        const currentLinkId = (0, providers_1.getNetworkLinkId)(providerName);
        const usableTokens = tokens.filter((v) => v.chains.includes(currentLinkId));
        const answers = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'token',
                message: `Choose a token`,
                choices: [...usableTokens.map((v) => v.symbol)],
            },
        ]);
        return usableTokens.find((v) => v.symbol === answers.token);
    });
}
exports.chooseToken = chooseToken;
function getTokenAddressByLinkId(token, linkId) {
    const index = token.chains.findIndex((v) => v === linkId);
    if (index >= 0) {
        return token.address[index];
    }
}
exports.getTokenAddressByLinkId = getTokenAddressByLinkId;
