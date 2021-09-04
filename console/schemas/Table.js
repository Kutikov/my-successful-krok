class Table{

    static BucketInitial = '!';
    static ModuleInitial = '    ?';
    static UnitInitial = '        +';
    static TableInitial = '#?';
    static TablePInitial = '#!';


    constructor(tableName){
        this.tableName = tableName;
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

    static Decode(tableName, record){
        const table = new Table(tableName);
        table.yaml = record.yaml;
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

}