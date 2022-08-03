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
exports.fetchTokens = exports.fetchAccountState = exports.sendRequest = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const index_js_1 = require("../../conf/index.js");
function sendRequest(method, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, node_fetch_1.default)(`${index_js_1.L2_HOST}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method,
                params,
                id: 1,
            }),
        });
    });
}
exports.sendRequest = sendRequest;
function fetchAccountState(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield sendRequest('account_info', [address]);
        const state = yield response.json();
        return state;
    });
}
exports.fetchAccountState = fetchAccountState;
function fetchTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield sendRequest('tokens', []);
        const tokens = yield response.json();
        return Object.values(tokens.result).filter((v) => !['USD', 'AUTO', 'SYN'].includes(v.symbol));
    });
}
exports.fetchTokens = fetchTokens;
