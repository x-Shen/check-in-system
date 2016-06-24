//CheckInService.getToken() returns the token stored when the admin has logged in

appLogin.controller("adminController", ['$scope', '$http', '$modal', '$state', 'CheckInService', '$document', '$window', function ($scope, $http, $modal, $state, CheckInService, $document) {
// placeholder of user
    $scope.user = {
        name: '',
        studentId: null,
        email: '',
        isAdmin: false,
        password: '',
        time: [
            {
                checkin: null,
                checkout: null,
                flag: false
            }
        ],
        selected: false
    };

    $scope.init = function () {//when adminView is first loaded, this function is ran first
        if (CheckInService.getToken() == undefined) {
            $state.go('adminLogin');
        } else {
            //get all actions
            $http.get('/admins/viewActions?token=' + CheckInService.getToken()).then(function (res) {
                $scope.actions = res.data;
            });

            //get all the user data from the database
            // $http.get('/admins/viewUsers?token=' + CheckInService.getToken()).then(function (res) {
            //     $scope.userList = res.data;
            //     $scope.user = res.data;
            //
            //     // sortDates($scope.userList);
            //     // convertToDateFormat($scope.userList);
            // }, function (err) {
            //     $state.go('adminLogin');
            //     if (err) {
            //         console.log(err);
            //     } else {
            //     }
            // });
        }


    };

    $scope.initUser = function () {
        //get all the user data from the database
        $http.get('/admins/viewUsers?token=' + CheckInService.getToken()).then(function (res) {
            $scope.user = res.data;

            // sortDates($scope.userList);
            // convertToDateFormat($scope.userList);
        }, function (err) {
            $state.go('adminLogin');
            if (err) {
                console.log(err);
            } else {
            }
        });
    };

    //Sorts each user by date in descending order (Kevin Pham)
    var sortDates = function (uList) {
        uList.sort(function (a, b) {
            var aDate = null;
            var bDate = null;
            var aTimeLength = a.time.length - 1; //Gets the highest index number of the array
            var bTimeLength = b.time.length - 1; //that contains the latest checkin time
                                                 //of the user
            if (a.name == null || a.time[aTimeLength] == null) { //If the user has any null
                aDate = new Date("1/1/99");                    //values, set its date to
            }                                                  //1/1/99 to ensure that the
            else                                               //user is sorted to the bottom
                aDate = new Date(a.time[aTimeLength].checkin); //of the list

            if (b.name == null || b.time[bTimeLength] == null) {
                bDate = new Date("1/1/99");
            }
            else
                bDate = new Date(b.time[bTimeLength].checkin);

            return (bDate - aDate); //Compare user "a" with user "b" and sort them
        });                         //accordingly
    };


// hash password !
    $scope.openAdd = function () {

        $modal.open({
            templateUrl: '/views/partial-addUser.html',
            backdrop: true,
            windowClass: 'modal',
            controller: function ($scope, $modalInstance, user, $log, $http) {
                $scope.user = user;
                $scope.submit = function () {
                    $http.post('/admins/addUser?token=' + CheckInService.getToken(), {
                            name: $scope.user.name,
                            studentId: $scope.user.studentId,
                            email: $scope.user.email,
                            isAdmin: $scope.user.isAdmin,
                            password: $scope.user.password
                        }
                    );
                    $modalInstance.dismiss('cancel');
                    user.name = "";
                    user.studentId = "";
                    user.email = "";
                    user.isAdmin = false;
                    user.password = "";
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                    user.name = "";
                    user.studentId = "";
                    user.email = "";
                    user.isAdmin = false;
                    user.password = "";
                };
            },
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });
    };


    $scope.remove = function (userToDelete) {
        if (confirm("Are you sure you want to delete " + userToDelete.name + "?")) {
            $http.post('/admins/deleteUsers?token=' + CheckInService.getToken(), userToDelete).then(
                $http.get('/admins/viewUsers?token=' + CheckInService.getToken()).success(function (data) {
                    if (data.status == 202) {
                        alert("Could not delete user.");
                    }
                    $scope.user = data;
                }));
        }
    };

    $scope.edit = function (userToEdit) {
        //Store userToEdit information so it can be updated on success
        $scope.user.name = userToEdit.name;
        $scope.user.studentId = userToEdit.studentId;
        $scope.user.email = userToEdit.email;
        $scope.user.isAdmin = userToEdit.isAdmin;
        $scope.user.password = userToEdit.password;
        $modal.open({
            templateUrl: 'views/partial-editUser.html',
            backdrop: true,
            windowClass: 'modal',
            scope: $scope,
            controller: function ($scope, $modalInstance, user, $log, $http) {
                //I don't know that this following line does anything important
                //$scope.user = user;

                $scope.submit = function () {
                    $http.post('/admins/editUser?token=' + CheckInService.getToken(), {
                            id: userToEdit._id,
                            new_name: $scope.user.name,
                            new_studentId: $scope.user.studentId,
                            new_email: $scope.user.email,
                            promoteAdmin: $scope.user.isAdmin,
                            new_password: $scope.user.password
                        }
                    ).success(function (res) {
                            if (res.status == '200') {
                                //Reflect changes in database to front-end
                                userToEdit.name = $scope.user.name;
                                userToEdit.studentId = $scope.user.studentId;
                                userToEdit.email = $scope.user.email;
                                userToEdit.isAdmin = $scope.user.isAdmin;
                                $modalInstance.dismiss('cancel');
                            }
                            else if (res.error.code == 11000)
                                alert("User ID or email already exists. Please make sure these fields are correct.");
                            else
                                alert("User could not be edited.");
                        }
                    );

                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.historyView = function (userIndex) {

        $modal.open({
            templateUrl: 'views/partial-viewHistory.html',
            backdrop: true,
            windowClass: 'modal viewUserModal lower',
            controller: function ($scope, $modalInstance, $http) {
                $scope.userData = userIndex;

                //Convert times to be more human readable. Modified from above.
                for (var i = 0; i < $scope.userData.time.length; i++) {
                    if ($scope.userData.time[i].checkin != null) {
                        $scope.userData.time[i].checkin = new Date($scope.userData.time[i].checkin).toLocaleString();
                    }
                    if ($scope.userData.time[i].checkout != null) {
                        $scope.userData.time[i].checkout = new Date($scope.userData.time[i].checkout).toLocaleString();
                    }

                }

                $scope.userTime = $scope.userData.time;

                //********************************************************************
                //Edit checkin/checkout time in History
                $scope.edit = function (timeHistoryByIndex, index) {
                    $scope.userTime.checkin = timeHistoryByIndex.checkin;
                    $scope.userTime.checkout = timeHistoryByIndex.checkout;

                    // Pass to front-end partial-editTimeInHistory.html
                    $scope.selectedIndex = index;


                    $modal.open({
                        templateUrl: 'views/partial-editTimeInHistory.html',
                        backdrop: true,
                        windowClass: 'modal viewUserModal',
                        scope: $scope,
                        controller: function ($scope, $modalInstance, user, $log, $http) {
                            //Change z-index of previous modeal so it is less than backdrop.
                            angular.element(document.getElementsByClassName('lower')[0]).css('z-index', ' 1059');

                            $scope.submit = function () {
                                console.log("index: " + index);
                                $http.post('/admins/editTimeInHistory?token=' + CheckInService.getToken(), {
                                        id: $scope.userData._id,
                                        update_index: index,
                                        new_checkIn: $scope.userTime.checkin,
                                        new_checkOut: $scope.userTime.checkout,
                                        user: $scope.userData
                                    }
                                ).success(function (res) {

                                        if (res.status == '200') {
                                            // instant update to front page
                                            timeHistoryByIndex.checkin = $scope.userTime.checkin;
                                            timeHistoryByIndex.checkout = $scope.userTime.checkout;
                                            $modalInstance.dismiss('cancel');
                                        }
                                        else if (res.error.code == 11000)
                                            alert("Invalid input.");
                                        else
                                            alert("User could not be edited.");
                                    }
                                );

                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            user: function () {
                                return $scope.user;
                            }
                        }
                    });
                };
                //********************************************************************

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                return $scope.user;
            }
        });
    };


    $scope.logOut = function () {
        $state.go('adminLogin');
        CheckInService.removeToken();
    }

}]);
