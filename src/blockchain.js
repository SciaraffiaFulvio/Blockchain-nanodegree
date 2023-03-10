/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message` 
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *  
 */

const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain {

    /**
     * Constructor of the class, you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     * Also everytime you create a Blockchain class you will need to initialized the chain creating
     * the Genesis Block.
     * The methods in this class will always return a Promise to allow client applications or
     * other backends to call asynchronous functions.
     */
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     * You should use the `addBlock(block)` to create the Genesis Block
     * Passing as a data `{data: 'Genesis Block'}`
     */
    async initializeChain() {
        if( this.height === -1){
            let block = new BlockClass.Block({data: 'Genesis Block'});
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block 
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to 
     * create the `block hash` and push the block into the chain array. Don't for get 
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention 
     * that this method is a private method. 
     */
    _addBlock(block) {
        let self=this;
        return new Promise(async (resolve, reject) => {
        let newblock= block;
        let valid_block = await newblock.validate();
            try {
                if (self.chain.length>0) {
                // previous block hash
                newblock.previousBlockHash = self.chain[self.chain.lenght-1].hash;
                }
                newblock.timeStamp = new Date().getTime().toString().slice(0,-3);
                newblock.hash = SHA256(JSON.stringify(newblock)).toString();
                
                self.height = self.chain.length -1;
                let valid_block = await self.validateChain();
                let errors = await self.validateChain();

                if (!valid_block){
                    throw new Error("not valid")
                    reject(valid.block)

                }else{    

                    throw new("block valid")
                    self.chain.push(newblock);
                    self.height++;
                    resolve(newblock);
                }    
                    
                } catch(errors){
                    console.error(errors);
                    reject(errors);
                }            
        });
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address 
     */
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            
            let verificacion_message = `${address}:${new Date().getTime().toString().slice(0,-3)}:starRegistry`;
            resolve(verificacion_message);
            
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Veify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address 
     * @param {*} message 
     * @param {*} signature 
     * @param {*} star 
     */
    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            let get_time=parseInt(message.split(':')[1]);
            let realTime = parseInt(new Date().getTime().toString().slice(0, -3));
            let veify = bitcoinMessage.verify(message, address, signature)
            if(realTime-get_time < 300){
                new Error("Time has passed")
        
            }
            if(!veify){

                new error("not valid user")
        
            }
            if(veify){

                let newblock = new BlockClass.Block.Class.Block({

                    owner: address,
                    star
                })

            }      
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash 
     */
    getBlockByHash(hash) {
        let self = this;
            return new Promise((resolve, reject) => {
            let block = self.chain.find(p => p.hash === hash);
            if (block) {
                resolve(block);
            } else {
                resolve(null);
            }
           
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object 
     * with the height equal to the parameter `height`
     * @param {*} height 
     */
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain 
     * and are belongs to the owner with the wallet address passed as parameter.
     * Remember the star should be returned decoded.
     * @param {*} address 
     */
    getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];
        return new Promise((resolve, reject) => {
            try {
                let starObj = self.chain
                    .filter(p => p.height > 0 && p.getBData().owner === address)
                    .map(block => block.getBData());
                resolve(starsByWalletList);
            } catch (error) {
                console.error(error);
                reject(error);
            }
            
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */
    async validateChain() {
        let self = this;
        return new Promise(async (resolve, reject) => {
            for (let i = 1; i < self.height; i++) {
                let Blockcurrent = self.chain[i];
                let Blockprevious = self.chain[i - 1];
    
                try {
                    if (!await currentBlock.validate()) {
                        reject(`the Block at index ${i} is not valid`);
                        return;
                    }
    
                    if (currentBlock.prevHash !== previousBlock.hash) {
                        reject(`Block at index ${i} has a not valid previous hash`);
                        return;
                    }
                } catch(error) {
                    console.error(error);
                    reject(error);
                    return;
                }
            }
            resolve(true);
        });
    }

}

module.exports.Blockchain = Blockchain;   