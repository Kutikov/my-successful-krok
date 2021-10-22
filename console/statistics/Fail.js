class Fail{
    constructor(){

    }

    static Decode(record){
        const item = new Fail();
        item.created = record.created;
        item.testId = record.testId;
        const parts = record.testId.split("@");
        item.testN = parts[0];
        item.unitId = parts[1];
        item.forkId = parts[2];
        return item;
    }
}