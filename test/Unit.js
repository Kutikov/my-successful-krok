class Unit{
    constructor(fork, unit){
        this.unitId = unit.replace(' ', 'Ø');
        this.forkId = fork.name.replace(' ', 'Ø');
        this.fork_unitId = this.unitId + '@' + this.forkId;
        this.testsCount = 0;
        this.needUpdate = false;
    }

    static Decode(fork_unitId, record, fork){
        const unit = new Unit(fork, record.forkId);
        unit.fork_unitId = fork_unitId;
        unit.testsCount = record.testsCount;
        unit.needUpdate = false;
        return testAccount;
    }

    updateTestsCount(testsArray){
        this.needUpdate = true;
        const prevCount = this.testsCount;
        this.testsCount = testsArray.length;
        fork.needUpdate = true;
        fork.testsCount = fork.testsCount - prevCount + testsArray.length;
    }
}