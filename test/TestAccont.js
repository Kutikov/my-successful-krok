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
        testAccount.task = 'Enter task here!' + Math.random().toString();
        testAccount.comment = '';
        testAccount.answersTrue = ['+Correct answer here'];
        testAccount.answersFalse = ['-Wrong answer here'];
        testAccount.needUpdate = true;
        return testAccount;
    }


    GetTestCard(order){
        this.answerTextArray = [];
        const id = 'answerCardM' + order;
        const contentL = document.getElementById('testCardTemplate').content.cloneNode(true);
        const answersList = contentL.querySelector('.card__answers_list');
        const image_actions = contentL.querySelectorAll('.mdc-card__action--icon')
        contentL.querySelector('.mdc-card').id = id;
        contentL.querySelector('.card__task').innerText = this.task;
        if(this.comment != ''){
            contentL.querySelector('.card__comment').innerText = this.comment;
        }
        else{
            contentL.querySelector('.card__comment').style.display = 'none';
        }
        contentL.querySelector('.mdc-card__action--button').addEventListener('click', () => {
            currentTestAccount = this;
            dialog.open();
            this.GetTestEdit();
        });
        for(let i = 0; i < this.answersTrue.length; i++){
            const answerP = document.getElementById('answerCardPositiveTemplate').content.cloneNode(true);
            answerP.querySelector('.card__answer').innerText = this.answersTrue[i].substring(1, this.answersTrue[i].length);
            answersList.appendChild(answerP);
        }
        for(let i = 0; i < this.answersFalse.length; i++){
            const answerP = document.getElementById('answerCardNegativeTemplate').content.cloneNode(true);
            answerP.querySelector('.card__answer').innerText = this.answersFalse[i].substring(1, this.answersFalse[i].length);
            answersList.appendChild(answerP);
        }
        image_actions[0].addEventListener('click', () => {
            testListMainPage.removeChild(document.getElementById(id));
        });
        image_actions[1].addEventListener('click', () => {
            const parent = document.getElementById(id).parentNode;
            let index = 0;
            for(let i = 0; i < parent.childNodes.length; i++){
                if(parent.childNodes[i].id == id){
                    index = i;
                    break;
                }
            }
            if(index > 0){
                parent.insertBefore(document.getElementById(id), parent.childNodes[index - 1]);
            }
        });
        image_actions[2].addEventListener('click', () => {
            const parent = document.getElementById(id).parentNode;
            let index = 0;
            for(let i = 0; i < parent.childNodes.length; i++){
                if(parent.childNodes[i].id == id){
                    index = i;
                    break;
                }
            }
            if(index < parent.childNodes.length - 1){
                parent.insertBefore(parent.childNodes[index + 1], document.getElementById(id));
            }
        });
        testListMainPage.appendChild(contentL);
        ripples = [].map.call(document.querySelectorAll(selector), function(el) {
            return new mdc.ripple.MDCRipple(el);
        });
    }

    GetTestEdit(){
        this.answerTextArray = [];
        const contentL = document.getElementById('testEditTemplate').content.cloneNode(true);
        this.answersList = contentL.getElementById('answersList');
        contentL.getElementById('createAnswerButton').addEventListener('click', () => {
            this.GetAnswerEditCard('Wrong answer here', false);
            texts = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
                return new mdc.textField.MDCTextField(el);
            });
            ripples = [].map.call(document.querySelectorAll(selector), function(el) {
                return new mdc.ripple.MDCRipple(el);
            });
        });
        contentL.getElementById('taskEditTextArea').value = this.task;
        contentL.getElementById('commentEditTextArea').value = this.comment;
        for(let i = 0; i < this.answersTrue.length; i++){
            this.GetAnswerEditCard(this.answersTrue[i].substring(1, this.answersTrue[i].length), true);
        }
        for(let i = 0; i < this.answersFalse.length; i++){
            this.GetAnswerEditCard(this.answersFalse[i].substring(1, this.answersFalse[i].length), false);
        }
        dialogContent.appendChild(contentL);
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
            document.querySelector('.card__text.negative__answer').innerText = "Нет текста задания";
            return false;
        }
        if(this.answerTextArray.length == 0){
            document.querySelector('.card__text.negative__answer').innerText = "Нет щтветов";
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
            document.querySelector('.card__text.negative__answer').innerText = "Нет правильного ответа";
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
        this.answersList = null;
        this.answerTextArray = [];
        return true;
    }
}