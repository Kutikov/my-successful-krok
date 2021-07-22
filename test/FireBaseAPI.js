class FireBaseAPI{

    Signals = {
        testLoaded: 'testLoaded',
        testFailed: 'testFailed',
        testEmpty: 'testEmpty',
        testFinished: 'testFinished',
        forksLoaded: 'forksLoaded',
        forksFailed: 'forksFailed',
        forksEmpty: 'forksEmpty',
        unitLoaded: 'unitLoaded',
        unitFailed: 'unitFailed',
        unitEmpty: 'unitEmpty',
    }

    Mode = {
        read: 'read',
        write: 'write',
        delete: 'delete'
    }

    constructor(){
        this.firebaseConfigDamirkut = {
            apiKey: "AIzaSyBKqO5q1O0TB--X0mt-e1bep0jeppC8PYw",
            authDomain: "test-414ca.firebaseapp.com",
            databaseURL: "https://test-414ca.firebaseio.com",
            projectId: "test-414ca",
            storageBucket: "test-414ca.appspot.com",
            messagingSenderId: "282306699058",
            appId: "1:282306699058:web:7a1fded73750a55b8d012b"
        };
        firebase.initializeApp(this.firebaseConfigDamirkut);
        this.firestore = firebase.firestore();
        this.realdatabase = firebase.database();
        firebase.auth().signInWithEmailAndPassword('damirkut@gmail.com', 'PaSsWoRd2021')
            .then((userCredential) => {
                console.log(userCredential);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //#region Forks
    readForks(author){
        let ref = this.realdatabase.ref('forks').orderByChild('author').equalTo(author);
        ref.get().then((snapshot) => {
            if(snapshot.exists()){
                const forksArrayLocal = [];
                for(const forkId in snapshot.val()){
                    forksArrayLocal.push(Fork.Decode(forkId, snapshot.val()[forkId]));
                }
                forksArray = forksArrayLocal;
                coreSignalHandler(this.Signals.forksLoaded, this.Mode.read);
            }
            else {
                coreSignalHandler(this.Signals.forksEmpty, this.Mode.read);
            }
        }).catch((error) => {
            console.log(error);
            coreSignalHandler(this.Signals.forksFailed, this.Mode.read);
        })
    }

    writeForks(){
        for(let i = 0; i < forksArray.length; i++){
            if(forksArray[i].needUpdate){
                this.realdatabase.ref('forks/' + forksArray[i].name).set({
                    extensionRate: forksArray[i].extensionRate,
                    extensionVar: forksArray[i].extensionVar,
                    extensionStage: forksArray[i].extensionStage,
                    extensionSpec: forksArray[i].extensionSpec,
                    language: forksArray[i].language,
                    testCount: forksArray[i].testCount,
                    author: forksArray[i].author,
                    isPremium: forksArray[i].isPremium
                }, (error) => {
                    if(error){
                        coreSignalHandler(this.Signals.forksLoaded, this.Mode.write);
                    }
                    else{
                        coreSignalHandler(this.Signals.forksLoaded, this.Mode.write);
                    }
                });
            }
        }
    }
    //#endregion Forks

    //#region Units
    readUnits(fork){
        let ref = this.realdatabase.ref('units').orderByChild('forkId').equalTo(fork.name.replace(' ', 'Ø'));
        ref.get().then((snapshot) => {
            if(snapshot.exists()){
                const unitsArrayLocal = [];
                for(const fork_unitId in snapshot.val()){
                    unitsArrayLocal.push(Unit.Decode(fork_unitId, snapshot.val()[fork_unitId], fork));
                }
                currentUnitsArray = unitsArrayLocal;
                coreSignalHandler(this.Signals.unitLoaded, this.Mode.read);
            }
            else {
                currentUnitsArray = [];
                coreSignalHandler(this.Signals.unitEmpty, this.Mode.read);
            }
        }).catch((error) => {
            console.log(error);
            coreSignalHandler(this.Signals.unitFailed, this.Mode.read);
        })
    }

    writeUnits(){
        for(let i = 0; i < currentUnitsArray.length; i++){
            if(currentUnitsArray[i].needUpdate){
                this.realdatabase.ref('units/' + currentUnitsArray[i].fork_unitId).set({
                    unitId: currentUnitsArray[i].unitId,
                    forkId: currentUnitsArray[i].forkId,
                    testsCount: currentUnitsArray[i].testsCount
                }, (error) => {
                    if(error){
                        coreSignalHandler(this.Signals.unitLoaded, this.Mode.write);
                    }
                    else{
                        coreSignalHandler(this.Signals.unitLoaded, this.Mode.write);
                    }
                });
            }
        }
    }
    //#endregion Units

    //#region Tests
    readTests(unit){
        let ref = this.realdatabase.ref('tests').orderByChild('fork_unitId').equalTo(unit.fork_unitId);
        ref.get().then((snapshot) => {
            if(snapshot.exists()){
                const testsArray = [];
                for(let i = 0; i < snapshot.val().length; i++){
                    testsArray.push(null);
                }
                for(const testId in snapshot.val()){
                    const index = new Number(testId.split('@')[0]) - 1;
                    testsArray[index] = TestAccount.Decode(testId, snapshot.val()[testId]);
                }
                currentTestArray = [];
                currentTestArrayShadow = [];
                for(let i =0; i < testsArray.length; i++){
                    currentTestArrayShadow.push(testsArray[i]);
                    currentTestArray.push(testsArray[i]);
                }
                coreSignalHandler(this.Signals.testLoaded, this.Mode.read);
            }
            else {
                currentTestArray = [];
                coreSignalHandler(this.Signals.testEmpty, this.Mode.read);
            }
        }).catch((error) => {
            console.log(error);
            currentTestArray = [];
            coreSignalHandler(this.Signals.testFailed, this.Mode.read);
        })
    }

    writeTests(){
        let lastIndex = 0;
        for(let i = 0; i < currentTestArray.length; i++){
            if(i < currentTestArrayShadow.length){
                if(currentTestArray[i].testId != currentTestArrayShadow[i].testId){
                    currentTestArray[i].testId = currentTestArrayShadow[i].testId;
                    currentTestArray[i].needUpdate = true;
                }
            }
            lastIndex = i;
        }
        if(currentTestArrayShadow.length > lastIndex - 1){
            currentTestArrayShadow.splice(0, lastIndex);
            this.deleteTests(currentTestArrayShadow);
        }
        for(let i = 0; i < currentTestArray.length; i++){
            if(currentTestArray[i].needUpdate){
                this.realdatabase.ref('tests/' + currentTestArray[i].testId).set({
                    unitId: currentTestArray[i].unitId,
                    forkId: currentTestArray[i].forkId,
                    task: currentTestArray[i].task,
                    comment: currentTestArray[i].comment,
                    answersTrue: currentTestArray[i].answersTrue,
                    answersFalse: currentTestArray[i].answersFalse,
                    fork_unitId: currentTestArray[i].fork_unitId
                }, (error) => {
                    if(error){
                        coreSignalHandler(this.Signals.testFailed, this.Mode.write);
                    }
                    else{
                        currentTestArray[i].needUpdate = false;
                        if(i == currentTestArray.length - 1){
                            coreSignalHandler(this.Signals.testLoaded, this.Mode.write);
                        }
                    }
                });
            }
        }
        currentTestArrayShadow = [];
        for(let i = 0; i < currentTestArray.length; i++){
            currentTestArrayShadow.push(currentTestArray[i]);
        }
    }

    deleteTests(testsToDelete){
        for(let i = 0; i < testsToDelete.length; i++){
            this.realdatabase.ref('tests/' + testsToDelete[i].testId).remove();
        }
    }
    //#endregion Tests
}