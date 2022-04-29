const { PlanetsService } = require('./planets.service');

const { deepEqual } = require('assert');

const sinon = require("sinon");

const mocks = {
  planet1: {
    mock: require('../mocks/planet_1.json'),
    url: "https://6261f5e3327d3896e280e5ed.mockapi.io/planets/1"
  },
  planet2: {
    mock: require('../mocks/planet_2.json'),
    url: "https://6261f5e3327d3896e280e5ed.mockapi.io/planets/2"
  }
};

(async () => {
  const planetsService = new PlanetsService();
  const stub = sinon.stub(planetsService, planetsService.makeRequest.name);

  stub
    .withArgs(mocks.planet1.url)
    .resolves(mocks.planet1.mock);

  stub
    .withArgs(mocks.planet2.url)
    .resolves(mocks.planet2.mock);

  {
    const expected = {
      id: "1",
      name: "Donald Reilly",
      gravity: 94
    }

    const result = await planetsService.getPlanetGravity(mocks.planet1.url);

    deepEqual(result, expected);
  }

  {
    const expected = {
      id: "2",
      name: "Juan Huels",
      gravity: 18
    }

    const result = await planetsService.getPlanetGravity(mocks.planet2.url);

    deepEqual(result, expected);
  }
})();