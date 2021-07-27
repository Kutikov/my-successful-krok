class User{
    constructor(email, name){
        this.email = email;
        this.name = name;
        this.buckets = [];
        this.device1 = {
            date: null,
            data: ''
        };
        this.device2 = {
            date: null,
            data: ''
        }
        this.tempRequest = '';
    }

    GetFireStroreObject(){
        return {
            email: this.email,
            name: this.name,
            buckets: [],
            device1: this.device1,
            device2: this.device2,
            tempRequest: ''
        };
    }
}