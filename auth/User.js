class User {
    constructor(email, name) {
        this.email = email;
        this.name = name;
        this.buckets = [];
        this.device1 = null;
        this.device2 = null
    }

    GetFireStroreObject() {
        return {
            email: this.email,
            name: this.name,
            buckets: this.buckets,
            device1: this.device1,
            device2: this.device2
        };
    }
}