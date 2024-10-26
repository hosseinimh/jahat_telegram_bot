const axios = require("axios");

axios.defaults.withCredentials = true;

const handlePost = async (url, data, config) => {
  return await axios.post(url, data, config);
};

module.exports = { handlePost };
