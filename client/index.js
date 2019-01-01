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
        let username
        if (username = localStorage.getItem("venmo")) {
            this.username = username
            this.screen = 'scanner'
        }
    },
    methods: {
        login: function () {
            if (!(this.username.startsWith('@') && this.username.length > 3)) return;
            // TODO: sanitize input with regex
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
            socket = io.connect('https://billsplit-server.now.sh')
            let prefs = {
                user: this.username,
                room: this.username
            }
            console.log(prefs)
            socket.on('connect', () => {
                socket.on('join', user => app.sendBill(user))
                socket.on('bill', bill => console.log("Got bill."))
                socket.emit('join', prefs)
            })
            this.screen = 'bill'
        },
        sendBill: function (user) {
            console.log('Sending bill to', user)
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