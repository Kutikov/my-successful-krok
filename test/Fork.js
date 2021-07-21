class Fork{

    Spec = {
        LECH: "LECH",
        STOM: "STOM",
        FARM: "FARM",
        NURS: "NURS",
        OBST: "OBST",
        PROF: "PROF",
        LABD: "LABD",
        PSYC: "PSYC",
        CLFR: "CLFR",
        COSM: "COSM",
        UNDF: "UNDF"
    }

    Stage = {
        K1: "K1",
        K2: "K2",
        K3: "K3",
        KM: "KM",
        KB: "KB",
        UD: "UD"
    }
    
    Var = {
        BOOKLET: "BOOKLET",
        BoT: "BoT",
        UNDEFINED: "UNDEFINED"
    }

    Rate = {
        official: "official",
        approved: "approved",
        alternative: "alternative"
    }

    constructor(name, author){
        this.extensionRate = '';
        this.extensionVar = '';
        this.extensionStage = '';
        this.extensionSpec = '';
        this.name = name;
        this.language = '';
        this.testCount = 0;
        this.author = author;
        this.isPremium = false;
        this.needUpdate = false; 
    }

    static Decode(record){
        const fork = new Fork(record.name, record.author);
        fork.extensionRate = record.extensionRate;
        fork.extensionVar = record.extensionVar;
        fork.extensionStage = record.extensionStage;
        fork.extensionSpec = record.extensionSpec;
        fork.language = record.language;
        fork.testsCount = record.testsCount;
        fork.isPremium = record.isPremium;
        fork.needUpdate = false;
        return testAccount;
    }


}