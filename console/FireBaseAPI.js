class FireBaseAPI{

    Signals = {
        testLoaded: 'testLoaded',
        testFailed: 'testFailed',
        testEmpty: 'testEmpty',
        testFinished: 'testFinished',
        presentersLoaded: 'presentersLoaded',
        presentersFailed: 'presentersFailed',
        presentersEmpty: 'presentersEmpty',
        presentersFinished: 'presentersFinished',
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

    Action = {
        writeDb: 'write',
        deleteDb: 'delete'
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
                this.realdatabase.ref('forks/' + forksArray[i].name).set(forksArray[i].GetFirebaseObject(), (error) => {
                    if(error){
                        coreSignalHandler(this.Signals.forksLoaded, this.Mode.write);
                    }
                    else{
                        forksArray[i].needUpdate = false;
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
                this.realdatabase.ref('units/' + currentUnitsArray[i].fork_unitId).set(currentUnitsArray[i].GetFirebaseObject(), (error) => {
                    if(error){
                        coreSignalHandler(this.Signals.unitLoaded, this.Mode.write);
                    }
                    else{
                        currentUnitsArray[i].needUpdate = false;
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
            const neededIndex = (i + 1).toString() + '@' + currentUnit.fork_unitId;
            if(currentTestArray[i].testId != neededIndex){
                currentTestArray[i].testId = neededIndex;
                currentTestArray[i].needUpdate = true;
            }
            lastIndex = i;
        }
        if(currentTestArrayShadow.length - 1 > lastIndex){
            const refs = [];
            for(let i = lastIndex + 1; i < currentTestArrayShadow.length; i++){
                refs.push('tests/' + (i + 1).toString() + '@' + currentUnit.fork_unitId)
            }
            this.performDbAction(refs, null, this.Action.deleteDb, this.deleteTestsCallback);
        }
        else{
            this.deleteTestsCallback(true);
        }
    }

    deleteTestsCallback(success){
        if(!success){
            progressToUi('Проблема с удалением тестов', false);
            coreSignalHandler(this.Signals.testFailed, this.Mode.delete);
        }
        else{
            const refs = [];
            const objects = [];
            if(currentUnit.testsCount != currentTestArray.length){
                currentUnit.updateTestsCount(currentTestArray);
                refs.push('units/' + currentUnit.fork_unitId);
                objects.push(currentUnit.GetFirebaseObject());
                refs.push('forks/' + currentFork.name);
                objects.push(currentFork.GetFirebaseObject());
            }
            for(let i = 0; i < currentTestArray.length; i++){
                if(currentTestArray[i].needUpdate){
                    refs.push('tests/' + currentTestArray[i].testId);
                    objects.push(currentTestArray[i].GetFirebaseObject());
                }
            }
            this.realdatabase.ref().child('commits').child(this.getDateStamp()).get()
                .then((snapshot) => {
                    let addFork = true;
                    let addUnit = true;
                    const commitOutArr = [];
                    const unitText = currentUnit.fork_unitId + "#" + EDITOR_MODE;
                    if(snapshot.exists()){
                        const changed = snapshot.val()['changed'];
                        for(let i = 0; i < changed.length; i++){
                            if(changed[i] == unitText){
                                addUnit = false;
                                addFork = false;
                            }
                            if(changed[i] == currentFork.name){
                                addFork = false;
                            }
                            commitOutArr.push(changed[i]);
                        }
                    }
                    if(addFork){
                        commitOutArr.push(currentFork.name);
                    }
                    if(addUnit){
                        commitOutArr.push(unitText);
                    }
                    refs.push('commits/' + this.getDateStamp());
                    objects.push({changed: commitOutArr});
                    this.performDbAction(refs, objects, this.Action.writeDb, this.writeTestsCallback);
                })
                .catch((error) => {
                    progressToUi('Проблема с удалением тестов', false);
                    coreSignalHandler(this.Signals.testFailed, this.Mode.write);                    
                });
        }
    }

    writeTestsCallback(success){
        if(!success){ 
            progressToUi('Проблема с записью тестов', false);
            coreSignalHandler(this.Signals.testFailed, this.Mode.write);
        }
        else{
            currentTestArrayShadow = [];
            saveButton.disabled = true;
            for(let i = 0; i < currentTestArray.length; i++){
                currentTestArray[i].needUpdate = false;
                currentTestArrayShadow.push(currentTestArray[i]);
            }
            progressToUi('Успешно записаны все тесты!', false);
            coreSignalHandler(this.Signals.testLoaded, this.Mode.write);
        }
    }
    //#endregion Tests

    //#region Presenters
    readPresenters(unit){
        let ref = this.realdatabase.ref('presenters').orderByChild('fork_unitId').equalTo(unit.fork_unitId);
        ref.get().then((snapshot) => {
            if(snapshot.exists()){
                const presentersArray = [];
                for(let i = 0; i < snapshot.val().length; i++){
                    presentersArray.push(null);
                }
                for(const presenterId in snapshot.val()){
                    const index = new Number(presenterId.split('@')[0]) - 1;
                    presentersArray[index] = Presenter.Decode(presenterId, snapshot.val()[presenterId]);
                }
                currentPresenterArray = [];
                currentPresenterArrayShadow = [];
                for(let i =0; i < presentersArray.length; i++){
                    currentPresenterArrayShadow.push(presentersArray[i]);
                    currentPresenterArray.push(presentersArray[i]);
                }
                coreSignalHandler(this.Signals.presentersLoaded, this.Mode.read);
            }
            else {
                currentPresenterArray = [];
                coreSignalHandler(this.Signals.presentersEmpty, this.Mode.read);
            }
        }).catch((error) => {
            console.log(error);
            currentPresenterArray = [];
            coreSignalHandler(this.Signals.PresenterFailed, this.Mode.read);
        })
    }

    writePresenters(){
        let lastIndex = 0;
        for(let i = 0; i < currentPresenterArray.length; i++){
            const neededIndex = (i + 1).toString() + '@' + currentUnit.fork_unitId;
            if(currentPresenterArray[i].presenterId != neededIndex){
                currentPresenterArray[i].presenterId = neededIndex;
                currentPresenterArray[i].needUpdate = true;
            }
            lastIndex = i;
        }
        if(currentPresenterArrayShadow.length - 1 > lastIndex){
            const refs = [];
            for(let i = lastIndex + 1; i < currentPresenterArrayShadow.length; i++){
                refs.push('presenters/' + (i + 1).toString() + '@' + currentUnit.fork_unitId)
            }
            this.performDbAction(refs, null, this.Action.deleteDb, this.deletePresentersCallback);
        }
        else{
            this.deletePresentersCallback(true);
        }
    }

    deletePresentersCallback(success){
        if(!success){
            progressToUi('Проблема с удалением тестов', false);
            coreSignalHandler(this.Signals.presentersFailed, this.Mode.delete);
        }
        else{
            const refs = [];
            const objects = [];
            if(currentUnit.presentersCount != currentPresenterArray.length){
                currentUnit.updatePresentersCount(currentPresenterArray);
                refs.push('units/' + currentUnit.fork_unitId);
                objects.push(currentUnit.GetFirebaseObject());
                refs.push('forks/' + currentFork.name);
                objects.push(currentFork.GetFirebaseObject());
            }
            for(let i = 0; i < currentPresenterArray.length; i++){
                if(currentPresenterArray[i].needUpdate){
                    refs.push('presenters/' + currentPresenterArray[i].presenterId);
                    objects.push(currentPresenterArray[i].GetFirebaseObject());
                }
            }
            this.realdatabase.ref().child('commits').child(this.getDateStamp()).get()
                .then((snapshot) => {
                    let addFork = true;
                    let addUnit = true;
                    const commitOutArr = [];
                    const unitText = currentUnit.fork_unitId + "#" + EDITOR_MODE;
                    if(snapshot.exists()){
                        const changed = snapshot.val()['changed'];
                        for(let i = 0; i < changed.length; i++){
                            if(changed[i] == unitText){
                                addUnit = false;
                                addFork = false;
                            }
                            if(changed[i] == currentFork.name){
                                addFork = false;
                            }
                            commitOutArr.push(changed[i]);
                        }
                    }
                    if(addFork){
                        commitOutArr.push(currentFork.name);
                    }
                    if(addUnit){
                        commitOutArr.push(unitText);
                    }
                    refs.push('commits/' + this.getDateStamp());
                    objects.push({changed: commitOutArr});
                    this.performDbAction(refs, objects, this.Action.writeDb, this.writePresentersCallback);
                })
                .catch((error) => {
                    progressToUi('Проблема с удалением презентеров', false);
                    coreSignalHandler(this.Signals.presentersFailed, this.Mode.write);                    
                });
        }
    }

    writePresentersCallback(success){
        if(!success){ 
            progressToUi('Проблема с записью презентеров', false);
            coreSignalHandler(this.Signals.presentersFailed, this.Mode.write);
        }
        else{
            currentPresenterArrayShadow = [];
            saveButton.disabled = true;
            for(let i = 0; i < currentPresenterArray.length; i++){
                currentPresenterArray[i].needUpdate = false;
                currentPresenterArrayShadow.push(currentPresenterArray[i]);
            }
            progressToUi('Успешно записаны все презентеры!', false);
            coreSignalHandler(this.Signals.presentersLoaded, this.Mode.write);
        }
    }
    //#endregion Presenters

    performDbAction(refs, objects, action, callback, i = 0){
        switch (action){
            case this.Action.writeDb:
                progressToUi('Записано ' + (Math.round(100 * (i / refs.length))).toString() + "%", true);
                this.realdatabase.ref(refs[i]).set(objects[i], (error) => {
                    if(error){
                        callback.apply(this, [false]);
                    }
                    else{
                        if(i == refs.length - 1){
                            callback.apply(this, [true]);
                        }
                        else{
                            this.performDbAction(refs, objects, action, callback, i + 1);
                        }
                    }
                });
                break;
            case this.Action.deleteDb:
                progressToUi('Очищено ' + (Math.round(100 * (i / refs.length))).toString() + "%", true);
                this.realdatabase.ref(refs[i]).remove()
                    .then(() => {
                        if(i == refs.length - 1){
                            callback.apply(this, [true]);
                        }
                        else{
                            this.performDbAction(refs, objects, action, callback, i + 1);
                        }
                    })
                    .catch(() => {
                        callback.apply(this, [false]);
                    });
                break;
        }
    }

    getDateStamp(){
        const date = new Date();
        return date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2);
    }
}