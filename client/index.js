var app = new Vue({
    el: '#app',
    data: {
        venmo_username: ''
    },
    created: function () {
        if (localStorage.getItem("venmo")) {
            // TODO: redirect to landing page 
        } else {
            // TODO: redirect to login page
        }
    },
    methods: {
        login: function () {
            // TODO: sanitize input
            localStorage.setItem('venmo', this.venmo_username)
            // TODO: should redirect to landing page
        }
    }
})