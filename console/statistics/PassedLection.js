class PassedLection{
    constructor(){

    }

    static Decode(record){
        const item = new PassedLection();
        item.finishedOn = record.finishedOn;
        item.startedOn = record.startedOn;
        item.unitId = record.fork_unitId.split("@")[0];
        item.forkId = record.fork_unitId.split("@")[1];
        return item;
    }
}