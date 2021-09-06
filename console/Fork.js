class Fork{
    static Editor_modes = {
        tests: 'tests',
        presenters: 'presenters',
        forks: 'forks',
        tables: 'tables',
        modules: 'modules'
    }    
    static AddNewModuleString = 'Добавить новый модуль'
    Spec = {
        LECH: "LECH",
        STOM: "STOM",
        FARM: "FARM",
        NURS: "NURS",
        OBST: "OBST",
        PROF: "PROF",
        LABD: "LABD",
        PSYC: "PSYC",
        CLFR: "CLFR",
        COSM: "COSM",
        UNDF: "UNDF"
    }

    Stage = {
        K1: "K1",
        K2: "K2",
        K3: "K3",
        KM: "KM",
        KB: "KB",
        UD: "UD"
    }
    
    Var = {
        BOOKLET: "BOOKLET",
        BoT: "BoT",
        UNDEFINED: "UNDEFINED"
    }

    Rate = {
        official: "official",
        approved: "approved",
        alternative: "alternative"
    }

    constructor(name, author){
        this.extensionRate = '';
        this.extensionVar = '';
        this.extensionStage = '';
        this.extensionSpec = '';
        this.name = name;
        this.language = '';
        this.testCount = 0;
        this.presentersCount = 0;
        this.author = author;
        this.isPremium = false;
        this.needUpdate = false; 
    }

    GetFirebaseObject(){
        return {
            extensionRate: this.extensionRate,
            extensionVar: this.extensionVar,
            extensionStage: this.extensionStage,
            extensionSpec: this.extensionSpec,
            language: this.language,
            testCount: this.testCount,
            presentersCount: this.presentersCount,
            author: this.author,
            isPremium: this.isPremium
        };
    }

    static Decode(forkId, record){
        const fork = new Fork(forkId, record.author);
        fork.extensionRate = record.extensionRate;
        fork.extensionVar = record.extensionVar;
        fork.extensionStage = record.extensionStage;
        fork.extensionSpec = record.extensionSpec;
        fork.language = record.language;
        fork.testCount = record.testCount;
        fork.presentersCount = record.presentersCount;
        fork.isPremium = record.isPremium;
        fork.needUpdate = false;
        return fork;
    }

    static CreateFork(){
        const contentL = document.getElementById('textinputTemplate').content.cloneNode(true);
        dialogTitle.innerText = 'Введите имя нового модуля';
        currentFork = new Fork('New module', author);
        contentL.querySelector('.mdc-text-field__input').value = 'New module';
        dialogContent.appendChild(contentL);
        dialog.open();
    }

    SaveFork(){
        const tempName = dialogContent.querySelector('.mdc-text-field__input').value;
        if(tempName == ''){
            dialogContent.querySelector('.negative__answer').innerText = 'Пустое имя модуля!';
            return false;
        }
        else{
            let foundDuplicate = false;
            for(let i = 0; i < forksArray.length; i++){
                if(forksArray[i].name == tempName){
                    foundDuplicate = true;
                }
            }
            if(foundDuplicate){
                dialogContent.querySelector('.negative__answer').innerText = 'Имя не уникально!';
                return false;
            }
            else{
                currentFork.name = tempName;
                currentFork.needUpdate = true;
                forksArray.push(currentFork);
                firebaseApi.writeForks();
                //firebaseApi.readUnits(currentFork);
                //Fork.DrawForks();
                drawUnitsAndForks();
                return true;
            }
        }
    }

    static DrawForks(){
        document.getElementById('forks-selected-text').addEventListener("DOMSubtreeModified", (i) => {
            if(document.getElementById('forks-selected-text').innerText != this.AddNewModuleString){
                for(let i = 0; i < forksArray.length; i++){
                    if(forksArray[i].name == document.getElementById('forks-selected-text').innerText){
                        document.getElementById('units-selected-text').innerText ='';
                        saveButton.disabled = true;
                        fab.classList.add('mdc-fab--exited');
                        currentFork = forksArray[i];
                        currentUnit = null;
                        if(EDITOR_MODE == Fork.Editor_modes.tests){
                            currentTestArray = [];
                            while (testListMainPage.firstChild) {
                                testListMainPage.removeChild(testListMainPage.lastChild);
                            }
                        }
                        else if(EDITOR_MODE == Fork.Editor_modes.presenters){
                            currentPresenterArray = [];
                            while (testListMainPage.firstChild) {
                                testListMainPage.removeChild(testListMainPage.lastChild);
                            }
                        }
                        firebaseApi.readUnits(forksArray[i]);
                        break;
                    }
                }
            }
            else{
                this.CreateFork();
            }
        });
        const forksList = document.getElementById('forksList');
        while (forksList.firstChild) {
            forksList.removeChild(forksList.lastChild);
        }
        for(let i = 0; i < forksArray.length; i++){
            const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
            listItem.querySelector('.mdc-list-item__text').innerText = forksArray[i].name;
            listItem.querySelector('.mdc-list-item').dataset.value = forksArray[i].name;
            forksList.appendChild(listItem);
        }
        const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
        listItem.querySelector('.mdc-list-item__text').innerText = this.AddNewModuleString;
        listItem.querySelector('.mdc-list-item').dataset.value = this.AddNewModuleString;
        forksList.appendChild(listItem);
    }
}