/* 
Title: Routes
Description:Application routes
Author:Waliul Islam Nohan
Date:22/07/21
*/
//dependencies
 const { checkHandler } = require('./routeHandler/checkHandler');
const {sampleHandler}= require ('./routeHandler/sampleHandler');
const { tokenHandler } = require('./routeHandler/tokenHandler');
const { userHandler } = require('./routeHandler/userHandler');
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
}

module.exports = routes;