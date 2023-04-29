const express = require("express");
const bodyParser = require('body-parser');
const request = require("request");
const BlockChainSK = require('./blockchainSK');
const PubSub = require('./publishSubscribe');


const app = express();

app.use(bodyParser.json());
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
const blockchain = new BlockChainSK();

const pubSub = new PubSub({ blockchain });

setTimeout(() => pubSub.broadcastChain(), 1000);

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
})

app.post('/api/mine', (req, res) => {
    const {data} = req.body;

    blockchain.addBlock({data});
    pubSub.broadcastChain();
    res.redirect("/api/blocks");
});

const syncChains = () => {
    request(
      { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
      (error, reposnse, body) => {
        console.log("error ", error, reposnse);
        if (!error && reposnse.statusCode === 200) {
          const rootChain = JSON.parse(body);
          console.log("Replace chain on sync with", rootChain);
          blockchain.replaceChain(rootChain);
        }
      }
    );
  };
  

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT) {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`)
    syncChains();
});