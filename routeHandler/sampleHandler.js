/* 
Title: Sample Handler
Description:Sample Handler
Author:Waliul Islam Nohan
Date:22/07/21
*/

//module scaffolding

const handler = {};

handler.sampleHandler = (requestProperties, callback) =>{
    callback(200, {
        message: 'this is a sample URL',
    });
}

module.exports = handler;