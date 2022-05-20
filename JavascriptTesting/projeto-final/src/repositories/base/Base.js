const { readFile } = require('fs/promises');


class BaseRepository {
  constructor({ file }) {
    this.file = file;
  }

  async find(id) {
    const content = JSON.parse(await readFile(this.file, 'utf8'));

    if (!id) return content;

    return content.find(item => item.id === id);
  }
}

module.exports = { BaseRepository };