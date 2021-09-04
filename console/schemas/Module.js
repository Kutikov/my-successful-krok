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

    static Decode(forkName, record){
        const module = new Module(forkName);
        module.forkId = record.forkId;
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

    Draw(){

    }
}