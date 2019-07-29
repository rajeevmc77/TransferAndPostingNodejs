const DataLayer = require('./datalayer');
const Helper = require('./helper');

const dataLayer = new DataLayer();

const helper = new Helper();
var claimList = {}, optimalList = [], tempList = [], vacancyList, transferList;

async function prepareClaimList() {
    transferList = await dataLayer.getTransferList();
    for (let aplnt of transferList) {
        for (claim of aplnt.choices) {
            if (claimList[claim]) {
                claimList[claim].push(aplnt.applicant);
            } else {
                claimList[claim] = [aplnt.applicant];
            }
        }
    }
}

async function prepareVacancyList() {
    vacancyList = await dataLayer.getVacancyList();
}

async function init() {
    await prepareClaimList();
    await prepareVacancyList();
}

function canClaimVacancy(priorityClaims){
    var tmpList1 = tempList.map(function(val){ 
        return Object.keys(val)[0];
    });
    var tmpList2 = optimalList.map(function(val){ 
        return Object.keys(val)[0];
    });
    var tmpList = tmpList1.concat(tmpList2);
    for(claimant of priorityClaims){
        if(tmpList.indexOf(claimant) == -1 ){
            return false;
        }
        else{
            continue;
        }       
    }
    return true;
}


async function prepareTransferLists() {
    await init();   
    var tlClone = JSON.parse(JSON.stringify(transferList));
    var vlClone = Object.assign([], vacancyList.vacancy);
    console.log('Init vlClone ' + vlClone);
    for (let aplnt of tlClone) {
        for (choice of aplnt.choices) {
            var vacancyIndex = vlClone.indexOf(choice);
            if (vacancyIndex < 0) continue;
            var applicantName = aplnt.applicant;         
            var claimPos = claimList[choice].indexOf(applicantName);
            if (claimPos < 0) continue;            
            var choiceIndex = aplnt.choices.indexOf(choice);
            var node = {};        
            if (choiceIndex === 0 && claimPos === 0) {
                node[applicantName] = choice;
                optimalList.push(node);
                vlClone.splice(vacancyIndex, 1);
                vlClone.push(aplnt.posting);
                var tlIndex = tlClone.findIndex(function(currentValue, index, arr){                    
                        return currentValue.applicant == applicantName;
                });
                tlClone.splice(tlIndex,1);
                break;
            }
            else {
                var applicantName = aplnt.applicant;
                if(claimPos > 0){
                    var priorityClaims = claimList[choice].slice(0,claimPos);                    
                    if(canClaimVacancy(priorityClaims)){
                        claimList[choice].splice(claimPos+1);
                    }
                    else{
                        continue
                    }
                }
                var tmpIndex = tempList.findIndex(function(currentValue){                
                    return Object.keys(currentValue)[0] == applicantName;
                });
                node[applicantName] = choice;                
                if(tmpIndex > -1){
                    tempList[tmpIndex] = node;
                } else{                    
                    tempList.push(node);
                }
                vlClone.splice(vacancyIndex, 1);
                vlClone.push(aplnt.posting);
                aplnt.posting = choice;
                aplnt.choices.splice(0, choiceIndex - 1);
            }        
        }
    }
     console.log('final  vlClone ' + vlClone);
     // console.log(tlClone);
     console.log(claimList);
     console.log(tempList);
     console.log(optimalList);

}





prepareTransferLists();
