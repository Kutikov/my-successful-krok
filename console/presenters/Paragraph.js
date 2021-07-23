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
        Deep_Purple: 'Deep_Purple',
        Indigo: 'Indigo',
        Blue: 'Blue',
        Light_Blue: 'Light_Blue',
        Cyan: 'Cyan',
        Teal: 'Teal',
        Green: 'Green',
        Light_Green: 'Light_Green',
        Lime: 'Lime',
        Yellow: 'Yellow',
        Amber: 'Amber',
        Orange: 'Orange',
        Deep_Orange: 'Deep_Orange',
        Brown: 'Brown',
        Grey: 'Grey',
        Blue_Grey: 'Blue_Grey',
    }

    constructor(){
        this.text = '';
        this.textStyle = Paragraph.TextStyle.n;
        this.textSize = Paragraph.TextSize.m;
        this.textColor = Paragraph.TextColor.Grey;
        this.textAlign = Paragraph.TextAlign.jf;
    }

    SetupController(){

    }

    Draw(){

    }
}