class Presenter{

    static presenterType = {
        file: 'file',
        image: 'image',
        infocard: 'infocard',
        link: 'link',
        paragraph: 'paragraph',
        testprogram: 'testprogram',
        video: 'video'
    }

    constructor(unit, fork){
        this.unitId = unit.replace(' ', 'Ø');
        this.forkId = fork.replace(' ', 'Ø');
        this.fork_unitId = this.unitId + '@' + this.forkId;
        this.presenterId = '';
        this.presenterType = '';
        this.presenterProps = {};
        this.needUpdate = false;

        this.tempType = '';
        this.tempProps = {};
    }

    GetFirebaseObject(){
        return {
            unitId: this.unitId,
            forkId: this.forkId,
            fork_unitId: this.fork_unitId,
            presenterType: this.presenterType,
            presenterProps: window.btoa(JSON.stringify(this.presenterProps))
        };
    }

    static ReDraw(){
        while (testListMainPage.firstChild) {
            testListMainPage.removeChild(testListMainPage.lastChild);
        }
        for(let i = 0; i < currentPresenterArray.length; i++){
            currentPresenterArray[i].GetPresenterCard(i);
        }
    }

    GetPresenterCard(order){
        const id = 'presenterCardM' + order;
        const props = this.presenterProps;
        const contentL = document.getElementById('testCardTemplate').content.cloneNode(true);
        const image_actions = contentL.querySelectorAll('.mdc-card__action--icon')
        contentL.querySelector('.mdc-card').id = id;
        const holder = contentL.querySelector('.card__presenter_holder');
        switch(this.presenterType){
            case Presenter.presenterType.paragraph:
                Paragraph.Draw(props, holder);
                break;
            case Presenter.presenterType.file:
                FileP.Draw(props, holder);
                break;
            case Presenter.presenterType.link:
                LinkP.Draw(props, holder);
                break;
            case Presenter.presenterType.infocard:
                InfoCard.Draw(props, holder);
                break;
            case Presenter.presenterType.video:
                VideoP.Draw(props, holder);
                break;
            case Presenter.presenterType.testprogram:
                TestProgram.Draw(props, holder);
                break;
            case Presenter.presenterType.image:
                ImageP.Draw(props, holder);
                break;
        }
        contentL.querySelector('.mdc-card__action--button').addEventListener('click', () => {
            currentPresenterAccount = this;
            dialog.open();
            this.GetPresenterEdit();
        });
        image_actions[0].addEventListener('click', () => {
            const parent = document.getElementById(id).parentNode;
            let index = 0;
            for(let i = 0; i < parent.childNodes.length; i++){
                if(parent.childNodes[i].id == id){
                    index = (i - 1) / 2;
                    break;
                }
            }
            currentPresenterArray.splice(index, 1);
            Presenter.ReDraw();
            saveButton.disabled = false;
        });
        image_actions[1].addEventListener('click', () => {
            const parent = document.getElementById(id).parentNode;
            let index = 0;
            for(let i = 0; i < parent.childNodes.length; i++){
                if(parent.childNodes[i].id == id){
                    index = (i - 1) / 2;
                    break;
                }
            }
            if(index > 0){
                Presenter.arraymove(currentTestArray, index, index - 1);
                Presenter.ReDraw();
                saveButton.disabled = false;
            }            
        });
        image_actions[2].addEventListener('click', () => {
            const parent = document.getElementById(id).parentNode;
            let index = 0;
            for(let i = 0; i < parent.childNodes.length; i++){
                if(parent.childNodes[i].id == id){
                    index = (i - 1) / 2;
                    break;
                }
            }
            if(index < parent.childNodes.length - 1){
                Presenter.arraymove(currentPresenterArray, index, index + 1);
                Presenter.ReDraw();
                saveButton.disabled = false;
            }
        });
        testListMainPage.appendChild(contentL);
        ripples = [].map.call(document.querySelectorAll(selector), function(el) {
            return new mdc.ripple.MDCRipple(el);
        });

    }

    static arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }

    SavePresenter(){
        let allowSaving = false;
        switch(this.tempType){
            case Presenter.presenterType.paragraph:
                allowSaving = Paragraph.Save(this);
                break;
            case Presenter.presenterType.file:
                allowSaving = FileP.Save(this);
                break;
            case Presenter.presenterType.link:
                allowSaving = LinkP.Save(this);
                break;
            case Presenter.presenterType.infocard:
                allowSaving = InfoCard.Save(this);
                break;
            case Presenter.presenterType.video:
                allowSaving = VideoP.Save(this);
                break;
            case Presenter.presenterType.testprogram:
                allowSaving = TestProgram.Save(this);
                break;
            case Presenter.presenterType.image:
                allowSaving = ImageP.Save(this);
                break;
        }
        if(!allowSaving){
            return false;
        }
        this.presenterType = this.tempType;
        this.needUpdate = true;
        return true;
    }

    Decode(presenterId, record){
        const presenter = new Presenter(record.unitId, record.forkId);
        presenter.presenterId = presenterId;
        presenter.presenterType = record.presenterType;
        presenter.presenterProps = JSON.parse(window.atob(record.presenterProps));
        return presenter;
    }

    static CreateEmptyPresenter(unit, fork, i){
        const presenter = new Presenter(unit, fork);
        presenter.presenterId = i.toString() + '@' + presenter.fork_unitId;
        presenter.presenterType = Presenter.presenterType.paragraph;
        presenter.presenterProps = new Paragraph();
        presenter.needUpdate = true;
        return presenter;
    }

    GetPresenterEdit(){
        const typeSelector = document.getElementById('type-selected-text');
        typeSelector.addEventListener("DOMSubtreeModified", (i) => {
            this.PrepareEdit(typeSelector.innerText);
        });
        typeSelector.innerText = this.presenterType;
        texts = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
            return new mdc.textField.MDCTextField(el);
        });
        ripples = [].map.call(document.querySelectorAll(selector), function(el) {
            return new mdc.ripple.MDCRipple(el);
        });
    }

    OnEditAction(id = null, message = null){
        const previewHolder = document.getElementById('previewHolder');
        switch(this.tempType){
            case Presenter.presenterType.paragraph:
                    Paragraph.OnEditAction(this.tempProps, id, message);
                    Paragraph.Draw(this.tempProps, previewHolder);
                    break;
                case Presenter.presenterType.file:
                    FileP.OnEditAction(this.tempProps, id, message);
                    FileP.Draw(this.tempProps, previewHolder);
                    break;
                case Presenter.presenterType.link:
                    LinkP.OnEditAction(this.tempProps, id, message);
                    LinkP.Draw(this.tempProps, previewHolder);
                    break;
                case Presenter.presenterType.infocard:
                    InfoCard.OnEditAction(this.tempProps, id, message);
                    InfoCard.Draw(this.tempProps, previewHolder);
                    break;
                case Presenter.presenterType.video:
                    VideoP.OnEditAction(this.tempProps, id, message);
                    VideoP.Draw(this.tempProps, previewHolder);
                    break;
                case Presenter.presenterType.testprogram:
                    TestProgram.OnEditAction(this.tempProps, id, message);
                    TestProgram.Draw(this.tempProps, previewHolder);
                    break;
                case Presenter.presenterType.image:
                    ImageP.OnEditAction(this.tempProps, id, message);
                    ImageP.Draw(this.tempProps, previewHolder);
                    break;
        }
    }

    PrepareEdit(type, contentL){
        const previewHolder = document.getElementById('previewHolder');
        
        document.getElementById('iconsEditorHolder').style.display = 'none';
        document.getElementById('linkEditorHolder').style.display = 'none';
        document.getElementById('paragraphEditorHolder').style.display = 'none';


        this.tempType = type;
        if(type == this.presenterType){
            this.tempProps = JSON.parse(JSON.stringify(this.presenterProps));
        }
        else{
            switch(type){
                case Presenter.presenterType.paragraph:
                    this.tempProps = new Paragraph();
                    break;
                case Presenter.presenterType.file:
                    this.tempProps = new FileP();
                    break;
                case Presenter.presenterType.link:
                    this.tempProps = new LinkP();
                    break;
                case Presenter.presenterType.infocard:
                    this.tempProps = new InfoCard();
                    break;
                case Presenter.presenterType.video:
                    this.tempProps = new VideoP();
                    break;
                case Presenter.presenterType.testprogram:
                    this.tempProps = new TestProgram();
                    break;
                case Presenter.presenterType.image:
                    this.tempProps = new ImageP();
                    break;
            }
        }
        const props = this.tempProps;
        switch(type){
            case Presenter.presenterType.paragraph:
                Paragraph.PrepareEdit(props, contentL);
                Paragraph.Draw(props, previewHolder);
                break;
            case Presenter.presenterType.file:
                FileP.PrepareEdit(props, contentL);
                FileP.Draw(props, previewHolder);
                break;
            case Presenter.presenterType.link:
                LinkP.PrepareEdit(props, contentL);
                LinkP.Draw(props, previewHolder);
                break;
            case Presenter.presenterType.infocard:
                InfoCard.PrepareEdit(props, contentL);
                InfoCard.Draw(props, previewHolder);
                break;
            case Presenter.presenterType.video:
                VideoP.PrepareEdit(props, contentL);
                VideoP.Draw(props, previewHolder);
                break;
            case Presenter.presenterType.testprogram:
                TestProgram.PrepareEdit(props, contentL);
                TestProgram.Draw(props, previewHolder);
                break;
            case Presenter.presenterType.image:
                ImageP.PrepareEdit(props, contentL);
                ImageP.Draw(props, previewHolder);
                break;
        }
    }
}