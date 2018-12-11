//  api.js
var express = require('express');
var app = express();
var ig = require('instagram-node').instagram();

//location of our static files(css,js,etc..)
app.use(express.static(__dirname + '/public'));

//set the view engine to use ejs
app.set('view engine', 'ejs');

ig.use({
    client_id: 'client_id',
    client_secret: 'client_secret'
});

//the redirect uri we set when registering our application
var redirectUri = 'http://localhost:5000/handleAuth';

app.get('/authorize', function(req, res){
    // set the scope of our application to be able to access likes and public content
    res.redirect(ig.get_authorization_url(redirectUri, { scope : ['public_content','likes','follower_list']}) );
});
var accessToken;
app.get('/handleAuth', function(req, res){
    //retrieves the code that was passed along as a query to the '/handleAuth' route and uses this code to construct an access token
    ig.authorize_user(req.query.code, redirectUri, function(err, result){
        if(err) res.send( err );
    // store this access_token in a global variable called accessToken
  
        accessToken = result.access_token;
        console.log(accessToken)
    // After getting the access_token redirect to the '/' route 
        res.redirect('/');
    });
})

app.get('/test', function(req, res){

console.log(accessToken)
    // create a new instance of the use method which contains the access token gotten
     ig.use({
      access_token : accessToken
     });

     ig.user_follows(accessToken.split('.')[0], function(err, users, pagination, remaining, limit) {
     
            console.log(err)
        console.log(users);

     });






     ig.user_media_recent(accessToken.split('.')[0], function(err, result, pagination, remaining, limit) {
         if(err) {
             console.log(err)
            
            res.json(err);

        }else{
      // pass the json file gotten to our ejs template
         res.render('./pages/index.ejs', { instagram : result });}

     });
    
    
 });


 app.get('/', function(req, res){
    //指定 /views/idex.ejs
    res.send('hi');
  });


  
 app.listen(5000);