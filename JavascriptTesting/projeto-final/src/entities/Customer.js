const { Base } = require("./base/Base")

class Customer extends Base {
  constructor({ id, name, driverLicense, age }) {
    super({ id, name });

    this.driverLicense = driverLicense;
    this.age = age;
  }
}

module.exports = { Customer };