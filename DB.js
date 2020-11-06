const fs = require("fs");
const path = require("path");

class DB {

    constructor() {
        this.filePath = '';
        this.data = [];
    }

    async init(file) {

        if (!file) {
            file = 'db.json';
        }
        this.filePath = path.resolve(__dirname, file);
        this.data = await this.loadfile();
    }

    loadfile() {
        return new Promise((success, failure) => {
            fs.readFile(this.filePath, (error, data) => {
                if (error) {
                    failure(error);
                }
                success(JSON.parse(data));
            })
        })
    }

    savefile() {
        return new Promise((success, failure) => {
            try {
                fs.writeFileSync(this.filePath, JSON.stringify(this.data));
                success(true);
            }
            catch (error) {
                success(false);
            }
        })
    }
}

module.exports = DB;