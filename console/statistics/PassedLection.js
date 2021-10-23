class PassedLection{
    constructor(){

    }

    static Decode(record, device){
        const thisItem = new PassedLection();
        thisItem.finishedOn = record.finishedOn;
        thisItem.startedOn = record.startedOn;
        thisItem.duration = record.duration; 
        thisItem.unitId = record.fork_unitId.split("@")[0];
        thisItem.forkId = record.fork_unitId.split("@")[1];
        thisItem.device = device;
        return thisItem;
    }
    static Draw(allPassedLections, forkId){
        const passedLectionsHolder = document.getElementById('passedLectionsHolder');
        while(passedLectionsHolder.firstChild){
            passedLectionsHolder.remove(passedLectionsHolder.lastChild);
        }
        let r = 0;
        for(let i = 0 ; i < allPassedLections.length; i++){
            if(allPassedLections[i].forkId == forkId){
                const passed = allPassedLections[i];
                const item = document.createElement('div');
                item.classList.add('lectionsRow');
                const unitText = document.createElement('p');
                unitText.classList.add('unitTextLections');
                if(r % 2){
                    unitText.classList.add('darkRow');
                }
                unitText.innerText = passed.unitId.replace(/ø/g, ' ');
                const devicesText = document.createElement('p');
                devicesText.className = 'deviceTextLections';
                devicesText.innerText = 'devices';
                devicesText.style.color = passed.device.contains('1') ? '#2e7d32' : '#1565c0'
                const startedText = document.createElement('p');
                startedText.className = 'startedTextLections';
                startedText.innerText = Date.today().addMilliseconds(-new Date().getTime()).addMilliseconds(passed.startedOn).toString("d.MM.yy, HH:mm:ss");
                const finishText = document.createElement('p');
                finishText.className = 'finishedTextLections';
                finishText.innerText = Date.today().addMilliseconds(-new Date().getTime()).addMilliseconds(passed.finishedOn).toString("d.MM.yy, HH:mm:ss");
                const durationText = document.createElement('p');
                durationText.className = 'durationTextLections';
                durationText.innerText = Date.today().addMilliseconds(-new Date().getTime()).addMilliseconds(passed.duration).toString("HH:mm:ss");
                item.append(unitText);
                item.append(devicesText);
                item.append(startedText);
                item.append(finishText);
                item.append(durationText);
                passedLectionsHolder.append(item);
                r++;
            }
        }
    }
}