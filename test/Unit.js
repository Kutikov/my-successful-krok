class Unit{

    static Editor_modes = {
        tests: 'tests',
        presenters: 'presenters'
    }
    static AddNewModuleString = 'Добавить новую лекцию'
    constructor(fork, unit){
        this.unitId = unit.replace(' ', 'Ø');
        this.forkId = fork.name.replace(' ', 'Ø');
        this.fork_unitId = this.unitId + '@' + this.forkId;
        this.testsCount = 0;
        this.unitName = unit.replace('Ø', ' ');
        this.needUpdate = false;
    }

    GetFirebaseObject(){
        return {
            unitId: this.unitId,
            forkId: this.forkId,
            testsCount: this.testsCount
        };
    }

    static Decode(fork_unitId, record, fork){
        const unit = new Unit(fork, record.unitId);
        unit.fork_unitId = fork_unitId;
        unit.testsCount = record.testsCount;
        unit.needUpdate = false;
        return unit;
    }

    updateTestsCount(testsArray){
        this.needUpdate = true;
        const prevCount = this.testsCount;
        this.testsCount = testsArray.length;
        currentFork.needUpdate = true;
        currentFork.testCount = currentFork.testCount - prevCount + testsArray.length;
    }

    
    static CreateUnit(){
        const contentL = document.getElementById('textinputTemplate').content.cloneNode(true);
        dialogTitle.innerText = 'Введите имя новой лекции';
        currentUnit = new Unit(currentFork, 'New lecture');
        contentL.querySelector('.mdc-text-field__input').value = 'New lecture';
        dialogContent.appendChild(contentL);
        dialog.open();
    }

    SaveUnit(){
        const tempName = dialogContent.querySelector('.mdc-text-field__input').value;
        if(tempName == ''){
            dialogContent.querySelector('.negative__answer').innerText = 'Пустое имя лекции!';
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
                currentUnit.name = tempName;
                currentUnit.needUpdate = true;
                currentUnitsArray.push(currentUnit);
                firebaseApi.writeUnits();
                if(EDITOR_MODE == Unit.Editor_modes.tests){
                    firebaseApi.readTests(currentUnit);
                }
                Unit.DrawUnits();
                return true;
            }
        }
    }

    static DrawUnits(){
        document.getElementById('units-selected-text').addEventListener("DOMSubtreeModified", (i) => {
            const dropdown = document.getElementById('units-selected-text');
            if(dropdown.innerText != this.AddNewModuleString && dropdown.innerText != ''){
                for(let i = 0; i < currentUnitsArray.length; i++){
                    if(currentUnitsArray[i].unitId.replace('Ø', ' ') == dropdown.innerText){
                        currentUnit = currentUnitsArray[i];
                        if(EDITOR_MODE == Unit.Editor_modes.tests){
                            currentTestArray = [];
                            while (testListMainPage.firstChild) {
                                testListMainPage.removeChild(testListMainPage.lastChild);
                            }
                            firebaseApi.readTests(currentUnitsArray[i]);
                        }
                        break;
                    }
                }
            }
            else if(dropdown.innerText == ''){

            }
            else{
                this.CreateUnit();
            }
        });
        const unitsList = document.getElementById('unitsList');
        while (unitsList.firstChild) {
            unitsList.removeChild(unitsList.lastChild);
        }
        for(let i = 0; i < currentUnitsArray.length; i++){
            const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
            listItem.querySelector('.mdc-list-item__text').innerText = currentUnitsArray[i].unitName;
            listItem.querySelector('.mdc-list-item').dataset.value = currentUnitsArray[i].unitName;
            unitsList.appendChild(listItem);
        }
        const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
        listItem.querySelector('.mdc-list-item__text').innerText = this.AddNewModuleString;
        listItem.querySelector('.mdc-list-item').dataset.value = this.AddNewModuleString;
        unitsList.appendChild(listItem);
    }
}