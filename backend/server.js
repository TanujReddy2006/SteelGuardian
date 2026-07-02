const RawMaterialYard = require("./src/zones/RawMaterialYard");
const CokeOven = require("./src/zones/CokeOven");
const BlastFurnace = require("./src/zones/BlastFurnace");
const SMS = require("./src/zones/SMS");
const RollingMill = require("./src/zones/RollingMill");

const rawMaterial = new RawMaterialYard();
const cokeOven = new CokeOven();
const blastFurnace = new BlastFurnace();
const sms = new SMS();
const rollingMill = new RollingMill();

const context = {

    plantState: {

        operatingMode: "NORMAL"

    },

    utilities: {

        powerAvailability: 1,

        waterAvailability: 1

    },

    dataBus: {}

};

for (let cycle = 0; cycle <= 200; cycle++) {

    rawMaterial.update({

        context,

        scenario: "NORMAL"

    });

    cokeOven.update({

        context,

        scenario: "NORMAL"

    });

    blastFurnace.update({

        context,

        scenario: "NORMAL"

    });

    sms.update({

        context,

        scenario: "NORMAL"

    });

    rollingMill.update({

        context,

        scenario: "NORMAL"

    });

    if (cycle % 25 === 0) {

        console.clear();

        console.log("\n==============================================");
        console.log("PLANT STATUS");
        console.log("Cycle :", cycle);
        console.log("==============================================\n");

        console.log("RAW MATERIAL YARD");
        console.dir(rawMaterial.publishData(), { depth: null });

        console.log("\n----------------------------------------------\n");

        console.log("COKE OVEN");
        console.dir(cokeOven.publishData(), { depth: null });

        console.log("\n----------------------------------------------\n");

        console.log("BLAST FURNACE");
        console.dir(blastFurnace.publishData(), { depth: null });

        console.log("\n----------------------------------------------\n");

        console.log("SMS");
        console.dir(sms.publishData(), { depth: null });

        console.log("\n----------------------------------------------\n");

        console.log("ROLLING MILL");
        console.dir(rollingMill.publishData(), { depth: null });

    }

}