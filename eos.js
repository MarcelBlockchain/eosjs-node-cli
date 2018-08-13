const chalk = require('chalk');
const Eos = require('eosjs');

const floatRegex = /[^\d.-]/g;
//----TEST VARIABLES----
const pubKeyTest = 'EOS7Tq7KKKz1UD5mzotQ5Ls3caVpfXKvEDdk4qKx2Xu4Qsr9UBxtW';
const transactionIDtest = 'd4d95c85db899a0e54328b2f0c2e2062f1d7dc4445d04008836367d1c5448298';
const blockNumHintTest = '9100334';
//const privKeyTest = '5HrZWBGf6ovYBqdDkoGBqzXCKRxyXdkEmke6LVufN3zK4q9Hctc';
//const pubKey2Test = 'EOS7pMyqadiD7DE7uZEHuEejZu2Qa7kiMmNVHf35bJEtqyniy8vBG';

//----MAIN NET----
// const config = {
//   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // main net
//   //keyProvider: ['MY PRIVATE KEY'], //used globally for signing transactions
//   keyProvider: ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'],
//   httpEndpoint: 'https://api.eosnewyork.io:443', //main net
//   expireInSeconds: 60,
//   sign: true,  // sign the transaction with a private key. Leaving a transaction unsigned avoids the need to provide a private key
//   broadcast: true,  //post the transaction to the blockchain. Use false to obtain a fully signed transaction
//   verbose: false, //verbose logging such as API activity
// };

//----TEST NET----
const config = {
  //keyProvider: ['MY PRIVATE KEY'], //used globally for signing transactions
  keyProvider: ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'],
  //sign: true,  // sign the transaction with a private key. Leaving a transaction unsigned avoids the need to provide a private key
  //broadcast: true,  //post the transaction to the blockchain. Use false to obtain a fully signed transaction
  verbose: false, //verbose logging such as API activity
};
const eos = Eos(config);
const { ecc } = Eos.modules;

const _this = module.exports = {
  toFloat : str =>  parseFloat(str.replace(floatRegex, '')),

  fromPrivToPub: wif => {
    const pubKey = ecc.privateToPublic(wif);
    console.log('pubKey: ', pubKey);
    return pubKey;
  },

  isPubKeyValid: pubKey => {
    const bool = ecc.isValidPublic(pubKey) === true;
    console.log('is pubKey valid? --> ', bool);
    return bool;
  },

  isPrivKeyValid : privKey => {
    const bool = ecc.isValidPrivate(privKey) === true;
    console.log('is privKey valid? --> ', bool);
    return bool;
  },

  //seed: 'string' any length string. This is private. The same seed produces the same
  //private key every time. At least 128 random bits should be used to produce a good private key.
  generatePrivKeyFromSeed : seed => ecc.seedPrivate(seed),

  //EOS public and private keys can be generated off the chain, but EOS users need to create a user
  //name before they can operate on the chain. So activated users are needed to send on-chain transactions
  //to new users in order to help them create accounts. By default users need to find Tripartite help.

  generateRandomPrivKeyP : () =>
    new Promise((resolve, reject) => {
      ecc.randomKey().then(privateKey => {
        //console.log('random private key: ', privateKey);
        resolve(privateKey);
      });
    }),

    generateRandomPrivKey : async () => {
      const output = await _this.generateRandomPrivKeyP();
      console.log('random private key: ', output);
      return output;
    },

    getAccSystemStatsP : id =>
    new Promise((resolve, reject) => {
      eos.getAccount(id, (error, result) => {
        if (error) reject(error);
        resolve(result.total_resources);
      });
    }),

    //id is the 12 character EOS account name like 'itamnetwork1'
    getAccSystemStats : async id => {
      try {
        const result = await _this.getAccSystemStatsP(id);
        //console.log(result); //whole object
        let { cpu_weight, net_weight, ram_bytes } = result;
        if (cpu_weight != null) cpu_weight = _this.toFloat(cpu_weight);
        if (net_weight) net_weight = _this.toFloat(net_weight);
        console.log(`account infos for ${id}:`)
        console.log('CPU weight in EOS: ', cpu_weight);
        console.log('net weight in EOS: ', net_weight);
        console.log('RAM in KB: ', ram_bytes / 1000);
        return result;
      } catch(error) {
        console.log(chalk.red(`no account-system-stats found for ${id}.\n` +
        'Make sure you are connected to the main net and the account name was spelled correctly'));
      }
    },
  
    getAccountNamesFromPubKeyP : pubKey =>
      new Promise((resolve, reject) => {
        eos.getKeyAccounts(pubKey, (error, result) => {
          if (error) reject(error);
          resolve(result);
          //array of account names, can be multiples
          //output example: { account_names: [ 'itamnetwork1', ... ] }
        });
      }),
  
    getAccountNamesFromPubKey : async pubKey => {
      const result = await _this.getAccountNamesFromPubKeyP(pubKey);
      console.log('account names from pubKey: ', result);
      return result;
    },
  
    //If you look at the result value, you can see an array in the form of a string.
    //This is because there could be tokens with many different symbols in the account
    getCurrencyBalanceP : (accountName, contractName = 'eosio.token') =>
      new Promise((resolve, reject) => {
        eos.getCurrencyBalance(contractName, accountName, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      }),

    getCurrencyBalance : async (accountName, contractName = 'eosio.token') => {
      const result = await _this.getCurrencyBalanceP(accountName, contractName);
      console.log(`balance of ${accountName}: `, result);
    },
  
    getCurrencyStatsP : (symbol, contractName) =>
      new Promise((resolve, reject) => {
        eos.getCurrencyStats(contractName, symbol, (error, result) => {
          if (error) reject(error);
          resolve(result);
          //output { EOS: { supply: '1006148640.3388 EOS', max_supply: '10000000000.0000 EOS',
          //         issuer: 'eosio' } }
        });
      }),

    getCurrencyStats : async (symbol, contractName = 'eosio.token') => {
      const result = await _this.getCurrencyStatsP(symbol, contractName);
      console.log(result);
      return result;
    },
  
    getBlockHeightP : () =>
      new Promise((resolve, reject) => {
        eos.getInfo((error, info) => {
          if (error) reject(error);
          else resolve(info);
        });
      }),
  
    getBlockHeight : async () => {
      const result = await _this.getBlockHeightP();
      console.log('current block height: ', result.head_block_num);
      return result.head_block_num;
    },

    isTransactionExecutedP : async (id, blockNumHint) =>
      new Promise(async (resolve, reject) => {
        await eos.getTransaction(id, blockNumHint, (error, info) => {
        if (error) reject(error);
        resolve(info.trx.receipt.status === 'executed');
      });
    }),

    isTransactionExecuted : async (id , blockNumHint) => {
      const executed = await _this.isTransactionExecutedP(id, blockNumHint);
      console.log(`transaction: ${id} \nwas executed: ${executed}`);
      return executed;
    },
  
    //where to get blockNumHint? https://github.com/EOSIO/eosjs/issues/288
    getTransactionP : async (id, blockNumHint) =>
      new Promise(async (resolve, reject) => {
        const blockHeight = await _this.getBlockHeight();
        await eos.getTransaction(id, blockNumHint, (error, info) => {
          const res = {};
          if (error) reject(error);
          // Transactions can be considered confirmed with 99.9% certainty after an average of 0.25 seconds from time of broadcast.
          // The EOS aBFT algorithm provides 100% confirmation of irreversibility within 1 second.
          for (var i in info.traces) {
            for (var x in info.traces[i].act.authorization)
              res['sender'] = info.traces[i].act.authorization[x].actor;
            res['receiver'] = info.traces[i].receipt.receiver;
            res['smart contract owner'] = info.traces[i].act.account;
            res['message'] = info.traces[i].act.data.message;
            //full data object:
            //console.log('Transaction data', info.traces[i]);
          };
          res['status'] = info.trx.receipt.status;
          res['sonfirmation height'] = blockHeight - info.block_num;
          res['transaction in block'] = info.block_num;
          res['transaction time in block'] = info.block_time;
          resolve(res);
        });
      }),
  
    getTransaction : async (id , blockNumHint) => {
      const result = await _this.getTransactionP(id, blockNumHint);
      console.log('transaction details: ', result);
      return result;
    },
  
    getCurrentBlockInfoP : () =>
      new Promise((resolve, reject) => {
        eos.getInfo((error, info) => {
          if (error) reject(error);
          else resolve(info);
        });
      }),
  
    getCurrentBlockInfo : async () => {
      const result = await _this.getCurrentBlockInfoP();
      console.log('current block info:  ', result);
      return result;
    },
  
    //e.g. binancecleos, itamnetwork1
    getOutgoingTransactionsP : async accountName =>
      new Promise(async (resolve, reject) => {
        const trx = [];
        const actions = (await eos.getActions(accountName)).actions;
        // in case you solely want the standard transactions
        //.filter(a => a.action_trace.act.name === 'transfer')
        actions.map(a => {
          const { from, memo, quantity, to, payer, quant, receiver } = a.action_trace.act.data;
          const { bytes, stake_cpu_quantity, stake_net_quantity, transfer } = a.action_trace.act.data;
          const { name, data } = a.action_trace.act;
          let obj = {};
          if (name === 'transfer')
            obj = {
              ...obj,
              to,
              from,
              quantity: _this.toFloat(quantity),
              memo,
            };
          else if (name === 'buyram') obj = { ...obj, payer, quant: _this.toFloat(quant), receiver };
          else if (name === 'buyrambytes') obj = { ...obj, payer, receiver, bytes };
          else if (name === 'delegatebw')
            obj = {
              ...obj,
              stake_cpu_quantity: _this.toFloat(stake_cpu_quantity), //unit in EOS
              stake_net_quantity: _this.toFloat(stake_net_quantity), //unit in EOS
              transfer,
            };
          else if (name === 'newaccount')
            obj = { ...obj, creator: data.creator, name: data.name, key: data.active.keys[0].key };
          else {
            // https://eosio.stackexchange.com/questions/1831/getactionsaccountname-possible-names-actions-action-trace-act-name?noredirect=1#comment1698_1831
            //if not any of the mainly used transaction types, return whole object
            return actions;
          }
          obj = {
            ...obj,
            transaction_ID: a.action_trace.trx_id,
            block_time: a.block_time,
            block_num: a.block_num,
            trx_type: name,
          };
          trx.push(obj);
          return a.action_trace.act;
        });
        //console.log(trx);
        //console.log(actions);  //unfiltered data;
        resolve(trx);
      }),
  
    getOutgoingTransactions : async (accountName, height) => {
      const result = await _this.getOutgoingTransactionsP(accountName);
      if (!height) {
        console.log(`outgoing transactions of ${accountName}: `, result);
        return result;
      }
      //use 'height' to get all transactions above a specific block height
      const aboveHeight = result.filter(a => a.block_num > height);
      console.log(`outgoing transactions of ${accountName} above block ${height}: `, aboveHeight);
      return aboveHeight;
    },
  
    createAccountPackage : async (ownerPubKey, activePubKey, name, bytes = 8192, stake_net_quantity = '10.0000 SYS', stake_cpu_quantity = '10.0000 SYS', transfer = 0) => {
      const tr = await eos.transaction(tr => {
        tr.newaccount({
          creator: 'eosio',
          name,
          owner: ownerPubKey,
          active: activePubKey,
        });
  
        tr.buyrambytes({
          payer: 'eosio',
          receiver: name,
          bytes,
        });
  
        tr.delegatebw({
          from: 'eosio', //acc_name
          receiver: name,
          stake_net_quantity,
          stake_cpu_quantity,
          transfer
        });
      });
      console.log('createAccount1 tr: ', tr);
    },
  
    //Must be less than 13 characters
    //Can only contain the following symbols: .12345abcdefghijklmnopqrstuvwxyz
  
    createSingleAccount : async (name, ownerPubKey, activePubKey) => {
      const tr = await eos.transaction(tr => {
        tr.newaccount({
          creator: 'eosio', //account_name
          name, //new account name
          owner: 'EOS86rDVGVU5UJAeAvDvRNKGJEDMjxGWr9vJBtBzCUW7s6zK2Puqp', //owner pubkey
          active: 'EOS86rDVGVU5UJAeAvDvRNKGJEDMjxGWr9vJBtBzCUW7s6zK2Puqp', //active pubkey
        });
      });
      console.log('createAccount2 tr: ', tr);
      return tr;
    },
  
    transferSignPushTransaction : async (from, to, amount, memo = '', sign = true, broadcast = true) => {
      const options = {
        authorization: `${from}@active`, //@active for activeKey, @owner for Owner key
        //default authorizations will be calculated.
        broadcast,
        sign,
      };

      const transaction = await eos.transaction(
        'eosio.token',
        acc => {
          acc.transfer(from, to, amount, memo);
        },
        options
      );
      //console.log(chalk.red('super big joe: '), transaction.transaction.transaction.actions[0].data); //.actions[0].data
      //console.log('big joe',transaction.transaction.signatures);
      const sig = await _this.signTransaction(transaction.transaction.transaction.actions[0].data, '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3');
      transaction.transaction.signatures.push(sig);
      console.log(chalk.green('signed transaction'), transaction.transaction);
      _this.pushTransaction(transaction.transaction);
      return transaction.transaction;
    },

    transfer : async (from, to, amount, memo = '', sign = true, broadcast = true) => {
      const options = {
        //authorization: `${from}@active`, //@active for activeKey, @owner for Owner key
        //default authorizations will be calculated.
        broadcast,
        sign,
      };

      const transaction = await eos.transaction(
        'eosio.token',
        acc => {
          acc.transfer(from, to, amount, memo);
        },
        options
      );
      console.log('HERE Transaction: ', transaction);
        return transaction.transaction;
    },
  
    pushTransaction : async txrID => {
      const pushed = await eos.pushTransaction(txrID);
      console.log('pushed: ', pushed);
      return pushed;
    },
    
    signTransaction : async (trxData = '000000000093dd74000000008093dd7420a10700000000000453595300000000066d794d656d6f', privKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3' ) => {
      const transaction = await ecc.sign(trxData, privKey);
      console.log('signature: ', transaction);
      return transaction;
    },
  
    createToken : async (amountNsymbol, to, memo = '') => {
      await eos.transaction('eosio.token', acc => {
        // Create the initial token with its max supply
        // const options = {authorization: 'acc', broadcast: true, sign: true} // default
        // OR const options = [{"actor":"eosio.token","permission":"active"}] //default (API log)
  
        acc.create('eosio.token', amountNsymbol); //, options)
        //according to eosio_token.json no arg reserved for 'name'
  
        // Issue some of the max supply for circulation into an arbitrary account
        acc.issue('eosio.token', amountNsymbol, 'issue');
        acc.transfer('eosio.token', to, '5000.000 LLL', memo);
      }); // }, options)
      const balance = await eos.getCurrencyBalance('eosio.token', to);
      console.log(`currency balance ${to}: `, balance);
      const balance2 = await eos.getCurrencyBalance('eosio.token', 'eosio.token');
      console.log('currency balance eosio.token: ', balance2);
    },
};