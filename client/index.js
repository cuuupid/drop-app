var socket;

var app = new Vue({
    el: '#app',
    data: {
        username: '',
        screen: 'login',
        items: [],
        tipAmount: 0,
        currency: '£',
        payees: [],
        colors: []
    },
    created: function () {
        let username
        if (username = localStorage.getItem("venmo")) {
            this.username = username
            this.screen = 'scanner'
        }
    },
    methods: {
        createDummyData: function () {
            this.items = [
                {
                    title: 'Silver Spoon Sugar',
                    price: 0.99,
                    payee: ''
                },
                {
                    title: 'Bullingdon Club Sandwich',
                    price: 2.45,
                    payee: ''
                },
                {
                    title: 'Filthy Rich Tea Biscuits',
                    price: 1.49,
                    payee: ''
                },
                {
                    title: 'Sam Camambert',
                    price: 2.65,
                    payee: ''
                },
                {
                    title: 'Badger Burgers',
                    price: 1.49,
                    payee: ''
                },
                {
                    title: 'Scottish Salmond',
                    price: 5.99,
                    payee: ''
                },
                {
                    title: 'Billionaire\'s Shortbread',
                    price: 99.00,
                    payee: ''
                },
                {
                    title: 'Wealthy Donor Kebab',
                    price: 2.50,
                    payee: ''
                },
                {
                    title: 'Eton Mess',
                    price: 3.95,
                    payee: ''
                },
                {
                    title: 'Dandelion & Murdoch',
                    price: 0.99,
                    payee: ''
                },
                {
                    title: 'Boris Johnson\'s Baby Powder',
                    price: 1.99,
                    payee: ''
                }
            ]
        },
        login: function () {
            if (!(this.username.startsWith('@') && this.username.length > 3)) return;
            // TODO: sanitize input with regex
            localStorage.setItem('venmo', this.username)
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