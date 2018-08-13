const figlet = require('figlet');
const clear = require('clear');
const chalk = require('chalk');
const eos = require('./eos');

clear();
console.log(
  chalk.yellow(figlet.textSync('EOS-nodejs', { horizontalLayout: 'full'}))
);
console.log(chalk.blue('made by Marcel Morales'));
console.log(chalk.green('Using standard private key on test net by default. Change --config-- in ./eos.js'));
console.log(chalk.green('Make sure to have docker running as explained at https://github.com/EOSIO/eosjs/tree/master/docker'));
console.log(chalk.green('Uncomment line to enable functions in ./app.js and get --help'));

//const pubKeyTest = 'EOS86rDVGVU5UJAeAvDvRNKGJEDMjxGWr9vJBtBzCUW7s6zK2Puqp';
//const privKeyTest = '5HrZWBGf6ovYBqdDkoGBqzXCKRxyXdkEmke6LVufN3zK4q9Hctc';
//const accountNameTest = 'binancecleos';
//const exampleTrxMainNet = '87134edc78cf9d1d183e896cbd96c8a89144511b33bce91c82f99321d0d2673a';
//const exampleTrxMainNetBlockHeight = 10251887;

//ALL  UNCOMMENTED  FUNCTIONS WILL BE INVOKED WHEN RUNNING node app.js in terminal

//----BLOCKCHAIN----
//eos.getBlockHeight();
//eos.getCurrentBlockInfo();

//----KEYS----
//  more infos: https://github.com/EOSIO/eosjs-ecc/blob/master/src/key_private.js
//  seed: 'string' any length string. This is private. The same seed produces the same
//  private key every time. At least 128 random bits should be used to produce a good private key.
//eos.generateRandomPrivKey();
//console.log('privKey generated from seed SEED123: ', eos.generatePrivKeyFromSeed('SEED123'));
//eos.fromPrivToPub('5HrZWBGf6ovYBqdDkoGBqzXCKRxyXdkEmke6LVufN3zK4q9Hctc');
//eos.isPubKeyValid('EOS7pMyqadiD7DE7uZEHuEejZu2Qa7kiMmNVHf35bJEtqyniy8vBG');
//eos.isPrivKeyValid('5HrZWBGf6ovYBqdDkoGBqzXCKRxyXdkEmke6LVufN3zK4q9Hctc');

//----ACCOUTS----
//  EOS public and private keys can be generated off the chain, but EOS users need to create a user
//  name before they can operate on the chain. So activated users are needed to send on-chain transactions
//  to new users in order to help them create accounts. By default users need to find Tripartite help.
//  main net only:
//eos.getAccountNamesFromPubKey('EOS7pMyqadiD7DE7uZEHuEejZu2Qa7kiMmNVHf35bJEtqyniy8vBG');
//  main net only: (ie 'binancecleos'):
//eos.getAccSystemStats('binancecleos');
//  account name must be less than 13 characters
//  can only contain the following symbols: .12345abcdefghijklmnopqrstuvwxyz:
//  default: bytes = 8192, stake_net_quantity = '10.0000 SYS', stake_cpu_quantity = '10.0000 SYS', transfer = 0:
//  ownerPubKey and activePubKey can be the same, but is less secure
//eos.createAccountPackage('ownerPubKey', 'activePubKey', 'accountName', bytes, stake_net_quantity, stake_cpu_quantity, transfer);
//eos.createSingleAccount('accountName', ownerPubKey, activePubKey);

//----TRANSACTIONS----
// Transactions can be considered confirmed with 99.9% certainty after an average of 0.25 seconds from time of broadcast.
// The EOS aBFT algorithm provides 100% confirmation of irreversibility within 1 second.
//  sender, receiver, amount in format: '50.0000 SYS' , memo, sign = true, broadcast = true
//eos.transfer('inita', 'initb', '4.0000 SYS', 'myMemo1', true, true);
//first creates an unsigned transaction, signs it and then broadcasts it. All separately. See logs()
//trx data from transaction.transaction.actions[0].data
//eos.transferSignPushTransaction('inita', 'initb', '5.0000 SYS', 'myMemo2', false, false);
//just signs the transaction and returns it:
//eos.signTransaction(trxData, privKey);
//  insert return value from eos.transfer(..., signed = true, broadcast = false);
//eos.pushTransaction(returnValueEos.transfer); 
//  accountName, (+ int allAboveBlockHeightX --> optional)
//eos.getOutgoingTransactions('binancecleos');
//  perform transaction and add the id + block number as arg:
//  where to get blockNumHint? https://github.com/EOSIO/eosjs/issues/288
//eos.getTransaction('87134edc78cf9d1d183e896cbd96c8a89144511b33bce91c82f99321d0d2673a', 10251887);
//eos.isTransactionExecuted('87134edc78cf9d1d183e896cbd96c8a89144511b33bce91c82f99321d0d2673a', 10251887)
//SIG_K1_KVxbVaErwxYQ7RkngUcJQS7fVojC2nX57uKPg2S9M1cpLsPgioVx4FJaN9nTikxnPX6k3NwY7nLqPPiHmiFybt8JZJ2QjA

//----CURRENCY----
//eos.getCurrencyBalance('inita'); //using EOS account name
//eos.getCurrencyStats('XYZ'); //works for tokens as well
//  amount in format '1000.0000 XYZ', receiver, memo:
//eos.createToken('1000.0000 XYZX', 'inita','new Token');

//----OTHER----
//  converts '1.3000 EOS' --> 1.3, see floatRegex in eosj.js
//console.log('tofloat: ', eos.toFloat('1.03002000'));
