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
        account.purchaseRequest = record.purchaseRequest;
        account.purchasedBuckets = JSON.parse(record.purchasedBuckets);
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


        const bucketsHolder = document.getElementById('passedBucketsHolder'); 
        while (bucketsHolder.firstChild) {
            bucketsHolder.removeChild(bucketsHolder.lastChild);
        }
        for(const bucketId in this.purchasedBuckets){
            for(let i = 0; i < allBucketsArray.length; i++){
                if(allBucketsArray[i].bucketId.toString() == bucketId){
                    const passed = allBucketsArray[i];
                    this.DrawItem(
                        passed.name, 
                        passed.beneficiary, 
                        MStoDate(this.purchasedBuckets[bucketId]).addMonths(passed.TTL).toString("d.MM.yy,<br/>HH:mm:ss"),
                        'remove');
                    break;
                }
            }
        }
        if(this.purchaseRequest.status == 'PENDING'){
            for(let i = 0; i < allBucketsArray.length; i++){
                if(allBucketsArray[i].bucketId.toString() == this.purchaseRequest.bucketId){
                    const passed = allBucketsArray[i];
                    this.DrawItem(
                        passed.name, 
                        passed.beneficiary, 
                        '-',
                        'confirm');
                    break;
                }
            }
        }
    }

    DrawItem(name, author, date, action){
        const item = document.createElement('tr');
        const nameText = document.createElement('td');
        nameText.className = 'nameTextBuckets';
        nameText.innerText = name;
        const authorText = document.createElement('td');
        authorText.className = 'authorTextBuckets';
        authorText.innerHTML = author;
        const dateText = document.createElement('td');
        dateText.className = 'upToBucket';
        dateText.innerHTML = date;
        const button = document.createElement('td');
        button.className = 'actionButtonBucket';
        switch(action){
            case 'remove':
                button.style.color = '#c62828';
                button.innerText = 'УДАЛИТЬ'
                button.onclick = function(){
                    alert('remove');
                }
                break;
            case 'confirm':
                button.style.color = '#2e7d32';
                button.innerText = 'ПРИНЯТЬ'
                button.onclick = function(){
                    alert('confirm');
                }
                break;
        }
        item.append(nameText);
        item.append(authorText);
        item.append(dateText);
        item.append(button);
        document.getElementById('passedBucketsHolder').append(item);
    }
}