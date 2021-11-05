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
        if(record.purchasedBuckets != null){
            account.purchasedBuckets = JSON.parse(record.purchasedBuckets);
        }
        else{
            account.purchasedBuckets = null;
        }
        return account;
    }

    Draw(email, server){
        document.getElementById('devMod1').innerText = this.dev1 != null ? this.dev1.model : '-';
        document.getElementById('devOs1').innerText = this.dev1 != null ? this.dev1.realise : '-';
        document.getElementById('devId1').innerText = this.dev1 != null ? this.dev1.id : '-';
        document.getElementById('devAct1').innerText = this.dev1 != null ? this.dev1.activationDate : '-';
        if(this.dev1 != null){
            if(this.dev1.write2 != 'Jan 1, 1970 03:00:00'){
                document.getElementById('devSync1').innerText = this.dev1.write2;
            }
            else{
                document.getElementById('devSync1').innerText = this.dev1.write1;
            }
        }
        document.getElementById('devMod2').innerText = this.dev2 != null ? this.dev2.model : '-';
        document.getElementById('devOs2').innerText = this.dev2 != null ? this.dev2.realise : '-';
        document.getElementById('devId2').innerText = this.dev2 != null ? this.dev2.id : '-';
        document.getElementById('devAct2').innerText = this.dev2 != null ? this.dev2.activationDate : '-';
        if(this.dev2 != null){
            if(this.dev2.write2 != 'Jan 1, 1970 03:00:00'){
                document.getElementById('devSync2').innerText = this.dev2.write2;
            }
            else{
                document.getElementById('devSync2').innerText = this.dev2.write1;
            }
        }


        const bucketsHolder = document.getElementById('passedBucketsHolder'); 
        while (bucketsHolder.firstChild) {
            bucketsHolder.removeChild(bucketsHolder.lastChild);
        }
        if(this.purchasedBuckets != null){
            for(const bucketId in this.purchasedBuckets){
                for(let i = 0; i < allBucketsArray.length; i++){
                    if(allBucketsArray[i].bucketId.toString() == bucketId){
                        const passed = allBucketsArray[i];
                        this.DrawItem({
                            bucketId: bucketId,
                            name: passed.name, 
                            author: passed.beneficiary, 
                            date: MStoDate(this.purchasedBuckets[bucketId]).addMonths(passed.TTL).toString("d.MM.yy,<br/>HH:mm:ss"),
                            action: 'remove',
                            email: email,
                            server: server
                        });
                        break;
                    }
                }
            }
        }
        if(this.purchaseRequest != null){
            if(this.purchaseRequest.status == 'PENDING'){
                for(let i = 0; i < allBucketsArray.length; i++){
                    if(allBucketsArray[i].bucketId.toString() == this.purchaseRequest.bucketId){
                        const passed = allBucketsArray[i];
                        this.DrawItem({
                            bucketId: this.purchaseRequest.bucketId,
                            name: passed.name, 
                            author: passed.beneficiary, 
                            date: '-',
                            action: 'confirm',
                            email: email,
                            server: server
                        });
                        break;
                    }
                }
            }
        }
    }

    DrawItem(param){
        const holder = document.getElementById('passedBucketsHolder');
        const item = document.createElement('tr');
        const nameText = document.createElement('td');
        nameText.className = 'nameTextBuckets';
        nameText.innerText = param.name;
        const authorText = document.createElement('td');
        authorText.className = 'authorTextBuckets';
        authorText.innerHTML = param.author;
        const dateText = document.createElement('td');
        dateText.className = 'upToBucket';
        dateText.innerHTML = param.date;
        const button = document.createElement('td');
        button.className = 'actionButtonBucket';
        switch(param.action){
            case 'remove':
                //{"1633690537058":1634497163079,"1630266739404":1634497162436}
                const purchasedBuckets = this.purchasedBuckets;
                button.style.color = '#c62828';
                button.innerText = 'УДАЛИТЬ'
                button.onclick = function(){
                    if(author == 'Kutikov'){
                        if(confirm('Вы уверены, что хотите заблокировать доступ к этому бакету?')){
                            delete purchasedBuckets[param.bucketId];
                            firebaseApi.updateBucketQuery(param.email, param.server, {
                                purchasedBuckets: JSON.stringify(purchasedBuckets)
                            });
                            item.remove();
                        }
                    }
                    else{
                        alert("Вы не имеете доступа к этому действию!")
                    }
                }
                break;
            case 'confirm':
                button.style.color = '#2e7d32';
                button.innerText = 'ПРИНЯТЬ'
                button.onclick = function(){
                    if(author == 'Kutikov'){
                        if(confirm('Вы уверены, что хотите одобрить доступ к этому бакету?')){
                            firebaseApi.updateBucketQuery(param.email, param.server, {
                                purchaseRequest: {
                                    status: "PURCHASED",
                                    bucketId: param.bucketId
                                }
                            });
                            item.remove();
                        }
                    }
                    else{
                        alert("Вы не имеете доступа к этому действию!")
                    }
                }
                break;
        }
        item.append(nameText);
        item.append(authorText);
        item.append(dateText);
        item.append(button);
        holder.append(item);
    }
}