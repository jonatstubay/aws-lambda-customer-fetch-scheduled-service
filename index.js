const AWS = require('aws-sdk');
AWS.config.update({region: "ap-southeast-2"});

exports.handler = (event, context, callback) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "ap-southeast-2"});
    var phone_number = event.Details.ContactData.CustomerEndpoint.Address;
    var cust_num = event.Details.ContactData.Attributes.inputNumber;
     
    console.log(event);
    
    if(typeof cust_num !== 'undefined' && cust_num){
        
        var params = {
            TableName : "northcott_customer",
            IndexName : 'account_number-index',
            KeyConditionExpression : 'account_number = :account_numberVal', 
            ExpressionAttributeValues : {
                ':account_numberVal' : cust_num       
            }
        };  
    }else{
        var params = {
            TableName : "northcott_customer",
            IndexName : 'phone_number-index',
            KeyConditionExpression : 'phone_number = :phone_numberVal', 
            ExpressionAttributeValues : {
                ':phone_numberVal' : phone_number       
            }
        };
    }
    
    console.log(params);
    
    var response;
    
    documentClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err,
                    null, 2));
            response={
                 "status": "failed"
                };
            callback(null,  response);
        } else {
            
            if ((Object.keys(data).length == 0) || (data.Items.length < 1)){
             response={
                 "status": "failed"
                };
            } else {
                console.log(data);
                response={
                 "status": "success",
                 "first_name"                   : data.Items[0].first_name,
                 "last_name"                    : data.Items[0].last_name,
                 "contact_no"                   : data.Items[0].phone_number,
                 "email_address"                : data.Items[0].email_address,
                 "date_scheduled_service"       : data.Items[0].date_scheduled_service,
                 "type_of_service"              : data.Items[0].type_of_service,
                 "time_scheduled_service"       : data.Items[0].time_scheduled_service
                };
            }
            callback(null,  response);
         
        }
    });
};