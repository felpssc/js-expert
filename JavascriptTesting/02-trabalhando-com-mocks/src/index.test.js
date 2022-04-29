const { error } = require("./constants");
const File = require("./File");
const { rejects, deepStrictEqual } = require("assert");

(async () => {
  {
    const filePath = "JavascriptTesting/02-trabalhando-com-mocks/mocks/emptyFile-invalid.csv";
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath)
  
    await rejects(result, rejection);
  }
  {
    const filePath = "JavascriptTesting/02-trabalhando-com-mocks/mocks/fourItems-invalid.csv";
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath)
  
    await rejects(result, rejection);
  }
  {
    const filePath = "JavascriptTesting/02-trabalhando-com-mocks/mocks/invalidHeaders-invalid.csv";
    const rejection = new Error(error.FILE_FIELDS_ERROR_MESSAGE);
    const result = File.csvToJson(filePath)
  
    await rejects(result, rejection);
  }
  {
    const filePath = "JavascriptTesting/02-trabalhando-com-mocks/mocks/threeItems-valid.csv";
    const result = await File.csvToJson(filePath)
  
    const expected = [
      {
        "id": 123,
        "name": "Felipe Silva",
        "profession": "Dev Jr",
        "birthday": 2000
      },
      {
        "id": 321,
        "name": "Irineu",
        "profession": "Project Owner",
        "birthday": 1990
      },
      {
        "id": 666,
        "name": "James",
        "profession": "CTO",
        "birthday": 1977
      }
    ]


    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
})();