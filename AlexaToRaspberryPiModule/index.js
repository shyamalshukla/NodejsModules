process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

const ask = require('ask-sdk');
const iot = require('aws-iot-device-sdk');

const skillBuilder = ask.SkillBuilders.standard();

const SendCommandHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' 
            || (request.type === 'IntentRequest' && request.intent.name === 'SendCommand'); 
    },
    handle(handlerInput) {
        const raspberrypi = iot.device({
            keyPath:'./Security/25fdb6c9be-private.pem.key',
            certPath: './Security/25fdb6c9be-certificate.pem.crt',
            caPath: './Security/VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem',
            clientId: 'Alexa',
            host: 'a81921ysfgj30.iot.us-west-2.amazonaws.com',
            region: 'us-west-2'});

        raspberrypi.publish('group1/topic1', JSON.stringify({'msg':'Test Message'}));
    } 
};

exports.handler = skillBuilder.addRequestHandlers(SendCommandHandle).addErrorHandlers().lambda();
