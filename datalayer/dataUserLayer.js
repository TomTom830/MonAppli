var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://toto:cYTJlafug4YpsR2K@cluster0-952lh.mongodb.net/test?retryWrites=true";
//var url = "mongodb://localhost/Users";
//var client = new MongoClient(url, {useNewUrlParser: true});

var client = new MongoClient(url, {useNewUrlParser: true});
//Password : cYTJlafug4YpsR2K
var db;
ObjectId = require('mongodb').ObjectID;

var dataLayer = {

    init : function(cb){
        //Initialise connection once
        client.connect(function(err){
            if(err) throw err;
        
            //db = client.db("Polytech");
            db = client.db("Users");
            cb();
        });
    },

    getInfos : function(cb){
        db.collection("ident").find({}).toArray(function(err, docs){
            cb(docs);
        });
    },

    //{ projection: { _id: 0, name: 1, address: 1 } }
    getUser : function(projection, cb){
        console.log("on demande si -> "+projection.id+" existe");
        db.collection("ident").findOne(projection, function(err, result) {
            if (err) throw err;
            console.log("resultat dans data layer : "+result);
            cb(result);
          });
    },

    newUser : function(myobject, cb){
        db.collection("ident").insertOne(myobject, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        cb();
        });
    }
}

module.exports = dataLayer;

//datalayer cest le model
//Dtset cest in objet metier