/* 
Title: Not found Handler
Description:Not found Handler
Author:Waliul Islam Nohan
Date:22/07/21
*/
//module scaffolding

const handler = {};

handler.notfoundHandler =  (requestProperties, callback) =>{
    callback(404, {
        message: 'this requested url was not found!',
    });
}


module.exports = handler;