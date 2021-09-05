export interface Consumer<T> {

    accept(object : T) : void;

}

export interface Predicate<T> {

    test(object : T) : boolean;

}