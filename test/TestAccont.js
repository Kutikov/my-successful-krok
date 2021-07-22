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
        return testAccount;
    }

    GetTestEdit(){
        this.answerTextArray = [];
        this.content = document.getElementById('testEditTemplate').content;
        this.answersList = this.content.getElementById('answersList');
        this.content.getElementById('createAnswerButton').addEventListener('click', () => {
            this.GetAnswerEditCard('Wrong answer here', false);
            texts = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
                return new mdc.textField.MDCTextField(el);
            });
            ripples = [].map.call(document.querySelectorAll(selector), function(el) {
                return new mdc.ripple.MDCRipple(el);
            });
        });
        this.content.getElementById('taskEditTextArea').value = this.task;
        this.content.getElementById('commentEditTextArea').value = this.comment;
        for(let i = 0; i < this.answersTrue.length; i++){
            this.GetAnswerEditCard(this.answersTrue[i].substring(1, this.answersTrue[i].length), true);
        }
        for(let i = 0; i < this.answersFalse.length; i++){
            this.GetAnswerEditCard(this.answersFalse[i].substring(1, this.answersFalse[i].length), false);
        }
        dialogContent.appendChild(this.content);
        dialogTitle.innerText = 'Изменить тест'
        texts = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
            return new mdc.textField.MDCTextField(el);
        });
        ripples = [].map.call(document.querySelectorAll(selector), function(el) {
            return new mdc.ripple.MDCRipple(el);
        });
    }

    GetAnswerEditCard(answer = '', correct){
        let answerEditTemplate = document.getElementById('answerEditTemplate');
        const id = 'answerCard' + this.answerTextArray.length;
        const contentL = answerEditTemplate.content.cloneNode(true);
        if(correct){
            contentL.querySelector('.mdc-checkbox__native-control').click();
        }
        contentL.querySelector('.mdc-card').id = id;
        contentL.querySelector('.mdc-text-field__input').value = answer;
        contentL.querySelector('.mdc-icon-button').addEventListener('click', () => {
            this.answersList.removeChild(document.getElementById(id));
            const index = this.answerTextArray.indexOf(id);
            if(index > -1){
                this.answerTextArray.splice(index, 1);
            }
        });
        this.answerTextArray.push(id);
        this.answersList.appendChild(contentL);
    }

    SaveTest(){
        if(document.getElementById('taskEditTextArea').value == ''){
            return false;
        }
        if(this.answerTextArray.length == 0){
            return false;
        }
        let foundTrueAnswer = false;
        for(let i = 0; i < this.answerTextArray.length; i++){
            const card = document.getElementById(this.answerTextArray[i]);
            if(card.querySelector('.mdc-text-field__input').value == ''){
                return false;
            }
            if(card.querySelector('.mdc-checkbox__native-control').checked){
                foundTrueAnswer = true;
            }
        }
        if(!foundTrueAnswer){
            return false;
        }
        this.task = document.getElementById('taskEditTextArea').value;
        this.comment = document.getElementById('commentEditTextArea').value;
        this.answersFalse = [];
        this.answersTrue = [];
        for(let i = 0; i < this.answerTextArray.length; i++){
            const card = document.getElementById(this.answerTextArray[i]);
            if(card.querySelector('.mdc-checkbox__native-control').checked){
                this.answersTrue.push('+' + card.querySelector('.mdc-text-field__input').value);
            }
            else{
                this.answersFalse.push('-' + card.querySelector('.mdc-text-field__input').value);
            }
        }
        this.needUpdate = true;
        dialogContent.innerHtml = '';
        this.content = null;
        this.answersList = null;
        this.answerTextArray = [];
        return true;
    }
}