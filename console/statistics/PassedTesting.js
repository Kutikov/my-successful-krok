class PassedTesting {
    constructor() {

    }

    static Decode(record, device) {
        const thisItem = new PassedTesting();
        thisItem.correctTests = record.correctTests;
        thisItem.allTests = record.allTests;
        thisItem.percent = Math.floor(record.correctTests / record.allTests * 100);
        thisItem.duration = record.duration;
        thisItem.forkId = record.fork_unitId.split("@")[1].replace(/ø/g, ' ');
        thisItem.unitId = record.fork_unitId.split("@")[0].replace(/ø/g, ' ');
        thisItem.startedOn = record.startedOn;
        thisItem.device = device;
        Day.AddResult(thisItem);
        return thisItem;
    }

    static Draw(allPassedTestings, forkId) {
        const passedTestingsHolder = document.getElementById('passedTestingsHolder'); 
        while (passedTestingsHolder.firstChild) {
            passedTestingsHolder.removeChild(passedTestingsHolder.lastChild);
        }
        for (let i = 0; i < allPassedTestings.length; i++) {
            if (allPassedTestings[i].forkId == forkId) {
                const passed = allPassedTestings[i];
                const item = document.createElement('tr');
                const unitText = document.createElement('td');
                unitText.className = 'unitTextTesting';
                unitText.innerText = passed.unitId;
                const devicesText = document.createElement('td');
                devicesText.className = 'deviceTextLections';
                devicesText.innerText = 'devices';
                devicesText.style.color = passed.device.indexOf('1') != -1 ? '#2e7d32' : '#1565c0'
                const dateText = document.createElement('td');
                dateText.className = 'dateTextTesting';
                dateText.innerHTML = MStoDate(passed.startedOn).toString("d.MM.yy,<br/>HH:mm:ss");
                const durationText = document.createElement('td');
                durationText.className = 'durationTextTesting';
                durationText.innerText = MStoDate(passed.duration).toString("HH:mm:ss");
                const percentText = document.createElement('td');
                percentText.className = 'percentTextTesting';
                percentText.innerHTML = passed.percent.toString() + "%";
                const testsText = document.createElement('td');
                testsText.className = 'testsTextTesting';
                testsText.innerHTML = passed.allTests.toString();
                item.append(unitText);
                item.append(devicesText);
                item.append(dateText);
                item.append(durationText);
                item.append(percentText);
                item.append(testsText);
                passedTestingsHolder.append(item);
            }
        }
    }

    static Wipe(){
        const passedTestingsHolder = document.getElementById('passedTestingsHolder'); 
        while (passedTestingsHolder.firstChild) {
            passedTestingsHolder.removeChild(passedTestingsHolder.lastChild);
        }
    }
}