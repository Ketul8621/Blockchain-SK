const Block = require('./block');
const { createHash } = require('./crypto-hash');

class BlockChainSK {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({data}) {
        const newBlock = Block.mineBlock({
            prevBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, prevHash, hash, data, nonce, difficulty } = chain[i];

            const realPrevHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;

            if(realPrevHash !== prevHash) {
                return false;
            }

            const validatedHash = createHash(timestamp, prevHash, data, nonce, difficulty);

            if(hash !== validatedHash) {
                return false;
            }

            if(Math.abs(lastDifficulty - difficulty) > 1) {
                return false;
            }
        }

        return true;
    }

    replaceChain(chain) {
        if(chain.length <= this.chain.length) {
            console.error("The chain is not longer");
        }

        if(!BlockChainSK.isValidChain(chain)) {
            console.log("Your chain is not a valid chain");
        }

        this.chain = chain;
    }
}

const blockchain = new BlockChainSK();
blockchain.addBlock({data: "This is the first mined block"});
blockchain.addBlock({data: "This is the second mined block"});

// console.log(blockchain);

const isValidBlock = BlockChainSK.isValidChain(blockchain.chain);
// console.log(isValidBlock);
module.exports = BlockChainSK;