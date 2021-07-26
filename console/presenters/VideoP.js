class VideoP{
    constructor(){
        this.videoId = 'M7lc1UVf-VE';
        this.startPoint = '00:00:00';
        this.endPoint = '00:00:00';
        this.isLocker = false;
        this.maxTime = 0;
        this.videoTitle = '';
    }

    static PrepareEdit(props, contentL){
        document.getElementById('videoEditorHolder').style.display = 'block';
        const videoURLTextEditTextArea = document.getElementById('videoURLTextEditTextArea');
        const videoFrom = document.getElementById('videoFrom');
        const videoTo = document.getElementById('videoTo');
        const checkboxLockerVideo = document.getElementById('checkboxLockerVideo');
        videoFrom.value = props.startPoint;
        videoTo.value = props.endPoint;
        videoURLTextEditTextArea.value = 'https://www.youtube.com/watch?v=' + props.videoId;
        checkboxLockerVideo.checked = props.isLocker;
        videoURLTextEditTextArea.addEventListener('input', (e) => {
            currentPresenter.OnEditAction('videoURLTextEditTextArea', null);
        });
        videoFrom.addEventListener('blur', (e) => {
            currentPresenter.OnEditAction(null, null);
        });
        videoTo.addEventListener('blur', (e) => {
            currentPresenter.OnEditAction(null, null);
        });
        checkboxLockerVideo.addEventListener('click', (e) => {
            currentPresenter.OnEditAction(null, null);
        })
        currentPresenter.OnEditAction('videoURLTextEditTextArea', null);
    }

    static OnEditAction(tempProps, id = null, message = null){
        const linearProgress = document.getElementById('loadingVideoProgress');
        const technicalVideoHolder = document.getElementById('technicalVideoHolder');
        const videoURLTextEditTextArea = document.getElementById('videoURLTextEditTextArea');
        const videoFrom = document.getElementById('videoFrom');
        const videoTo = document.getElementById('videoTo');
        tempProps.isLocker = document.getElementById('checkboxLockerVideo').checked
        if(message == null){
            if(tempProps.maxTime == 0 && id == null){
                return;
            }
            const youtube_regex = /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/;
            let videoId;
            if(!videoURLTextEditTextArea.value.match(youtube_regex)[2]){
                return;
            }
            else{
                videoId = videoURLTextEditTextArea.value.match(youtube_regex)[2]
            }
            if(videoId != tempProps.videoId || tempProps.maxTime == 0){
                tempProps.videoId = videoId;
                tempProps.maxTime = 0;
                tempProps.videoTitle = '';
                tempProps.startPoint = '00:00:00';
                tempProps.endPoint = '00:00:00';
                videoFrom.value = '00:00:00';
                videoTo.value = '00:00:00';
                linearProgress.style.display = 'block';
                console.log('st');
                while (technicalVideoHolder.firstChild) {
                    technicalVideoHolder.removeChild(technicalVideoHolder.lastChild);
                }
                const technicalVideoHolder2 = document.createElement('div');
                technicalVideoHolder2.id = 'technicalVideoHolder2';
                technicalVideoHolder.appendChild(technicalVideoHolder2);
                new YT.Player('technicalVideoHolder2', {
                    height: '360',
                    width: '640',
                    videoId: tempProps.videoId,
                    events: {
                        'onReady': (event) => {
                            event.target.setVolume(0);
                            event.target.playVideo();
                            setTimeout(() => {
                                event.target.stopVideo();
                                currentPresenter.OnEditAction(null, {duration: Math.floor(event.target.getDuration()), title: event.target.getVideoData().title});
                            }, 5000);
                        },
                        'onStateChange': (event) => {}
                    }
                });
                return;
            }
            tempProps.videoId = videoId;
            if(tempProps.maxTime != 0){
                const startObj = VideoP.StringToSeconds(videoFrom.value);
                const finishObj = VideoP.StringToSeconds(videoTo.value);
                if(finishObj.success){
                    if(tempProps.maxTime < finishObj.seconds){
                        const maxEndTime = VideoP.SecondToString(tempProps.maxTime);
                        videoTo.value = maxEndTime;
                        currentPresenter.OnEditAction(null, null);
                        return;
                    }
                    else{
                        tempProps.endPoint = finishObj.point;
                    }
                }
                else{
                    const maxEndTime = VideoP.SecondToString(tempProps.maxTime);
                    videoTo.value = maxEndTime;
                    currentPresenter.OnEditAction(null, null);
                    return;
                }
                if(startObj.success){
                    if(tempProps.maxTime <= startObj.seconds){
                        const maxStartTime = VideoP.SecondToString(tempProps.maxTime - 1);
                        videoFrom.value = maxStartTime;
                        currentPresenter.OnEditAction(null, null);
                        return;
                    }
                    if(VideoP.StringToSeconds(tempProps.endPoint).seconds != 0){
                        if(startObj.seconds >= finishObj.seconds){
                            const maxStartTime = VideoP.SecondToString(finishObj.seconds - 1);
                            videoFrom.value = maxStartTime;
                            currentPresenter.OnEditAction(null, null);
                            return;
                        }
                        else{
                            tempProps.startPoint = startObj.point;
                        }
                    }
                    else{
                        tempProps.startPoint = startObj.point;
                    }
                }
                else{
                    videoFrom.value = startObj.point;
                    currentPresenter.OnEditAction(null, null);
                    return;
                }
            }            
        }
        else{
            linearProgress.style.display = 'none';
            tempProps.maxTime = message.duration;
            tempProps.videoTitle = message.title;
            videoFrom.value = VideoP.SecondToString(0);
            videoTo.value = VideoP.SecondToString(tempProps.maxTime);
            currentPresenter.OnEditAction(null, null);
        }
    }

    static SecondToString(sec){
        const hour = (sec - sec % 3600) / 3600; 
        const minutes = ((sec % 3600) - (sec % 3600) % 60) / 60;
        const seconds = sec - hour * 3600 - minutes * 60;
        return hour.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }

    static StringToSeconds(str){
        const time_regex = /\d\d:\d\d:\d\d/s;
        if(str.length == 8 && str.match(time_regex)){
            const parts = str.split(':');
            let successL = true;
            let seconds = new Number(parts[2]);
            if(seconds > 59){
                successL = false;
                seconds = 59;
            }
            let minutes = new Number(parts[1]);
            if(minutes > 59){
                successL = false;
                minutes = 59;
            }
            let hours = new Number(parts[0]);
            let secondsConverted = 0;
            if(successL){
                secondsConverted = seconds + minutes * 60 + hours * 60 * 60;
            }
            return { success: successL, point: VideoP.SecondToString(secondsConverted), seconds: secondsConverted };
        }
        return { success: false, point: '00:00:00', seconds: 0 };
    }

    static Save(presenter){
        return presenter.tempProps.maxTime != 0 && presenter.tempProps.videoId != '';
    }

    static Draw(props, contentL){
        while (contentL.firstChild) {
            contentL.removeChild(contentL.lastChild);
        }
        const previewHolder = document.createElement('div');
        const preview = document.createElement('div');
        const previewIcon = document.createElement('p');
        preview.id = 'preview' + Math.round(Math.random() * 100000).toString();
        preview.style.display = 'none';
        previewHolder.classList.add('video__preview_holder');
        previewIcon.innerText = 'hourglass_empty';
        previewIcon.classList.add('material-icons');
        previewIcon.classList.add('video__preview_icon');
        previewIcon.id = preview.id + 'button';
        previewHolder.appendChild(preview);
        previewHolder.appendChild(previewIcon);
        const startS = VideoP.StringToSeconds(props.startPoint).seconds;
        const endS = VideoP.StringToSeconds(props.endPoint).seconds;
        
        const titlePar = document.createElement('p');
        titlePar.classList.add('card__text');
        titlePar.classList.add('par__textStyle_b');
        titlePar.innerText = props.videoTitle;
        const timePar = document.createElement('p');
        timePar.classList.add('card__text');
        timePar.innerText = 'С ' + props.startPoint + " по " + props.endPoint + " (всего " + VideoP.SecondToString(endS - startS) + ")." + (props.isLocker ? ' Блокирует дальнейший просмотр.' : '');
        contentL.appendChild(previewHolder);
        contentL.appendChild(titlePar);
        contentL.appendChild(timePar);
        const lockP = new YT.Player(preview.id, {
            height: '360',
            width: '640',
            videoId: props.videoId,
            playerVars: {
                fs: 1,
                start: startS,
                controls: 0,
                autoplay: 0,
                disablekb: 1,
                enablejsapi: 1,
                rel: 0,
                showinfo: 0,
                end: endS
            },
            events: {
                'onReady': (event) => {
                    const previewL = document.getElementById(preview.id);
                    const previewButtonL = document.getElementById(preview.id + 'button');
                    previewButtonL.innerText = 'play_arrow';
                    previewL.style.display = 'block';
                    previewL.style.position = 'absolute';
                    previewL.style.width = '100%';
                    previewL.style.height = '100%';
                    previewButtonL.addEventListener('click', function () {
                        switch (lockP.getPlayerState()) {
                            case 0:
                            case -1:
                            case 2:
                            case 5:
                                lockP.playVideo();
                                previewButtonL.style.opacity = '0.0';
                                break;
                            case 1:
                                lockP.pauseVideo();
                                previewButtonL.style.opacity = '1.0';
                                break;
                        }
                    });
                },
                'onStateChange': (event) => {
                    const previewButtonL = document.getElementById(preview.id + 'button');
                    if(lockP.getPlayerState() == 0){
                        lockP.pauseVideo();
                        previewButtonL.style.opacity = '1.0';
                        lockP.seekTo(startS, true);
                    }
                }
            }
        });
    }
}