const FileManager = require('./filemanager');

var transferList, vacancyList;
const fileManager = new FileManager();

function getTransferList() {
    return fileManager.getJSONFromFle('transrequests.json');
}

function getVacancyList() {
    return fileManager.getJSONFromFle('vacancy.json');
}

getTransferList().then(data => {
    transferList = data;
    console.log(data);
});

getVacancyList().then(data => {
    vacancyList = data;
    console.log(data);
});