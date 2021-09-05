import {CompoundInterceptor, DataInterceptor} from "./data.interceptor";
import { deserialize} from 'typescript-json-serializer';
import {DefaultInterceptorExecutor, InterceptorExecutor} from "./interceptor.executor";

export interface InterceptorHandler {

    register<T>(subChannel: string, dataInterceptor: DataInterceptor<T>): void;

    call(subChannel: string, content: string): void;

    unregisterAll(): void;

}

export class DefaultInterceptorHandler implements InterceptorHandler {

    private interceptors: Map<string, CompoundInterceptor<any>> =
        new Map<string, CompoundInterceptor<any>>();

    private executor : InterceptorExecutor = new DefaultInterceptorExecutor();

    call(subChannel: string, content: string): void {
        let compound = this.interceptors.get(subChannel);

        if (compound != null) {
            compound
                .get()
                .forEach(interceptor => {
                    this.executor.execute(deserialize(content, interceptor.getClass()), interceptor)
                });
        }

    }

    register<T>(subChannel: string, dataInterceptor: DataInterceptor<T>): void {
        let compound = this.interceptors.get(subChannel);

        if (compound == null) {
            compound = new CompoundInterceptor();
            this.interceptors.set(subChannel, compound);
        }

        compound.register(dataInterceptor);
    }

    unregisterAll(): void {
        this.interceptors.clear();
    }

}

