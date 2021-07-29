class Bucket {
    constructor() {
        this.bucketId = new Date().getTime();
        this.addresses = [];
        this.beneficiary = '';
        this.cost = '0.00 UAH';
        this.description = '';
        this.detailsURL = '';
        this.name = '';
        this.shopURL = '';
        this.templateURL = '';
    }

    static Decode(bucketId, record){
        const bucket = new Bucket();
        bucket.bucketId = bucketId;
        bucket.addresses = record.addresses;
        bucket.beneficiary = record.beneficiary;
        bucket.cost = record.cost;
        bucket.description = record.description;
        bucket.detailsURL = record.detailsURL;
        bucket.name = record.name;
        bucket.shopURL = record.shopURL;
        bucket.templateURL = record.templateURL;
        return bucket;
    }

    GetFirebaseObject(){
        return {
            addresses: this.addresses,
            beneficiary: this.beneficiary,
            cost: this.cost,
            description: this.description,
            detailsURL: this.detailsURL,
            name: this.name,
            shopURL: this.shopURL,
            templateURL: this.templateURL
        };
    }

    static DrawAll(){
        for(let i = 0; i < allBucketsArray.length; i++){
            Bucket.Draw(allBucketsArray[i]);
        }
    }

    static StringifyIncludesId(fork, unit){
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

    static MakeNode(parentNode, bucket, i, parsed) {
        const contentF = document.getElementById('editItemTeplate').content.cloneNode(true);
        const selectorsH = contentF.querySelectorAll('.mdc-select');
        const selectors = contentF.querySelectorAll('.mdc-select__selected-text');
        const lists = contentF.querySelectorAll('.mdc-list');
        selectors[0].id = bucket.bucketId + 'forkSelector' + i.toString();
        selectors[1].id = bucket.bucketId + 'unitSelector' + i.toString();
        selectorsH[0].id = bucket.bucketId + 'forkSelectorH' + i.toString();
        selectorsH[1].id = bucket.bucketId + 'unitSelectorH' + i.toString();
        for (let j = 0; j < allForksArray.length; j++) {
            const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
            listItem.querySelector('.mdc-list-item__text').innerText = allForksArray[j].replace(/ø/g, ' ');
            listItem.querySelector('.mdc-list-item').dataset.value = allForksArray[j].replace(/ø/g, ' ');
            lists[0].appendChild(listItem);
        }
        parentNode.appendChild(contentF);
        let sel1 = new mdc.select.MDCSelect(document.getElementById(selectorsH[0].id));
        let sel2 = new mdc.select.MDCSelect(document.getElementById(selectorsH[1].id));
        selectors[0].addEventListener('DOMSubtreeModified', (k) => {
            if(!document.getElementById(bucket.bucketId + 'add').disabled){
                while (lists[1].firstChild) {
                    lists[1].removeChild(lists[1].lastChild);
                }
                const unitsOfFork = Bucket.GetAllUnitsOfFrok(selectors[0].innerText);
                for (let j = 0; j < unitsOfFork.length; j++) {
                    const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
                    listItem.querySelector('.mdc-list-item__text').innerText = unitsOfFork[j];
                    listItem.querySelector('.mdc-list-item').dataset.value = unitsOfFork[j];
                    lists[1].appendChild(listItem);
                }
            }
        });
        selectors[0].innerText = parsed.fork;
        selectors[1].innerText = parsed.unit;
    }

    static Draw(bucket) {
        const contentL = document.getElementById('bucketCardTemplate').content.cloneNode(true);
        const image_actions = contentL.querySelectorAll('.mdc-card__action--button');
        const texts = contentL.querySelectorAll('.mdc-text-field__input');
        const holder = contentL.querySelector('.card__presenter_holder');
        const radios = contentL.querySelectorAll('.mdc-radio__native-control');
        contentL.querySelector('.mdc-card').id = 'card' + bucket.bucketId;
        testListMainPage.appendChild(contentL);
        texts[0].value = bucket.name; 
        texts[1].value = bucket.description; 
        texts[2].value = bucket.beneficiary; 
        texts[3].value = bucket.cost.split(' ')[0]; 
        texts[4].value = bucket.shopURL; 
        texts[5].value = bucket.detailsURL; 
        texts[6].value = bucket.templateURL;
        radios[0].checked = bucket.cost.split(' ')[1] == "USD";
        radios[1].checked = bucket.cost.split(' ')[1] == "UAH";
        image_actions[0].id = bucket.bucketId + 'edit';
        image_actions[1].id = bucket.bucketId + 'add';
        image_actions[2].id = bucket.bucketId + 'save';
        image_actions[3].id = bucket.bucketId + 'delete';
        image_actions[0].addEventListener('click', () => {
            document.getElementById(bucket.bucketId + 'edit').disabled = true;
            document.getElementById(bucket.bucketId + 'add').disabled = false;
            document.getElementById(bucket.bucketId + 'save').disabled = false;
            document.getElementById(bucket.bucketId + 'delete').disabled = true;
        });
        image_actions[2].addEventListener('click', () => {
            let allValid = true;
            for(let textI = 0; textI < texts.length; textI++){
                if(!texts[textI].checkValidity()){
                    allValid = false;
                }
            }
            if(allValid && holder.childElementCount > 0){
                document.getElementById(bucket.bucketId + 'edit').disabled = false;
                document.getElementById(bucket.bucketId + 'save').disabled = true;
                document.getElementById(bucket.bucketId + 'add').disabled = true;
                document.getElementById(bucket.bucketId + 'delete').disabled = false;
                const includes = [];
                for(let i = 0; i < holder.childElementCount / 2; i++){
                    includes.push(Bucket.StringifyIncludesId(
                        document.getElementById(bucket.bucketId + 'forkSelector' + i.toString()).innerText,
                        document.getElementById(bucket.bucketId + 'unitSelector' + i.toString()).innerText,
                    ));
                }
                bucket.addresses = includes;
                bucket.name = texts[0].value;
                bucket.description = texts[1].value;
                bucket.beneficiary = texts[2].value;
                bucket.cost = texts[3].value + (radios[0].checked ? " USD" : " UAH");
                bucket.shopURL = texts[4].value;
                bucket.detailsURL = texts[5].value;
                bucket.templateURL = texts[6].value;
                firebaseApi.writeBucket(bucket);
            }
        });
        image_actions[1].addEventListener('click', () => {
            Bucket.MakeNode(holder, bucket, holder.childElementCount / 2, { fork: allForksArray[0], unit: '*'});
        });
        image_actions[3].addEventListener('click', () => {
            contentL.getParentNode().removeChild(contentL);
            firebaseApi.deleteBucket(bucket);
        });
        image_actions[1].disabled = true;
        image_actions[2].disabled = true;
        if(bucket.addresses == null){
            bucket.addresses = [];
        }
        for (let i = 0; i < bucket.addresses.length; i++) {
            const parsed = Bucket.ParseIncludedId(bucket.addresses[i]);
            Bucket.MakeNode(holder, bucket, i, parsed);
        }
        updateDesign();
    }
}