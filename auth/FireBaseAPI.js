class FireBaseAPI{

    static Servers = {
        kharkiv1: 'kharkiv1',
        kharkiv2: 'kharkiv2'
    }

    static GetRandomServer(){
        const randomId = Math.floor(Math.random() * 2);
        switch(randomId){
            case 0:
                return FireBaseAPI.Servers.kharkiv1;
            case 1:
                return FireBaseAPI.Servers.kharkiv2;
        }
    }

    constructor(){
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
        this.realdatabase = firebase.database();
        this.regFirebase = firebase.initializeApp(this.firebaseConfigMyKROKTutor, FireBaseAPI.Servers.kharkiv2);
        firebase.auth().signInWithEmailAndPassword('damirkut@gmail.com', 'PaSsWoRd2021')
            .then((userCredential) => {
                console.log(userCredential);
                if(window.location.toString().includes('index.html')){
                    if(this.verifyOnLoadActions()){
                        const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)cr\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                        if(cookie != ''){
                            console.log(cookie);
                            firebase.auth().signOut ()
                                .then(() => {
                                })
                                .catch((error) => {
                                    console.log(error);
                                 });
                            this.login(JSON.parse(cookie).lg, JSON.parse(cookie).ps);
                            return;
                        }
                        else{
                            console.log('ok');
                            changeCard('login');
                        }
                    }
                }
                else{
                    this.authSecondServer();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //#region Equiring
    authSecondServer(){
        this.regFirebase.auth().signInWithEmailAndPassword('damirkut@gmail.com', 'PaSsWoRd2021')
            .then((userCredential) => {
                console.log(userCredential);
                changeCard(new URLSearchParams(window.location.search).get('action'));
            })
            .catch((error) => {
                console.log('error entering kharkiv2: ' + error);
            });
    }

    getBucketData(neededBucketId){
        let ref = this.realdatabase.ref('buckets');
        console.log('ok 86')
        ref.get().then((snapshot) => {
            if(snapshot.exists()){
                for(const bucketId in snapshot.val()){
                    if(bucketId == neededBucketId){
                        const targetBucket = Bucket.Decode(bucketId, snapshot.val()[bucketId]);
                        renderBucket(targetBucket);
                        break;
                    }
                }
            }
            else {
                console.log('no buckets');
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    updateBucketQuery(userEmail, serverId, bucketId, success){
        let targerFireStore = null;
        switch(serverId){
            case FireBaseAPI.Servers.kharkiv1:
                targerFireStore = firebase.firestore();
                break;
            case FireBaseAPI.Servers.kharkiv2:
                targerFireStore = this.regFirebase.firestore();
                break;
        }
        const userRecord = targerFireStore.collection("users").doc(userEmail);
        userRecord.get()
            .then((doc) => {
                if(doc.exists){
                    userRecord
                        .update({
                            purchaseRequest: {
                                status: success ? "PURCHASED" : "CANCELED",
                                bucketId: bucketId
                            } 
                        })
                        .then(() => {
                            console.log("updated!");
                        })
                        .catch((error) => {
                            console.error("Error updating document: ", error);
                        });
                }
                else{
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    }
    //#endregion Equiring

    //#region Auth
    register(email, password, name){
        this.regFirebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                user.updateProfile({
                    displayName: name
                });
                this.regFirebase.auth().signInWithEmailAndPassword(email, password)
                    .then((userCredential2) => {
                        userCredential2.user.sendEmailVerification(null)
                            .then(() => {
                                let targerFireStore = null;
                                const userFireStrore = new User(email, name);
                                const server = FireBaseAPI.GetRandomServer();
                                switch(server){
                                    case FireBaseAPI.Servers.kharkiv1:
                                        targerFireStore = firebase.firestore();
                                        break;
                                    case FireBaseAPI.Servers.kharkiv2:
                                        targerFireStore = this.regFirebase.firestore();
                                        break;
                                }
                                const updates = {};
                                updates['/users/' + email.split('@')[0].replace(/\./g, 'ø')] = server;
                                firebase.database().ref().update(updates);
                                targerFireStore.collection('users').doc(email).set(userFireStrore.GetFireStroreObject())
                                    .then(() => {
                                        changeCard('success');
                                        showMessage('needVerification');
                                        const loginPass = { lg: email, ps: password, ver: false };
                                        document.cookie = "cr=" + JSON.stringify(loginPass);
                                        loginPass['action'] = 'register';
                                        interactionInterface(JSON.stringify(loginPass));
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                
            })
            .catch((error) => {
                const errorCode = error.code;
                switch(errorCode){
                    case 'auth/weak-password':
                        showMessage('weakPassword');
                        break;
                    case 'auth/email-already-in-use':
                        showMessage('duplicateEmail');
                        break;
                    case 'auth/invalid-email':
                        showMessage('emptyEmail');
                        break;
                }
                document.getElementById('loginingButtonB').disabled = false;
                document.getElementById('registerButtonB').disabled = false;
            });
    }

    login(email, password){
        this.regFirebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const loginPass = { lg: user.email, ps: password, ver: user.emailVerified };
                document.cookie = "cr=" + JSON.stringify(loginPass);
                changeCard('success');
                if(user.emailVerified){
                    showMessage('logedIn');
                    loginPass['action'] = 'login';
                }
                else{
                    showMessage('needVerification');
                    loginPass['action'] = 'not_verified';
                }
                interactionInterface(JSON.stringify(loginPass));
            })
            .catch((error) => {
                const errorCode = error.code;
                switch(errorCode){
                    case 'auth/wrong-password':
                        showMessage('wrongPassword');
                        document.getElementById('resetButtonB').disabled = false;
                        break;
                    case 'auth/user-not-found':
                        showMessage('notFoundEmail');
                        break;
                    case 'auth/invalid-email':
                        showMessage('emptyEmail');
                        break;
                }
                document.getElementById('registartionButtonB').disabled = true;
                document.getElementById('loginButtonB').disabled = false;
            });      
    }

    resetPass(email, newPassword = null, updatePassword){
        if(updatePassword){
            const actionCode = this.getParameterByName('oobCode');
            this.regFirebase.auth().confirmPasswordReset(actionCode, newPassword)
                .then((resp) => {
                    this.login(email, newPassword);
                    window.location.href = window.location.href.split('?')[0];
                })
                .catch((error) => {
                    const errorCode = error.code;
                    switch (errorCode) {
                        case 'auth/expired-action-code':
                            showMessage('expiredTermReresetPass');
                            break;
                        case 'auth/weak-password':
                            showMessage('weakPassword');
                            break;
                    }
                });
        }
        else{
            this.regFirebase.auth().sendPasswordResetEmail(email, null)
                .then(() => {
                    changeCard('success');
                    showMessage('passwordEmailSended');
                    interactionInterface('update_password_email');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    console.log(errorCode);
                    switch (errorCode) {
                        case 'auth/invalid-email':
                        case 'auth/user-not-found':
                            showMessage('expiredTermReresetPass');
                            break;
                    }
                });
        }
    }

    getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    
    verifyOnLoadActions() {
        const mode = this.getParameterByName('mode');
        const actionCode = this.getParameterByName('oobCode');
        const lang = this.getParameterByName('lang') || 'ua';
        switch(lang){
            case 'en':
                localize(1);
                break;
            case 'ua':
            case 'uk':
                localize(0);
                break;
            case 'ru':
                localize(2);
                break;
        }
        if (mode) {
            switch (mode) {
                case 'resetPassword':
                    this.regFirebase.auth().verifyPasswordResetCode(actionCode)
                        .then((email) => {
                            changeCard('login');
                            updatePassword = true;
                            document.getElementById('loginButtonB').disabled = true;
                            document.getElementById('registartionButtonB').disabled = true;
                            document.getElementById('emailLogin').value = email;
                            showMessage('enterNewPassword', true);
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            switch(errorCode){
                                case 'auth/expired-action-code':
                                case 'auth/invalid-action-code':
                                    changeCard('login');
                                    showMessage('expiredTermReresetPass');
                                    return true;
                            }
                        });
                    break;
                case 'recoverEmail':
                    break;
                case 'verifyEmail':
                    this.regFirebase.auth().applyActionCode(actionCode)
                        .then((resp) => {
                            console.log(resp);
                            changeCard('success');
                            showMessage('emailVerified');
                            const loginPass = JSON.parse(document.cookie);
                            loginPass['action'] = 'verified';
                            interactionInterface(JSON.stringify(loginPass));
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            switch(errorCode){
                                case 'auth/expired-action-code':
                                    showMessage('expiredTermReregister');
                                    break;
                                case 'auth/invalid-action-code':
                                    return true;
                            }
                        });
                    break;
                default:
                    break;
            }
            return false;
        }
        return true;
    };
    //#endregion Auth
}