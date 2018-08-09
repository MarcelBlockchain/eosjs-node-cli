# eosjs-node-cli
EOS-nodejs made by Marcel Morales__
using eosjs https://github.com/EOSIO/eosjs __
__
USAGE: __
__
Using standard private key on test net by default. Change --config-- in ./eos.js __
Make sure to have docker running as explained at https://github.com/EOSIO/eosjs/tree/master/docker __
Uncomment line to enable functions in ./app.js and get --help'__
__
----BLOCKCHAIN---- __
eos.getBlockHeight(); __
eos.getCurrentBlockInfo(); __

----KEYS---- __
//  more infos: https://github.com/EOSIO/eosjs-ecc/blob/master/src/key_private.js __
//  seed: 'string' any length string. This is private. The same seed produces the same __
//  private key every time. At least 128 random bits should be used to produce a good private key. __
eos.generateRandomPrivKey(); __
console.log('privKey generated from seed SEED123: ', eos.generatePrivKeyFromSeed('SEED123')); __
eos.fromPrivToPub('5HrZWBGf6ovYBqdDkoGBqzXCKRxyXdkEmke6LVufN3zK4q9Hctc'); __
eos.isPubKeyValid('EOS7pMyqadiD7DE7uZEHuEejZu2Qa7kiMmNVHf35bJEtqyniy8vBG'); __
eos.isPrivKeyValid('5HrZWBGf6ovYBqdDkoGBqzXCKRxyXdkEmke6LVufN3zK4q9Hctc'); __
 __
----ACCOUTS---- __
//  EOS public and private keys can be generated off the chain, but EOS users need to create a user __
//  name before they can operate on the chain. So activated users are needed to send on-chain transactions __
//  to new users in order to help them create accounts. By default users need to find Tripartite help. __
//  main net only: __
eos.getAccountNamesFromPubKey('EOS7pMyqadiD7DE7uZEHuEejZu2Qa7kiMmNVHf35bJEtqyniy8vBG'); __
//  main net only: (ie 'binancecleos'): __
eos.getAccSystemStats('binancecleos'); __
//  account name must be less than 13 characters __
//  can only contain the following symbols: .12345abcdefghijklmnopqrstuvwxyz: __
//  default: bytes = 8192, stake_net_quantity = '10.0000 SYS', stake_cpu_quantity = '10.0000 SYS',  transfer = 0: __
//  ownerPubKey and activePubKey can be the same, but is less secure __
eos.createAccountPackage('ownerPubKey', 'activePubKey', 'accountName', bytes, stake_net_quantity, stake_cpu_quantity, transfer); __
eos.createSingleAccount('accountName', ownerPubKey, activePubKey); __
__
----TRANSACTIONS---- __
// Transactions can be considered confirmed with 99.9% certainty after an average of 0.25 seconds from time of broadcast. __
// The EOS aBFT algorithm provides 100% confirmation of irreversibility within 1 second. __
//  sender, receiver, amount in format: '50.0000 SYS' , memo, sign = true, broadcast = true __
eos.transfer('inita', 'initb', '50.0000 SYS', 'myMemo', true, true); __
//  insert return value from eos.transfer(..., signed = true, broadcast = false); __
eos.pushTransaction(returnValueEos.transfer); __
//  accountName, (+ int allAboveBlockHeightX --> optional) __
eos.getOutgoingTransactions('binancecleos'); __
//  perform transaction and add the id + block number as arg: __
//  where to get blockNumHint? https://github.com/EOSIO/eosjs/issues/288 __
eos.getTransaction('87134edc78cf9d1d183e896cbd96c8a89144511b33bce91c82f99321d0d2673a', 10251887); __
eos.isTransactionExecuted('87134edc78cf9d1d183e896cbd96c8a89144511b33bce91c82f99321d0d2673a', 10251887) __
__
__
----CURRENCY---- __
eos.getCurrencyBalance('inita'); //using EOS account name __
eos.getCurrencyStats('XYZ'); //works for tokens as well __
//  amount in format '1000.0000 XYZ', receiver, memo: __
eos.createToken('1000.0000 XYZX', 'inita','new Token'); __
__
----OTHER---- __
//  converts '1.3000 EOS' --> 1.3, see floatRegex in eosj.js __
console.log('tofloat: ', eos.toFloat('1.03002000')); __
