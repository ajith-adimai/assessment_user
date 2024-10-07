const fs = require('fs');
const path = require('path');

class DataHandlingUtils {
  static dataFilePath = path.join(__dirname, "..", 'data', 'data.json');

  static readDataFromFile() {
    try {
      const rawData = fs.readFileSync(this.dataFilePath, 'utf8'); // Read file synchronously
      return JSON.parse(rawData); // Parse JSON and return it
    } catch (error) {
      console.error('Error reading data from file:', error);
      return null; // Return null in case of error
    }
  }

  static writeDataToFile(data) {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2)); // Write JSON data to file
    } catch (error) {
      console.error('Error writing data to file:', error);
    }
  }
  static checkUser(data){
    try {
      const rawData = fs.readFileSync(this.dataFilePath, 'utf8');
      const userData = JSON.parse(rawData);
      const findUser = userData.filter((el) => el.email === data.email && el.password === data.password);
      return findUser.length ? findUser[0] : null;
    } catch (error) {
      console.error('Error reading data from file:', error);
      return null;
    }
  }
}

module.exports = DataHandlingUtils;