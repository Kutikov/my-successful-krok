class Bucket {
    constructor() {
        this.bucketId = new Date().getTime();
        this.addresses = [];
        this.beneficiary = '';
        this.cost = '0.00 UAH';
        this.description = '';
        this.descriptionFull = '';
        this.detailsURL = '';
        this.name = 'New bucket' + Math.floor(Math.random() * 100);
        this.TTL = 0;
        this.shopURL = '';
        this.templateURL = '';
    }

    static Decode(bucketId, record) {
        const bucket = new Bucket();
        bucket.bucketId = bucketId;
        bucket.addresses = record.addresses;
        bucket.beneficiary = record.beneficiary;
        bucket.cost = record.cost;
        bucket.description = record.description;
        bucket.descriptionFull = record.descriptionFull;
        bucket.detailsURL = record.detailsURL;
        bucket.name = record.name;
        bucket.shopURL = record.shopURL;
        bucket.TTL = record.TTL;
        bucket.templateURL = record.templateURL;
        if (bucket.TTL == undefined) {
            bucket.TTL = 0;
        }
        return bucket;
    }

    GetFirebaseObject() {
        return {
            addresses: this.addresses,
            beneficiary: this.beneficiary,
            cost: this.cost,
            description: this.description,
            descriptionFull: this.descriptionFull,
            detailsURL: this.detailsURL,
            name: this.name,
            shopURL: this.shopURL,
            templateURL: this.templateURL,
            TTL: this.TTL
        };
    }

    static DrawAll() {
        Bucket.Draw(allBucketsArray[0]);
    }

    static StringifyIncludesId(fork, unit) {
        if(fork == '-' || fork == ''){
            return null;
        }
        return unit.replace(/ /g, 'ø') + '@' + fork.replace(/ /g, 'ø')
    }

    static ParseIncludedId(strId) {
        return {
            fork: strId.split('@')[1].replace(/ø/g, ' '),
            unit: strId.split('@')[0].replace(/ø/g, ' ')
        }
    }

    static GetAllUnitsOfFrok(forkId) {
        const ret = ['*'];
        for (let i = 0; i < allUnitsArray.length; i++) {
            const sp = allUnitsArray[i].split('@');
            if (sp[1] == forkId.replace(/ /g, 'ø')) {
                ret.push(sp[0].replace(/ø/g, ' '));
            }
        }
        return ret;
    }

    static GenerateCodes(cost){
        document.getElementById('acceptLink').innerText = "https://kutikov.github.io/my-successful-krok/auth/equiring.html?action=accept&code=" + (cost + 10000 + 45.575).toString();
        document.getElementById('rejectLink').innerText = "https://kutikov.github.io/my-successful-krok/auth/equiring.html?action=reject&code=" + (cost + 10000 + 45.575).toString();
    }

    static Draw(bucket) {
        document.getElementById('nameEditText').value = bucket.name;
        document.getElementById('descriptionEditText').value = bucket.description;
        document.getElementById('descriptionFullEditText').value = bucket.descriptionFull;
        document.getElementById('beneficiarEditText').value = bucket.beneficiary;
        document.getElementById('costEditText').value = bucket.cost.split(' ')[0];
        document.getElementById('shopUrlEditText').value = bucket.shopURL;
        document.getElementById('detailsUrlEditText').value = bucket.detailsURL;
        document.getElementById('schemaUrlEditText').innerText = bucket.templateURL;
        document.getElementById('currencyEditText').innerText = bucket.cost.split(' ')[1];
        document.getElementById('monthEditText').value = bucket.TTL;
        const cost = Number(bucket.cost.split(' ')[0]);
        Bucket.GenerateCodes(cost);
        if (bucket.addresses == null) {
            bucket.addresses = [];
        }
        for (let i = 0; i < bucket.addresses.length; i++) {
            const parsed = Bucket.ParseIncludedId(bucket.addresses[i]);
            document.getElementById('slot' + (i + 1).toString() + 'Mtext').innerText = parsed.fork;
            document.getElementById('slot' + (i + 1).toString() + 'Utext').innerText = parsed.unit;
        }
        saveButton.disabled = false;
        deleteButton.disabled = false;
        currentBucket = bucket;
    }
}