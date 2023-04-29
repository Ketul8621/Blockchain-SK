const INITIAL_DIFFICULTY = 2;
const MINE_RATE = 1000;
const GENESIS_DATA = {
  timestamp: 1,
  prevHash: "0x000",
  hash: "0x123",
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY,
  data: [],
};

module.exports = { GENESIS_DATA, MINE_RATE };
