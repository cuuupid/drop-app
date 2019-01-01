var socket;

var app = new Vue({
    el: '#app',
    data: {
        username: '',
        screen: 'login',
        items: [],
        tipAmount: 0
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
            localStorage.setItem('venmo', this.username)
            this.screen = 'scanner'
        },
        scan: function () {
            // TODO: run tesseract ocr on image
            this.screen = 'user-selection'
        },
        createBill: function () {
            let bill = {
                items: this.items.map(item => {
                    return {
                        title: item.title,
                        price: item.price,
                        payee: item.payee
                    }
                }),
                tip: this.tip
            }
            socket = io.connect('http://localhost')
            let prefs = {
                user: this.username,
                room: this.username
            }
            console.log(prefs)
            socket.on('connect', () => {
                socket.on('join', user => app.sendBill(user))
                socket.emit('join', prefs)
            })
            this.screen = 'bill'
        },
        sendBill: function (user) {
            console.log(user)
            let bill = {
                items: this.items.map(item => {
                    return {
                        title: item.title,
                        price: item.price,
                        payee: item.payee
                    }
                }),
                tip: this.tip
            }
            socket.emit('bill', bill)
        },
        finishBill: function () {
            // TODO: finish bill
            this.screen = 'tip'
        },
        tip: function (amount) {
            this.tipAmount = amount
            let bill = {
                items: this.items.map(item => {
                    return {
                        title: item.title,
                        price: item.price,
                        payee: item.payee
                    }
                }),
                tip: this.tipAmount
            }
            // TODO: send bill to room
            this.screen = 'finish'
        },
        makeReport: function () {
            // TODO: make report of bill
        }
    }
})