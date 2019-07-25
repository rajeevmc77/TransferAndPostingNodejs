const DataLayer = require('./datalayer');

const dataLayer = new DataLayer();

var claimList = {};

/* dataLayer.getTransferList().then(data => {
    console.log(data);
});

dataLayer.getVacancyList().then(data => {
    console.log(data);
}); */

async function prepareClaimList() {
    var transferList = await dataLayer.getTransferList();
    /*     for (let aplnt of transferList) {
            for (claim of aplnt.choices) {
                if (claimList[aplnt.applicant]) {
                    claimList[aplnt.applicant].push(claim);
                } else {
                    claimList[aplnt.applicant] = [claim];
                }
            }
        } */

    for (let aplnt of transferList) {
        for (claim of aplnt.choices) {
            if (claimList[claim]) {
                claimList[claim].push(aplnt.applicant);
            } else {
                claimList[claim] = [aplnt.applicant];
            }
        }
    }
    console.log(claimList);
}
prepareClaimList();