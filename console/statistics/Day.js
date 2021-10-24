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
}