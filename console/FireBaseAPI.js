class FireBaseAPI {

    static Servers = {
        kharkiv1: 'kharkiv1',
        kharkiv2: 'kharkiv2'
    }
    Signals = {
        loggedIn: 'loggedIn',

        tablesLoaded: 'tablesLoaded',
        tablesFailed: 'tablesFailed',
        tablesFinished: 'tablesFinished',

        modulesLoaded: 'modulesLoaded',
        modulesFailed: 'modulesFailed',
        modulesFinished: 'modulesFinished',

        testLoaded: 'testLoaded',
        testFailed: 'testFailed',
        testEmpty: 'testEmpty',
        testFinished: 'testFinished',

        presentersLoaded: 'presentersLoaded',
        presentersFailed: 'presentersFailed',
        presentersEmpty: 'presentersEmpty',
        presentersFinished: 'presentersFinished',

        bucketsLoaded: 'bucketsLoaded',
        bucketsFailed: 'bucketsFailed',
        bucketsEmpty: 'bucketsEmpty',

        forksLoaded: 'forksLoaded',
        forksFailed: 'forksFailed',
        forksEmpty: 'forksEmpty',

        unitLoaded: 'unitLoaded',
        unitFailed: 'unitFailed',
        unitEmpty: 'unitEmpty',

        usersListLoaded: 'usersListLoaded',
        usersListFailed: 'usersListFailed',
        usersListEmpty: 'usersListEmpty',

        firestoreAuth: 'firestoreAuth',
        firestoreRead: 'firestoreRead',
        firestoreRatingRead: 'firestoreRatinRead',
        firestoreFail: 'firestoreFail'
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

    constructor() {
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
                coreSignalHandler(this.Signals.loggedIn, null);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //#region Index
    login(email, password, author, target) {
        firebase.auth().signOut()
            .then(() => {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        window.open(target + '.html?author=' + author, '_self');
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        switch (errorCode) {
                            case 'auth/wrong-password':
                                document.getElementById('message' + author).style.display = 'block';
                                break;
                        }
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    //#endregion

    //#region Forks
    readForks(author) {
        let ref = this.realdatabase.ref('forks').orderByChild('author').equalTo(author);
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const forksArrayLocal = [];
                for (const forkId in snapshot.val()) {
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

    readAllForks() {
        let ref = this.realdatabase.ref('forks').orderByChild('author');
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const forksArrayLocal = [];
                for (const forkId in snapshot.val()) {
                    forksArrayLocal.push(forkId);
                }
                allForksArray = forksArrayLocal;
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

    writeForks() {
        for (let i = 0; i < forksArray.length; i++) {
            if (forksArray[i].needUpdate) {
                this.realdatabase.ref('forks/' + forksArray[i].name).set(forksArray[i].GetFirebaseObject(), (error) => {
                    if (error) {
                        coreSignalHandler(this.Signals.forksLoaded, this.Mode.write);
                    }
                    else {
                        forksArray[i].needUpdate = false;
                        coreSignalHandler(this.Signals.forksLoaded, this.Mode.write);
                    }
                });
            }
        }
    }
    //#endregion Forks

    //#region Buckets
    readAllBuckets() {
        let ref = this.realdatabase.ref('buckets');
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const bucketsArrayLocal = [];
                for (const bucketId in snapshot.val()) {
                    bucketsArrayLocal.push(Bucket.Decode(bucketId, snapshot.val()[bucketId]));
                }
                allBucketsArray = bucketsArrayLocal;
                coreSignalHandler(this.Signals.bucketsLoaded, this.Mode.read);
            }
            else {
                coreSignalHandler(this.Signals.bucketsEmpty, this.Mode.read);
            }
        }).catch((error) => {
            console.log(error);
            coreSignalHandler(this.Signals.bucketsFailed, this.Mode.read);
        })
    }
    writeBucket(bucket) {
        this.realdatabase.ref('buckets/' + bucket.bucketId).set(bucket.GetFirebaseObject(), (error) => {
            if (error) {
                coreSignalHandler(this.Signals.bucketsFailed, this.Mode.write);
            }
            else {
                coreSignalHandler(this.Signals.bucketsLoaded, this.Mode.write);
            }
        });
    }

    deleteBucket(bucket) {
        this.realdatabase.ref(bucket.bucketId).remove()
            .then(() => {
                coreSignalHandler(this.Signals.bucketsLoaded, this.Mode.delete);
            })
            .catch(() => {
                coreSignalHandler(this.Signals.bucketsFailed, this.Mode.delete);
            });
    }
    //#endregion Buckets

    //#region Modules
    readAllModules() {
        let ref = this.realdatabase.ref('modules');
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const modulesArrayLocal = [];
                for (const moduleId in snapshot.val()) {
                    modulesArrayLocal.push(Module.Decode(moduleId, snapshot.val()[moduleId]));
                }
                modulesArray = Module.reDecodeModules(forkUnitHolder, modulesArrayLocal);
            }
            else {
                modulesArray = Module.reDecodeModules(forkUnitHolder, null);
            }
            coreSignalHandler(this.Signals.modulesLoaded, this.Mode.read);
        }).catch((error) => {
            console.log(error);
            coreSignalHandler(this.Signals.modulesFailed, this.Mode.read);
        })
    }

    writeModule(module, tablesArray) {
        this.realdatabase.ref('modules/' + module.forkId).set(module.GetFirebaseObject(), (error) => {
            if (error) {
                coreSignalHandler(this.Signals.modulesFailed, this.Mode.write);
            }
            else {
                const fbObj = {};
                for (let i = 0; i < tablesArray.length; i++) {
                    fbObj[tablesArray[i].tableId] = tablesArray[i].GetFirebaseObject();
                }
                this.realdatabase.ref('tables').set(fbObj, (error) => {
                    if (error) {
                        coreSignalHandler(this.Signals.tablesFailed, this.Mode.write);
                    }
                    else {
                        coreSignalHandler(this.Signals.modulesLoaded, this.Mode.write);
                    }
                });
                coreSignalHandler(this.Signals.modulesLoaded, this.Mode.write);
            }
        });
    }
    //#endregion Modules

    //#region Tables
    readAllTables() {
        let ref = this.realdatabase.ref('tables');
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const tablesArrayLocal = [];
                for (const tableId in snapshot.val()) {
                    tablesArrayLocal.push(Table.Decode(tableId, snapshot.val()[tableId]));
                }
                tablesArray = tablesArrayLocal;
            }
            else {
                tablesArray = [];
            }
            coreSignalHandler(this.Signals.tablesLoaded, this.Mode.read);
        }).catch((error) => {
            console.log(error);
            coreSignalHandler(this.Signals.tablesFailed, this.Mode.read);
        })
    }

    writeTable(table) {
        this.realdatabase.ref('tables/' + table.tableId).set(table.GetFirebaseObject(), (error) => {
            if (error) {
                coreSignalHandler(this.Signals.tablesFailed, this.Mode.write);
            }
            else {
                coreSignalHandler(this.Signals.tablesLoaded, this.Mode.write);
            }
        });
    }
    //#endregion Modules

    //#region Units
    readUnits(fork) {
        let ref = this.realdatabase.ref('units').orderByChild('forkId').equalTo(fork.name.replace(/ /g, 'ø'));
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const unitsArrayLocal = [];
                for (const fork_unitId in snapshot.val()) {
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

    readUnitsA() {
        let ref = this.realdatabase.ref('units');
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const unitsArrayLocal = [];
                for (const fork_unitId in snapshot.val()) {
                    unitsArrayLocal.push(Unit.Decode(fork_unitId, snapshot.val()[fork_unitId], null, fork_unitId.split('@')[1]));
                }
                allUnitsArray = unitsArrayLocal;
                coreSignalHandler(this.Signals.unitLoaded, this.Mode.read);
            }
            else {
                allUnitsArray = [];
                coreSignalHandler(this.Signals.unitEmpty, this.Mode.read);
            }
        }).catch((error) => {
            console.log(error);
            coreSignalHandler(this.Signals.unitFailed, this.Mode.read);
        })
    }

    readAllUnits() {
        let ref = this.realdatabase.ref('units');
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const unitsArrayLocal = [];
                for (const fork_unitId in snapshot.val()) {
                    unitsArrayLocal.push(fork_unitId);
                }
                allUnitsArray = unitsArrayLocal;
                coreSignalHandler(this.Signals.unitLoaded, this.Mode.read);
            }
            else {
                allUnitsArray = [];
                coreSignalHandler(this.Signals.unitEmpty, this.Mode.read);
            }
        }).catch((error) => {
            console.log(error);
            coreSignalHandler(this.Signals.unitFailed, this.Mode.read);
        })
    }

    writeUnits() {
        for (let i = 0; i < allUnitsArray.length; i++) {
            if (allUnitsArray[i].needUpdate) {
                this.realdatabase.ref('units/' + allUnitsArray[i].fork_unitId).set(allUnitsArray[i].GetFirebaseObject(), (error) => {
                    if (error) {
                        coreSignalHandler(this.Signals.unitLoaded, this.Mode.write);
                    }
                    else {
                        allUnitsArray[i].needUpdate = false;
                        coreSignalHandler(this.Signals.unitLoaded, this.Mode.write);
                    }
                });
            }
        }
    }
    //#endregion Units

    //#region Tests
    readTests(unit) {
        let ref = this.realdatabase.ref('tests').orderByChild('fork_unitId').equalTo(unit.fork_unitId);
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const testsArray = [];
                for (let i = 0; i < snapshot.val().length; i++) {
                    testsArray.push(null);
                }
                for (const testId in snapshot.val()) {
                    const index = new Number(testId.split('@')[0]) - 1;
                    testsArray[index] = TestAccount.Decode(testId, snapshot.val()[testId]);
                }
                currentTestArray = [];
                currentTestArrayShadow = [];
                for (let i = 0; i < testsArray.length; i++) {
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

    writeTests() {
        let lastIndex = 0;
        for (let i = 0; i < currentTestArray.length; i++) {
            const neededIndex = (i + 1).toString() + '@' + currentUnit.fork_unitId;
            if (currentTestArray[i].testId != neededIndex) {
                currentTestArray[i].testId = neededIndex;
                currentTestArray[i].needUpdate = true;
            }
            lastIndex = i;
        }
        if (currentTestArrayShadow.length - 1 > lastIndex) {
            const refs = [];
            for (let i = lastIndex + 1; i < currentTestArrayShadow.length; i++) {
                refs.push('tests/' + (i + 1).toString() + '@' + currentUnit.fork_unitId)
            }
            this.performDbAction(refs, null, this.Action.deleteDb, this.deleteTestsCallback);
        }
        else {
            this.deleteTestsCallback(true);
        }
    }

    deleteTestsCallback(success) {
        if (!success) {
            progressToUi('Проблема с удалением тестов', false);
            coreSignalHandler(this.Signals.testFailed, this.Mode.delete);
        }
        else {
            const refs = [];
            const objects = [];
            if (currentUnit.testsCount != currentTestArray.length) {
                currentUnit.updateTestsCount(currentTestArray);
                refs.push('units/' + currentUnit.fork_unitId);
                objects.push(currentUnit.GetFirebaseObject());
                refs.push('forks/' + currentFork.name);
                objects.push(currentFork.GetFirebaseObject());
            }
            for (let i = 0; i < currentTestArray.length; i++) {
                if (currentTestArray[i].needUpdate) {
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
                    if (snapshot.exists()) {
                        const changed = snapshot.val()['changed'];
                        for (let i = 0; i < changed.length; i++) {
                            if (changed[i] == unitText) {
                                addUnit = false;
                                addFork = false;
                            }
                            if (changed[i] == currentFork.name) {
                                addFork = false;
                            }
                            commitOutArr.push(changed[i]);
                        }
                    }
                    if (addFork) {
                        commitOutArr.push(currentFork.name);
                    }
                    if (addUnit) {
                        commitOutArr.push(unitText);
                    }
                    refs.push('commits/' + this.getDateStamp());
                    objects.push({ changed: commitOutArr, timestamp: new Date().getTime() });
                    this.performDbAction(refs, objects, this.Action.writeDb, this.writeTestsCallback);
                })
                .catch((error) => {
                    progressToUi('Проблема с удалением тестов', false);
                    coreSignalHandler(this.Signals.testFailed, this.Mode.write);
                });
        }
    }

    writeTestsCallback(success) {
        if (!success) {
            progressToUi('Проблема с записью тестов', false);
            coreSignalHandler(this.Signals.testFailed, this.Mode.write);
        }
        else {
            currentTestArrayShadow = [];
            saveButton.disabled = true;
            for (let i = 0; i < currentTestArray.length; i++) {
                currentTestArray[i].needUpdate = false;
                currentTestArrayShadow.push(currentTestArray[i]);
            }
            progressToUi('Успешно записаны все тесты!', false);
            coreSignalHandler(this.Signals.testLoaded, this.Mode.write);
        }
    }
    //#endregion Tests

    //#region Presenters
    readPresenters(unit) {
        let ref = this.realdatabase.ref('presenters').orderByChild('fork_unitId').equalTo(unit.fork_unitId);
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const presentersArray = [];
                for (let i = 0; i < snapshot.val().length; i++) {
                    presentersArray.push(null);
                }
                for (const presenterId in snapshot.val()) {
                    const index = new Number(presenterId.split('@')[0]) - 1;
                    presentersArray[index] = Presenter.Decode(presenterId, snapshot.val()[presenterId]);
                }
                currentPresenterArray = [];
                currentPresenterArrayShadow = [];
                for (let i = 0; i < presentersArray.length; i++) {
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

    writePresenters() {
        let lastIndex = 0;
        for (let i = 0; i < currentPresenterArray.length; i++) {
            const neededIndex = (i + 1).toString() + '@' + currentUnit.fork_unitId;
            if (currentPresenterArray[i].presenterId != neededIndex) {
                currentPresenterArray[i].presenterId = neededIndex;
                currentPresenterArray[i].needUpdate = true;
            }
            lastIndex = i;
        }
        if (currentPresenterArrayShadow.length - 1 > lastIndex) {
            const refs = [];
            for (let i = lastIndex + 1; i < currentPresenterArrayShadow.length; i++) {
                refs.push('presenters/' + (i + 1).toString() + '@' + currentUnit.fork_unitId)
            }
            this.performDbAction(refs, null, this.Action.deleteDb, this.deletePresentersCallback);
        }
        else {
            this.deletePresentersCallback(true);
        }
    }

    deletePresentersCallback(success) {
        if (!success) {
            progressToUi('Проблема с удалением тестов', false);
            coreSignalHandler(this.Signals.presentersFailed, this.Mode.delete);
        }
        else {
            const refs = [];
            const objects = [];
            if (currentUnit.presentersCount != currentPresenterArray.length) {
                currentUnit.updatePresentersCount(currentPresenterArray);
                refs.push('units/' + currentUnit.fork_unitId);
                objects.push(currentUnit.GetFirebaseObject());
                refs.push('forks/' + currentFork.name);
                objects.push(currentFork.GetFirebaseObject());
            }
            for (let i = 0; i < currentPresenterArray.length; i++) {
                if (currentPresenterArray[i].needUpdate) {
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
                    if (snapshot.exists()) {
                        const changed = snapshot.val()['changed'];
                        for (let i = 0; i < changed.length; i++) {
                            if (changed[i] == unitText) {
                                addUnit = false;
                                addFork = false;
                            }
                            if (changed[i] == currentFork.name) {
                                addFork = false;
                            }
                            commitOutArr.push(changed[i]);
                        }
                    }
                    if (addFork) {
                        commitOutArr.push(currentFork.name);
                    }
                    if (addUnit) {
                        commitOutArr.push(unitText);
                    }
                    refs.push('commits/' + this.getDateStamp());
                    objects.push({ changed: commitOutArr, timestamp: new Date().getTime() });
                    this.performDbAction(refs, objects, this.Action.writeDb, this.writePresentersCallback);
                })
                .catch((error) => {
                    progressToUi('Проблема с удалением презентеров', false);
                    coreSignalHandler(this.Signals.presentersFailed, this.Mode.write);
                });
        }
    }

    writePresentersCallback(success) {
        if (!success) {
            progressToUi('Проблема с записью презентеров', false);
            coreSignalHandler(this.Signals.presentersFailed, this.Mode.write);
        }
        else {
            currentPresenterArrayShadow = [];
            saveButton.disabled = true;
            for (let i = 0; i < currentPresenterArray.length; i++) {
                currentPresenterArray[i].needUpdate = false;
                currentPresenterArrayShadow.push(currentPresenterArray[i]);
            }
            progressToUi('Успешно записаны все презентеры!', false);
            coreSignalHandler(this.Signals.presentersLoaded, this.Mode.write);
        }
    }
    //#endregion Presenters

    //#region Statistics
    authSecondServer() {
        this.firebaseConfigMyKROKTutor = {
            apiKey: "AIzaSyD4FNLmDuvVACkRgOBQ19EZ2tzblhQ1oZc",
            authDomain: "mysuccessfulkrok.firebaseapp.com",
            databaseURL: "https://mysuccessfulkrok-default-rtdb.firebaseio.com",
            projectId: "mysuccessfulkrok",
            storageBucket: "mysuccessfulkrok.appspot.com",
            messagingSenderId: "824994683052",
            appId: "1:824994683052:web:889e746f4862b1ac336709",
            measurementId: "G-NT595NEQ1Q"
        };
        this.regFirebase = firebase.initializeApp(this.firebaseConfigMyKROKTutor, FireBaseAPI.Servers.kharkiv2);
        this.regFirebase.auth().signInWithEmailAndPassword('damirkut@gmail.com', 'PaSsWoRd2021')
            .then((userCredential) => {
                console.log(userCredential);
                coreSignalHandler(this.Signals.firestoreAuth, this.Mode.read);
            })
            .catch((error) => {
                console.log('error entering kharkiv2: ' + error);
                coreSignalHandler(this.Signals.firestoreFail, this.Mode.read);
            });
    }
    readAccount(email, server) {
        let accRef = null;
        switch (server) {
            case FireBaseAPI.Servers.kharkiv1:
                accRef = this.firestore.collection('users').doc(email);
                break;
            case FireBaseAPI.Servers.kharkiv2:
                accRef = this.regFirebase.firestore().collection('users').doc(email);
                break;
        }
        accRef.get()
            .then((doc) => {
                if (doc.exists) {
                    const acc = Account.Decode(doc.data());
                    acc.Draw(email, server);
                    allLecionsArr = [];
                    allLecionsArr = [];
                    allTestingsArr = [];
                    this.readCollections(email, server, 'fails', 'dev1');
                }
                else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    }

    readFailsRating() {
        const colRef1 = this.firestore.collection('fails');
        const colRef2 = this.regFirebase.firestore().collection('fails');
        colRef1.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const forkName1 = doc.id.replace(/ø/g, ' ');
                    for (let testId in doc.data()) {
                        allRating.push({
                            fork: forkName1,
                            testId: testId,
                            count: doc.data()[testId]
                        });
                    }
                });
                colRef2.get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const forkName2 = doc.id.replace(/ø/g, ' ');
                            for (let testId in doc.data()) {
                                let found = false;
                                let i = 0;
                                while (!found && i < allRating.length) {
                                    if (allRating[i].testId == testId) {
                                        found = true;
                                        allRating[i].count = allRating[i].count + doc.data()[testId];
                                    }
                                    i++;
                                }
                                if (!found) {
                                    allRating.push({
                                        fork: forkName2,
                                        testId: testId,
                                        count: doc.data()[testId]
                                    });
                                }
                            }
                        });
                        allRating.sort((b, a) => (a.count > b.count) ? 1 : ((b.count > a.count) ? -1 : 0));
                        coreSignalHandler(this.Signals.firestoreRatingRead, this.Mode.read);
                    });
            });
    }

    readCollections(email, server, col, order) {
        let colRef = null;
        switch (server) {
            case FireBaseAPI.Servers.kharkiv1:
                colRef = this.firestore.collection('users').doc(email).collection(col + '_' + order);
                break;
            case FireBaseAPI.Servers.kharkiv2:
                colRef = this.regFirebase.firestore().collection('users').doc(email).collection(col + '_' + order);
                break;
        }
        colRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    switch (col) {
                        case 'fails':
                            allFailsArr.push(Fail.Decode(doc.data(), order));
                            break;
                        case 'lectionsPassed':
                            allLecionsArr.push(PassedLection.Decode(doc.data(), order));
                            break;
                        case 'testingsPassed':
                            allTestingsArr.push(PassedTesting.Decode(doc.data(), order));
                            break;
                    }
                });
                if (order == 'dev1') {
                    this.readCollections(email, server, col, 'dev2');
                }
                else {
                    switch (col) {
                        case 'fails':
                            this.readCollections(email, server, 'lectionsPassed', 'dev1');
                            break;
                        case 'lectionsPassed':
                            this.readCollections(email, server, 'testingsPassed', 'dev1');
                            break;
                        case 'testingsPassed':
                            console.log('f');
                            coreSignalHandler(this.Signals.firestoreRead, this.Mode.read);
                            break;
                    }
                }
            });
    }

    updateBucketQuery(email, serverId, updateObj) {
        let targerFireStore = null;
        switch (serverId) {
            case FireBaseAPI.Servers.kharkiv1:
                targerFireStore = this.firestore;
                break;
            case FireBaseAPI.Servers.kharkiv2:
                targerFireStore = this.regFirebase.firestore();
                break;
        }
        const userRecord = targerFireStore.collection("users").doc(email);
        userRecord.get()
            .then((doc) => {
                if (doc.exists) {
                    userRecord
                        .update(updateObj)
                        .then(() => {
                            console.log("updated!");
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });
                }
                else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    }

    getTestById(testId, action) {
        let ref = this.realdatabase.ref('tests/' + testId);
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                const test = TestAccount.Decode(testId, snapshot.val());
                switch (action) {
                    case 'dialog':
                        test.GetTestDialog();
                        dialog.open();
                        break;
                    default:
                        const order = Number(action);
                        test.GetTestFailCounter(allRating[order].count);
                        ratingRenderer(order);
                        break;
                }
            }
            else {
                switch (action) {
                    case 'dialog':
                        alert('no test');
                        break;
                    default:
                        alert('no test');
                        break;
                }
            }
        }).catch((error) => {
            console.log(error);
            switch (action) {
                case 'dialog':
                    alert('no test');
                    break;
                default:
                    alert('no test');
                    break;
            }
        })
    }

    loadAllUsers() {
        let ref = this.realdatabase.ref('users');
        ref.get().then((snapshot) => {
            if (snapshot.exists()) {
                for (const emailP in snapshot.val()) {
                    allUsersArray.push({
                        email: emailP.replace(/ø/g, '.') + '@gmail.com',
                        server: snapshot.val()[emailP]
                    });
                }
                coreSignalHandler(this.Signals.usersListLoaded, this.Mode.read);
            }
            else {
                allUnitsArray = [];
                coreSignalHandler(this.Signals.usersListEmpty, this.Mode.read);
            }
        }).catch((error) => {
            console.log(error);
            coreSignalHandler(this.Signals.usersListFailed, this.Mode.read);
        })
    }
    //#endregion Statistics
    performDbAction(refs, objects, action, callback, i = 0) {
        switch (action) {
            case this.Action.writeDb:
                progressToUi('Записано ' + (Math.round(100 * (i / refs.length))).toString() + "%", true);
                this.realdatabase.ref(refs[i]).set(objects[i], (error) => {
                    if (error) {
                        callback.apply(this, [false]);
                    }
                    else {
                        if (i == refs.length - 1) {
                            callback.apply(this, [true]);
                        }
                        else {
                            this.performDbAction(refs, objects, action, callback, i + 1);
                        }
                    }
                });
                break;
            case this.Action.deleteDb:
                progressToUi('Очищено ' + (Math.round(100 * (i / refs.length))).toString() + "%", true);
                this.realdatabase.ref(refs[i]).remove()
                    .then(() => {
                        if (i == refs.length - 1) {
                            callback.apply(this, [true]);
                        }
                        else {
                            this.performDbAction(refs, objects, action, callback, i + 1);
                        }
                    })
                    .catch(() => {
                        callback.apply(this, [false]);
                    });
                break;
        }
    }

    getDateStamp() {
        const date = new Date();
        return date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2);
    }
}