var Listeafaire = angular.module('ListeaFaire', []);

//$http variable pour faire les requtes entre client et serveur
function mainController($scope, $http) {
    $scope.formData69 = {};
    $scope.modifData = [];
    
    var auteur_cookie = document.cookie.split(';');
    auteur_cookie = auteur_cookie[0].substring(0,auteur_cookie[0].indexOf('='));


    //Obtenir la liste (appel à la fonction get dans server.js)
    $http.get('/getTaskSet')
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error : ' + data);
        });


    //rajout d'une donnée (appel à la fonction post dans server.js)
    $scope.createTodo = function() {

        data_sent = { text: $scope.formData69.text, 
            creat: auteur_cookie
        };


        $http.post('/addTask', data_sent)
            .success(function(data) {
                //vide la zone de saisie le '{}' initialise
                $scope.formData69 = {};
                $scope.laliste = data;
            })
            .error(function(data) {
                console.log('Error : ' + data.errorCode);
            }); 
    };

    //rajout d'une donnée (appel à la fonction delete dans server.js)
    $scope.deleteTodo = function(id) {
        var rrq = '/delTask/' + id;
        $http.delete(rrq)
            .success(function(data) {
                $scope.laliste = data;
            })
            .error(function(data) {
                console.log('Error : ' + data.errorCode);
            }); 
    };

    $scope.updateTodo = function(id) {
        var data_sent={text: $scope.modifData[id]};

        $http.put('/updTask/'  + id, data_sent)
        .success(function(data){
            $scope.modifData[id] = [];
            $scope.laliste = data;
        })
        .error(function(data){
            console.log('Error : ' + data.errorCode);
        });
    };

    $scope.deconnexion = function(){
        document.cookie="";
        window.location.replace("/");
        $http.post('/Deconnect');
    }
}