const { faker } = require('@faker-js/faker');

const { join } = require('path');
const { writeFile } = require('fs/promises');

const { Car } = require('../src/entities/Car');
const { Customer } = require('../src/entities/Customer');
const { CarCategory } = require('../src/entities/CarCategory');
const { Console } = require('console');

const seedBaseFolder = join(__dirname, '../', 'database');

const CARS_AMOUNT = 3;
const cars = [];
const customers = [];

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100),
});

for(let i = 0; i < CARS_AMOUNT; i++) {
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: faker.random.boolean(),
    releaseYear: faker.date.past().getFullYear(),
  });

  cars.push(car);
  carCategory.carIds.push(car.id);

  const customer = new Customer({
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    driverLicense: faker.random.uuid(),
  });

  customers.push(customer);
}

const write = (fileName, data) => writeFile(join(seedBaseFolder, fileName), JSON.stringify(data, null, 2));

(async () => {
  await write('car_categories.json', [carCategory]);
  await write('cars.json', cars);
  await write('customers.json', customers);
})();