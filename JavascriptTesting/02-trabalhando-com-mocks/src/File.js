const { readFile } = require("fs/promises");
const { error } = require("./constants");

const User = require("../entities/User");

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"]
}

class File {
  static async csvToJson(filePath) {
    const content = await File.getFileContent(filePath);

    const isFileInvalid = File.isValid({ csvString: content });

    if(isFileInvalid) {
      throw new Error(isFileInvalid.error);
    }

    const data = File.parseCsvToJSON(content);

    return data;
  }

  static async getFileContent(filePath) {
    return await readFile(filePath, {
      encoding: "utf-8"
    });
  }

  static isValid({ csvString, options = DEFAULT_OPTIONS }) {
    const [header, ...content] = csvString.split("\n");

    const isHeaderValid = header === options.fields.join(",");

    if(!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      }
    }

    const isContentLengthValid = (
      content.length > 0 && content.length <= options.maxLines
    );

    if(!isContentLengthValid) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      }
    }
  }

  static parseCsvToJSON(csvString) {
    const lines = csvString.split("\n");
    const firstLine = lines.shift();

    const header = firstLine.split(",");

    const data = lines.map(line => {
      const columns = line.split(",");

      const user = {};

      for(let index in columns) {
        user[header[index]] = columns[index];
      }

      return new User(user);
    });

    return data;
  }
}

module.exports = File;