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
exports.changeWallet = exports.getCurrentAccount = exports.addSecret = exports.readSecret = exports.createSecret = void 0;
const ethers_1 = require("ethers");
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const _1 = require(".");
const account_1 = require("./account");
let currentAccount;
function createSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const initialSecret = {
                accounts: [],
            };
            yield fs_extra_1.default.writeJson(path_1.default.resolve('.secret.json'), initialSecret);
            console.log(chalk_1.default.greenBright('Secret file saved', path_1.default.resolve('.secret.json')));
            return initialSecret;
        }
        catch (e) {
            console.log(e);
            return yield createSecret();
        }
    });
}
exports.createSecret = createSecret;
function readSecret() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const secret = yield fs_extra_1.default.readJson(path_1.default.resolve('.secret.json'));
            if ('accounts' in secret) {
                if ((_a = secret === null || secret === void 0 ? void 0 : secret.accounts) === null || _a === void 0 ? void 0 : _a.length) {
                    return secret;
                }
            }
            return;
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                console.log(chalk_1.default.bgRed('ERROR'), chalk_1.default.red('You must be import web3 wallet first.'));
            }
            return;
        }
    });
}
exports.readSecret = readSecret;
function addSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const answers = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'privateKey',
                    message: 'Enter your PrivateKey',
                },
            ]);
            const wallet = new ethers_1.Wallet(answers.privateKey);
            const address = yield wallet.getAddress();
            const secret = yield readSecret();
            const account = {
                address,
                privateKey: answers.privateKey,
            };
            if (secret === null || secret === void 0 ? void 0 : secret.accounts) {
                if ((secret === null || secret === void 0 ? void 0 : secret.accounts.findIndex((v) => v.address === address)) >= 0) {
                    throw new Error('Duplicate wallet.');
                }
            }
            const accounts = (secret === null || secret === void 0 ? void 0 : secret.accounts) ? [...secret.accounts, account] : [account];
            yield fs_extra_1.default.writeJson(path_1.default.resolve('.secret.json'), {
                accounts,
            });
            console.log(chalk_1.default.greenBright('PrivateKey saved to .secret.json'));
            currentAccount = account;
            yield (0, account_1.checkAccountState)();
            return account;
        }
        catch (e) {
            if (e.code === 'INVALID_ARGUMENT') {
                console.log(chalk_1.default.bgRed('ERROR', chalk_1.default.red('Invalid PrivateKey.')));
            }
            console.log(e);
            return yield addSecret();
        }
    });
}
exports.addSecret = addSecret;
function getCurrentAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = yield readSecret();
        if (!secret) {
            yield createSecret();
            return yield addSecret();
        }
        if (!currentAccount) {
            return secret.accounts[0];
        }
        return currentAccount;
    });
}
exports.getCurrentAccount = getCurrentAccount;
function changeWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield getCurrentAccount();
            const secret = yield readSecret();
            const answers = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'overwrite',
                    message: `Choose a wallet`,
                    choices: [...secret.accounts.map((a) => a.address), 'New Wallet', _1.actionBack],
                },
            ]);
            if (answers.overwrite === 'New Wallet') {
                return yield addSecret();
            }
            currentAccount = secret.accounts.find((v) => v.address === answers.overwrite);
            return currentAccount;
        }
        catch (e) {
            return yield changeWallet();
        }
    });
}
exports.changeWallet = changeWallet;
