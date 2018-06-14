const fs = require('fs');

const _checkExistOrCreate = file => {
    try {
        const exist = fs.existsSync(file);

        if (!exist) {
            fs.writeFileSync(file, "{}");
        }
    } catch (e) {
        fs.writeFileSync(file, "{}");
    }
};

const _getContent = (file = '') => {
    const fileValidated = file || __dirname + '/../../temp.json';
    _checkExistOrCreate(fileValidated);

    const content = fs.readFileSync(fileValidated);

    try {
        return JSON.parse(content);
    } catch (e) {
        return {};
    }
};

const _saveContent = (file = '') => (content) => {
    const fileValidated = file || __dirname + '/../../temp.json';
    _checkExistOrCreate(fileValidated);

    const string = typeof content === 'string' ? content : JSON.stringify(content);

    fs.writeFileSync(fileValidated, string);
};

exports.getStartPage = (file = '') => {
    const settings = _getContent(file);

    return settings.page ? parseInt(settings.page, 10) : 1;
};

exports.saveCurrentPage = (page, file = '') => {
    _saveContent(file)({
        page: parseInt(page, 10)
    });
};