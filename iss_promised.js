const needle = require('needle');

// 1. Get IP address
const fetchMyIP = function () {
  return needle('get', 'https://api.ipify.org?format=json')
    .then(response => response.body.ip);
};

// 2. Get coordinates using IP
const fetchCoordsByIP = function (ip) {
  const url = `https://ipwho.is/${ip}`;
  return needle('get', url)
    .then(response => {
      if (!response.body.success) {
        throw new Error(`Failed to get coordinates: ${response.body.message}`);
      }
      const { latitude, longitude } = response.body;
      return { latitude, longitude };
    });
};

// 3. Get ISS flyover times using coordinates
const fetchISSFlyOverTimes = function (coords) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  return needle('get', url)
    .then(response => {
      if (!response.body.response) {
        throw new Error("No flyover times found");
      }
      return response.body.response;
    });
};

// 4. Chain it all together
const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes);
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};
