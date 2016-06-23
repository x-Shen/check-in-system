appLogin.controller("loginController", ['$scope','$http', '$state', 'CheckInService', 'updateNameService', function($scope, $http, $state, CheckInService, updateNameService){
    $scope.user;
    $scope.name = updateNameService.get();

    $scope.loginUser = function(){
        //var checkinString = $scope.checkin.toString();
        //if(checkinString.indexOf("@") > -1){ //If checkin contains the character "@" then it is an email
        //    $http.post("/users/checkin", {
        //        email: $scope.checkin.toLowerCase()
        //    }).success(function(data){
        //        if(data.status == 200){
        //            $state.go('CheckInConfirmation');
        //        }else if(data.status == 201){
        //            alert("User is logged in, please checkout first");
        //            window.location.href='#/home';
        //        } else {
        //            alert("Student email does not exist!");
        //        }
        //    });
        //}
        //else{
            $http.post("/users/checkin", {
                studentId: $scope.checkin
            }).success(function(data){
                // data is json get back from the server
                if(data.status == 200){
                    //Set name to reflect on confirmation page and go there
                    updateNameService.set(data.token);
                    $state.go('CheckInConfirmation');
                }else if(data.status == 201){
                    alert("User is already logged in. Please checkout first");
                    window.location.href='#/home';
                } else {
                    alert("Student ID does not exist!");
                }
            });
        //}
    };

    $scope.loginAdmin = function(){
        $http.post("/admins/login",{
            adminID: $scope.adminID,
            adminPass : $scope.adminPass
        }).success(function(response){
            if(response.status == 200){
                //Set name to reflect on confirmation page and go there
                CheckInService.saveToken(response.token);
                $state.go('adminView');
            }else{
                alert("Admin ID or Password is incorrect. Please try again.");
            }

        });
    };

    $scope.logoutUser = function(){
        //var checkoutString = $scope.checkout.toString();
        ////$scope.name = "";
        //if(checkoutString.indexOf("@") > -1){ //If checkin contains the character "@" then it is an email
        //
        //    $http.post("/users/checkout", {
        //        email: $scope.checkout.toLowerCase()
        //    }).success(function(data){
        //        if(data.status == 200) {
        //            updateNameService.set(data.token);
        //            $state.go('CheckOutConfirmation');
        //            // window.location.href = 'checkout_confirmation.html';
        //        }else if( data.status == 202){
        //            alert(data.message);
        //            $state.go('home');
        //        }
        //    });
        //}
        //else{

            $http.post("/users/checkout", {
                studentId: $scope.checkout
            }).success(function(data){
                if(data.status == 200) {
                    //Set name to reflect on confirmation page and go there
                    updateNameService.set(data.token);
                    $state.go('CheckOutConfirmation');
                }else if( data.status == 201){
                    alert(data.message);
                    window.location.href='#/home';
                }
                else{
                    alert("Student ID does not exist!");
                }
            });
        //}
    }
}]);
