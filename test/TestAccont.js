class TestAccount{
    constructor(unit, fork){
        this.unitId = unit.replace(' ', 'Ø');
        this.forkId = fork.replace(' ', 'Ø');
        this.task = '';
        this.comment = '';
        this.answersTrue = [];
        this.answersFalse = [];
        this.fork_unitId = this.unitId + '@' + this.forkId;
        this.testId = '';
    }

    static GetTestAccount(task, comment, answersTrueL, answersFalseL, fork, unit, i){
        const testAccount = new TestAccount(unit, fork);
        testAccount.testId = i.toString() + '@' + testAccount.fork_unitId;
        testAccount.task = task;
        testAccount.comment = comment;
        testAccount.answersTrue = answersTrueL;
        testAccount.answersFalse = answersFalseL;
        return testAccount;
    }
}