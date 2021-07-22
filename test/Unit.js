class Unit{
    static AddNewModuleString = 'Добавить новую лекцию'
    constructor(fork, unit){
        this.unitId = unit.replace(' ', 'Ø');
        this.forkId = fork.name.replace(' ', 'Ø');
        this.fork_unitId = this.unitId + '@' + this.forkId;
        this.testsCount = 0;
        this.needUpdate = false;
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
        fork.needUpdate = true;
        fork.testsCount = fork.testsCount - prevCount + testsArray.length;
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
                firebaseApi.readTests(currentUnit);
                Unit.DrawUnits();
                return true;
            }
        }
    }

    static DrawUnits(){
        document.getElementById('units-selected-text').addEventListener("DOMSubtreeModified", (i) => {
            if(document.getElementById('units-selected-text').innerText != this.AddNewModuleString){
                for(let i = 0; i < currentUnitsArray.length; i++){
                    if(currentUnitsArray[i].unitId.replace('Ø', ' ') == document.getElementById('units-selected-text').innerText){
                        currentUnit = currentUnitsArray[i];
                        firebaseApi.readTests(currentUnitsArray[i]);
                        break;
                    }
                }
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
            listItem.querySelector('.mdc-list-item__text').innerText = currentUnitsArray[i].unitId.replace('Ø', ' ');
            listItem.querySelector('.mdc-list-item').dataset.value = currentUnitsArray[i].unitId.replace('Ø', ' ');
            unitsList.appendChild(listItem);
        }
        const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
        listItem.querySelector('.mdc-list-item__text').innerText = this.AddNewModuleString;
        listItem.querySelector('.mdc-list-item').dataset.value = this.AddNewModuleString;
        unitsList.appendChild(listItem);
    }
}