class TestProgram{

    static TestingMode = {
        free: 'free',
        training: 'training',
        control: 'control',
        krok: 'krok'
    }
    constructor(){
        this.text = 'Enter test name';
        this.allowNotesAndImages = true;
        this.mode = TestProgram.TestingMode.free;
        this.testsCount = -1;
        this.startFrom = -1;
        this.finishOn = -1;
        this.mixTests = true;
        this.unit = '';
        this.isLocker = false;
        this.lockerPercent = 0;
    }

    static GetNamedControls(){
        return {
            unitSelector: document.getElementById('testUnit-selected-text'),
            unitList: document.getElementById('testProgramList'),
            nameField: document.getElementById('testProgramTextEditTextArea'),
            radioFree: document.getElementById('radioFree'),
            radioTraining: document.getElementById('radioTraining'),
            radioControl: document.getElementById('radioControl'),
            radioKrok: document.getElementById('radioKrok'),
            checkboxAllowSave: document.getElementById('checkboxAllowSave'),
            checkboxLockerTestProgram: document.getElementById('checkboxLockerTestProgram'),
            testProgramMinPercent: document.getElementById('testProgramMinPercent'),
            testProgramMinPercentHolder: document.getElementById('testProgramMinPercentHolder'),
            checkboxMixTestHolder: document.getElementById('checkboxMixTestHolder'),
            checkboxMixTest: document.getElementById('checkboxMixTest'),
            testProgramFrom: document.getElementById('testProgramFrom'),
            testProgramTo: document.getElementById('testProgramTo'),
            countHolder: document.getElementById('countHolder'),
            randomHolder: document.getElementById('randomHolder'),
            testProgramRand: document.getElementById('testProgramRand')
        }
    }

    static OnEditAction(tempProps, id = null, message = null){
        const adr = TestProgram.GetNamedControls();
        let maxTest = 0;
        tempProps.text = adr.nameField.value;
        tempProps.unit = '';
        tempProps.allowNotesAndImages = adr.checkboxAllowSave.checked;
        const selectedUnit = adr.unitSelector.innerText.split(' (')[0];
        for(let i = 0; i < currentUnitsArray.length; i++){
            if(currentUnitsArray[i].unitName == selectedUnit){
                tempProps.unit = currentUnitsArray[i].fork_unitId;
                maxTest = currentUnitsArray[i].testsCount;
                if(new Number(adr.testProgramRand.value) < 1 && new Number(adr.testProgramRand.value) != -1){
                    adr.testProgramRand.value = '-1';
                }
                if(new Number(adr.testProgramFrom.value) < 1 && new Number(adr.testProgramFrom.value) != -1){
                    adr.testProgramFrom.value = '-1';
                }
                if(new Number(adr.testProgramTo.value) < 1 && new Number(adr.testProgramTo.value) != -1){
                    adr.testProgramTo.value = '-1';
                }
                if(new Number(adr.testProgramRand.value) > maxTest){
                    adr.testProgramRand.value = maxTest.toString();
                }
                if(new Number(adr.testProgramFrom.value) > maxTest - 1){
                    adr.testProgramFrom.value = (maxTest - 1).toString();
                }
                if(new Number(adr.testProgramTo.value) > maxTest){
                    adr.testProgramTo.value = maxTest.toString();
                }
                if(new Number(adr.testProgramFrom.value) > new Number(adr.testProgramTo.value)){
                    adr.testProgramFrom.value = (new Number(adr.testProgramTo.value)).toString();
                }
                break;
            }
        }
        if(new Number(adr.testProgramMinPercent.value) > 95){
            adr.testProgramMinPercent.value = '95';
        }
        if(adr.checkboxLockerTestProgram.checked){
            tempProps.isLocker = true;
            tempProps.lockerPercent = new Number(adr.testProgramMinPercent.value);
            adr.testProgramMinPercentHolder.style.display = 'block';
        }
        else{
            tempProps.isLocker = false;
            tempProps.lockerPercent = 0;
            adr.testProgramMinPercentHolder.style.display = 'none';
        }
        if(adr.radioFree.checked){
            tempProps.mode = TestProgram.TestingMode.free;
            tempProps.testsCount = -1;
            tempProps.startFrom = -1;
            tempProps.finishOn = -1;
            tempProps.mixTests = false;
            adr.randomHolder.style.display = 'none';
            adr.countHolder.style.display = 'none';
            adr.checkboxMixTestHolder.style.display = 'none';
        }
        else if(adr.radioTraining.checked || adr.radioControl.checked){
            if(adr.radioTraining.checked){
                tempProps.mode = TestProgram.TestingMode.training;
            }
            else if(adr.radioControl.checked){
                tempProps.mode = TestProgram.TestingMode.control;
            }
            adr.checkboxMixTestHolder.style.display = 'inline-flex';
            if(adr.checkboxMixTest.checked){
                tempProps.testsCount = new Number(adr.testProgramRand.value);
                tempProps.startFrom = -1;
                tempProps.finishOn = -1;
                tempProps.mixTests = true;
                adr.randomHolder.style.display = 'flex';
                adr.countHolder.style.display = 'none';
            }
            else{
                tempProps.testsCount = -1;
                tempProps.startFrom = new Number(adr.testProgramFrom.value);
                tempProps.finishOn = new Number(adr.testProgramTo.value);
                tempProps.mixTests = false;
                adr.randomHolder.style.display = 'none';
                adr.countHolder.style.display = 'flex';
            }
        }
        else{
            tempProps.mode = TestProgram.TestingMode.krok;
            adr.checkboxMixTestHolder.style.display = 'none';
            tempProps.testsCount = new Number(adr.testProgramRand.value);
            tempProps.startFrom = -1;
            tempProps.finishOn = -1;
            tempProps.mixTests = adr.checkboxMixTest.checked;
            adr.randomHolder.style.display = 'flex';
            adr.countHolder.style.display = 'none';
        }
    }

    static PrepareEdit(props, contentL){
        document.getElementById('testProgramEditorHolder').style.display = 'block';
        const adr = TestProgram.GetNamedControls();
        adr.nameField.value = props.text;
        adr.testProgramMinPercent.value = props.lockerPercent.toString();
        adr.testProgramFrom.value = props.startFrom.toString();
        adr.testProgramTo.value = props.finishOn.toString();
        adr.testProgramRand.value = props.testsCount.toString();
        adr.checkboxAllowSave.checked = props.allowNotesAndImages;
        adr.checkboxLockerTestProgram.checked = props.isLocker;
        adr.checkboxMixTest.checked = props.mixTests;
        if(props.unit != ''){
            for(let i = 0; i < currentUnitsArray.length; i++){
                if(currentUnitsArray[i].fork_unitId == props.unit){
                    adr.unitSelector.innerText = currentUnitsArray[i].name + " (" + currentUnitsArray[i].testsCount + " тестов)";
                    break;
                }
            }
        }
        const unitsList = adr.unitList;
        while (unitsList.firstChild) {
            unitsList.removeChild(unitsList.lastChild);
        }
        for(let i = 0; i < currentUnitsArray.length; i++){
            const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
            listItem.querySelector('.mdc-list-item__text').innerText = currentUnitsArray[i].unitName + " (" + currentUnitsArray[i].testsCount + " тестов)";
            listItem.querySelector('.mdc-list-item').dataset.value = currentUnitsArray[i].unitName + " (" + currentUnitsArray[i].testsCount + " тестов)";
            unitsList.appendChild(listItem);
        }
        adr.unitSelector.addEventListener('DOMSubtreeModified', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.nameField.addEventListener('input', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.testProgramMinPercent.addEventListener('input', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.testProgramFrom.addEventListener('input', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.testProgramTo.addEventListener('input', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.testProgramRand.addEventListener('input', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.checkboxMixTest.addEventListener('click', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.checkboxLockerTestProgram.addEventListener('click', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.checkboxAllowSave.addEventListener('click', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.radioKrok.addEventListener('click', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.radioFree.addEventListener('click', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.radioControl.addEventListener('click', function(){
            currentPresenter.OnEditAction(null, null);
        });
        adr.radioTraining.addEventListener('click', function(){
            currentPresenter.OnEditAction(null, null);
        });
        switch(props.mode){
            case TestProgram.TestingMode.free:
                adr.radioFree.click();
                break;
            case TestProgram.TestingMode.training:
                adr.radioTraining.click();
                break;
            case TestProgram.TestingMode.control:
                adr.radioControl.click();
                break;
            case TestProgram.TestingMode.krok:
                adr.radioKrok.click();
                break;
        }
    }

    static Save(presenter){
        return presenter.tempProps.text != '' && presenter.tempProps.unit != '';
    }

    static Draw(tempProps, contentL){
        let text1 = '';
        if(!generalPreviewBoolean){
            text1 = '<b>' + tempProps.text + '</b>\nЛекция: ';
            let maxTest = 0;
            for(let i = 0; i < currentUnitsArray.length; i++){
                if(currentUnitsArray[i].fork_unitId == tempProps.unit){
                    text1 = text1 + currentUnitsArray[i].unitName;
                    maxTest = currentUnitsArray[i].testsCount;
                    break;
                }
            }
            const adr = TestProgram.GetNamedControls();
            text1 = text1 + '\nСохранение: ' + (tempProps.allowNotesAndImages ? 'разрешено' : 'запрещено');
            text1 = text1 + '\nПорог: ' + (tempProps.isLocker ? tempProps.lockerPercent.toString() + '% для открытия следующих разделов' : 'нету');
            text1 = text1 + '\nPежим: ';
            let nextSettings = false;
            switch(tempProps.mode){
                case TestProgram.TestingMode.free:
                    nextSettings = false;
                    text1 = text1 + 'пользователь настраивает сам';
                    break;
                case TestProgram.TestingMode.training:
                    nextSettings = true;
                    text1 = text1 + 'тренинг';
                    break;
                case TestProgram.TestingMode.control:
                    nextSettings = true;
                    text1 = text1 + 'контроль';
                    break;
                case TestProgram.TestingMode.krok:
                    nextSettings = true;
                    text1 = text1 + 'КРОК';
                    break;
            }
            if(nextSettings){
                text1 = text1 + '\nПеремешивание тестов: ' + (tempProps.mixTests ? 'перемешивать' : 'НЕ перемешивать');
                if(tempProps.mixTests){
                    text1 = text1 + '\nТесты в программе: ' + (tempProps.testsCount == -1 ? 'все ' + maxTest.toString() + ' тестов' : tempProps.testsCount.toString() + ' случайных из ' + maxTest.toString() + ' тестов');
                }
                else {
                    text1 = text1 + '\nТесты в программе: ' + (tempProps.startFrom == -1 ? 'с 1 до ' : "с " + tempProps.startFrom.toString() + ' до ') + (tempProps.finishOn == -1 ?  maxTest.toString() + ' последнего теста' : tempProps.finishOn.toString() + ' по порядку из ' + maxTest.toString() + ' тестов');
                }
            }
        }
        else{
            text1 = '<b>' + tempProps.text + '</b>\nПройдено: 2\nМаксимамальный результат: 22%';
        }
        while (contentL.firstChild) {
            contentL.removeChild(contentL.lastChild);
        }
        const localProps = new Paragraph();
        localProps.text = text1;
        const card = document.createElement('div');
        const textElement = Paragraph.DrawCommon(localProps, false);
        const icon = document.createElement('p');
        card.classList.add('infocard');
        card.classList.add('infocard__color_Blue_Grey');
        icon.innerText = 'rule';
        icon.classList.add('material-icons');
        icon.classList.add('infocard__icon');
        textElement.classList.add('infocard__text');
        card.appendChild(icon);
        card.appendChild(textElement);
        contentL.appendChild(card);
    }
}