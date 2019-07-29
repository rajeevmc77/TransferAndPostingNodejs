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
function clearClaimListFor(applicant){
    for ( claim in claimList){
        claimList[claim].forEach( function(currentValue,index,arr){
            if(applicant == currentValue){
                arr.splice(index,1);
            }
        });        
    }
}
function clearTransferListFor(applicant,choice,lst){
    for(aplnt in lst){
        lst[aplnt].choices.forEach((currentValue,index,arr)=>{
            if(choice == currentValue){
                arr.splice(index,1);
            }
        });
    }
    var tlIndex = lst.findIndex(function(currentValue){                    
        return currentValue.applicant == applicant;
    });
    lst.splice(tlIndex,1); 
}
function doOptimalTransfer(vlClone,tlClone,vacancyIndex,aplnt,choice){
    var node = {};
    node[aplnt.applicant] = choice;
    optimalList.push(node);
    vlClone.splice(vacancyIndex, 1);
    vlClone.push(aplnt.posting);
    clearTransferListFor(aplnt.applicant,aplnt.posting,tlClone); 
    clearClaimListFor(aplnt.applicant);     
}
function doTemporaryTransfer(vlClone,tlClone,vacancyIndex,aplnt,choice,choiceIndex,claimPos){
    var node = {};      
    if(claimPos > 0){
        var priorityClaims = claimList[choice].slice(0,claimPos);                    
        if(canClaimVacancy(priorityClaims))
            claimList[choice].splice(claimPos+1);
        else
            return;
    }
    var tmpIndex = tempList.findIndex(function(currentValue){                
        return Object.keys(currentValue)[0] == aplnt.applicant;
    });
    node[aplnt.applicant] = choice;                
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

function processTransferRequest(aplnt,vlClone,tlClone){
    var vacancyIndex;   
    for (choice of aplnt.choices) {
        if(( vacancyIndex = vlClone.indexOf(choice)) < 0 ) continue;      
        if(( claimPos = claimList[choice].indexOf(aplnt.applicant)) < 0 ) continue;             
        var choiceIndex = aplnt.choices.indexOf(choice);           
        if (choiceIndex == 0 && claimPos == 0) {
            doOptimalTransfer(vlClone,tlClone,vacancyIndex,aplnt,choice);            
        }
        else {
            doTemporaryTransfer(vlClone,tlClone,vacancyIndex,aplnt,choice,choiceIndex,claimPos);
        }        
    }
}


async function prepareTransferLists() {
    await init();   
    var tlClone = JSON.parse(JSON.stringify(transferList));
    var vlClone = Object.assign([], vacancyList.vacancy);
    console.log('Init vlClone ' + vlClone);
    for (let aplnt of tlClone) {
        processTransferRequest(aplnt,vlClone,tlClone);
    }
     console.log('final  vlClone ' + vlClone);
     // console.log(tlClone);
     console.log(claimList);
     console.log(tempList);
     console.log(optimalList);

}

prepareTransferLists();
