class Table{

    static BucketInitial = '!';
    static ModuleInitial = '    ?';
    static UnitInitial = '        +';
    static TableInitial = '#?';
    static TablePInitial = '#!';
    static LinkInitial = '*';


    constructor(tableName){
        this.tableName = tableName;
        this.tableId = tableName.replace(/ /g, 'ø');
        this.links = [
            {text: '', url: ''},
            {text: '', url: ''},
            {text: '', url: ''}
        ];
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
        Table.YamlToObjects(record.yaml, table);
        return table;
    }

    static YamlToObjects(yaml, tableOut){
        const table = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        const links = [
            {text: '', url: ''},
            {text: '', url: ''},
            {text: '', url: ''}
        ];
        const lines = yaml.split('\n');
        let row = 0;
        for(let i = 0; i < lines.length; i++){
            if(lines[i].startsWith(Table.TableInitial) || lines[i].startsWith(Table.TablePInitial)){
                const cells = lines[i].replace(Table.TableInitial, '').replace(Table.TablePInitial, '').split('|');
                for(let column = 0; column < cells.length; column++){
                    if(cells[column] != '' && cells[column] != '_'){
                        if(table[row][column] == null){
                            table[row][column] = {
                                text: "text",
                                svg: "svg"
                            };
                        }
                        if(lines[i].startsWith(Table.TableInitial)){
                            table[row][column].text = cells[column];
                        }
                        else if(lines[i].startsWith(Table.TablePInitial)){
                            table[row][column].svg = cells[column];
                        }
                    }
                }
                row++;
                if(row == table.length){
                    row = 0;
                }
            }
            else if(lines[i].startsWith(Table.LinkInitial)){
                const obj = lines[i].replace(Table.LinkInitial, '').split('|');
                links[row] = {
                    text: obj[0],
                    url: obj[1]
                }
                row++;
                if(row == links.length){
                    row = 0;
                }
            }
        }
        tableOut.table = table;
        tableOut.links = links;
    }

    ObjectsToYaml(modulesArray){
        let objYaml = Table.BucketInitial + this.tableName + '\n';
        let tableYaml = '\n';
        let tablePYaml = '\n';
        let linksYaml = '\n';
        for(let i = 0; i < this.table.length; i++){
            tableYaml = tableYaml + '\n' + Table.TableInitial;
            tablePYaml = tablePYaml + '\n' + Table.TablePInitial;
            for(let j = 0; j < this.table[i].length; j++){
                if(this.table[i][j] != null){
                    objYaml = objYaml + Table.ModuleInitial + this.table[i][j].text + '\n';
                    tableYaml = tableYaml + this.table[i][j].text + '|';
                    tablePYaml = tablePYaml + this.table[i][j].svg + '|';
                    for(let k = 0; k < forksArray.length; k++){
                        if(modulesArray[k].forkName == this.table[i][j].text){
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
        for(let d = 0; d < 3; d++){
            linksYaml = linksYaml + '\n' + Table.LinkInitial + this.links[d].text + '|' + this.links[d].url;
        }
        this.yaml = objYaml + tableYaml + tablePYaml + linksYaml;
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
        updateDesign();
        for(let i = 0; i < this.table.length; i++){
            for(let j = 0; j < this.table[i].length; j++){
                const address = i.toString() + "_" + j.toString();
                const module = this.table[i][j];
                document.getElementById('select' + address).innerText = module == null ? '-' : module.text
            }
        }
        for(let i = 0; i < this.links.length; i++){
            Table.DrawLink(this.links, i);
        }
    }

    static DrawLink(links, order){
        const descrInput = document.getElementById('link' + (order + 1).toString() + 'descr');
        const urlInput = document.getElementById('link' + (order + 1).toString() + 'url');
        descrInput.value = links[order].text;
        urlInput.value = links[order].url;
        descrInput.addEventListener('input', function(){
            saveButton.disabled = false;
            if(descrInput.value != ''){
                links[order] = {
                    text: descrInput.value,
                    url: urlInput.value
                };
            }
            else if(urlInput.value != ''){
                urlInput.value = '';
                links[order] = {
                    text: '',
                    url: ''
                };
            }
        });
        urlInput.addEventListener('input', function(){
            saveButton.disabled = false;
            if(descrInput.value != '' && urlInput.value != ''){
                links[order].url = urlInput.value;
            }
            else if(urlInput.value != ''){
                urlInput.value = '';
            }
        });
    }

    static DrawCell(modulesArray, address, table){
        const row = Number(address.split('_')[0]);
        const column = Number(address.split('_')[1]);
        const defaultEmptySVG = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                </svg>`;
        const defaultNonEmptySVG = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M20,17A2,2 0 0,0 22,15V4A2,2 0 0,0 20,2H9.46C9.81,2.61 10,3.3 10,4H20V15H11V17M15,7V9H9V22H7V16H5V22H3V14H1.5V9A2,2 0 0,1 3.5,7H15M8,4A2,2 0 0,1 6,6A2,2 0 0,1 4,4A2,2 0 0,1 6,2A2,2 0 0,1 8,4Z" />
                                    </svg>`;
        const contentL = document.getElementById('cellCardTemplate').content.cloneNode(true);
        const svgImage = contentL.querySelector('.cell_icon');
        const svgInput = contentL.querySelector('.mdc-text-field__input');
        const modulesList = contentL.querySelector('.mdc-list');
        const moduleSelect = contentL.querySelector('.mdc-select__selected-text');
        svgInput.id = 'svgInput' + address;
        moduleSelect.id = 'select' + address;
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
            if(moduleSelect.innerText == '-' || moduleSelect.innerText == ''){
                table[row][column] = null;
                svgInput.value = '';
                svgInput.dispatchEvent(new Event('input'));
            }
            else{
                if(table[row][column] != null){
                    table[row][column].text = moduleSelect.innerText;
                }
                else{
                    table[row][column] = {
                        text: moduleSelect.innerText,
                        svg: defaultNonEmptySVG
                    };
                }
                svgInput.value = table[row][column].svg;
                svgInput.dispatchEvent(new Event('input'));
            }
        });
        svgInput.addEventListener('input', function(){
            let outer = '';
            const lines = svgInput.value.split('\n');
            for(let i = 0; i < lines.length; i++){
                outer = outer + lines[i].trim();
            }
            svgInput.value = outer;
            saveButton.disabled = false;
            if(moduleSelect.innerText == '-'){
                if(svgImage.innerHTML != defaultEmptySVG){
                    svgImage.innerHTML = defaultEmptySVG;
                    svgInput.value = '';
                }
            }
            else if(moduleSelect.innerText == ''){

            }
            else{
                if(table[row][column] != null){
                    table[row][column].svg = svgInput.value;
                }
                svgImage.innerHTML = svgInput.value;
            }
            svgImage.firstChild.removeAttribute("style");
        });
        return contentL;
    }
}