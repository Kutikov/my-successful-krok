const win1251Decoder = new TextDecoder('windows-1251');
const utf8Decoder = new TextDecoder('utf-8');
const EncodingE = {
    QST_UTF8 : 'QST_UTF8',
    QST_WIN1251 : 'QST_WIN1251',
    QST_ENCRYPTED : 'QST_ENCRYPTED',
    GIFT : 'GIFT'
}
const cryptoHelper = (function(){
    return{
        encryptMessage: function(messageToencrypt = '', secretkey = ''){
            var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
            return encryptedMessage.toString();
        },
        decryptMessage: function(encryptedMessage = '', secretkey = ''){
            var decryptedBytes = CryptoJS.AES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(encryptedMessage)
            }, CryptoJS.enc.Hex.parse(CryptoJS.lib.ByteArray(secretkey)), {
                iv: CryptoJS.enc.Hex.parse(CryptoJS.lib.ByteArray(secretkey)),
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            });
            //var decryptedMessage = CryptoJS.enc.Utf8.stringify(decryptedBytes);
            return decryptedBytes;
        }
    }
})();

function utf8ToBytes(str) {
    let byteArray = [];
    for (let i = 0; i < str.length; i++){
        if (str.charCodeAt(i) <= 0x7F){
            byteArray.push(str.charCodeAt(i));
        }
        else {
            let h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
            for (let j = 0; j < h.length; j++){
                byteArray.push(parseInt(h[j], 16));
            }
        }
    }
    for (let i = byteArray.length; i < 16; i++){
        byteArray.push(0);
    }   
    return byteArray;
};

function setup(fileinputId){
    document.getElementById(fileinputId).addEventListener('change', function(){
        const fr = new FileReader();
        fr.onload = function(){
            let encoding;
            let decoder;
            let filecontent = fr.result;
            let draft = win1251Decoder.decode(filecontent);
            if(draft.startsWith("<ENCRYPTED>")){
                encoding = EncodingE.QST_ENCRYPTED;
                decoder = utf8Decoder;
            }
            else if(draft.startsWith("<GIFT>")){
                encoding = EncodingE.GIFT;
                decoder = utf8Decoder;
            }
            else{
                if(utf8Decoder.decode(filecontent).match('�')){
                    encoding = EncodingE.QST_WIN1251;
                    decoder = win1251Decoder;
                }
                else{
                    encoding = EncodingE.QST_UTF8;
                    decoder = utf8Decoder;
                }
            }
            const source = decoder.decode(filecontent);
            let testsArray = [];
            switch(encoding){
                case EncodingE.QST_WIN1251:
                case EncodingE.QST_UTF8:
                    testsArray = parseQST(source, currentFork.name, currentUnit.unitId);
                    break;
                case EncodingE.GIFT:
                    testsArray = parseGift(source, currentFork.name, currentUnit.unitId);
                    break;
                case EncodingE.QST_ENCRYPTED:
                    //decrypt(source);
                    break;
            }
            currentTestArray = testsArray;
            firebaseApi.writeTests();
        }
        fr.readAsArrayBuffer(this.files[0]);
    });
}

function parseQST(input, fork = '', unit = ''){
    input = "\n\n" + input.replace(/\t/i, ' ').replace(/(?:[\r\n])/g, '\n');
    const fragments = input.split("\n\n?");
    const objectsArrayList = [];
    for (let i = 1; i < fragments.length; i++) {
        const sss = fragments[i].split("\n\n");
        let task = '';
        let comment = '';
        let answersTrueL = [];
        let answersFalseL = [];
        let currentModifier = "?";
        for (let a = 0; a < sss.length; a++) {
            const ss = sss[a];
            if (ss.startsWith("?")) {
                comment = '';
                currentModifier = "?";
            } else if (ss.startsWith("!")) {
                comment = '';
                currentModifier = "!";
            } else if (ss.startsWith("+")) {
                answersTrueL.push(ss.trim());
                currentModifier = "+";
            } else if (ss.startsWith("-")) {
                answersFalseL.push(ss.trim());
                currentModifier = "-";
            } else if(ss != '') {
                if (currentModifier == "?") {
                    if (!task.endsWith(" ") && !ss.startsWith(" ")) {
                        task = task + ' ' + ss;
                    } else if (task.endsWith("-") && !task.endsWith(" -")) {
                        task = task.substr(0, task.length - 1);
                    } else {
                        task = task + ss;
                    }
                } else if (currentModifier == "!") {
                    comment = comment + ss;
                }
            }
        }
        if (task != "" && answersTrueL.length > 0 && answersTrueL.length + answersFalseL.length - 1 < 18) {
            if (task.endsWith("\n")) {
                task = task.substring(0, task.length - 1);
            }
            if (task.startsWith(" ")) {
                task = task.trim();
            }
            objectsArrayList.push(TestAccount.GetTestAccount(task, comment.trim(), answersTrueL, answersFalseL, fork, unit, i));
        }
    }
    return objectsArrayList;
}

function parseGift(input, fork = '', unit = ''){
    const objectsArrayList = [];
    let task;
    let answersTrueList = [];
    let answersFalseList = [];
    let currentModifier = "!";
    input = input.replace(/(?:[\r\n])/g, '\n');
    const doubleDotFragments = input.split("::");
    let counter = 1;
    for (let i = 0; i < doubleDotFragments.length; i++) {
        const doubleDotFragment = doubleDotFragments[i];
        if (doubleDotFragment.endsWith("}") || doubleDotFragment.endsWith("}\n") || doubleDotFragment.endsWith("}\n\n") || doubleDotFragment.endsWith("}\n\n\n")) {
            let figureFragment = doubleDotFragment.split("{");
            let comment = '';
            if (figureFragment[0].startsWith("\n")) {
                task = figureFragment[0].trim();
            } else {
                task = figureFragment[0];
            }
            answersTrueList = [];
            answersFalseList = [];
            const answers = figureFragment[1].split("\n\n");
            for (let j = 0; j < answers.length; j++) {
                const answer = answers[j];
                if (answer.startsWith("=")) {
                    answersTrueList.push(answer.split("#")[0].trim());
                } else if (answer.startsWith("~")) {
                    answersFalseList.push(answer.split("#")[0].trim());
                } else if (answer.startsWith("#")) {
                    currentModifier = "#";
                } else if (currentModifier == "#") {
                    if (answer.endsWith("}")) {
                        comment = comment + answer.substring(0, answer.length - 1);
                    } else {
                        comment = comment + answer;
                    }
                }
            }
            if (answersTrueList.length > 0 && answersFalseList.length > 0 && task.length > 0 && answersTrueList.length + answersFalseList.length - 1 < 18) {
                if (task.endsWith("\n")) {
                    task = task.substring(task.substring(0, task.length - 1));
                }
                objectsArrayList.push(TestAccount.GetTestAccount(task.trim(), comment.trim(), answersTrueList, answersFalseList, fork, unit, counter));
                counter++;
            }
        }
    }
    return objectsArrayList;
}

function decrypt(source){
    encrypted = source.split('\n')[1];
    console.log(CryptoJS.enc.Base64.parse(encrypted));
    let key = utf8ToBytes('bismillahi');
    let reslt = code.decryptMessage(encrypted, key);
    console.log(reslt);
}