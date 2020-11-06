// REQUIREMENTS
const fs = require("fs");
const path = require("path");

// DB CLASS
class DB {

    // CLASS CONSTRUCTOR
    constructor() {
        this.filePath = '';
        this.data = [];
    }

    // CLASS INITIALISATION
    async init(file) {

        if (!file) {
            file = 'db.json';
        }
        this.filePath = path.resolve(__dirname, file);
        this.data = await this.loadfile();
    }

    // LOAD THE DATA AND PARSE
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

    // SAVE THE DATA TO THE FILE
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

// EXPORT FOR USE
module.exports = DB;