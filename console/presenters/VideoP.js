class VideoP{
    constructor(){
        this.videoId = 'M7lc1UVf-VE';
        this.startPoint = '00:00:00';
        this.endPoint = '00:00:00';
        this.isLocker = false;
        this.maxTime = 0;
    }

    static PrepareEdit(props, contentL){
        document.getElementById('videoEditorHolder').style.display = 'block';
        const videoURLTextEditTextArea = document.getElementById('videoURLTextEditTextArea');
        const videoFrom = document.getElementById('videoFrom');
        const videoTo = document.getElementById('videoTo');
        videoFrom.value = props.startPoint;
        videoTo.value = props.endPoint;
        videoURLTextEditTextArea.value = 'https://www.youtube.com/watch?v=' + props.videoId;
        document.getElementById('checkboxLockerVideo').checked = props.isLocker;
        videoURLTextEditTextArea.addEventListener('input', (e) => {
            currentPresenter.OnEditAction('videoURLTextEditTextArea', null);
        });
        videoFrom.addEventListener('blur', (e) => {
            currentPresenter.OnEditAction(null, null);
        });
        videoTo.addEventListener('blur', (e) => {
            currentPresenter.OnEditAction(null, null);
        });
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
                const techno = new YT.Player('technicalVideoHolder2', {
                    height: '360',
                    width: '640',
                    videoId: tempProps.videoId,
                    events: {
                        'onReady': (event) => {
                            techno.playVideo();
                            setTimeout(() => {
                                techno.stopVideo();
                                VideoP.OnEditAction(tempProps, null, techno.getDuration());
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
                    if(tempProps.maxTime <= finishObj.seconds){
                        const maxEndTime = VideoP.SecondToString(tempProps.maxTime);
                        videoTo.value = maxEndTime;
                        VideoP.OnEditAction(tempProps, null, null);
                        return;
                    }
                    else{
                        tempProps.endPoint = finishObj.point;
                    }
                }
                else{
                    const maxEndTime = VideoP.SecondToString(tempProps.maxTime);
                    videoTo.value = maxEndTime;
                    VideoP.OnEditAction(tempProps, null, null);
                    return;
                }
                if(startObj.success){
                    if(tempProps.maxTime <= startObj.seconds){
                        const maxStartTime = VideoP.SecondToString(tempProps.maxTime - 1);
                        videoFrom.value = maxStartTime;
                        VideoP.OnEditAction(tempProps, null, null);
                        return;
                    }
                    if(VideoP.StringToSeconds(tempProps.endPoint) != 0){
                        if(startObj.seconds >= finishObj.seconds){
                            const maxStartTime = VideoP.SecondToString(finishObj.seconds - 1);
                            videoFrom.value = maxStartTime;
                            VideoP.OnEditAction(tempProps, null, null);
                            return;
                        }
                    }
                    else{
                        tempProps.startPoint = startObj.point;
                    }
                }
                else{
                    videoFrom.value = startObj.point;
                    VideoP.OnEditAction(tempProps, null, null);
                    return;
                }
            }            
        }
        else{
            linearProgress.style.display = 'none';
            tempProps.maxTime = message;
            videoFrom.value = VideoP.SecondToString(0);
            videoTo.value = VideoP.SecondToString(tempProps.maxTime);
            VideoP.OnEditAction(tempProps, null, null);
        }
    }

    static SecondToString(sec){
        const hour = (sec - sec % 3600) / 3600; 
        const minutes = ((sec % 3600) - (sec % 3600) % 60) / 60;
        const seconds = Math.floor(sec - hour * 3600 - minutes * 60);
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
                parts[2] = '59';
            }
            let minutes = new Number(parts[1]);
            if(minutes > 59){
                successL = false;
                minutes = 59;
                parts[1] = '59';
            }
            let hours = new Number(parts[0]);
            let secondsConverted = 0;
            if(successL){
                secondsConverted = seconds + minutes * 60 + hours * 60 * 60;
            }
            return { success: successL, point: hours.toString() + ':' + minutes.toString() + ':' + seconds.toString(), seconds: secondsConverted };
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
        previewIcon.innerText = 'link';
        previewIcon.classList.add('material-icons');
        previewIcon.classList.add('video__preview_icon');
        previewHolder.appendChild(preview);
        previewHolder.appendChild(previewIcon);
        const techno = new YT.Player(preview.id, {
            height: '360',
            width: '640',
            videoId: props.videoId,
            playerVars: {
                fs: 1,
                end: VideoP.StringToSeconds(props.endPoint),
                controls: 0,
                autoplay: 1,
                disablekb: 1,
                rel: 0,
                showinfo: 0,
                start: VideoP.StringToSeconds(props.startPoint)
            },
            events: {
                'onReady': (event) => {
                    previewIcon.style.display = 'block';
                    preview.style.display = 'block';
                },
                'onStateChange': (event) => {
                    
                }
            }
        });
        previewHolder.addEventListener('click', function(){
            switch(techno.getPlayerState()){
                case 0:
                case -1:
                case 2:
                    techno.playVideo();
                    previewIcon.style.display = 'none';
                    break;
                case 1:
                    techno.pauseVideo();
                    previewIcon.style.display = 'block';
                    break;
            }
        });
        contentL.appendChild(previewHolder);
    }
}