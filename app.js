/*
{
  "name": "appliweb",
  "version": "1.0.0",
  "description": "Mon premier fichier",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "keywords": [
    "file"
  ],
  "author": "Thomas",
  "license": "ISC",
  "dependencies": {
    "nodemon": "^1.18.10",
    "bcryptjs": "^2.4.3",
    "express": "^4.16.4",
    "mongodb": "^3.2.3",
    "mongoose": "^5.4.20",
    "morgan": "^1.9.1"
  },
  "devDependencies": {}
}

*/

//datalayerr
var dataLayer = require('./datalayer/dataLayer.js');

var dataUserLayer = require('./datalayer/dataUserLayer.js');

//server web 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");


//init parser
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); //Dossier des données statics

var obj_rech = {auteur:""};

function heure(){
    var date = new Date();
    var heure = date.getHours();
    var minutes = date.getMinutes();
    if(minutes < 10)
         minutes = "0" + minutes;
    return heure + "h" + minutes;
}

function dateFr(){
    // les noms de jours / mois
    var jours = new Array("dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi");
    var mois = new Array("janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre");
    // on recupere la date
    var date = new Date();
    // on construit le message
    var message = jours[date.getDay()] + " ";   // nom du jour
    message += date.getDate() + " ";   // numero du jour
    message += mois[date.getMonth()] + " ";   // mois
    message += date.getFullYear();
    return message;
}


//Start the application after the database connection is ready
dataLayer.init(function(){
    console.log('init');
    app.listen(3000);
    console.log("Listening on port 3000");
});


dataUserLayer.init(function(){
    console.log('User data initialized');
});


app.get("/", function(req,res){
    res.sendFile(__dirname+'/users/connect.html');
});

/*app.get("/", function(req,res){
    res.sendFile(__dirname+'/public/index.html');
});*/

//insert task
app.post("/addTask", function(req, res){
    
    console.log("CONSOLE : tache ="+req.body.text+" / auteur : "+req.body.creat);
    if(req.body && typeof req.body.text !='undefined' && typeof req.body.creat != 'undefined'
    && req.body.creat!=''){
        console.log(req.body);

        var task = {
            tache : req.body.text,
            auteur : req.body.creat,
            heure : heure()+" "+dateFr()
        };

        dataLayer.insertTask(task,function(){
            
            dataLayer.getTaskSet( obj_rech,function(dtSet){
                res.send(dtSet);
            });
            
        })
    }else if(req.body.creat==''){
        console.log("on envoi erreur pas co");
        res.status(404).send({
            success : false,
            errorCode : "NOT_CONNECTED"
        });
    }
    else{
        console.log("on envoi erreur");
        res.status(404).send({
            success : false,
            errorCode : "PARAM_MISSING"
        });
    }
});


//insert task
app.post("/Connect", function(req, res){
    //console.log( "Mot de passe chiffré : "+SHA256("req.body.passwd"));


    if(req.body && typeof req.body.id !='undefined' && req.body.id!=''
        && typeof req.body.passwd !='undefined' && req.body.passwd!=''){

        dataUserLayer.getInfos( function(dtSet){
            console.log("L'identifiant : "+dtSet[0]);
        });

        var proj = {id:req.body.id};
        dataUserLayer.getUser(proj,function(result){
            console.log("Return datalayer : "+ result);
        
            if(result != null){
                if(result.pwd.localeCompare(req.body.passwd) == 0){
                obj_rech = {auteur: req.body.id};
                res.send({
                    success : true,
                    url : "/public/index.html"
                });
                }
                else{
                    console.log("erreur d'identifiant");
                    res.status(404).send({
                        success : false,
                        errorCode : "AUTH_FAIL"
                    });
                }
            }else{
                res.status(404).send({
                    success : false,
                    errorCode : "AUTH_FAIL"
                });
            }
        });
    }else{
        res.status(404).send({
            success : false,
            errorCode : "MISSING PARAM"
        });
    }
});

app.post('/Deconnect', function(){
    obj_rech = {auteur:""};
});


//get all InfosUser
app.get('/getInfos', function(req, res) {

    dataUserLayer.getInfos( function(dtSet){
        res.send(dtSet);
    });
});


app.get('/goSinscrire',function(req,res){
    console.log("on envoie la page inscription");
    res.send('/users/inscrire.html');
    
});

app.post('/addUser', function(req,res){
    console.log(req.body.sub_passwd + " "+ req.body.sub_id);

    if(req.body && typeof req.body.sub_id !='undefined' && typeof req.body.sub_passwd != 'undefined'){

        var proj = {id:req.body.sub_id};
        dataUserLayer.getUser(proj,function(result){
            console.log("Return datalayer : "+ result);
            
            if(result == null){
                console.log("utilisateur non defini");
                // if(req.body && typeof req.body.text !='undefined' && typeof req.body.creat != 'undefined'){
                //mettre la verif
                var myobj = { id: req.body.sub_id, pwd: req.body.sub_passwd };
                dataUserLayer.newUser(myobj,function(){
                    console.log("user added");
                    res.send({
                        success : true
                    });
                });
            }
            else{
                res.status(404).send({
                    success : false,
                    errorCode : "USER_ALREADY_REGISTRED"
                });
            }
        });
    }else{
        res.status(404).send({
            success : false,
            errorCode : "MISSING PARAM"
        });
    }
})


//get all TaskSet
app.get('/getTaskSet', function(req, res) {

    dataLayer.getTaskSet( obj_rech,function(dtSet){
        res.send(dtSet);
    });
});

app.delete('/delTask/:id',function(req,res){
    dataLayer.deleteTask( req.params.id, function(){
        dataLayer.getTaskSet( obj_rech, function(dtSet){
            res.send(dtSet);
        });
    });
});

app.put('/updTask/:id', function(req, res){
    console.log("Dans le put");
    console.log("le text testé : "+ req.body.text );
    if(req.body && typeof req.body.text !='undefined' && req.body.text !=''){
        dataLayer.updateTask(req.params.id, req.body.text,function(){
            dataLayer.getTaskSet( obj_rech,function(dtSet){
                res.send(dtSet);
            });
        });
    }
    else{
        console.log("on envoi erreur");
        res.status(404).send({
            success : false,
            errorCode : "PARAM_MISSING"
        });
    }
});
