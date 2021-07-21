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
        this.needUpdate = false;
    }

    static GetTestAccount(task, comment, answersTrueL, answersFalseL, fork, unit, i){
        const testAccount = new TestAccount(unit, fork);
        testAccount.testId = i.toString() + '@' + testAccount.fork_unitId;
        testAccount.task = task;
        testAccount.comment = comment;
        testAccount.answersTrue = answersTrueL;
        testAccount.answersFalse = answersFalseL;
        testAccount.needUpdate = true;
        return testAccount;
    }

    static Decode(testId, record){
        const testAccount = new TestAccount(record.unitId, record.forkId);
        testAccount.testId = testId;
        testAccount.task = record.task;
        testAccount.comment = record.comment;
        testAccount.answersTrue = record.answersTrueL;
        testAccount.answersFalse = record.answersFalseL;
        testAccount.needUpdate = false;
        return testAccount;
    }

    static CreateEmptyTest(unit, fork, i){
        const testAccount = new TestAccount(unit, fork);
        testAccount.testId = i.toString() + '@' + testAccount.fork_unitId;;
        testAccount.task = 'Enter task here!';
        testAccount.comment = '';
        testAccount.answersTrue = ['+Correct answer here'];
        testAccount.answersFalse = ['-Wrong answer here'];
        testAccount.needUpdate = true;
    }
}