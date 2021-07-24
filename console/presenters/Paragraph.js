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
        this.text = '';
        this.textStyle = Paragraph.TextStyle.n;
        this.textSize = Paragraph.TextSize.m;
        this.textColor = Paragraph.TextColor.Grey;
        this.textAlign = Paragraph.TextAlign.jf;
    }

    static PrepareEdit(props, contentL){

    }

    static Save(presenter){

    }

    static Draw(props, contentL){
        
    }
}