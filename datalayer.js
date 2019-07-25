const FileManager = require('./filemanager');

class DataLayer {

    constructor() {
        this.fileManager = new FileManager();
    }

    getTransferList() {
        return this.fileManager.getJSONFromFle('transrequests.json');
    }

    getVacancyList() {
        return this.fileManager.getJSONFromFle('vacancy.json');
    }
}

module.exports = DataLayer;