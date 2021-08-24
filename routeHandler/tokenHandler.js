/* 
Title: token Handler
Description:Handler to handle token related routes
Author:Waliul Islam Nohan
Date:11/08/21
*/
//dependencies
const data = require('../lib/data');
const {hash} = require('../helpers/utilities');
const {parseJSON}= require('../helpers/utilities');
//module scaffolding
const {createRandomString} = require('../helpers/utilities')
const handler = {};

handler.tokenHandler = (requestProperties, callback) =>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._token[requestProperties.method](requestProperties, callback);
    }else {
        callback(405);
    }

};


handler._token = {};
//post - token create
handler._token.post = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone)=== 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password)=== 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone && password){
        data.read('users', phone, (err1, userData )=>{
            let hashedpass = hash(password);
            if(hashedpass === parseJSON(userData).password){
 
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 *60 *1000;
                const tokenObj = {
                    phone,
                    id: tokenId,
                    expires
                };

                //store the token
                data.create('tokens', tokenId, tokenObj, (err2)=>{
                    if(!err2){
                        callback(200, tokenObj);
                    }else{
                        callback(500,{
                            error: 'there was a problem in server side',
                        });
 
                    }
                })

            

            }else {
                callback(400, {
                    error: 'Password is not vallid',
                });
            }

        })
        
    }else {
        callback(400, {
            error: 'you have a problem in your request',
        })
    }

};


handler._token.get = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id)=== 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
// lookup the token
    if(id){
        data.read('tokens', id, (err, tokenData)=>{
            const token = {...parseJSON(tokenData)};
            if(!err && token) {

                callback(200,token);
            }else {
                callback(404,{
                    error: 'requested token was not found',
                })
            }
        });
    }else {
        callback(404,{
            error: 'requested token was not found',
        });
    }
};

handler._token.put = (requestProperties, callback) =>{
    const id = typeof(requestProperties.body.id)=== 'string' && requestProperties.body.id.trim().length ===20 ? requestProperties.body.id : false;

    const extend = typeof(requestProperties.body.extend)=== 'boolean' && requestProperties.body.extend === true ? requestProperties.body.extend : false;

    if(id && extend){
        data.read('tokens', id, (err1, tokenData)=>{
            let tokenObj = parseJSON(tokenData);
            if(tokenObj.expires > Date.now()){
                tokenObj.expires = Date.now() + 60 * 60 * 1000;

                //store the data token
                data.update('tokens', id, tokenObj,(err2)=>{
                    if(!err2){
                        callback(200);
                    }else{
                        callback(500,{
                            error:'there was a server side error!',
                        });
                    }
                } );
            }else{
                callback(400,{
                    error: 'token already expired',
                })
            }
        })
    }


};

handler._token.delete = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id)=== 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if(id){
        data.read('tokens',id, (err1,tokenData)=>{
            if(!err1 && tokenData){
                data.delete('tokens', id, (err2)=> {
                    if(!err2){
                        callback(200,{
                            message:'token was successfully deleted!',
                        })
                    }else {
                        callback(500,{
                            error:'fuck server side',
                        })
                    }
                })
            }else{
                callback(500,{
                    error:'ami to portei partesina',
                })
            }
        })
    }
};

handler._token.verify =(id, phone, callback) =>{
    data.read('tokens', id, (err,tokenData) =>{
        if(!err && tokenData){
            if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()){

                callback(true);
            }else{
                callback(false);

            }
        }else{
            callback(false);

        }
    })
}

module.exports = handler;