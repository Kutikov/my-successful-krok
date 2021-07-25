class LinkP{
    constructor(){
        this.url = 'https://google.com.ua';
        this.text = 'Enter link description';
        this.isLocker = false;
    }

    static PrepareEdit(props, contentL){
        document.getElementById('linkEditorHolder').style.display = 'block';
        document.getElementById('linkTextEditTextArea').addEventListener('input', function() {
            currentPresenter.OnEditAction(null, null);
        });
        document.getElementById('linkTextEditTextArea').value = props.text;
        document.getElementById('linkUrlEditTextArea').addEventListener('input', function() {
            currentPresenter.OnEditAction(null, null);
        });
        document.getElementById('linkUrlEditTextArea').value = props.url;
        document.getElementById('checkboxLockUrl').checked = props.isLocker;
    }
    static OnEditAction(tempProps, id = null, message = null){
        tempProps.text =  document.getElementById('linkTextEditTextArea').value;
        tempProps.url =  document.getElementById('linkUrlEditTextArea').value;
        tempProps.isLocker = document.getElementById('checkboxLockUrl').checked;
    }

    static Save(presenter){
        const url = presenter.tempProps.url == '';
        const text = presenter.tempProps.text == '';
        if(url){
            presenter.tempProps.isLocker = document.getElementById('checkboxLockUrl').checked;
        }
        return url && text;
    }

    static Draw(props, contentL){
        while (contentL.firstChild) {
            contentL.removeChild(contentL.lastChild);
        }
        const card = document.createElement('div');
        const icon = document.createElement('p');
        const link = document.createElement('a');
        link.innerText = props.text;
        link.href = props.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        card.classList.add('infocard');
        card.classList.add('infocard__color_Blue_Gray');
        icon.innerText = 'link';
        icon.classList.add('material-icons');
        icon.classList.add('infocard__icon');
        link.classList.add('infocard__text');
        link.classList.add('par__text');
        link.classList.add('par__textStyle_n');
        link.classList.add('par__textAlign_jf');
        link.classList.add('par__size_m');
        link.style.color = '#37474f';
        card.appendChild(icon);
        card.appendChild(link);
        contentL.appendChild(card);
    }
}