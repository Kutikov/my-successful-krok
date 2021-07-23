class InfoCard{
    
    static Icons = {
        info: 'info',
        add: 'add',
        edit: 'edit',
        notification: 'notification', 
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
        language: 'language'
    }

    constructor(){
        this.text = '';
        this.icon = InfoCard.Icons.info;
        this.textStyle = Paragraph.TextStyle.n;
        this.textSize = Paragraph.TextSize.m;
        this.textColor = Paragraph.TextColor.Grey;
        this.textAlign = Paragraph.TextAlign.jf;
    }
}