class PassedTesting{
    constructor(){

    }

    static Decode(record){
        const item = new PassedTesting();
        item.correctTests = record.correctTests;
        item.allTests = record.allTests;
        item.percent = Math.floor(record.correctTests / record.allTests * 100);
        item.duration = Math.floor(record.duration / 1000);
        item.forkId = record.fork_unitId.split("@")[1];
        item.unitId = record.fork_unitId.split("@")[0];
        item.startedOn = record.startedOn;
        return item;
    }

    static GetDays(){
        
    }
}