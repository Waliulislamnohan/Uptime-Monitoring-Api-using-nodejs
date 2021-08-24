/* 
Title: User Handler
Description:Handler to handle user related routes
Author:Waliul Islam Nohan
Date:04/08/21
*/
//dependencies
const data = require('../lib/data');
const {hash} = require('../helpers/utilities');
const {parseJSON}= require('../helpers/utilities');
const tokenHandler = require('./tokenHandler');
//module scaffolding

const handler = {};

handler.userHandler = (requestProperties, callback) =>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._users[requestProperties.method](requestProperties, callback);
    }else {
        callback(405);
    }

};


handler._users = {};
//post - user create
handler._users.post = (requestProperties, callback) => {

    const firstName = typeof(requestProperties.body.firstName)=== 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    console.log(firstName);
    const lastName = typeof(requestProperties.body.lastName)=== 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone)=== 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password)=== 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    console.log(firstName,lastName,phone,hash(password));
    // const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' && requestProperties.body.tosAgreement ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password){
        // make sure that user doesnt already exists
        data.read('users', phone, (err1)=>{
            if(err1){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password)
                };
                //store the user db
                data.create('users', phone, userObject, (err2) =>{
                    if(!err2){
                        callback(200,{
                            message: 'user was created successfully!',
                        });
                       
                    }else {
                        callback(500, {error:'couldnot create user!'});
                        console.log(err2);
                    }
                })
            }else {
                callback (500, {
                    error: 'there is a problem in server side',
                })
            }
        });
    }else {
        callback(400, {
            error: 'you have a problem in your request',
        });

    }


};

handler._users.get = (requestProperties, callback) => {
    const phone = typeof(requestProperties.queryStringObject.phone)=== 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if(phone){
        //verify token 
        const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenId)=>{

            if(tokenId) {
                data.read('users', phone, (err, u)=>{

                    const user = {...parseJSON(u)};
                    if(!err && user) {

                        delete user.password;
                        callback(200,user);

                    }else {
                        callback(404,{
                            error: 'requested user was not found',
                        })
                    }
                });
            }else{
                callback(403, {
                    error:'Authentication failure!',
                });
            }
        })


    }else {
        callback(404,{
            error: 'requested user was not found',
        });
    }
};

handler._users.put = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone)=== 'string' && requestProperties.body.phone.trim().length === 0 ? requestProperties.body.phone : false;

    const firstName = typeof(requestProperties.body.firstName)=== 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName)=== 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const password = typeof(requestProperties.body.password)=== 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if(phone){      
        if(firstName || lastName || password){
              
            
        const token =
        typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token: false;

        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if(tokenId){
                data.read('users', phone,(err1,uData)=>{
                    const userData = {...parseJSON(uData)};
                    if(!err1 && userData){
                        if(firstName){
                            userData.firstName = firstName;
                        }
                        if(lastName){
                            userData.lastName = lastName;
                        }
                        if(password){
                            userData.password = hash(password);
                        }
    
                        data.update('users', phone, userData, (err2)=>{
                            if(!err2) {
                                callback(200,{
                                    message:'User was updeated successfully',
                                })
                            }else{
                                callback(500,{
                                    message:'there was a problem in server side',
                                })    
                                console.log(err2);
                            }
                        });
                    }else{
                        callback(400,{
                            error: 'you have a problem in your request!',
                        })
                        console.log(err1);
                    }
                });
            }else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }

        })

 
    }else{
            callback(400,{
                error: 'you have a problem in your request baaal!',
            });

        }
    }else {
        callback(400,{
            error: 'you have a problem in your request oibal!',
        });


    }
};

handler._users.delete = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        // verify token
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // lookup the user
                data.read('users', phone, (err1, userData) => {
                    if (!err1 && userData) {
                        data.delete('users', phone, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    message: 'User was successfully deleted!',
                                });
                            } else {
                                callback(500, {
                                    error: 'There was a server side error!',
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
};



module.exports = handler;