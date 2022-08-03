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
exports.resetCurrentNetwork = exports.getCurrentNetwork = exports.chooseNetwork = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const index_1 = require("./index");
const providers_1 = require("./providers");
let currentNetwork;
function chooseNetwork() {
    return __awaiter(this, void 0, void 0, function* () {
        const answers = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'network',
                message: `Choose a network`,
                choices: [
                    ...Object.values(providers_1.ProviderNames).filter((n) => [providers_1.ProviderNames.Polygon, providers_1.ProviderNames.Avalanche].includes(n)),
                    index_1.actionBack,
                ],
            },
        ]);
        if (answers.network === index_1.actionBack) {
            return Promise.reject(new Error(index_1.actionBack));
        }
        currentNetwork = answers.network;
        return currentNetwork;
    });
}
exports.chooseNetwork = chooseNetwork;
function getCurrentNetwork() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!currentNetwork) {
            return yield chooseNetwork();
        }
        return currentNetwork;
    });
}
exports.getCurrentNetwork = getCurrentNetwork;
function resetCurrentNetwork() {
    return __awaiter(this, void 0, void 0, function* () {
        currentNetwork = undefined;
    });
}
exports.resetCurrentNetwork = resetCurrentNetwork;
