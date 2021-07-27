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
        firebase.auth().signInWithEmailAndPassword('damirkut@gmail.com', 'PaSsWoRd2021')
            .then((userCredential) => {
                console.log(userCredential);
            })
            .catch((error) => {
                console.log(error);
            });
        if(this.verifyOnLoadActions()){
            const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)cr\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            if(cookie != ''){
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
                changeCard('login');
            }
        }
    }

    register(email, password, name){
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                document.cookie = "cr={lg:'" + user.email + "',ps:'" + password + "',ver:false}";
                user.updateProfile({
                    displayName: name
                });
                firebase.auth().currentUser.sendEmailVerification(null)
                    .then(() => {
                        changeCard('success');
                        showMessage('needVerification');
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        console.log(errorCode);
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
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                document.cookie = "cr={lg:" + user.email + ",ps:" + password + ",ver:" + user.emailVerified + "}";
                changeCard('success');
                if(user.emailVerified){
                    showMessage('logedIn');
                }
                else{
                    showMessage('needVerification');
                }
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
            firebase.auth().confirmPasswordReset(actionCode, newPassword)
                .then((resp) => {
                    this.login(email, newPassword);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    switch (errorCode) {
                        case 'auth/expired-action-code':
                            showMessage('expiredTermReresetPass');
                            break;
                        case 'auth/weak-password':
                            showMessage('emptyEmail');
                            break;
                    }
                });
        }
        else{
            firebase.auth().currentUser.sendPasswordResetEmail(email, null)
                .then(() => {
                    changeCard('success');
                    showMessage('passwordEmailSended');
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
        // TODO: Implement getParameterByName()
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
                    firebase.auth().verifyPasswordResetCode(actionCode)
                        .then((email) => {
                            changeCard('login');
                            document.getElementById('loginButtonB').disabled = true;
                            document.getElementById('emailLogin').value = email;
                            showMessage('enterNewPassword');
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            switch(errorCode){
                                case 'auth/expired-action-code':
                                    changeCard('register');
                                    showMessage('expiredTermReresetPass');
                                    break;
                            }
                        });
                    break;
                case 'recoverEmail':
                    break;
                case 'verifyEmail':
                    firebase.auth().applyActionCode(actionCode)
                        .then((resp) => {
                            console.log(resp);
                            changeCard('success');
                            showMessage('emailVerified');
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            switch(errorCode){
                                case 'auth/expired-action-code':
                                    showMessage('expiredTermReregister');
                                    break;
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
}