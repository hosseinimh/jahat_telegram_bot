const axios = require("axios");

const createConfig = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.METIS_API_KEY,
    },
  };

  return config;
};

let austinSession = null;
let searleSession = null;

async function createSession(botId) {
  const data = { botId, user: null };
  const response = await axios.post(
    `https://api.metisai.ir/api/v1/chat/session`,
    data,
    createConfig()
  );

  return response.data;
}

async function createAustinSession() {
  return await createSession("0226b5cf-3305-4930-a393-ff9023da7b82");
}

async function createSearleSession() {
  return await createSession("769899f6-9a24-41e1-b3c4-d01bfe9f2784");
}

async function getResponse(session, createSession, message) {
  let result = null;

  try {
    if (!session) {
      session = await createSession();
    }

    const data = { message: { content: message }, type: "USER" };
    const response = await axios.post(
      `https://api.metisai.ir/api/v1/chat/session/${session.id}/message`,
      data,
      createConfig()
    );

    result = response.data;
  } catch (e) {
    console.error(e);
  } finally {
    return result;
  }
}

async function getAustinResponse(message) {
  return await getResponse(austinSession, createAustinSession, message);
}

async function getSearleResponse(message) {
  return await getResponse(searleSession, createSearleSession, message);
}

module.exports = { getAustinResponse, getSearleResponse };
