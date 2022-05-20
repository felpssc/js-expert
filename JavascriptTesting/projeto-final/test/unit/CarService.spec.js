const { join } = require('path');
const assert = require('assert');

const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');

const { CarService } = require('../../src/service/CarService');
const { Transaction } = require('../../src/entities/Transaction');

const mocks = {
  car: require('../mocks/car-valid.json'),
  carCategory: require('../mocks/carCategory-valid.json'),
  customer: require('../mocks/customer-valid.json')
}

describe('CarService', () => {

  let carService;
  let sandbox;

  beforeEach(() => {
    carService = new CarService({
      cars: join(__dirname, './../../database', 'cars.json')
    });

    sandbox = sinon.createSandbox()
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should retrieve a random position from an array', async () => {
    const array = [1, 2, 3, 4, 5];

    const randomPosition = await carService.getRandomPosition(array);

    expect(randomPosition).to.be.lte(array.length).and.be.gte(0);
  });

  it("Should choose the first id from carIds in carCategory", async () => {
    const carCategory = mocks.carCategory;
    const carIdIndex = 0;

    sandbox.stub(
      carService,
      carService.getRandomPosition.name
    ).returns(carIdIndex);

    const result = await carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];

    expect(carService.getRandomPosition.calledOnce);
    expect(result).to.be.equal(expected);
  });

  it('Given a car category it should be able to return an available car', async () => {

    const car = mocks.car;

    const carCategory = Object.create(mocks.carCategory);
    carCategory.carIds = [car.id];

    sandbox.stub(
      carService.carsRepository,
      carService.carsRepository.find.name
    ).returns(car)

    sandbox.spy(
      carService,
      carService.chooseRandomCar.name
    );

    const result = await carService.listAvailableCars(carCategory);
    const expected = car;

    expect(carService.chooseRandomCar.calledOnce);
    expect(carService.carsRepository.find.calledWithExactly(car.id)); 
    expect(result).to.deep.equal(expected);
  });

  it("Given a carCategory, customer and numberOfDays it should calculate final amount in real", 
    async () => {
      const customer = Object.create(mocks.customer);
      customer.age = 50;

      const carCategory = Object.create(mocks.carCategory);
      carCategory.price = 37.6;

      const numberOfDays = 5;

      sandbox.stub(
        carService,
        "taxesBasedOnAge"
      ).get(() => [{ from: 40, to: 50, then: 1.3 }]);

      const expected = carService.currencyFormat.format(244.40);

      const result = await carService.calculateFinalPrice(customer, carCategory, numberOfDays);

      expect(result).to.be.equal(expected);
    }
  )

  it("Given a customer and a car category it should return a transaction receipt", async () => {
    const customer = Object.create(mocks.customer);
    customer.age = 20;

    const car = Object.create(mocks.car);

    const carCategory = {
      ...mocks.carCategory,
      price: 37.6,
      carIds: [car.id]
    }

    const numberOfDays = 5;
    const dueDate = "10 de novembro de 2022";

    const today = new Date(2022, 10, 5);

    sandbox.useFakeTimers(today.getTime());

    sandbox.stub(
      carService.carsRepository,
      carService.carsRepository.find.name
    ).resolves(car);

    const expectedAmount = carService.currencyFormat.format(206.8);

    const result = await carService.rent(customer, carCategory, numberOfDays);

    const expected = new Transaction({
      customer,
      car,
      amount: expectedAmount,
      dueDate
    });

    expect(result).to.be.deep.equal(expected);
  });
});