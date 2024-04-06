const logger = require("../config/logger");
let axios = require("axios");
const activityLogs = require('./activityLogs');
const config = require('../config/config');

async function SendSMS(data) {
  const requestData = {
    user_id: config.sms.userId,
    api_key: config.sms.apiKey,
    sender_id: config.sms.senderId,
    to: data.phone_number,
    message: data.message,
  };

  if(requestData.to[0] === "0") {
    requestData.to = "94" + requestData.to.slice(1);
  } else if(requestData.to.toString()[0] !== "9" && requestData.to.toString()[1] !== "4"){
    requestData.to =  "94" + requestData.to;
  }

  if(config.env === "development") {
    logger.info("SMS Data:", 'SMS send to ' + requestData.to + ' with message: ' + requestData.message);
    return
  }

  let result = await axios
    .post("https://app.notify.lk/api/v1/send", requestData)
    .then((response) => {
      // console.log("Response:", response.data);
      logger.info("Response:", response.data);
    })
    .catch((error) => {
      // console.error("Error:", error.response.data);
      logger.error("Error:", error.response.data);
    });

    await activityLogs(
      null,
      "SendSMS",
      "Sent SMS to " + data.phone_number + " with message: " + data.message,
      ""
    );

  return result;
}

module.exports = SendSMS;
