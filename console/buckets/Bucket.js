class Bucket {
    constructor() {
        this.bucketId = new Date().getTime();
        this.purchaseURL = '';
        this.includedUnitIds = [];
    }

    static Decode(bucketId, record){
        const bucket = new Bucket();
        bucket.bucketId = bucketId;
        bucket.purchaseURL = record.purchaseURL;
        bucket.includedUnitIds = record.includedUnitIds;
        return bucket;
    }

    GetFirebaseObject(){
        return {
            purchaseURL = this.purchaseURL,
            includedUnitIds = this.includedUnitIds
        };
    }

    static DrawAll(){
        for(let i = 0; i < allBucketsArray.length; i++){
            Bucket.Draw(allBucketsArray[i]);
        }
    }

    static StringifyIncludesId(fork, unit){
        return unit.replace(' ', 'Ø') + '@' + fork.replace(' ', 'Ø')
    }

    static ParseIncludedId(strId) {
        return {
            fork: strId.split('@')[1].replace('Ø', ' '),
            unit: strId.split('@')[0].replace('Ø', ' ')
        }
    }

    static GetAllUnitsOfFrok(forkId) {
        const ret = ['*'];
        for (let i = 0; i < allUnitsArray.length; i++) {
            const sp = allUnitsArray[i].split('@');
            if (sp[1] == forkId.replace(' ', 'Ø')) {
                ret.push(sp[0].replace('Ø', ' '));
            }
        }
        return ret;
    }

    static MakeNode(parentNode, bucket, i, parsed) {
        const contentF = document.getElementById('editItemTeplate').content.cloneNode(true);
        const selectors = contentF.querySelectorAll('.mdc-select__selected-text');
        const lists = contentF.querySelectorAll('.mdc-list');
        selectors[0].id = bucket.bucketId + 'forkSelector' + i.toString();
        selectors[1].id = bucket.bucketId + 'unitSelector' + i.toString();
        selectors[0].addEventListener('DOMSubtreeModified', (k) => {
            while (lists[1].firstChild) {
                lists[1].removeChild(lists[1].lastChild);
            }
            const unitsOfFork = Bucket.GetAllUnitsOfFrok(selectors[0].innerText);
            for (let j = 0; j < unitsOfFork.length; j++) {
                const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
                listItem.querySelector('.mdc-list-item__text').innerText = unitsOfFork[i];
                listItem.querySelector('.mdc-list-item').dataset.value = unitsOfFork[i];
                lists[1].appendChild(listItem);
            }
        });
        for (let j = 0; j < allForksArray.length; j++) {
            const listItem = document.getElementById('listItemTemplate').content.cloneNode(true);
            listItem.querySelector('.mdc-list-item__text').innerText = allForksArray[i].replace('Ø', ' ');
            listItem.querySelector('.mdc-list-item').dataset.value = allForksArray[i].replace('Ø', ' ');
            lists[0].appendChild(listItem);
        }
        selectors[0].innerText = parsed.fork;
        selectors[1].innerText = parsed.unit;
        parentNode.appendChild(contentF);
    }

    static Draw(bucket) {
        const contentL = document.getElementById('bucketCardTemplate').content.cloneNode(true);
        const image_actions = contentL.querySelectorAll('.mdc-card__action--button');
        const holder = contentL.querySelector('.card__presenter_holder');
        const urlText = contentL.querySelector('.mdc-text-field__input');
        contentL.querySelector('.mdc-card').id = 'card' + bucket.bucketId;
        testListMainPage.appendChild(contentL);
        image_actions[0].id = bucket.bucketId + 'edit';
        image_actions[1].id = bucket.bucketId + 'add';
        image_actions[2].id = bucket.bucketId + 'save';
        image_actions[3].id = bucket.bucketId + 'delete';
        image_actions[0].addEventListener('click', () => {
            document.getElementById(bucket.bucketId + 'edit').disabled = true;
            document.getElementById(bucket.bucketId + 'add').disabled = false;
            document.getElementById(bucket.bucketId + 'save').disabled = false;
            document.getElementById(bucket.bucketId + 'delete').disabled = true;
            for (let i = 0; i < bucket.includedUnitIds.length; i++) {
                const parsed = Bucket.ParseIncludedId(bucket.includedUnitIds[i]);
                Bucket.MakeNode(holder, bucket, i, parsed);
            }
        });
        image_actions[2].addEventListener('click', () => {
            if(urlText.value != '' && holder.childElementCount > 0){
                document.getElementById(bucket.bucketId + 'edit').disabled = false;
                document.getElementById(bucket.bucketId + 'save').disabled = true;
                document.getElementById(bucket.bucketId + 'add').disabled = true;
                document.getElementById(bucket.bucketId + 'delete').disabled = false;
                const includes = [];
                for(let i = 0; i < holder.childElementCount; i++){
                    includes.push(Bucket.StringifyIncludesId(
                        document.getElementById(bucket.bucketId + 'forkSelector' + i.toString()).innerHTML,
                        document.getElementById(bucket.bucketId + 'unitSelector' + i.toString()).innerHTML,
                    ));
                }
                bucket.includedUnitIds = includes;
                bucket.urlText = urlText.value;
                firebaseApi.writeBucket(bucket);
            }
        });
        image_actions[1].addEventListener('click', () => {
            Bucket.MakeNode(holder, bucket, holder.childElementCount, { fork: allForksArray[0], unit: '*'});
        });
        image_actions[3].addEventListener('click', () => {
            contentL.getParentNode().removeChild(contentL);
            firebaseApi.deleteBucket(bucket);
        });
        image_actions[1].disabled = true;
        image_actions[2].disabled = true;
        updateDesign();
    }
}