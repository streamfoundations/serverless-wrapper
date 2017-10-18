const AWS = require('aws-sdk');

module.exports = async function serverlessWrapper(lambdaName, forceLocal, obj, fn, args) {
  if (process.env.NODE_ENV !== 'production' || forceLocal) {
    return obj[fn](...args);
  }

  const lambda = new AWS.Lambda({ region: process.env.AWS_REGION || 'eu-west-1', apiVersion: '2015-03-31' });

  try {
    const data = await lambda.invoke({
      FunctionName: lambdaName,
      InvocationType: 'RequestResponse',
      LogType: 'None',
      // LogType: 'Tail',
      Payload: JSON.stringify({ fn, args }),
    }).promise();

    // console.warn('data.log', Buffer.from(data.LogResult, 'base64').toString('utf8'));
    return JSON.parse(data.Payload);
  } catch (err) {
    return Promise.reject(err);
  }
};
