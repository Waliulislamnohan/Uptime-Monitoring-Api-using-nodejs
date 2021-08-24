/* 
Title: Handle Request Response
Description:Handle Request and Response
Author:Waliul Islam Nohan
Date:22/07/21
*/

//dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../route');
const {notfoundHandler}= require('../routeHandler/notfoundHandler');
const {parseJSON} = require('./utilities');
//module scaffolding

const handler = {};

handler.handleReqRes = (req, res) => {
    //get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimPath] ? routes[trimPath] : notfoundHandler;

    req.on('data',(buffer)=>{

        realData += decoder.write(buffer);

    });
    req.on('end', () => {
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);
    //response handle
    chosenHandler(requestProperties,(statusCode,payload)=> {
        statusCode = typeof(statusCode)=== 'number'? statusCode : 500;
        payload = typeof(payload) === 'object' ? payload :{};

        const payloadString = JSON.stringify(payload);

        //return the final response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
    });


    });

};

module.exports = handler;