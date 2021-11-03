class Paragraph{

    static TextStyle = {
        n: 'n',
        b: 'b',
        i: 'i',
        u: 'u',
        b_u: 'b_u',
        i_u: 'i_u',
        b_i: 'b_i',
        b_i_u: 'b_i_u',
    }

    static TextList = {
        ol: 'ol',
        nl: 'nl',
        ul: 'ul'
    }

    static TextSize = {
        xs: 'xs',
        s: 's',
        m: 'm',
        l: 'l',
        xl: 'xl'
    }

    static TextAlign = {
        lf: 'lf',
        md: 'md',
        rt: 'rt',
        jf: 'jf'
    }

    static TextColor = {
        Red: 'Red',
        Pink: 'Pink',
        Purple: 'Purple',
        Indigo: 'Indigo',
        Light_Blue: 'Light_Blue',
        Teal: 'Teal',
        Green: 'Green',
        Lime: 'Lime',
        Yellow: 'Yellow',
        Orange: 'Orange',
        Blue_Grey: 'Blue_Grey',
        Black: 'Black'
    }

    constructor(){
        this.text = 'Enter text there';
        this.textStyle = Paragraph.TextStyle.n;
        this.textSize = Paragraph.TextSize.m;
        this.textColor = Paragraph.TextColor.Black;
        this.textAlign = Paragraph.TextAlign.jf;
        this.textList = Paragraph.TextList.nl;
    }

    static FormatString(inputArea, tag){
        let start = inputArea.value.toString().substring(0, inputArea.selectionStart);
        let selection = inputArea.value.toString().substring(inputArea.selectionStart, inputArea.selectionEnd);
        let end = inputArea.value.toString().substring(inputArea.selectionEnd, inputArea.value.toString().length);
        return start + '<' + tag + '>' + selection + '</' + tag + '>' + end;
    }

    static PrepareEdit(props, contentL){
        const inputArea = document.getElementById('paragraphEditTextArea');
        inputArea.value = '';
        const buttons = [ 'b_paragraph', 'i_paragraph', 'u_paragraph' ];
        for(let it in Paragraph.TextSize){
            buttons.push(Paragraph.TextSize[it] + '_paragraph');
        }
        for(let it in Paragraph.TextAlign){
            buttons.push(Paragraph.TextAlign[it] + '_paragraph');
        }
        for(let it in Paragraph.TextList){
            buttons.push(Paragraph.TextList[it] + '_paragraph');
        }
        for(let i = 0; i < buttons.length; i++){
            document.getElementById(buttons[i]).classList.remove('toggle_on');
        }

        document.getElementById('paragraphEditorHolder').style.display = 'block';
        inputArea.value = props.text;
        inputArea.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const menu = document.createElement('menu');
            const boldMenu = document.createElement('menu');
            boldMenu.title = 'жирный';
            boldMenu.style.fontWeight = 600;
            boldMenu.addEventListener('click', () => {
                menu.remove();
                inputArea.value = Paragraph.FormatString(inputArea, 'b');
                currentPresenter.OnEditAction(null, null);
            });
            const italicMenu = document.createElement('menu');
            italicMenu.title = 'курсив';
            italicMenu.style.fontStyle = 'italic';
            italicMenu.addEventListener('click', () => {
                menu.remove();
                inputArea.value = Paragraph.FormatString(inputArea, 'i');
                currentPresenter.OnEditAction(null, null);
            });
            const underlineMenu = document.createElement('menu');
            underlineMenu.title = 'подчеркнутый';
            underlineMenu.style.textDecoration = 'underline';
            underlineMenu.addEventListener('click', () => {
                menu.remove();
                inputArea.value = Paragraph.FormatString(inputArea, 'u');
                currentPresenter.OnEditAction(null, null);
            });
            menu.append(boldMenu);
            menu.append(italicMenu);
            menu.append(underlineMenu);
            window.document.body.appendChild(menu);
            menu.style.zIndex = 1000;
            menu.style.left = (e.pageX - 10)+"px";
            menu.style.top = (e.pageY - 10)+"px";
            return false;
        });
        document.getElementById('paragraphEditTextArea').addEventListener('input', function() {
            currentPresenter.OnEditAction(null, null);
        });
        document.getElementById(props.textSize + '_paragraph').classList.add('toggle_on')
        document.getElementById(props.textAlign + '_paragraph').classList.add('toggle_on')
        document.getElementById(props.textList + '_paragraph').classList.add('toggle_on');
        if(props.textStyle.includes('b')){
            document.getElementById('b_paragraph').classList.add('toggle_on')
        }
        if(props.textStyle.includes('i')){
            document.getElementById('i_paragraph').classList.add('toggle_on')
        }
        if(props.textStyle.includes('u')){
            document.getElementById('u_paragraph').classList.add('toggle_on')
        }
        currentPresenter.OnEditAction(null, null);
    }

    static Save(presenter){
        return presenter.tempProps.text != '';
    }

    static OnEditAction(tempProps, id = null, message = null){
        tempProps.text = document.getElementById('paragraphEditTextArea').value;
        const workingIds = [
            ['lf_paragraph', 'md_paragraph', 'rt_paragraph', 'jf_paragraph'],
            ['xl_paragraph', 'l_paragraph', 'm_paragraph', 's_paragraph', 'xs_paragraph'],
            ['nl_paragraph', 'ol_paragraph', 'ul_paragraph'],
            ['i_paragraph', 'b_paragraph', 'u_paragraph']
        ];
        workingIds.push(InfoCard.GetListOfIds());
        if(id !== null){
            for(let i = 0; i < workingIds.length; i++){
                if(workingIds[i].indexOf(id) !== -1){
                    switch(i){
                        case 0:
                            tempProps.textAlign = id.replace('_paragraph', '');
                            break;
                        case 1:
                            tempProps.textSize = id.replace('_paragraph','');
                            break;
                        case 2:
                            tempProps.textList = id.replace('_paragraph', '');
                            break;
                        case 3:
                            const u = document.getElementById('u_paragraph').classList.contains('toggle_on');
                            const i = document.getElementById('i_paragraph').classList.contains('toggle_on');
                            const b = document.getElementById('b_paragraph').classList.contains('toggle_on');
                            if(u && i && b){
                                tempProps.textStyle = Paragraph.TextStyle.b_i_u;
                            }
                            else if(u && i){
                                tempProps.textStyle = Paragraph.TextStyle.i_u;
                            }
                            else if(i && b){
                                tempProps.textStyle = Paragraph.TextStyle.b_i;
                            }
                            else if(u && b){
                                tempProps.textStyle = Paragraph.TextStyle.b_u;
                            }
                            else if(b){
                                tempProps.textStyle = Paragraph.TextStyle.b;
                            }
                            else if(u){
                                tempProps.textStyle = Paragraph.TextStyle.u;
                            }
                            else if(i){                                
                                tempProps.textStyle = Paragraph.TextStyle.i;
                            }
                            else{
                                tempProps.textStyle = Paragraph.TextStyle.n;
                            }
                            break;
                        case 4:
                            tempProps.icon = id.replace('_iconSelect', '');
                            break;
                    }
                    break;
                }
            }
        }
        else if(message !== null){
            tempProps.textColor = message;
        }
    }

    static Draw(props, contentL){
        while (contentL.firstChild) {
            contentL.removeChild(contentL.lastChild);
        }
        const rootElement = Paragraph.DrawCommon(props, true);
        contentL.appendChild(rootElement);
    }

    static DrawCommon(props, forParagraph){
        const elements = [];
        const strings = props.text.split('\n');
        let rootElement;
        switch(props.textList){
            case Paragraph.TextList.nl:
                rootElement = document.createElement('div');
                break; 
            case Paragraph.TextList.ul:
                rootElement = document.createElement('ul');
                break;                    
            case Paragraph.TextList.ol:
                rootElement = document.createElement('ol');
                break;                    
        }
        for(let i = 0; i < strings.length; i++){
            let elem;
            switch(props.textList){
                case Paragraph.TextList.nl:
                    elem = document.createElement('p');
                    elem.innerHTML = strings[i];
                    elements.push(elem);
                    break; 
                case Paragraph.TextList.ul:
                case Paragraph.TextList.ol:
                    elem = document.createElement('li');
                    elem.innerHTML = strings[i];
                    elements.push(elem);
                    break;                    
            }
        }
        rootElement.style.boxSizing = 'border-box';
        rootElement.style.margin = '0';
        for(let i = 0; i < elements.length; i++){
            elements[i].classList.add('par__text');
            elements[i].classList.add('par__textStyle_' + props.textStyle);
            elements[i].classList.add('par__textAlign_' + props.textAlign);
            if(forParagraph){
                elements[i].classList.add('par__color_' + props.textColor);
            }
            elements[i].classList.add('par__size_' + props.textSize);
            rootElement.appendChild(elements[i]);
        }
        return rootElement;
    }
}