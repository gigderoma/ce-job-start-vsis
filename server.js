function main(msg) {
    var iamAuthTokenUrl = "https://iam.cloud.ibm.com/identity/token";
    var vpcApiEndPoint = "https://eu-de.iaas.cloud.ibm.com/v1/instances/02b7_0fe8b246-1d8a-4dbc-99bb-218e7f480f0b/actions?version=2022-11-08";
   
    var at;
    const postPayLoadStop = '\'{"type": "reboot"}\'';
   
 
    console.log('Curl to ' + iamAuthTokenUrl);
 
    var spawn = require('child_process').exec;
 
 
    var promise = new Promise(function(resolve, reject) {
 
        var authme = spawn('curl --connect-timeout 10 -X POST ' +  iamAuthTokenUrl +' -H "Content-Type: application/x-www-form-urlencoded" -H "Accept: application/json"  --data-urlencode "grant_type=urn:ibm:params:oauth:grant-type:apikey" --data-urlencode "apikey=r1CZ4dkY5e94psOmL8B8S7VJQKH-xxxxxxxxxx"');
 
        var tmp = {stdout: "", stderr: "", code: "undefined"};
 
        authme.stdout.on('data', function (data) {
            tmp.stdout =  tmp.stdout + data ;
             at = JSON.parse(data).access_token;
            console.log('Access Token: ' +at);
        });
 
        authme.stderr.on('data', function (data) {
            tmp.stderr = tmp.stderr + data;
        });
 
        authme.on('close', function (code) {
            tmp.code = code;
            if (tmp.code === 0) {
               
                
                console.log('Curl to ' +  vpcApiEndPoint );
                var instAction = spawn('curl  --data '+ postPayLoadStop +' -X POST "'+  vpcApiEndPoint +'" -H "Content-Type: application/json" -H "Authorization: Bearer '+ at + '"');
            
                instAction.stdout.on('data', function (data) {
                    tmp.stdout =  data;
                });
 
                instAction.stderr.on('data', function (data) {
                    tmp.stderr = tmp.stderr + data;
                 }); 
            
                instAction.on('close', function (code) {
                    tmp.code = code;
                    if (tmp.code === 0) {
                        console.log(tmp.stdout);
                        resolve({msg: tmp.stdout});
               
                    } else {
                     console.log(tmp.stderr);
                    resolve({msg: tmp.stderr});
                }
 
            });
               
            } else {
                console.log(tmp.stderr);
                resolve({msg: tmp.stderr});
            }
           
            
        });
    });
 
    return promise;
}
