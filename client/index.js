var app = new Vue({
    el: '#app',
    data: {
        venmo_username: '',
        screen: 'login',
        text: '',
        reciept: ''
    },
    created: function () {
        if (localStorage.getItem("venmo")) {
            // TODO: redirect to scanning page 
        } else {
            // TODO: redirect to login page
        }
    },
    methods: {
        login: function () {
            // TODO: sanitize input
            localStorage.setItem('venmo', this.venmo_username)
            this.screen = 'scanner'
        },
        scan: function () {
            // TODO: run tesseract ocr on image
            this.screen = 'user-selection'
            Tesseract.recognize(this.reciept, {
                lang: 'engl'
            }).then(function(result) {this.text = result})
            console.log(this.text)
        },
        createBill: function () {
            // TODO: create a bill
            // TODO: join socket
            // TODO: create room based on username
            // TODO: send bill to room
            this.screen = 'bill'
        },
        finishBill: function () {
            // TODO: finish bill
            this.screen = 'tip'
        },
        tip: function (amount) {
            // TODO: create final bill, in format:
            /*
                {
                    items: [
                        {
                            title: String,
                            price: Number,
                            payee: String
                        }
                    ],
                    tip: Number
                }
            */
            // TODO: send bill to room
            this.screen = 'finish'
        },
        makeReport: function () {
            // TODO: make report of bill
        }
    }
})