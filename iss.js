// iss.js
const needle = require('needle');

const fetchMyIP = function(callback) {
  const url = 'https://api.ipify.org?format=json';

  needle.get(url, (error, response) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response.body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = response.body.ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const url = `https://ipwho.is/${ip}`;

  needle.get(url, (error, response) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (!response.body.success) {
      const message = `Success status was false. Server message says: ${response.body.message} when fetching IP for ${ip}`;
      callback(Error(message), null);
      return;
    }


    const { latitude, longitude } = response.body;
    callback(null, { latitude, longitude });
  });

};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  needle.get(url, (error, response) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times. Response: ${response.body}`;
      callback(Error(msg), null);
      return;
    }

    const passes = response.body.response;
    if (!passes) {
      const msg = `Invalid response from ISS API: ${JSON.stringify(response.body)}`;
      callback(Error(msg), null);
      return;
    }

    callback(null, passes);
  });
};
  
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, flyoverTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, flyoverTimes);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};