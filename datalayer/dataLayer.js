var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://toto:cYTJlafug4YpsR2K@cluster0-952lh.mongodb.net/test?retryWrites=true";
//var url = "mongodb://localhost/ListeaFaire";
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
        
            db = client.db("Polytech");
            //db = client.db("ListeaFaire");
            cb();
        });
    },

    getTaskSet : function(recherche,cb){
        db.collection("listes").find(recherche).toArray(function(err, docs){
            cb(docs);
        });
    },

    insertTask : function(task, cb){
        db.collection("listes").insertOne(task, function(err,result){
            cb();
        });
    },

    
    deleteTask : function(id_task, cb){
        var myquery = { _id: ObjectId(id_task) };
        db.collection("listes").deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            cb();
        });
    },

    updateTask : function(id_task, laTache, cb){
        console.log("id : "+id_task+" / tache : "+laTache);
        var myquery = { _id: ObjectId(id_task) };
        var newvalues = { $set: {tache : laTache} };
        db.collection("listes").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            cb(res);
        });
    }
}

module.exports = dataLayer;

//datalayer cest le model
//Dtset cest in objet metier