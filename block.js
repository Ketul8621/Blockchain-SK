const { GENESIS_DATA, MINE_RATE } = require("./config");
const { createHash } = require("./crypto-hash");
const hexToBinary = require("hex-to-binary");

class Block {
  constructor({ timestamp, prevHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({prevBlock, data}) {
    let timestamp, hash;
    const prevHash = prevBlock.hash;
    let { difficulty } = prevBlock;

    let nonce = 0;
    do{
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: prevBlock,
        timestamp
      });

      // console.log("adjusted difficulty = ", difficulty);
      hash = createHash(timestamp, data, prevHash, difficulty, nonce)
    }while(hexToBinary(hash).substring(0,difficulty) !== "0".repeat(difficulty))

    return new Block({
        timestamp,
        data,
        prevHash,
        hash,
        difficulty,
        nonce
    })
  }

  static adjustDifficulty({originalBlock, timestamp}) {
    const { difficulty } = originalBlock;

    if(difficulty < 1) return 1;
    const difference = timestamp - originalBlock.timestamp;

    // console.log("difference - ", difference);

    if (difference - MINE_RATE > 1) return difficulty - 1;
    return difficulty + 1;
  }
}

// const block1 = new Block({
//   timestamp: "22/04/2023",
//   prevHash: "This is the latest Ketul's blockchain",
//   hash: "0x4651",
//   data: "0x6541",
// });

const genesisBlock = Block.genesis();

// const mineBlock = Block.mineBlock({prevBlock: genesisBlock, data: "sdsgfgfd"});

// console.log("genesisBlock = ", genesisBlock);
// console.log("mineBlock = ", mineBlock);
// console.log(block1);

module.exports = Block;