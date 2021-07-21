class FireBaseAPI{
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
    }

    readTests(fork, unit){
        let ref = this.realdatabase.ref('tests').orderByChild('fork_unitId').equalTo(unit.replace(' ', 'Ø') + '@' + fork.replace(' ', 'Ø'));
        ref.get().then((snapshot) => {
            if(snapshot.exists()){
                const testsArray = [];
                for(const testId in snapshot.val()){
                    testsArray.push(TestAccount.DecodeTestAccount(testId, snapshot.val()[testId]));
                }
                console.log(testsArray);
            }
            else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    writeTests(testAccounts){
        console.log(testAccounts);
        for(let i = 0; i < testAccounts.length; i++){
            if(testAccounts[i].needUpdate){
                this.realdatabase.ref('tests/' + testAccounts[i].testId).set({
                    unitId: testAccounts[i].unitId,
                    forkId: testAccounts[i].forkId,
                    task: testAccounts[i].task,
                    comment: testAccounts[i].comment,
                    answersTrue: testAccounts[i].answersTrue,
                    answersFalse: testAccounts[i].answersFalse,
                    fork_unitId: testAccounts[i].fork_unitId
                }, (error) => {
                    if(error){
                        console.log('error on test #' + (i + 1).toString());
                    }
                    else{
                        console.log('ok on test #' + (i + 1).toString());
                    }
                });
            }
        }
    }
}