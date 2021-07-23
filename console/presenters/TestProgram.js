class TestProgram{

    static TestingMode = {
        free: 'free',
        training: 'training',
        control: 'control',
        krok: 'krok'
    }
    constructor(){
        this.allowNotes = true;
        this.allowImages = true;
        this.mixTests = TestProgram.TestingMode.free;
        this.testsCount = -1;
        this.startFrom = -1;
        this.finishOn = -1;
        this.mode = '';
        this.unit = '';
        this.isLocker = false;
        this.lockerPercent = 0;
    }
}