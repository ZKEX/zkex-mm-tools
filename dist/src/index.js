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
exports.Actions = exports.actionBack = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const account_1 = require("./account");
const deposit_1 = require("./deposit");
const secret_1 = require("./secret");
exports.actionBack = '< back';
var Actions;
(function (Actions) {
    Actions["ChangeWallet"] = "1) Your Wallets";
    Actions["AccountDoctor"] = "2) Account Doctor";
    Actions["AccountInfo"] = "3) Account Info";
    Actions["Balances"] = "4) Balances";
    Actions["Deposit"] = "5) Deposit";
})(Actions = exports.Actions || (exports.Actions = {}));
function actions() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentAccount = yield (0, secret_1.getCurrentAccount)();
        const answers = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'action',
                message: `Choose a action. (Current: ${currentAccount === null || currentAccount === void 0 ? void 0 : currentAccount.address})`,
                choices: [...Object.values(Actions)],
            },
        ]);
        const { action } = answers;
        if (action === Actions.AccountInfo) {
            const state = yield (0, account_1.accountState)();
            console.table({
                AccountId: state.id,
                PubKeyHash: state.committed.pubKeyHash,
                AccountStatus: state.committed.pubKeyHash === 'sync:0000000000000000000000000000000000000000'
                    ? 'Locked'
                    : 'Activated',
            });
        }
        else if (action === Actions.Balances) {
            console.table(yield (0, account_1.balances)());
        }
        else if (action === Actions.Deposit) {
            yield (0, deposit_1.deposit)();
        }
        else if (action === Actions.ChangeWallet) {
            yield (0, secret_1.changeWallet)();
        }
        else if (action === Actions.AccountDoctor) {
            yield (0, account_1.checkAccountState)();
        }
        return yield actions();
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield actions();
    });
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
