class Table{

    static BucketInitial = '!';
    static ModuleInitial = '    ?';
    static UnitInitial = '        +';
    static TableInitial = '#?';
    static TablePInitial = '#!';


    constructor(tableName){
        this.tableName = tableName;
        this.tableId = tableName.replace(/ /g, 'ø');
        this.yaml = '';
        this.table = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    GetFirebaseObject(){
        this.ObjectsToYaml(modulesArray);
        return {
            tableName: this.tableName,
            yaml: this.yaml
        };
    }

    static Decode(tableId, record){
        const tableName = tableId.replace(/ø/g, ' ');
        const table = new Table(tableName);
        table.yaml = record.yaml;
        table.tableId = tableId;
        table.table = Table.YamlToObjects(record.yaml);
        return table;
    }

    static YamlToObjects(yaml){
        const table = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        const lines = yaml.split('\n');
        for(let i = 0; i < lines.length; i++){
            if(lines.startsWith(Table.TableInitial) || lines.startsWith(Table.TablePInitial)){
                const cells = lines[i].split('|');
                for(let j = 0; j < cells.length; j++){
                    if(cells[j] != '' && cells[j] != '_'){
                        if(table[i][j] == null){
                            table[i][j] = {
                                name: "name",
                                svg: "svg"
                            };
                        }
                        if(lines.startsWith(Table.TableInitial)){
                            table[i][j].name = cells[j];
                        }
                        else if(lines.startsWith(Table.TablePInitial)){
                            table[i][j].svg = cells[j];
                        }
                    }
                }
            }
        }
        return table;
    }

    ObjectsToYaml(modulesArray){
        let objYaml = Table.BucketInitial + this.tableName + '\n';
        let tableYaml = '\n';
        let tablePYaml = '\n';
        for(let i = 0; i < this.table.length; i++){
            tableYaml = tableYaml + '\n' + Table.TableInitial;
            tablePYaml = tablePYaml + '\n' + Table.TablePInitial;
            for(let j = 0; j < this.table[i].length; j++){
                if(this.table[i][j] != null){
                    objYaml = objYaml + Table.ModuleInitial + this.table[i][j].name + '\n';
                    tableYaml = tableYaml + this.table[i][j].name + '|';
                    tablePYaml = tablePYaml + this.table[i][j].svg + '|';
                    for(let k = 0; k < forksArray.length; k++){
                        if(modulesArray[k].forkName == this.table[i][j].name){
                            for(let l = 0; l < modulesArray[k].list.length; l++){
                                const record = modulesArray[k].list[l];
                                if(record.visibility){
                                    objYaml = objYaml + Table.UnitInitial + record.unitName + '|' + record.fork_unitId + '|' + record.isLocker + '\n';
                                }
                            }
                            break;
                        }
                    }
                }
                else{
                    tableYaml = tableYaml + '_|';
                    tablePYaml = tablePYaml + '_|';
                }
            }
        }
        this.yaml = objYaml + tableYaml + tablePYaml;
    }

    static CreateTable(){
        const contentL = document.getElementById('textinputTemplate').content.cloneNode(true);
        dialogTitle.innerText = 'Введите имя новой таблицы';
        contentL.querySelector('.mdc-text-field__input').value = 'New table';
        dialogContent.appendChild(contentL);
        dialog.open();
    }

    static SaveTable(){
        const tempName = dialogContent.querySelector('.mdc-text-field__input').value;
        if(tempName == ''){
            dialogContent.querySelector('.negative__answer').innerText = 'Пустое имя таблицы!';
            return false;
        }
        else{
            let foundDuplicate = false;
            for(let i = 0; i < tablesArray.length; i++){
                if(tablesArray[i].tableName == tempName){
                    foundDuplicate = true;
                }
            }
            if(foundDuplicate){
                dialogContent.querySelector('.negative__answer').innerText = 'Имя не уникально!';
                return false;
            }
            else{
                const table = new Table(tempName);
                tablesArray.push(table);
                firebaseApi.writeTable(table);
                drawUnitsAndForks();
                return true;
            }
        }
    }

    Draw(){
        for(let i = 0; i < this.table.length; i++){
            for(let j = 0; j < this.table[i].length; j++){
                const address = i.toString() + "_" + j.toString();
                const element = Table.DrawCell(modulesArray, address, this.table);
                const targetCell = document.getElementById(address);
                while(targetCell.firstChild){
                    targetCell.removeChild(targetCell.lastChild);
                }
                targetCell.appendChild(element);
            }
        }
    }

    static DrawCell(modulesArray, address, table){
        const row = Number(address.split('_')[0]);
        const column = Number(address.split('_')[1]);
        const module = table[row][column] == null ? null : table[row][column].name;
        const defaultEmptySVG = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                    <path fill="#333" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                </svg>`;
        const defaultNonEmptySVG = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M20,17A2,2 0 0,0 22,15V4A2,2 0 0,0 20,2H9.46C9.81,2.61 10,3.3 10,4H20V15H11V17M15,7V9H9V22H7V16H5V22H3V14H1.5V9A2,2 0 0,1 3.5,7H15M8,4A2,2 0 0,1 6,6A2,2 0 0,1 4,4A2,2 0 0,1 6,2A2,2 0 0,1 8,4Z" />
                                    </svg>`;
                                    
        let svg = defaultEmptySVG;
        if(module != null){
            svg = table[row][column].svg;
        }
        const contentL = document.getElementById('unitCardTemplate').content.cloneNode(true);
        const svgImage = contentL.querySelector('.card__text');
        const svgInput = contentL.querySelector('.mdc-text-field__input');
        const modulesList = contentL.querySelector('.mdc-list');
        const moduleSelect = contentL.querySelector('.mdc-select__selected-text');
        svgInput.id = 'svgInput' + address;
        if(module != null){
            svgInput.innerText = svg;
        }
        for(let i = 0; i < modulesArray.length; i++){
            const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
            listItem.querySelector('.mdc-list-item__text').innerText = modulesArray[i].forkName;
            listItem.querySelector('.mdc-list-item').dataset.value = modulesArray[i].forkName;
            modulesList.appendChild(listItem);
        }
        const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
        listItem.querySelector('.mdc-list-item__text').innerText = '-';
        listItem.querySelector('.mdc-list-item').dataset.value = '-';
        modulesList.appendChild(listItem);

        moduleSelect.addEventListener('DOMSubtreeModified', () => {
            saveButton.disabled = false;
            if(moduleSelect.innerText == '-'){
                table.table[row][column] = null;
                svgInput.value = '';
            }
            else{
                table.table[row][column].name = moduleSelect.innerText;
                if(svgInput.value == ''){
                    svgInput.value = defaultNonEmptySVG;
                }
            }
        });
        svgInput.addEventListener('input', function(){
            saveButton.disabled = false;
            if(moduleSelect.innerText == '-'){
                if(svgInput.value = ''){
                    svgImage.innerHTML = defaultEmptySVG;
                }
                else{
                    svgInput.value = '';
                }
            }
            else{
                table.table[row][column].svg = moduleSelect.innerText;
                svgImage.innerHTML = svgInput.value;
            }
        });

        moduleSelect.innerText = module == null ? '-' : module;
        svgInput.value = svg;
        return contentL;
    }
}