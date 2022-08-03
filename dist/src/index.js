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
exports.actionBack = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const account_1 = require("./account");
const deposit_1 = require("./deposit");
exports.actionBack = '< back';
function actions() {
    return __awaiter(this, void 0, void 0, function* () {
        const answers = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'action',
                message: `Choose a action`,
                choices: ['balances', 'deposit'],
            },
        ]);
        const { action } = answers;
        if (action === 'balances') {
            console.table(yield (0, account_1.balances)());
        }
        else if (action === 'deposit') {
            yield (0, deposit_1.deposit)();
        }
        // else if (action === 'tranfer') {
        //   await transfer()
        // }
        return yield actions();
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, account_1.accountState)();
        yield actions();
    });
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
