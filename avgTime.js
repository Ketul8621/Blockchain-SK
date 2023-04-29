const BlockchainSK = require('./blockchainSK');

const blockchainSK = new BlockchainSK();

blockchainSK.addBlock({data: "Block1"});

let times = [];

for (let i = 1; i < 1000; i++) {
    const prevTimestamp = blockchainSK.chain[blockchainSK.chain.length - 1].timestamp;
    blockchainSK.addBlock({data: `Block${i+1}`});
    const nextBlock = blockchainSK.chain[blockchainSK.chain.length - 1];
    const nextTimestamp = nextBlock.timestamp;

    const timeDifference = nextTimestamp - prevTimestamp;

    times.push(timeDifference);

    const avgTime = times.reduce((total, value) => total + value) / times.length;

    console.log(`Block number ${i} took time ${timeDifference}ms to mine. Difficulty: ${nextBlock.difficulty}, Avg: ${avgTime}`);
}