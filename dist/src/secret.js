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
exports.getCurrentAccount = exports.generateSecret = exports.readSecret = void 0;
const ethers_1 = require("ethers");
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
// FFFF 86ffd39d2f01e9a4d5e834dba979ac80b92d1d0b8b8e2faa3ed0498060c2dc00
// 6666 14075e10e53a752ed31bfd4bfa867402b308b791cba8c6ef22d72faab8adff34
// 0000 75831a3b69356c467e5023d07ac173103f6120c1d400de5e2dea3d421a7d315a
let currentAccount;
function readSecret() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const secret = yield fs_extra_1.default.readJson(path_1.default.resolve('.secret.json'));
            if ('privateKey' in secret && 'address' in secret) {
                console.log(chalk_1.default.greenBright('Secret loaded.'), chalk_1.default.gray(secret.address));
            }
            currentAccount = secret;
            return secret;
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                console.log(chalk_1.default.bgRed('ERROR'), chalk_1.default.red('You must be import web3 wallet first.'));
            }
            return yield generateSecret();
        }
    });
}
exports.readSecret = readSecret;
function generateSecret() {
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
            yield fs_extra_1.default.writeJson(path_1.default.resolve('.secret.json'), {
                address,
                privateKey: answers.privateKey,
            });
            console.log(chalk_1.default.greenBright('Secret file saved', path_1.default.resolve('.secret.json')));
            return yield readSecret();
        }
        catch (e) {
            if (e.code === 'INVALID_ARGUMENT') {
                console.log(chalk_1.default.bgRed('ERROR', chalk_1.default.red('Invalid PrivateKey.')));
            }
            return yield generateSecret();
        }
    });
}
exports.generateSecret = generateSecret;
function getCurrentAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentAccount) {
            return yield readSecret();
        }
        return currentAccount;
    });
}
exports.getCurrentAccount = getCurrentAccount;
