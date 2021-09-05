import {RedisClient} from "redis";
import {Messenger} from "../messenger";
import {deserialize} from 'typescript-json-serializer';
import {Message} from "../message";

export class RedisListener {

    public constructor(private redis: RedisClient,
                       private channel: string,
                       private messenger: Messenger) {
    }

    async connect() {
        const subscriber = this.redis.duplicate();

        await subscriber.subscribe(this.channel, message => {
            let messageObject = deserialize(message, Message);
            this.messenger.call(messageObject.getSubChannel(), messageObject.getObject());
        });
    }

}