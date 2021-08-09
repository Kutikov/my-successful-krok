class TestItem{

    constructor(){
        this.task = "Task text";
        this.comment = "Comment text";
        this.ansT1 = "Answer 1";
        this.ansV1 = true;
        this.ansT2 = "Answer 2";
        this.ansV2 = false;
        this.ansT3 = "Answer 3";
        this.ansV3 = false;
        this.ansT4 = "Answer 4";
        this.ansV4 = false;
        this.ansT5 = "Answer 5";
        this.ansV5 = false;
        this.ansT6 = "";
        this.ansV6 = false;
    }

    static PrepareEdit(props, contentL){
        document.getElementById('testItemEditorHolder').style.display = 'block';
        for(let i = 1; i < 7; i++){
            document.getElementById('testItem_ansT' + i.toString()).addEventListener('input', function() {
                currentPresenter.OnEditAction(null, null);
            });
            document.getElementById('testItem_ansT' + i.toString()).value = props["ansT" + i.toString()];
            document.getElementById('testItem_ansV' + i.toString()).addEventListener('click', function() {
                currentPresenter.OnEditAction(null, null);
            });
            document.getElementById('testItem_ansV' + i.toString()).checked = props["ansV" + i.toString()];
        }
        document.getElementById('testItem_task').addEventListener('input', function() {
            currentPresenter.OnEditAction(null, null);
        });
        document.getElementById('testItem_task').value = props.task;
        document.getElementById('testItem_comment').addEventListener('input', function() {
            currentPresenter.OnEditAction(null, null);
        });
        document.getElementById('testItem_comment').value = props.comment;
    }

    static OnEditAction(tempProps, id = null, message = null){
        tempProps.task = document.getElementById('testItem_task').value;
        tempProps.comment = document.getElementById('testItem_comment').value;
        for(let i = 1; i < 7; i++){
            tempProps['ansT' + i.toString()] =  document.getElementById('testItem_ansT' + i.toString()).value;
            tempProps['ansV' + i.toString()] = document.getElementById('testItem_ansV' + i.toString()).checked;
        }
    }

    static Save(presenter){
        const testItem_task = presenter.tempProps.testItem_task != '';
        let trueAns = false;
        let emptyAns = false;
        for(let i = 1; i < 3; i++){
            if(document.getElementById('testItem_ansT' + i.toString()).value == ''){
                emptyAns = true;
                break;
            }
            if(document.getElementById('testItem_ansV' + i.toString()).checked){
                trueAns = true;
            }
        }
        return testItem_task && !emptyAns && trueAns;
    }

    static Draw(props, contentL){
        while (contentL.firstChild) {
            contentL.removeChild(contentL.lastChild);
        }
        const card = document.createElement('div');
        card.classList.add('infocard');
        card.classList.add('test_item_card');
        const task = document.createElement('p');
        task.classList.add('par__text');
        task.classList.add('par__textStyle_n');
        task.classList.add('par__textAlign_jf');
        task.classList.add('par__size_m');
        task.style.color = "#000";
        task.innerText = props.task;
        card.append(task);
        for(let i = 1; i < 7; i++){
            if(props["ansT" + i.toString()] != ''){
                const answer = document.createElement('p');
                answer.classList.add('par__text');
                answer.classList.add('par__textStyle_n');
                answer.classList.add('par__textAlign_jf');
                answer.classList.add('par__size_m');
                answer.classList.add(props['ansV' + i.toString()] ? 'ans__correct' : 'ans__wrong');
                answer.innerText = props["ansT" + i.toString()];
                card.append(answer);
            }
        }
        if(props.comment != ''){
            const comment = document.createElement('p');
            comment.classList.add('par__text');
            comment.classList.add('par__textStyle_n');
            comment.classList.add('par__textAlign_jf');
            comment.classList.add('par__size_m');
            comment.style.color = "#333";
            comment.innerText = props.comment;
            card.append(comment);
        }
        contentL.appendChild(card);
    }
}