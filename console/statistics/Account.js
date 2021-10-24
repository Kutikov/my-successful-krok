class Account{
    constructor(){

    }

    static Decode(record){
        const account = new Account();
        if(record.device1 != null){
            account.dev1 = JSON.parse(record.device1);
        }
        else{
            account.dev1 = null;
        }
        if(record.device2 != null){
            account.dev2 = JSON.parse(record.device2);
        }
        else{
            account.dev2 = null;
        }
        account.purchasedRequest = record.purchasedRequest;
        return account;
    }

    Draw(){
        document.getElementById('devMod1').innerText = this.dev1 != null ? this.dev1.model : '-';
        document.getElementById('devOs1').innerText = this.dev1 != null ? this.dev1.realise : '-';
        document.getElementById('devId1').innerText = this.dev1 != null ? this.dev1.id : '-';
        //document.getElementById('devAct1').innerText = this.dev1 != null ? MStoDate(this.dev1.activationDate.getTime()).toString('dd.MM.yy HH:mm') : '-';
        //document.getElementById('devSync1').innerText = this.dev1 != null ?MStoDate(this.dev1.write1.getTime()).toString('dd.MM.yy HH:mm') : '-';
        document.getElementById('devMod2').innerText = this.dev2 != null ? this.dev2.model : '-';
        document.getElementById('devOs2').innerText = this.dev2 != null ? this.dev2.realise : '-';
        document.getElementById('devId2').innerText = this.dev2 != null ? this.dev2.id : '-';
        //document.getElementById('devAct2').innerText = this.dev1 != null ? MStoDate(this.dev2.activationDate.getTime()).toString('dd.MM.yy HH:mm') : '-';
        //document.getElementById('devSync2').innerText = this.dev1 != null ?MStoDate(this.dev2.write1.getTime()).toString('dd.MM.yy HH:mm') : '-';
    }
}