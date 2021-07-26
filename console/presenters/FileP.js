class FileP{
    constructor(){
        this.url = '';
        this.text = '';
        this.isLocker = '';
        this.hyperName = (Math.round(Math.random() * 1000000000)).toString();
    }

    static PrepareEdit(props, contentL){
        const file_loader = document.getElementById('upload_file');
        document.getElementById('fileEditorHolder').style.display = 'block';
        document.getElementById('fileTextEditTextArea').addEventListener('input', function() {
            currentPresenter.OnEditAction(null, null);
        });
        document.getElementById('fileTextEditTextArea').value = props.text;
        document.getElementById('checkboxLockerFile').checked = props.isLocker;
        file_loader.onchange = evt => {
            const file = file_loader.files[0];
            if (file) {
                currentPresenter.OnEditAction(null, file);
            }
        }
    }

    static OnEditAction(tempProps, id = null, message = null){
        if (message != null) {
            tempProps.url = '';
            const filename = currentFork.name + '/' + currentUnit.unitId + '/' + tempProps.hyperName + '.pdf';
            const loadingProgress = document.getElementById('loadingFileProgress');
            const loadingText = document.getElementById('loadingFileText');
            const uploadTask = firebase.storage().ref().child(filename).put(message, { contentType: '.pdf' });
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    loadingText.innerText = 'Файл загружен на ' + progress + '%';
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
                        tempProps.url = downloadURL;
                        loadingText.innerText = 'Файл загружен!';
                        loadingProgress.style.display = 'none';
                    });
                }
            );
        }
        tempProps.text = document.getElementById('fileTextEditTextArea').value;
        tempProps.isLocker = document.getElementById('checkboxLockerFile').checked;
    }

    static Save(presenter){
        return presenter.tempProps.url != '' && presenter.tempProps.text != '';
    }

    static Draw(props, contentL){
        while (contentL.firstChild) {
            contentL.removeChild(contentL.lastChild);
        }
        const card = document.createElement('div');
        const icon = document.createElement('p');
        const link = document.createElement('a');
        link.innerText = props.text;
        link.href = props.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        card.classList.add('infocard');
        card.classList.add('infocard__color_Blue_Grey');
        icon.innerText = 'picture_as_pdf';
        icon.classList.add('material-icons');
        icon.classList.add('infocard__icon');
        link.classList.add('infocard__text');
        link.classList.add('par__text');
        link.classList.add('par__textStyle_n');
        link.classList.add('par__textAlign_jf');
        link.classList.add('par__size_m');
        link.style.color = '#37474f';
        card.appendChild(icon);
        card.appendChild(link);
        contentL.appendChild(card);
    }
}