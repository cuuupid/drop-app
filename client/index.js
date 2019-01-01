var app = new Vue({
    el: '#app',
    data: {
        appname: 'Unnamed Bill Sharing App',
        message: 'hello',
        venmo_username: ''
    },
    created: function() {
        if(localStorage.getItem("venmo")) {
           //Redirect to landing page 
        } else {
            //Redirect to login page
        }
    },
    methods: {
        sayHello: function () {
            this.message = 'hello world!'
        },
        login: function() {
            localStorage.setItem('venmo', this.venmo_username)
            //Should redirect to landing page
        }
    }
})