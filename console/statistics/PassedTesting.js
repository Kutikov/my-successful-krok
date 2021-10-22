class PassedTesting{
    constructor(){

    }

    static Decode(record){
        const thisItem = new PassedTesting();
        thisItem.correctTests = record.correctTests;
        thisItem.allTests = record.allTests;
        thisItem.percent = Math.floor(record.correctTests / record.allTests * 100);
        thisItem.duration = Math.floor(record.duration / 1000);
        thisItem.forkId = record.fork_unitId.split("@")[1];
        thisItem.unitId = record.fork_unitId.split("@")[0];
        thisItem.startedOn = record.startedOn;
        return thisItem;
    }

    static GetDays(){
        
    }
}