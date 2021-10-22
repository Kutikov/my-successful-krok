class PassedTesting{
    constructor(){

    }

    static Decode(record){
        const thisItem = new PassedTesting();
        thisItem.correctTests = record.correctTests;
        thisItem.allTests = record.allTests;
        thisItem.percent = Math.floor(record.correctTests / record.allTests * 100);
        thisItem.duration = record.duration;
        thisItem.forkId = record.fork_unitId.split("@")[1];
        thisItem.unitId = record.fork_unitId.split("@")[0];
        thisItem.startedOn = record.startedOn;
        return thisItem;
    }

    static Draw(allPassedTestings, forkId){
        const passedTestingsHolder = document.getElementById('passedTestingsHolder'); //TODO tbody
        while(passedTestingsHolder.firstChild){
            passedTestingsHolder.remove(passedTestingsHolder.lastChild);
        }
        for(let i = 0 ; i < allPassedTestings.length; i++){
            if(allPassedTestings[i].forkId == forkId){
                const passed = allPassedTestings[i];
                const item = document.createElement('tr');
                item.classList.add('.testingsRow');
                const unitText = document.createElement('td');
                unitText.classList.add('.unitTextTesting');
                unitText.innerText = passed.unitId.replace(/ø/g, ' ');
                const dateText = document.createElement('td');
                dateText.classList.add('.dateTextTesting');
                dateText.innerHTML = Date.today().addMilliseconds(-new Date().getTime()).addMilliseconds(passed.startedOn).toString("d.MM.yy,<br/>HH:mm:ss");
                const durationText = document.createElement('td');
                durationText.classList.add('.durationTextTesting');
                durationText.innerText = Date.today().addMilliseconds(-new Date().getTime()).addMilliseconds(passed.duration).toString("HH:mm:ss");
                const percentText = document.createElement('td');
                percentText.classList.add('.percentTextTesting');
                percentText.innerHTML = passed.percent.toString() + "%";
                const testsText = document.createElement('td');
                testsText.classList.add('.testsTextTesting');
                testsText.innerHTML = passed.percent.toString();
                item.append(unitText);
                item.append(dateText);
                item.append(durationText);
                item.append(percentText);
                item.append(testsText);
                passedTestingsHolder.append(item);
            }
        }
    }
}