export class Message {

    public constructor(private subChannel: string,
                       private object : string) {
    }

    public getSubChannel() : string {
        return this.subChannel;
    }

    public getObject() : string {
        return this.object;
    }

}