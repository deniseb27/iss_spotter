//index.js
const {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes
} = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned IP:', ip);

  fetchCoordsByIP(ip, (error, coords) => {
    if (error) {
      console.log("Failed to fetch coordinates", error);
      return;
    }

    console.log("Coordinates are:", coords);

    fetchISSFlyOverTimes(coords, (error, passes) => {
      if (error) {
        console.log("Failed to fetch ISS flyover times:", error);
        return;
      }
      for (const pass of passes) {
        const datetime = new Date(pass.risetime * 1000);
        const duration = pass.duration;
        console.log(`Next pass at ${datetime} for ${duration} seconds!`);
      }
    });
  });
});
// use request to fetch IP address from JSON API

module.exports = { fetchMyIP };