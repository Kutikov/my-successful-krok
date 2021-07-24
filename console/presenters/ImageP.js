class ImageP{

    constructor(){
        this.imageUrl = '';
        this.imageSubscription = '';
        this.hyperName = (Math.round(Math.random() * 1000000000)).toString()
        this.isInvertable = false;
        this.tempFileLink = null;
        this.isLoading = false; 
    }

    static PrepareEdit(props, contentL){
        const image_loader = document.getElementById('upload_image');
        document.getElementById('imageEditorHolder').style.display = 'block';
        document.getElementById('imageTextEditTextArea').addEventListener('input', function() {
            currentPresenter.OnEditAction(null, null);
        });
        document.getElementById('imageTextEditTextArea').value = props.imageSubscription;
        if(props.isInvertable){
            document.getElementById('checkboxInvertImage').click();
        }
        image_loader.onchange = evt => {
            const file = image_loader.files[0];
            if (file) {
                props.tempFileLink = file;
                document.getElementById('image_preview').src = URL.createObjectURL(file);
                currentPresenter.OnEditAction(null, file);
            }
        }
    }

    static OnEditAction(tempProps, id = null, message = null){
        if (message != null) {
            tempProps.imageUrl = '';
            const extension = message.name.split('.')[message.name.split('.').length - 1];
            const filename = currentFork.name + '/' + currentUnit.unitId + '/' + tempProps.hyperName + '.' + extension;
            const loadingProgress = document.getElementById('loadingImageProgress');
            const loadingText = document.getElementById('loadingImageText');
            const uploadTask = firebase.storage().ref().child(filename).put(message, { contentType: 'image/*' });
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    loadingText.innerText = 'Изображение загружено на ' + progress + '%';
                    loadingText.style.display = 'block';
                    loadingProgress.style.display = 'block';
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error.code);
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        tempProps.imageUrl = downloadURL;
                        loadingText.innerText = 'Изображение загружено!';
                        loadingProgress.style.display = 'none';
                    });
                }
            );
        }
        tempProps.imageSubscription = document.getElementById('imageTextEditTextArea').value;
        tempProps.isInvertable = document.getElementById('checkboxInvertImage').checked;
    }

    static Save(presenter){
        return presenter.tempProps.imageUrl == '';
    }

    static Draw(props, contentL){
        while (contentL.firstChild) {
            contentL.removeChild(contentL.lastChild);
        }
        const imagePreview = document.createElement('img');
        const holder = document.createElement('div');
        imagePreview.id = 'image_preview';
        imagePreview.style.width = '100%';
        holder.style.width = '100%';
        if(props.imageUrl == ''){
            if(props.tempFileLink != null){
                imagePreview.src = URL.createObjectURL(props.tempFileLink);
            }
        }
        else{
            imagePreview.src = props.imageUrl;
        }
        holder.appendChild(imagePreview);
        if(props.imageSubscription != ''){
            const sub = document.createElement('p');
            sub.innerText = props.imageSubscription;
            sub.classList.add('par__text');
            sub.classList.add('par__textStyle_i');
            sub.classList.add('par__textAlign_md');
            sub.classList.add('par__size_s');
            sub.style.color = '#333';
            holder.appendChild(sub);
        }
        contentL.appendChild(holder);
    }
}