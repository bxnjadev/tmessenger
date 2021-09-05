import {Consumer, Predicate} from "./functional/functional";
import {RedisClient}  from "redis";
import {serialize} from 'typescript-json-serializer';
import {DefaultInterceptorHandler, InterceptorHandler} from "./interceptor.handler";
import {DataInterceptor} from "./data.interceptor";
import {ClassType} from "./class.type";
import {Message} from "./message";
import {RedisListener} from "./redis/redis.listener";

export interface Messenger {

    sendMessage<T>(subChannel : string, object : object) : void;

    intercept<T>(subChannel : string, type: ClassType<T>, consumer : Consumer<T>, predicate : Predicate<T>) : void;

    call(subChannel : string, content : string) : void;

}

export class DefaultMessenger implements Messenger {

    private interceptorHandler: InterceptorHandler = new DefaultInterceptorHandler();
    private redisListener : RedisListener;

    public constructor(private redis : RedisClient,
                       private channel : string) {

        this.redisListener = new RedisListener(redis, channel, this);
    }

    intercept<T>(subChannel: string,
                 type : ClassType<T>,
                 consumer : Consumer<T>,
                 predicate : Predicate<T>): void {
        this.interceptorHandler
            .register(
                subChannel,
                new DataInterceptor<T>(type, consumer, predicate)
            )
    }

    sendMessage<T>(subChannel: string, object: object): void {

        let message = new Message(subChannel, serialize(object));

        this.redis
            .publish(this.channel, serialize(message));
    }

    call(subChannel: string, content: string): void {
        this.interceptorHandler
            .call(subChannel, content);
    }

}



