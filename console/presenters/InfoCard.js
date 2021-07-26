class InfoCard{
    
    static Icons = {
        info: 'info',
        add_circle: 'add_circle',
        edit: 'edit',
        notifications_active: 'notifications_active', 
        schedule: 'schedule',
        thumb_up: 'thumb_up',
        thumb_down: 'thumb_down',
        verified: 'verified',
        school: 'school',
        paid: 'paid',
        warning: 'warning',
        highlight_off: 'highlight_off',
        lightbulb: 'lightbulb',
        menu_book: 'menu_book',
        today: 'today',
        insights: 'insights',
        done_outline: 'done_outline',
        language: 'language',
        poll: 'poll',
        copyright: 'copyright'
    }

    constructor(){
        this.text = 'Enter text there';
        this.icon = InfoCard.Icons.info;
        this.textStyle = Paragraph.TextStyle.n;
        this.textSize = Paragraph.TextSize.m;
        this.textColor = Paragraph.TextColor.Blue_Grey;
        this.textAlign = Paragraph.TextAlign.jf;
        this.textList = Paragraph.TextList.nl;
    }

    static PrepareEdit(props, contentL){
        Paragraph.PrepareEdit(props, contentL);
        document.getElementById('iconsEditorHolder').style.display = 'block';
        document.getElementById(props.icon + '_iconSelect').click();
    }

    static OnEditAction(tempProps, id = null, message = null){
        Paragraph.OnEditAction(tempProps, id, message);
    }

    static Save(presenter){
        return presenter.tempProps.text != '';
    }

    static Draw(props, contentL){
        while (contentL.firstChild) {
            contentL.removeChild(contentL.lastChild);
        }
        const card = document.createElement('div');
        const textElement = Paragraph.DrawCommon(props, false);
        const icon = document.createElement('p');
        card.classList.add('infocard');
        card.classList.add('infocard__color_' + props.textColor);
        icon.innerText = props.icon;
        icon.classList.add('material-icons');
        icon.classList.add('infocard__icon');
        textElement.classList.add('infocard__text');
        card.appendChild(icon);
        card.appendChild(textElement);
        contentL.appendChild(card);
    }

    static FillIcons(){
        const iconsHolderTrue = document.getElementById('iconsHolderTrue');
        const icons = InfoCard.generateArrayOfIcons();
        const iconIds = InfoCard.GetListOfIds();
        for(let i = 0; i < iconIds.length; i++){
            const button = document.createElement('button');
            button.id = iconIds[i];
            button.classList.add('mdc-icon-button');
            button.classList.add('material-icons');
            button.innerText = icons[i];
            button.onclick = function(){
                disableSiblings(iconIds[i], null);
            }
            iconsHolderTrue.appendChild(button);
        }
    }

    static GetListOfIds(){
        const arr = InfoCard.generateArrayOfIcons();
        for(let i = 0; i < arr.length; i++){
            arr[i] = arr[i] + '_iconSelect';
        }
        return arr;
    }

    static generateArrayOfIcons(){
        const arr = [];
        for(let icon in InfoCard.Icons){
            arr.push(InfoCard.Icons[icon]);
        }
        return arr;
    }
}