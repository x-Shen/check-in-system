appLogin.filter('duration', function(){
    return function(input) {
        if(input.checkout == null){
            return 'Not Checked out';
        }else{
            var millis = (new Date(input.checkout) - new Date(input.checkin))
            var hours = Math.floor(millis / 36e5),
                mins = Math.floor((millis % 36e5) / 6e4),
                secs = Math.floor((millis % 6e4) / 1000)
            return hours+' hour(s) '+ mins+' min(s) '+ secs +'sec(s)'
        }
    }
})

appLogin.filter('currentTime', function(){
    return function(){
        return new Date().toLocaleTimeString()
    }
})