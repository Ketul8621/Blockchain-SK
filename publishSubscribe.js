const redis = require("redis");

const CHANNEL = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN"
}
class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriber.subscribe(CHANNEL.BLOCKCHAIN);

        this.subscriber.on("message", (channel, message) =>  this.handleMessage(channel, message))
    }

    handleMessage(channel, message) {
        console.log("Msg received = " + channel + " " + message);

        const parseMessage = JSON.parse(message);

        if(channel === CHANNEL.BLOCKCHAIN) {
            this.blockchain.replaceChain(parseMessage);
        }
    }

    publish({channel, message}) {
        console.log("channel", channel);
        this.publisher.publish(channel, message);        
    }

    broadcastChain() {
        console.log("broadcasting");
        this.publish({
            channel: CHANNEL.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }
}

// const checkPubSub = new PubSub();

// setTimeout(() => {
//     checkPubSub.publisher.publish(CHANNEL.TEST, "Hellooooo boi");
// }, 1000);

module.exports = PubSub;