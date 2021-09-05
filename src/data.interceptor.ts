import {Consumer, Predicate} from "./functional/functional";
import {ClassType} from "./class.type";

export class DataInterceptor<T> {

    public constructor(private clazz: ClassType<T>,
                       private consumer: Consumer<T>,
                       private predicate: Predicate<T>) {
    }

    public getClass(): ClassType<T> {
        return this.clazz;
    }

    public getInterceptor(): Consumer<T> {
        return this.consumer;
    }

    public getPredicate(): Predicate<T> {
        return this.predicate;
    }

}

export class CompoundInterceptor<T> {

    private interceptors: Set<DataInterceptor<T>> = new Set<DataInterceptor<T>>();

    public register(dataInterceptor: DataInterceptor<T>): void {
        this.interceptors.add(dataInterceptor);
    }

    public get(): Set<DataInterceptor<T>> {
        return this.interceptors;
    }

}

