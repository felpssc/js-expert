const { BaseRepository } = require('../repositories/base/Base');

const { Tax } = require('../entities/Tax');
const { Transaction } = require('../entities/Transaction');

class CarService {
  constructor({ cars }) {
    this.carsRepository = new BaseRepository({ file: cars }); 
    this.taxesBasedOnAge = Tax.taxesBasedOnAge;
    this.currencyFormat = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  async listAvailableCars(carCategory) {
    const carId =  await this.chooseRandomCar(carCategory);
    const car = await this.carsRepository.find(carId);

    return car;
  }

  async getRandomPosition(list) {
    const listLength = list.length;

    return Math.floor(Math.random() * listLength);
  }

  async chooseRandomCar(carCategory) {
    const randomCarIndex = await this.getRandomPosition(carCategory.carIds);
    const carId = carCategory.carIds[randomCarIndex];

    return carId;
  }

  async calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;
    const { then: tax } = this.taxesBasedOnAge
      .find(tax => tax.from <= age && tax.to >= age);

    const finalPrice = ((price * tax) * numberOfDays);

    return this.currencyFormat.format(finalPrice);
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.listAvailableCars(carCategory);
    const finalPrice = await this.calculateFinalPrice(customer, carCategory, numberOfDays);

    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }

    const dueDate = today.toLocaleDateString('pt-br', options);

    const transaction = new Transaction({
      customer,
      car,
      amount: finalPrice,
      dueDate
    });

    return transaction;
  }
}

module.exports = { CarService };