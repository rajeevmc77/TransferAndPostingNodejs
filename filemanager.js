const fs = require('fs');
const util = require('util');

class FileManager {
    constructor() {
        this.readFile = util.promisify(fs.readFile);
    }

    async getJSONFromFle(fileName) {
        var data;
        try {
            data = await this.readFile(__dirname + '/files/' + fileName, "utf8");
            return JSON.parse(data);
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = FileManager;