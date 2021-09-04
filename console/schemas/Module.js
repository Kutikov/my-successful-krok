class Module{
    constructor(forkName){
        this.forkName = forkName;
        this.forkId = forkName.replace(/ /g, 'ø');
        this.list = [];
    }

    GetFirebaseObject(){
        return {
            forkId: this.forkId,
            forkName: this.forkName,
            list: JSON.stringify(this.list)
        };
    }

    static Decode(forkId, record){
        const forkName = forkId.replace(/ø/g, ' ');
        const module = new Module(forkName);
        module.forkId = forkId;
        module.list = JSON.parse(record.list);
        return module;
    }

    static reDecodeModules(forkUnitHolder, modulesArray){
        const newModulesArray = [];
        const forkNamesArray = Object.keys(forkUnitHolder);
        for(let i = 0; i < forkNamesArray.length; i++){
            let found = false;
            if(modulesArray != null){
                for(let j = 0 ; j < modulesArray.length; j++){
                    if(modulesArray[j].forkName == forkNamesArray[i]){
                        found = true;
                        newModulesArray.push(Module.renewModule(forkNamesArray[i], modulesArray[j], forkUnitHolder[forkNamesArray[i]]));
                        break;
                    }
                }
            }
            if(!found){
                newModulesArray.push(Module.renewModule(forkNamesArray[i], null, forkUnitHolder[forkNamesArray[i]]));
            }
        }
        return newModulesArray;
    }

    static renewModule(forkName, prevModule, unitsArray){
        const module = new Module(forkName);
        if(prevModule != null){
            module.list = prevModule.list;
        }
        for(let i = 0; i < unitsArray.length; i++){
            let found = false;
            for(let j = 0; j < module.list.length; j++){
                if(module.list[j].unitName == unitsArray[i].unitName){
                    found = true;
                    break;
                }
            }
            if(!found){
                module.list.push({
                    unitName: unitsArray[i].unitName,
                    fork_unitId: unitsArray[i].fork_unitId,
                    visibility: true,
                    isLocker: false
                });
            }
        }
        return module;
    }

    updateUnit(unitName, visibility, isLocker){
        for(let i = 0; i < this.list.length; i++){
            if(this.list[i].unitName == unitName){
                this.list[i].visibility = visibility;
                this.list[i].isLocker = isLocker;
                break;
            }
        }
    }

    static arraymove(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }

    Draw(){
        for(let i = 0; i < this.list.length; i++){
            const id = 'unitCardM' + i;
            const contentL = document.getElementById('unitCardTemplate').content.cloneNode(true);
            const image_actions = contentL.querySelectorAll('.mdc-card__action--icon');
            const unitText = contentL.querySelector('.card__text');
            unitText.innerText = this.list[i].unitName;
            contentL.querySelector('.mdc-card').id = id;
            image_actions[0].addEventListener('click', () => {
                const visibility = image_actions[0].innerText != 'visibility';
                const isLocker = image_actions[1].innerText != 'lock';
                this.updateUnit(this.list[i], visibility, isLocker);
                unitText.classList.remove('card__unit_disabled');
                unitText.classList.remove('card__unit_locker');
                unitText.classList.remove('card__unit_nonlocker');
                if(visibility){
                    unitText.classList.add(isLocker ? 'card__unit_locker' : 'card__unit_nonlocker');
                }
                else{
                    unitText.classList.add('card__unit_nonlocker');
                }
                image_actions[0].innerText = visibility ? 'visibility' : 'visibility_off';
                image_actions[1].innerText = isLocker ? 'lock' : 'lock_open';
            });
            image_actions[1].addEventListener('click', () => {
                const visibility = image_actions[0].innerText == 'visibility';
                const isLocker = image_actions[1].innerText == 'lock';
                this.updateUnit(this.list[i], visibility, isLocker);
                unitText.classList.remove('card__unit_disabled');
                unitText.classList.remove('card__unit_locker');
                unitText.classList.remove('card__unit_nonlocker');
                if(visibility){
                    unitText.classList.add(isLocker ? 'card__unit_locker' : 'card__unit_nonlocker');
                }
                else{
                    unitText.classList.add('card__unit_nonlocker');
                }
                image_actions[0].innerText = visibility ? 'visibility' : 'visibility_off';
                image_actions[1].innerText = isLocker ? 'lock' : 'lock_open';
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
                if(index > 0){
                    Module.arraymove(currentTestArray, index, index - 1);
                    saveButton.disabled = false;
                    Draw();
                }            
            });
            image_actions[3].addEventListener('click', () => {
                const parent = document.getElementById(id).parentNode;
                let index = 0;
                for(let i = 0; i < parent.childNodes.length; i++){
                    if(parent.childNodes[i].id == id){
                        index = (i - 1) / 2;
                        break;
                    }
                }
                if(index < parent.childNodes.length - 1){
                    Module.arraymove(currentTestArray, index, index + 1);
                    saveButton.disabled = false;
                    Draw();
                }
            });
            testListMainPage.appendChild(contentL);
            ripples = [].map.call(document.querySelectorAll(selector), function(el) {
                return new mdc.ripple.MDCRipple(el);
            });
        }
    }
}