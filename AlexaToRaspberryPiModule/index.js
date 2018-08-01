process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

const ask = require('ask-sdk');
const aws = require('aws-sdk');

const skillBuilder = ask.SkillBuilders.standard();

const SendCommandHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' 
            || (request.type === 'IntentRequest' && request.intent.name === 'SendCommand'); 
    },
    handle(handlerInput) {
        const host = 'a81921ysfgj30.iot.us-west-2.amazonaws.com';
        const iotdata = new aws.IotData({ endpoint : host });

        if (iotdata === null)
        {
            console.log("iotdata found null");
        }
        else {
            var params = {
                topic : 'group1/topic1',
                payload : 'Message From Alexa',
                qos : 0
            };

            iotdata.publish(params, (err, data) => {
                if (err) {
                    console.log("Error occured : ", err);
                }
                else {
                    console.log("Success..");
                }
            });
        }
        return handlerInput.responseBuilder.speak("Message has been sent").withSimpleCard("Raspberry Pi Broker", "Message has been sent to raspberry pi").getResponse(); 
    } 
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason : ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse(); 
    }
};
exports.handler = skillBuilder.addRequestHandlers(SendCommandHandler, SessionEndedRequestHandler).addErrorHandlers().lambda();
