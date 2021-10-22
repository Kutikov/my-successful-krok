class PassedLection{
    constructor(){

    }

    static Decode(record){
        const thisItem = new PassedLection();
        thisItem.finishedOn = record.finishedOn;
        thisItem.startedOn = record.startedOn;
        thisItem.unitId = record.fork_unitId.split("@")[0];
        thisItem.forkId = record.fork_unitId.split("@")[1];
        return thisItem;
    }
}