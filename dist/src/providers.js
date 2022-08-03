"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworkChainId = exports.getNetworkLinkId = exports.getProvider = exports.ProviderNames = exports.GoerliProvider = exports.RinkebyProvider = exports.AvalancheProvider = exports.PolygonProvider = void 0;
const providers_1 = require("@ethersproject/providers");
exports.PolygonProvider = new providers_1.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com', {
    name: 'Polygon Testnet',
    chainId: 80001,
});
exports.AvalancheProvider = new providers_1.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc', {
    name: 'Avalanche Testnet',
    chainId: 43113,
});
exports.RinkebyProvider = new providers_1.JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', {
    name: 'Rinkeby',
    chainId: 4,
});
exports.GoerliProvider = new providers_1.JsonRpcProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', {
    name: 'Goerli',
    chainId: 5,
});
var ProviderNames;
(function (ProviderNames) {
    ProviderNames["Polygon"] = "Polygon";
    ProviderNames["Avalanche"] = "Avalanche";
    ProviderNames["Rinkeby"] = "Rinkeby";
    ProviderNames["Goerly"] = "Goerly";
})(ProviderNames = exports.ProviderNames || (exports.ProviderNames = {}));
function getProvider(providerName) {
    switch (providerName) {
        case ProviderNames.Polygon:
            return exports.PolygonProvider;
        case ProviderNames.Avalanche:
            return exports.AvalancheProvider;
        case ProviderNames.Rinkeby:
            return exports.RinkebyProvider;
        case ProviderNames.Goerly:
            return exports.GoerliProvider;
    }
}
exports.getProvider = getProvider;
function getNetworkLinkId(providerName) {
    switch (providerName) {
        case ProviderNames.Polygon:
            return 1;
        case ProviderNames.Avalanche:
            return 2;
        case ProviderNames.Rinkeby:
            return 3;
        case ProviderNames.Goerly:
            return 4;
    }
}
exports.getNetworkLinkId = getNetworkLinkId;
function getNetworkChainId(providerName) {
    switch (providerName) {
        case ProviderNames.Polygon:
            return 80001;
        case ProviderNames.Avalanche:
            return 43113;
        case ProviderNames.Rinkeby:
            return 4;
        case ProviderNames.Goerly:
            return 5;
    }
}
exports.getNetworkChainId = getNetworkChainId;
