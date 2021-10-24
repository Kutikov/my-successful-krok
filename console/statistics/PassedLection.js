class PassedLection {
    constructor() {

    }

    static Decode(record, device) {
        const thisItem = new PassedLection();
        thisItem.finishedOn = record.finishedOn;
        thisItem.startedOn = record.startedOn;
        thisItem.duration = record.duration;
        thisItem.unitId = record.fork_unitId.split("@")[0].replace(/ø/g, ' ');
        thisItem.forkId = record.fork_unitId.split("@")[1].replace(/ø/g, ' ');
        thisItem.device = device;
        return thisItem;
    }

    static Draw(allPassedLections, forkId) {
        const passedLectionsHolder = document.getElementById('passedLectionsHolder');
        while (passedLectionsHolder.firstChild) {
            passedLectionsHolder.removeChild(passedLectionsHolder.lastChild);
        }
        for (let i = 0; i < allPassedLections.length; i++) {
            if (allPassedLections[i].forkId == forkId) {
                const passed = allPassedLections[i];
                const item = document.createElement('tr');
                const unitText = document.createElement('td');
                unitText.classList.add('unitTextLections');
                unitText.innerText = passed.unitId;
                const devicesText = document.createElement('td');
                devicesText.className = 'deviceTextLections';
                devicesText.innerText = 'devices';
                devicesText.style.color = passed.device.indexOf('1') != -1 ? '#2e7d32' : '#1565c0'
                const startedText = document.createElement('td');
                startedText.className = 'startedTextLections';
                startedText.innerHTML = MStoDate(passed.startedOn).toString("d.MM.yy<br/>HH:mm:ss");
                const finishText = document.createElement('td');
                finishText.className = 'finishedTextLections';
                finishText.innerHTML = MStoDate(passed.finishedOn).toString("d.MM.yy<br/>HH:mm:ss");
                const durationText = document.createElement('td');
                durationText.className = 'durationTextLections';
                durationText.innerText = MStoDate(passed.duration).toString("HH:mm:ss");
                item.append(unitText);
                item.append(devicesText);
                item.append(startedText);
                item.append(finishText);
                item.append(durationText);
                passedLectionsHolder.append(item);
            }
        }
    }
}