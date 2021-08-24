/* 
Title: Environments
Description:Handle all environment related things
Author:Waliul Islam Nohan
Date:26/07/21
*/

//dependencies


// module scaffolding

const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'hsfsdfsaasdfsadf',
    maxChecks: 5,
    twilio: {
        fromPhone: '01312203998',
        accountSid: 'AC1547ddcc9e3e3d8ed7e2ce3c91dcaf7b',
        authToken: '9bee87f6b02a5432c8f66f6e71dc0bb9',
    },
}

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'sdfsavdfavadfvdafv',
    maxChecks: 5,
    twilio: {
        fromPhone: '01875490002',
        accountSid: 'AC1547ddcc9e3e3d8ed7e2ce3c91dcaf7b',
        authToken: '9bee87f6b02a5432c8f66f6e71dc0bb9',
    },
}

//determine which environment was passed


const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';


// Export corrosponding environment object

const environmentToexport = 
    typeof environments[currentEnvironment] === 'object'
     ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToexport;