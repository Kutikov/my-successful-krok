class Day {
    constructor() {

    }

    static AddResult(passedTesting) {
        const dateStr = MStoDate(passedTesting.startedOn + passedTesting.duration).toString("dd.MM.yy");
        if (daysObj[dateStr] == undefined) {
            daysObj[dateStr] = {
                date: MStoDate(passedTesting.startedOn + passedTesting.duration).clearTime(),
                correctTests: passedTesting.correctTests,
                allTests: passedTesting.allTests
            };
        }
        else {
            daysObj[dateStr].correctTests = daysObj[dateStr].correctTests + passedTesting.correctTests;
            daysObj[dateStr].allTests = daysObj[dateStr].correctTests + passedTesting.allTests;
        }
    }

    static ResultsOnDay(dateStr) {
        if (daysObj[dateStr] == undefined) {
            document.getElementById('allTestsDay').innerText = '0';
            document.getElementById('correctTestsDay').innerText = '0';
            document.getElementById('percentDay').innerText = '0%';
        }
        else {
            document.getElementById('allTestsDay').innerText = daysObj[dateStr].allTests;
            document.getElementById('correctTestsDay').innerText = daysObj[dateStr].correctTests;
            document.getElementById('percentDay').innerText = (Math.floor(daysObj[dateStr].correctTests / daysObj[dateStr].allTests * 100)) + '%';
        }
    }

    static GetChart(){
        const labels1 = [];
        const trues = [];
        const falses = [];
        const all = [];
        let fDate = Date.today().addDays(-30);
        for(let i = 0; i < 31; i++){
            fDate = fDate.addDays(1);
            labels1.push(fDate.toString("dd.MM"));
            const dateStr = fDate.toString('dd.MM.yy');
            if(daysObj[dateStr] != undefined){
                trues.push(daysObj[dateStr].correctTests);
                falses.push(daysObj[dateStr].allTests - daysObj[dateStr].correctTests);
                all.push(daysObj[dateStr].allTests);
            }
            else{
                trues.push(0);
                falses.push(0);
                all.push(0);
            }
        }
        data1 = {
            labels: labels1,
            datasets: [{
                label: 'Верно',
                borderWidth: 2,
                data: trues,
                fill: false,
                pointBorderWidth: 0,
                backgroundColor: '#81c784',
                borderColor: '#2e7d32',
                tension: 0.25,
            },
            {
                label: 'Всего',
                borderWidth: 2,
                data: all,
                fill: false,
                pointBorderWidth: 0,
                backgroundColor: '#aaa',
                borderColor: '#222',
                tension: 0.25
            },
            {
                label: 'Неверно',
                borderWidth: 2,
                data: falses,
                fill: false,
                pointBorderWidth: 0,
                backgroundColor: '#e57373',
                borderColor: '#c62828',
                tension: 0.25
            }]
        };
        resize();
    }
}