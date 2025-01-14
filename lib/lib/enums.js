export var WordCount;
(function (WordCount) {
    WordCount[WordCount["WORDS12"] = 12] = "WORDS12";
    WordCount[WordCount["WORDS15"] = 15] = "WORDS15";
    WordCount[WordCount["WORDS18"] = 18] = "WORDS18";
    WordCount[WordCount["WORDS21"] = 21] = "WORDS21";
    WordCount[WordCount["WORDS24"] = 24] = "WORDS24";
})(WordCount || (WordCount = {}));
export var Network;
(function (Network) {
    Network["Testnet"] = "testnet";
    Network["Regtest"] = "regtest";
    Network["Bitcoin"] = "bitcoin";
    Network["Signet"] = "signet";
})(Network || (Network = {}));
export var EntropyLength;
(function (EntropyLength) {
    EntropyLength[EntropyLength["Length16"] = 16] = "Length16";
    EntropyLength[EntropyLength["Length24"] = 24] = "Length24";
    EntropyLength[EntropyLength["Length32"] = 32] = "Length32";
})(EntropyLength || (EntropyLength = {}));
export var BlockChainNames;
(function (BlockChainNames) {
    BlockChainNames["Electrum"] = "Electrum";
    BlockChainNames["Esplora"] = "Esplora";
    BlockChainNames["Rpc"] = "Rpc";
})(BlockChainNames || (BlockChainNames = {}));
export var AddressIndex;
(function (AddressIndex) {
    AddressIndex["New"] = "new";
    AddressIndex["LastUnused"] = "lastUnused";
})(AddressIndex || (AddressIndex = {}));
export var KeychainKind;
(function (KeychainKind) {
    KeychainKind["External"] = "external";
    KeychainKind["Internal"] = "internal";
})(KeychainKind || (KeychainKind = {}));
export var AddressError;
(function (AddressError) {
    AddressError["Base58"] = "Base58";
    AddressError["Bech32"] = "Bech32";
    AddressError["WitnessVersion"] = "WitnessVersion";
    AddressError["WitnessProgram"] = "WitnessProgram";
    AddressError["UncompressedPubkey"] = "UncompressedPubkey";
    AddressError["ExcessiveScriptSize"] = "ExcessiveScriptSize";
    AddressError["UnrecognizedScript"] = "UnrecognizedScript";
    AddressError["NetworkValidation"] = "NetworkValidation";
    AddressError["OtherAddressErr"] = "OtherAddressErr";
})(AddressError || (AddressError = {}));
export var ChainPosition;
(function (ChainPosition) {
    ChainPosition["Confirmed"] = "Confirmed";
    ChainPosition["Unconfirmed"] = "Unconfirmed";
})(ChainPosition || (ChainPosition = {}));
export var CreateTxError;
(function (CreateTxError) {
    CreateTxError["Descriptor"] = "Descriptor";
    CreateTxError["Persist"] = "Persist";
    CreateTxError["Policy"] = "Policy";
    CreateTxError["SpendingPolicyRequired"] = "SpendingPolicyRequired";
    CreateTxError["Version0"] = "Version0";
    CreateTxError["Version1Csv"] = "Version1Csv";
    CreateTxError["LockTime"] = "LockTime";
    CreateTxError["RbfSequence"] = "RbfSequence";
    CreateTxError["RbfSequenceCsv"] = "RbfSequenceCsv";
    CreateTxError["FeeTooLow"] = "FeeTooLow";
    CreateTxError["FeeRateTooLow"] = "FeeRateTooLow";
    CreateTxError["NoUtxosSelected"] = "NoUtxosSelected";
    CreateTxError["OutputBelowDustLimit"] = "OutputBelowDustLimit";
    CreateTxError["ChangePolicyDescriptor"] = "ChangePolicyDescriptor";
    CreateTxError["CoinSelection"] = "CoinSelection";
    CreateTxError["InsufficientFunds"] = "InsufficientFunds";
    CreateTxError["NoRecipients"] = "NoRecipients";
    CreateTxError["Psbt"] = "Psbt";
    CreateTxError["MissingKeyOrigin"] = "MissingKeyOrigin";
    CreateTxError["UnknownUtxo"] = "UnknownUtxo";
    CreateTxError["MissingNonWitnessUtxo"] = "MissingNonWitnessUtxo";
    CreateTxError["MiniscriptPsbt"] = "MiniscriptPsbt";
})(CreateTxError || (CreateTxError = {}));
export var ElectrumError;
(function (ElectrumError) {
    ElectrumError["IoError"] = "IoError";
    ElectrumError["Json"] = "Json";
    ElectrumError["Hex"] = "Hex";
    ElectrumError["Protocol"] = "Protocol";
    ElectrumError["Bitcoin"] = "Bitcoin";
    ElectrumError["AlreadySubscribed"] = "AlreadySubscribed";
    ElectrumError["NotSubscribed"] = "NotSubscribed";
    ElectrumError["InvalidResponse"] = "InvalidResponse";
    ElectrumError["Message"] = "Message";
    ElectrumError["InvalidDnsNameError"] = "InvalidDnsNameError";
    ElectrumError["MissingDomain"] = "MissingDomain";
    ElectrumError["AllAttemptsErrored"] = "AllAttemptsErrored";
    ElectrumError["SharedIoError"] = "SharedIoError";
    ElectrumError["CouldntLockReader"] = "CouldntLockReader";
    ElectrumError["Mpsc"] = "Mpsc";
    ElectrumError["CouldNotCreateConnection"] = "CouldNotCreateConnection";
    ElectrumError["RequestAlreadyConsumed"] = "RequestAlreadyConsumed";
})(ElectrumError || (ElectrumError = {}));
//# sourceMappingURL=enums.js.map