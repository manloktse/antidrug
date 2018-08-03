var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/";

(function() 
 {
	var fs, http, qs, server, url;
	http = require('http');
	url = require('url');
	qs = require('querystring');
	fs = require('fs');
 var nodemailer = require('nodemailer');
  var xoauth2 = require('xoauth2');
  var smtpTransport = require('nodemailer-smtp-transport');
	
	var loginStatus = false, loginUser = "";

	server = http.createServer(function(req, res) 
	{
		var action, form, formData, msg, publicPath, urlData, stringMsg;
		urlData = url.parse(req.url, true);
		action = urlData.pathname;
		publicPath = __dirname + "\\public\\";
		console.log(req.url);
		
		
		
		if (action === "/signup") 
		{
			console.log("signup");
    
			if (req.method === "POST") 
			{
		    console.log("action = post");
    
				formData = '';
				msg = ''; 
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data server="+ formData);
					return req.on('end', function() 
					{

						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var splitName = tempSplitName.split("=");
						var tempPassword = splitMsg[1];
						var splitPassword = tempPassword.split("=");
            var tempEmail=splitMsg[2];
            var splitEmail=tempEmail.split("=")
            console.log(tempSplitName);
            var text = "";
                 var tempid="";
                   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                   for (var i = 0; i < 18; i++)
                   text += possible.charAt(Math.floor(Math.random() * possible.length));
                  
             MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
               var name={name: splitName[1]};
               var email={mail:splitEmail[1]};
               var myobj = { name: splitName[1], password: splitPassword[1], email: splitEmail[1] ,key:text};
                       dbo.collection("tempcustomers").insertOne(myobj, function(err, res) {
                       if (err) throw err;
                      console.log("1 document inserted");
                         console.log(res);
                        
                      });
                      //loginStatus=true;
                  
                      dbo.collection("tempcustomers").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                        db.close();
                });     
               
                 
            }); 
                 //Email Verification
              var transporter = nodemailer.createTransport(smtpTransport( {
                  service: 'Gmail',
                  auth: {
                    xoauth2: xoauth2.createXOAuth2Generator({
                      user: 'antidrug18@gmail.com',
                      clientId: '328924256483-q4gdg9barg8dvrj9bjf09uegjkli7t4i.apps.googleusercontent.com',
                      clientSecret: 'WG9_WUxnnRN0f7J5RKF2Y8Z8',
                      refreshToken: '1/8y_Fah1nCxzLI-89woVxPvgt3p5PCMyXLTWx3NM3Bus',

                    })
                  }
                }));


              var mailOptions = {
                from: 'antidrug18@gmail.com',
                to: splitEmail[1],
                subject: 'Email verification',
                text: 'Activate Your Account: '+"https://mean-manloktse266881.codeanyapp.com/confirm"+"?"+text
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            return res.end("1")
            
             

				    
					});
				});
				
			} 
			else 
			{

				form = "signup2.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		} 
    
    //email verification
    if (action === "/confirm") 
		{
			console.log("email verification!");
    
			if (req.method === "POST") 
			{
		    console.log("action = post");
    
				formData = '';
				msg = ''; 
				return req.on('data', function(data) 
				{
					formData += data;
          var ObjectId = require('mongodb').ObjectId; 
					console.log("form data server="+ formData);
					return req.on('end', function() 
					{
            
						var splitKey = formData.split("?");
						var tempName,tempPwd,tempEm;
             MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
             dbo.collection("tempcustomers").find({key:splitKey[1]}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    if(!result[0]){
                       db.close();
                      return res.end("0");
                    }
                    else{
                      tempName=result[0].name
                      tempPwd=result[0].password
                      tempEm=result[0].email
                      var myobj = { name: tempName, password: tempPwd, email: tempEm };
                      //confirmed
                      dbo.collection("customers").insertOne(myobj, function(err, res) {
                       if (err) throw err;
                      console.log("1 document inserted in customers");
                      //   console.log(res);
                        // loginStatus=true;
                        
                  
                         db.close();
                      //  
                         
                      });
                           dbo.collection("customers").find({}).toArray(function(err, result) {
                              if (err) throw err;
                              console.log("hellododo")
                              console.log(result);
                                  db.close();
                          });  
                       db.close();
                           return res.end("1");
                    }
                       
                    }); 
                
                
                    
										
                    
//                
                       
                 
// 								 dbo.collection("customers").deleteOne({"_id": ObjectId("5b2a5062e888e1045900f997")}, function(err, obj) {
//                     if (err) throw err;
//                     console.log("1 document deleted");
//                     dbo.collection("customers").find({}).toArray(function(err, result) {
//                     if (err) throw err;
//                     console.log("customers"+result);
//                       db.close();
                                    
//                   });  
                    
										
                    
//                });
            
           
              
               
                  
                   
               
                 
            });
             

				    
					});
				});
				
			} 
			else 
			{

				form = "confirm.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
   //delect delect temp user
    else if (action === "/deltempuser") 
		{

				console.log("delect temp user");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					
					return req.on('data', function(data) 
					{
						formData += data;
            var splitKey = formData.split("?");
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							
            
							MongoClient.connect(dbUrl, function(err, db) 
							{
							
								if (err) throw err;
								var dbo = db.db("mydb");
								
								 dbo.collection("tempcustomers").deleteOne({key:splitKey[1]}, function(err, obj) {
                    if (err) throw err;
                    console.log("1 document deleted");
                    dbo.collection("tempcustomers").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                      
                      
                     
                                    
                  });  
          
                    db.close();
                   return res.end("1");
								//		return res.end("1"); 
                    
                });
							});
						});
					});
				}     
		   	
		
		} 
    //fbstaus
    else if (action === "/fbstatus") 
		{
			
    
			if (req.method === "POST") 
			{
        console.log("fbstaus");
		    formData = '';
				
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							
             if(formData=="login"){
               loginStatus=true;
               return res.end("1"); 
             }else if(formData=="logout"){
               loginStatus=false;
               return res.end("0"); 
             }
				
        });
			});
        
		}
    }
    
    
  //delect account
    else if (action === "/delacc") 
		{
			if(loginStatus)
			{
				console.log("delect account");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							
            
							MongoClient.connect(dbUrl, function(err, db) 
							{
							
								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = {"name" : formData};
								 dbo.collection("customers").deleteOne(myobj, function(err, obj) {
                    if (err) throw err;
                    console.log("1 document deleted");
                    dbo.collection("customers").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                      
                     
                                    
                  });  
                   loginStatus=false;
                    db.close();
										
                    
                });
                
                dbo.collection("favourite").deleteOne(myobj, function(err, obj) {
                    if (err) throw err;
                    console.log("1 document deleted");
                    dbo.collection("favourite").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                      
                     
                                    
                  });  
                   loginStatus=false;
                    db.close();
										
                    
                });
							});
              
              return res.end("1"); 
						});
					});
				}
        
		  } 
		
			else
			{
				console.log("no user detected.");
        sendFileContent(res, "index.html", "text/html");
			}
		} 
    
     else if (action === "/getprofile") 
		{
			if(loginStatus)
			{
				console.log("getprofile");
				
        if (req.method === "POST"){
            formData = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("get data="+ formData);
						return req.on('end', function() 
						{
// 							
             							
						MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
             
              var myquery = { name: formData };
              
              dbo.collection("customers").find(myquery).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    db.close();
                    var resultReturn = JSON.stringify(result);
									console.log(resultReturn);
									return res.end(resultReturn);
                });         
               });
							
						});
					});
        }
        
		} 
		
			else
			{
        sendFileContent(res, "index.html", "text/html");
				console.log("no user detected.");
			}
		} 
    
    else if (action === "/resetpwdchk") 
		{
			
    
			if (req.method === "POST") 
			{
        console.log("resetpwdchk");
		    formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							
              var splitMsg = formData.split("&");
						
              var tempSplitID = splitMsg[0];
               var tempSplitKey = splitMsg[1];
               var tempID = tempSplitID.split("=");
               var tempKey = tempSplitKey.split("=");
            MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
             dbo.collection("customers").find({keyid:tempID[1],key:tempKey[1]}).toArray(function(err, result) {
               if (err) throw err;
               else if (!result[0]){
                 console.log("not taken");
                 return res.end("0");
               }
               else{
                 return res.end("1");
               }
               
               dbo.close;
               
             });
            });
				
        });
			});
        
		}
    }
    
    else if (action === "/resetpwd") 
		{
			
				console.log("resetpwd");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							
              var splitMsg = formData.split("&");
						
              var tempSplitID = splitMsg[0];
               var tempSplitPassword = splitMsg[1];
               var tempID = tempSplitID.split("=");
               var tempPassword = tempSplitPassword.split("=");
							//generate key
                  var text = "";
                 var tempid="";
                   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                   for (var i = 0; i < 18; i++)
                   text += possible.charAt(Math.floor(Math.random() * possible.length));
						MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
             
              var myquery = { keyid: tempID[1] };
              var newvalues = { $set: {password: tempPassword[1],key: text} };
              dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                 dbo.collection("customers").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log("ok");
                });              
                db.close();
              });
              
              
               
                  return res.end("1");
            });
							
						});
					});
				}
//      
        else 
			{

				form = "resetpwd.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		 
		
		
			} 
    else if (action === "/profile") 
		{
			if(loginStatus)
			{
				console.log("profile");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							
              var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var splitName = tempSplitName.split("=");
						var tempPassword = splitMsg[1];
						var splitPassword = tempPassword.split("=");
            var tempEmail=splitMsg[2];
            var splitEmail=tempEmail.split("=")
							
						MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
             
              var myquery = { name: splitName[1] };
              var newvalues = { $set: {password: splitPassword[1], email: splitEmail[1] } };
              dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                 dbo.collection("customers").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                });              
                db.close();
              });
              
              
               
                  return res.end("1");
            });
							
						});
					});
				}
//      
        else 
			{

				form = "profile.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		} 
		
			else
			{
        sendFileContent(res, "index.html", "text/html");
				console.log("no user detected.");
			}
			} 
    
    else if (action === "/recover") 
		{
			console.log("cover");
    
			if (req.method === "POST") 
			{
		
				
			} 
			else 
			{

				form = "recoverpassword2.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		} 
    
     else if (action === "/namecheck") 
		{
			
    
			if (req.method === "POST") 
			{
        console.log("namecheck");
		    formData = '';
				
				return req.on('data', function(data) 
				{
					formData += data;
        return req.on('end', function() 
					{
            MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
             dbo.collection("customers").find({name:formData}).toArray(function(err, result) {
               if (err) throw err;
               else if (!result[0]){
                 console.log("not taken"); 
                 return res.end("notTaken");
               }
               else{
                 return res.end("taken");
               }
               
               dbo.close;
               
             });
            });
				
        });
			});
        
		}
    }
    
    else if (action === "/emailcheck") 
		{
			
    
			if (req.method === "POST") 
			{
        console.log("emailcheck");
		    formData = '';
				
				return req.on('data', function(data) 
				{
					formData += data;
        return req.on('end', function() 
					{
            MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
             dbo.collection("customers").find({email:formData}).toArray(function(err, result) {
               if (err) throw err;
               else if (!result[0]){
                 console.log("not taken");
                 return res.end("notTaken");
               }
               else{
                 return res.end("taken");
               }
               
               dbo.close;
               
             });
            });
				
        });
			});
        
		}
    }
    
    else if (action === "/mail") 
		{
			
    
			if (req.method === "POST") 
			{
        console.log("mail");
        formData = '';
				msg = ''; 
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data server="+ formData);
					return req.on('end', function() 
					{
						
            
            MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
                
             
             dbo.collection("customers").find({email:formData}).toArray(function(err, result) {
               if (err) throw err;
               else if (!result[0]){
                 console.log("invalid email");
                 return res.end("invalid email!");
               }
         
               else{
                 console.log(result);
                console.log("ok");
                 //generate key
                  var text = "";
                 var tempid="";
                   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                   for (var i = 0; i < 18; i++)
                   text += possible.charAt(Math.floor(Math.random() * possible.length));
                   for (var j = 0; j < 6; j++)
                   tempid += possible.charAt(Math.floor(Math.random() * possible.length));
              var newvalues = { $set: {key:text,keyid:tempid } };
              dbo.collection("customers").updateOne({email:formData}, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                 dbo.collection("customers").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                });              
                db.close();
              });
                 //reset password email
              var transporter = nodemailer.createTransport(smtpTransport( {
                  service: 'Gmail',
                  auth: {
                    xoauth2: xoauth2.createXOAuth2Generator({
                      user: 'antidrug18@gmail.com',
                      clientId: '328924256483-q4gdg9barg8dvrj9bjf09uegjkli7t4i.apps.googleusercontent.com',
                      clientSecret: 'WG9_WUxnnRN0f7J5RKF2Y8Z8',
                      refreshToken: '1/8y_Fah1nCxzLI-89woVxPvgt3p5PCMyXLTWx3NM3Bus',

                    })
                  }
                }));


              var mailOptions = {
                from: 'antidrug18@gmail.com',
                to: formData,
                subject: 'Forget Password',
                text: 'Your reset password link: '+"https://mean-manloktse266881.codeanyapp.com/resetpwd"+"?"+"id="+tempid+"&key="+text
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
                 
                 return res.end("1");
                
              }
              
    
   console.log(result);
    db.close();
  });
            });
             
				
				    
					});
				});

        
   
			
			} 
		
		}
    //send message
    else if (action === "/sdmsg") 
		{
			
    
			if (req.method === "POST") 
			{
        console.log("send message");
        formData = '';
				
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data server="+ formData);
					return req.on('end', function() 
					{
						 var splitMsg = formData.split("&");
						
              var tempSplitName = splitMsg[0];
               var tempSplitEmail = splitMsg[1];
            var tempSplitMsg = splitMsg[2];
            var tempSplitPhone = splitMsg[3];
               var tempName = tempSplitName.split("=");
               var tempEmail = tempSplitEmail.split("=");
               var tempMsg = tempSplitMsg.split("=");
               var tempPhone = tempSplitPhone.split("=");
              
           //send message email
              var transporter = nodemailer.createTransport(smtpTransport( {
                  service: 'Gmail',
                  auth: {
                    xoauth2: xoauth2.createXOAuth2Generator({
                      user: 'antidrug18@gmail.com',
                      clientId: '328924256483-q4gdg9barg8dvrj9bjf09uegjkli7t4i.apps.googleusercontent.com',
                      clientSecret: 'WG9_WUxnnRN0f7J5RKF2Y8Z8',
                      refreshToken: '1/8y_Fah1nCxzLI-89woVxPvgt3p5PCMyXLTWx3NM3Bus',

                    })
                  }
                }));


              var mailOptions = {
                from: tempEmail[1],
                to: 'antidrug18@gmail.com',
                subject: 'Message From Anti-Drug',
               // text: tempMsg[1]+'\n From: '+tempName[1]+"<h> Contact email: </h>"+tempEmail[1]+'/n Contact No.: '+tempPhone[1],
              html: tempMsg[1]+'<br/> From: '+tempName[1]+"<h> Contact email: </h>"+tempEmail[1]+'/n Contact No.: '+tempPhone[1]
              
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Msg Email sent: ' + info.response);
                }
              });
                 
                 return res.end("1");
             
				
				    
					});
				});

        
   
			
			} 
		
		}
    
    
       else if (action === "/signout") 
		{
			console.log("signout");
    
			if (req.method === "POST") 
			{
        console.log("000");
		    loginStatus=false;
				return res.end("1");
			} 
		
		} 
    

    else if (action === "/login")
		{
			console.log("login");
			if (req.method === "POST") 
			{
				console.log("action = post");
    
				formData = '';
				msg = ''; 
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data server="+ formData);
					return req.on('end', function() 
					{
						//var user;

						//user = qs.parse(formData);
						//msg = JSON.stringify(user);
						//stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var splitName = tempSplitName.split("=");
						var tempPassword = splitMsg[1];
						var splitPassword = tempPassword.split("=");
            console.log(tempSplitName);
//             MongoClient.connect(dbUrl,function(err,db){
//               var dbo=db.db("mydb");
//                 dbo.collection("stuendt").insertOne
//             if (err){
//               console.log("Connection failed")
//             }
             
//             });
            
            MongoClient.connect(dbUrl, function(err, db) {
            if (err) throw err;
             var dbo = db.db("mydb");
            
//                  var myobj = { name: splitName[1], password: splitPassword[1] };
//              dbo.collection("customers").insertOne(myobj, function(err, res) {
//               if (err) throw err;
//                  console.log("1 document inserted");
//               // db.close();
//              });
//              var myobj = stringMsg;
// 							dbo.collection("customers").count({"Name" : splitName[1], "Password" : splitPassword[1]}, function(err, count)
// 							{
// 								console.log(err, count);
// 								finalcount = count;
// 								if(err) throw err;
// 								if(finalcount > 0)
// 								{
// 									loginStatus = true;
// 									loginUser = splitName[1];
// 									console.log("user exist, user is: " + loginUser);
// 									db.close();
// 									return res.end(msg);
// 								}
// 								else
// 								{
// 									db.close();
// 									console.log("user or pw not match");
// 									return res.end("fail");
// 								}
// 							});
              
              var name={name: splitName[1]}
             dbo.collection("customers").find(name).toArray(function(err, result) {
               if (err) throw err;
               else if (!result[0]){
                 console.log("Not such user");
                 return res.end("Not such user!");
               }
         
               else if(splitPassword[1]==result[0].password){
                console.log("hi");
                 loginStatus = true;
                 //return res.end("hi "+splitName[1]+ "^^");
                 return res.end("1");
                
              }
               else{
                 console.log("wrong password!"+result[0].password);
                 return res.end("wrong passord!");
                 
               }
    
   console.log(result);
    db.close();
  });
            });
             
						//res.writeHead(200, 
					//	{
					//		"Content-Type": "application/json",
					//		"Content-Length": msg.length
					//	});
				    
					});
				});
        
       
			}
      
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "login2.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
      
      
       
		}
    
    else if (action === "/fav") 
		{
			if(loginStatus)
			{
				console.log("add favour");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							var user;
// 							user = qs.parse(formData);
// 							msg = JSON.stringify(user);
// 							stringMsg = JSON.parse(msg);
// 							var splitMsg = formData.split("=");
// 							console.log("mess="+msg);
// 							console.log("mess="+splitMsg[0]);
// 							res.writeHead(200, 
// 							{
// 								"Content-Type": "application/json",
// 								"Content-Length": msg.length
// 							});
              var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var splitName = tempSplitName.split("=");
						var tempFav = splitMsg[1];
						var splitFav = tempFav.split("=");
							MongoClient.connect(dbUrl, function(err, db) 
							{
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = {"user" : splitName[1], "favourite" : splitFav[1]};
								dbo.collection("favourlist").count(myobj, function(err, count)
								{
									console.log(err, count);
									finalcount = count;
									if(finalcount > 0)
									{
										if(err) throw err;
										console.log("fav exist");
										db.close();
										return res.end("fail");
									}
									else
									{
										dbo.collection("favourlist").insertOne(myobj, function(err, res) 
										{
											if (err) throw err;
											console.log("fav inserted");
											//db.close();
										});
                    dbo.collection("favourlist").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                      
                                    
                  });  
                    db.close();
										return res.end(msg);
									}
								});
							});
						});
					});
				}
        else 
			{

				form = "favoritelist.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		} 
		
			else
			{
				console.log("no user detected.");
        sendFileContent(res, "index.html", "text/html");
			}
			} 
			
    else if (action === "/addfav") 
		{
			if(loginStatus)
			{
				console.log("add favour");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							
            var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var splitName = tempSplitName.split("=");
						var tempFav = splitMsg[1];
						var splitFav = tempFav.split("=");
            var tempFavNo = splitMsg[2];
						var splitFavNo = tempFavNo.split("=");  
							MongoClient.connect(dbUrl, function(err, db) 
							{
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = {"user" : splitName[1], "favourite" : splitFav[1], "favouriteID" : splitFavNo[1]};
								dbo.collection("favourlist").count(myobj, function(err, count)
								{
									console.log(err, count);
									finalcount = count;
									if(finalcount > 0)
									{
										if(err) throw err;
										console.log("fav exist");
										db.close();
										return res.end("fail");
									}
									else
									{
										dbo.collection("favourlist").insertOne(myobj, function(err, res) 
										{
											if (err) throw err;
											console.log("fav inserted");
											//db.close();
										});
                    dbo.collection("favourlist").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                      
                                    
                  });  
                    db.close();
										return res.end(msg);
									}
								});
							});
						});
					});
				}
        
		  } 
		
			else
			{
				console.log("no user detected.");
        sendFileContent(res, "index.html", "text/html");
			}
		} 
    
    else if (action === "/defav") 
		{
			if(loginStatus)
			{
				console.log("delect favour");
				if (req.method === "POST") 
				{
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) 
					{
						formData += data;
          
						console.log("form data="+ formData);
						return req.on('end', function() 
						{
// 							
            var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var splitName = tempSplitName.split("=");
						var tempFav = splitMsg[1];
						var splitFav = tempFav.split("=");
            var tempFavNo = splitMsg[2];
						var splitFavNo = tempFavNo.split("=");  
							MongoClient.connect(dbUrl, function(err, db) 
							{
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = {"favourite" : splitFav[1]};
								 dbo.collection("favourlist").deleteOne(myobj, function(err, obj) {
                    if (err) throw err;
                    console.log("1 document deleted");
                    dbo.collection("favourlist").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                      
                                    
                  });  
                    db.close();
										return res.end(msg);
                    
                });
							});
						});
					});
				}
        
		  } 
		
			else
			{
				console.log("no user detected.");
        sendFileContent(res, "index.html", "text/html");
			}
		} 
	
    else if (action === "/readfavourlist")
		{
			
				
				if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						
						
						
						var splitName = tempSplitName.split("=");
						
						
						var username =splitName[1];
						
						
						
						console.log("login="+username);
						
						
					
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("favourlist").find({"user" : username}).toArray(function(err, result) 
							{
								if (err) throw err;
									console.log(result);
								db.close();
								var resultReturn = JSON.stringify(result);
									console.log(resultReturn);
									return res.end(resultReturn);
							});
						});
					});
				});
			}
			
		}
    
    else if (action === "/checkstatus")
		{
			
				
				if (req.method === "POST") 
			{
				console.log("action = check");
				if(loginStatus){
          return res.end("1");
        }
        else{
          return res.end("0");
        }
				
							
			}
			
		}
    
// 		else if (action === "/readfavourlist")
// 		{
// 			if(!loginStatus)
// 			{
// 				console.log("no logged in user found");
// 			}
// 			else
// 			{
//           MongoClient.connect(dburl, function(err, db) {
// 							if (err) throw err;
// 							var dbo = db.db("asm");
// 							dbo.collection("profile").find({}).toArray(function(err, result) {
								
// 								if (err) throw err;
// 								var checking =-1;
// 								for (i = 0; i < result.length; i++) { 
// 										if(result[i].id === stringMsg.id){
// 											console.log("\tRecord Found");
// 											console.log("\t\tfav value: "+ result[i].fav);
// 											response.writeHead(200, {
// 												"Content-Type": "text/html"
// 											});
// 											return response.end(result[i].fav);

// 										}
// 								}
// 								db.close();
// 							});					
// 						});
// 				console.log("read favour");
// 				MongoClient.connect(dbUrl, function(err, db) 
// 				{
// 					var finalcount;
// 					if (err) throw err;
// 					var dbo = db.db("mydb");
// 					var myobj = stringMsg;
// 					dbo.collection("favourlist").find({"user" : loginUser}, {"_id" : 0, "command" : 1, "texttitle" : 1}).toArray(function(err, result) 
// 					{
//     				if (err) throw err;
//     				console.log(result);
//     				db.close();
// 						var resultReturn = JSON.stringify(result);
// 						console.log(resultReturn);
//             return res.end(resultReturn);
// 					});
// 				});
// 			}
// 		}

		else 
		{
      
      //handle redirect
			if(req.url === "/index")
			{
        
        if(loginStatus)
				{
					sendFileContent(res, "index2.html", "text/html");
				}
				else
				{
					sendFileContent(res, "index.html", "text/html");
//         if (req.method === "POST") 
// 			{
// 				console.log("action = post");
    
// 				formData = '';
// 				msg = ''; 
// 				return req.on('data', function(data) 
// 				{
// 					formData += data;
          
// 					console.log("form data server="+ formData);
// 					return req.on('end', function() 
// 					{
// 						//var user;

// 						//user = qs.parse(formData);
// 						//msg = JSON.stringify(user);
// 						//stringMsg = JSON.parse(msg);
// 						var splitMsg = formData.split("&");
// 						var tempSplitName = splitMsg[0];
// 						var splitName = tempSplitName.split("=");
// 						var tempPassword = splitMsg[1];
// 						var splitPassword = tempPassword.split("=");
//             console.log(tempSplitName);
// //             MongoClient.connect(dbUrl,function(err,db){
// //               var dbo=db.db("mydb");
// //                 dbo.collection("stuendt").insertOne
// //             if (err){
// //               console.log("Connection failed")
// //             }
             
// //             });
            
//             MongoClient.connect(dbUrl, function(err, db) {
//             if (err) throw err;
//              var dbo = db.db("mydb");
            
// //                  var myobj = { name: splitName[1], password: splitPassword[1] };
// //              dbo.collection("customers").insertOne(myobj, function(err, res) {
// //               if (err) throw err;
// //                  console.log("1 document inserted");
// //               // db.close();
// //              });
//               var name={name: splitName[1]}
//              dbo.collection("customers").find(name).toArray(function(err, result) {
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
//             });
             
// 						//res.writeHead(200, 
// 					//	{
// 					//		"Content-Type": "application/json",
// 					//		"Content-Length": msg.length
// 					//	});
// 				    return res.end("hi "+splitName[1]+ "!");
// 					});
// 				});
        
       
// 			}

 				}
			}
			else if (req.url === "/clinic")
			{
        console.log("clinic");
				sendFileContent(res, "clinic.html", "text/html");
			}
			else if (req.url === "/header")
			{
				sendFileContent(res, "header.html", "text/html");
			}
      else if (req.url === "/game")
			{
				sendFileContent(res, "drug-killer.html", "text/html");
			}
      else if (req.url === "/fblogin")
			{
				sendFileContent(res, "fblogin.html", "text/html");
			}

			else if(req.url === "/")
			{
				console.log("Requested URL is url" + req.url);
				res.writeHead(200, 
				{
					'Content-Type': 'text/html'
				});
				res.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + req.url);
			}
			else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString()))
			{
        
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
       else if(/^\/[a-zA-Z0-9\/]*.min.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
      
       else if(/^\/[a-zA-Z0-9_\/]*.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
       else if(/^\/[-a-zA-Z0-9\.a-zA-Z0-9\/]*.min.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
       else if(/^\/[-a-zA-Z0-9\/].[-a-zA-Z0-9\/]-[-a-zA-Z0-9\/]*.min.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
			else if(/^\/[-a-zA-Z0-9\/]*.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
       else if(/^\/[a-zA-Z0-9-a-zA-Z0-9\/]*.min.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
       else if(/^\/[-a-zA-Z0-9\.a-zA-Z0-9\/]*.min.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
      else if(/^\/[a-zA-Z0-9\/]*.min.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
       else if(/^\/[a-zA-Z0-9\/]*.map$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
        else if(/^\/[-a-zA-Z0-9\/]*.woff$/.test(req.url.toString()))
			{
        console.log("heol1");
				sendFileContent(res, req.url.toString().substring(1), "application/font-woff");
			}
      else if(/^\/[a-zA-Z0-9-a-zA-Z0-9\/]*.woff2$/.test(req.url.toString()))
			{
        console.log("heol");
				sendFileContent(res, req.url.toString().substring(1), "application/font-woff2");
			}
       else if(/^\/[-a-zA-Z0-9-a-zA-Z0-9\/]*.eot$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "application/vnd.ms-fontobject");
			}
       else if(/^\/[-a-zA-Z0-9-a-zA-Z0-9\/]*.otf$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "application/font-otf");
			}
       else if(/^\/[a-zA-Z0-9\/]*.ttf$/.test(req.url.toString()))
			{
       
				sendFileContent(res, req.url.toString().substring(1), "application/font-ttf");
			}
       else if(/^\/[-a-zA-Z0-9-a-zA-Z0-9\/]*.svg$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "application/image/svg+xml");
			}
			else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "image/jpg");
			}
      else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "image/png");
			}
      else if(/^\/[-a-zA-Z0-9\/]-[-a-zA-Z0-9\/]*.png$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "image/png");
			}
			else
			{
				console.log("Requested URL is: " + req.url);
				res.end();
			}

		}
	});

	server.listen(3000);

	console.log("Server is running�Atime is" + new Date());


	function sendFileContent(response, fileName, contentType)
	{
		fs.readFile(fileName, function(err, data)
		{
			if(err)
			{
				response.writeHead(404);
				response.write("Not Found!");
			}
			else
			{
				response.writeHead(200, {'Content-Type': contentType});
				response.write(data);
			}
			response.end();
		});
	}
 }).call(this);
