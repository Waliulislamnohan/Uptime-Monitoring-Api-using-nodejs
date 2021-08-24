/* 
Title: Routes
Description:Application routes
Author:Waliul Islam Nohan
Date:22/07/21
*/
//dependencies

//module scaffolding
const crypto = require('crypto');
const utilities = {};
const environments = require('./environments');
utilities.parseJSON = (jsonString) =>{
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};


//hash string 
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length >0){
        const hash = crypto
        .createHmac('sha256', environments.secretKey)
               .update('str')
               .digest('hex');
               return hash;
    }
    return false;
};

//create random string 
utilities.createRandomString = (strlength) => {
     let length = strlength;
     length = typeof strlength === 'number' && strlength >0 ? strlength : false;

     if(length){
        const possibleChar = 'abcdefghiklmnopqrstuvwxyz1234567890';
        let output = '';
        for(let i=1; i<= length; i+=1){
            const randomChar = possibleChar.charAt(Math.floor(Math.random()* possibleChar.length))
            output += randomChar;
        };
        return output;
     }else{
        return false; 
     }
    };


module.exports = utilities;