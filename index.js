const AWS = require('aws-sdk');

module.exports = async function serverlessWrapper(lambdaName, forceLocal, fn, args) {
  if (process.env.NODE_ENV !== 'production' || forceLocal) {
    return fn(...args);
  }

  const lambda = new AWS.Lambda({ region: process.env.AWS_REGION || 'eu-west-1', apiVersion: '2015-03-31' });

  try {
    const data = await lambda.invoke({
      FunctionName: lambdaName,
      InvocationType: 'RequestResponse',
      LogType: 'None',
    }).promise();

    return JSON.parse(data.Payload);
  } catch (err) {
    return Promise.reject(err);
  }
};
