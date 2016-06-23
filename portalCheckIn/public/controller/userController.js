appLogin.controller("userController", ['$scope','$http', function($scope, $http){

    $scope.loginUser = function(){
        if(typeof($scope.checkin) == "number"){
            $http.post("/users/checkin", {
                studentId: $scope.checkin});
        }

        else if(typeof($scope.checkin) == "string"){
            $http.post("/users/checkin", {
                email: $scope.checkin});
        }
        else{
            //later add something
            console.log("incorrect input");
        }
    }

    //$scope.logoutUser = function(){
    //    if(typeof($scope.checkout) == "number"){
    //        $http.post("/users/checkout", {
    //            student_id: $scope.checkout})
    //    }
    //
    //    else if(typeof($scope.checkout) == "string"){
    //        $http.post("/users/checkout", {
    //            email: $scope.checkout})
    //    }
    //    else{
    //        //later add something
    //        console.log("incorrect input");
    //    }
    //}

}]);
