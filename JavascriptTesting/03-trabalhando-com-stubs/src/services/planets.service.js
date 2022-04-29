const https = require('https');

class PlanetsService {

  async makeRequest(url) {
    return new Promise((resolve, reject) => {

      let content = "";

      https.get(url, response => {
        response.on('data', chunk => {
          content += chunk;
        })
        response.on('error', error => reject(error));
        response.on('end', () => resolve(
          JSON.parse(content.toString())
        ));
      })
    })
  }

  async getPlanetGravity(url) {
    const response = await this.makeRequest(url);

    return {
      id: response.id,
      name: response.name,
      gravity: response.gravity
    }
  }
}

module.exports = {
  PlanetsService
}