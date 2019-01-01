var app = new Vue({
    el: '#app',
    data: {
        message: 'hello'
    },
    methods: {
        sayHello: function () {
            this.message = 'hello world!'
        }
    }
})