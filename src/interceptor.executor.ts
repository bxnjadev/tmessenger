import {DataInterceptor} from "./data.interceptor";

export interface InterceptorExecutor {

    execute<T>(object : T, dataInterceptor: DataInterceptor<T>): void;

}

export class DefaultInterceptorExecutor implements InterceptorExecutor {

    execute<T>(object : T, dataInterceptor: DataInterceptor<T>): void {
        let predicate = dataInterceptor.getPredicate();

        if (predicate == null || !predicate.test(object)) {
            return;
        }

        dataInterceptor
            .getInterceptor()
            .accept(object);
    }

}

