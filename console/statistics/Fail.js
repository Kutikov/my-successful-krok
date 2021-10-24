class Fail {
    constructor() {

    }

    static Decode(record, device) {
        const item = new Fail();
        item.created = record.created;
        item.testId = record.testId;
        const parts = record.testId.split("@");
        item.testN = parts[0];
        item.unitId = parts[1].replace(/ø/g, ' ');
        item.forkId = parts[2].replace(/ø/g, ' ');
        this.device = device;
        return item;
    }

    static Draw(allFailes, allForksNames) {
        const failsHolder = document.getElementById('failsHolder');
        while (failsHolder.firstChild) {
            failsHolder.removeChild(failsHolder.lastChild);
        }
        for (let i = 0; i < allFailes.length; i++) {
            if (allForksNames.contains(allFailes[i].forkId)) {
                const passed = allFailes[i];
                const item = document.createElement('tr');
                const forkText = document.createElement('td');
                forkText.classList.add('forkTextFails');
                forkText.innerText = passed.forkId;
                const unitText = document.createElement('td');
                unitText.classList.add('unitTextFails');
                unitText.innerText = passed.unitId;
                const devicesText = document.createElement('td');
                devicesText.className = 'deviceTextFails';
                devicesText.innerText = 'devices';
                devicesText.style.color = passed.device.contains('1') ? '#2e7d32' : '#1565c0';
                const createdText = document.createElement('td');
                createdText.className = 'createdTextFails';
                createdText.innerHTML = Date.today().addMilliseconds(-new Date().getTime()).addMilliseconds(passed.created).toString("d.MM.yy<br/>HH:mm:ss");
                const viewText = document.createElement('td');
                viewText.className = 'viewTextFails';
                viewText.innerText = 'visibility';
                item.append(forkText);
                item.append(unitText);
                item.append(devicesText);
                item.append(createdText);
                item.append(viewText);
                failsHolder.append(item);
            }
        }
    }
}