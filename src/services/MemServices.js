const fs = require('fs');

const _checkExistOrCreate = file => {
    const exist = fs.existsSync(file);

    if (!exist) {
        fs.writeFile(file, "{}");
    }
};

const _getContent = () => {
    const file = __dirname + '/../../temp.json';
    _checkExistOrCreate(file);

    const content = fs.readFileSync(file);

    try {
        return JSON.parse(content);

    } catch (e) {
        return {};
    }
};

const _saveContent = (content) => {
    const file = __dirname + '/../../temp.json';
    _checkExistOrCreate(file);

    const string = typeof content === 'string' ? content : JSON.stringify(content);

    fs.writeFileSync(file, string);
};

exports.getStartPage = () => {
    const settings = _getContent();

    return settings.page ? parseInt(settings.page, 10) : 1;
};

exports.saveCurrentPage = (page) => {
    _saveContent({
        page: parseInt(page, 10)
    });
};