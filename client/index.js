var socket;

const getRandomColor = () => '#' + [0, 1, 2, 3, 4, 5].map(_ => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('')

var app = new Vue({
    el: '#app',
    data: {
        username: '',
        screen: window.location.href.indexOf('?pay=') > -1 ? 'pay' : 'login',
        items: [],
        tipAmount: 0,
        currency: '£',
        payees: [],
        colors: [],
        reciept: '',
        video: {},
        canvas: {},
        captures: []
    },
    created: function () {
        let username
        if (username = localStorage.getItem("venmo")) {
            this.username = username
            this.screen = window.location.href.indexOf('?pay=') > -1 ? 'pay' : 'scanner'
            if (this.screen == 'scanner') setTimeout(startStream, 200)
            // TODO: make it after the dom has updated (i think theres an updated hook)
            if (this.screen == 'pay') this.joinBill()
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
            this.screen = window.location.href.indexOf('?pay=') > -1 ? 'pay' : 'scanner'
            if (this.screen == 'scanner') setTimeout(startStream, 200)
            // TODO: see TODO in created
            if (this.screen == 'pay') this.joinBill()
        },
        scan: function () {
            // TODO: run tesseract ocr on image
            imageCapture.takePhoto().then(function(blob) {
                console.log('Took photo:', blob);
<<<<<<< HEAD
                blob = JSON.parse(JSON.stringify(blob));
                Tesseract.recognize(blob, {
                    lang: 'eng'
=======
                var img = new Image();
                img.src = URL.createObjectURL(blob);
                Tesseract.recognize(img, {
                    lang: 'engl'
>>>>>>> 88fcd59083e6ce41e601f75036f6c3b015a0e66e
                }).then(function(result) {this.text = result})
                
            }).catch(function(error) {
                console.log('takePhoto() error: ', error);
            });
            this.screen = 'user-selection'
            console.log(this.text)
        },
        userSelect: function (i) {
            this.items[i].payee = this.items[i].payee == this.username ? '' : this.username
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
                room: this.username.toLowerCase()
            }
            console.log(prefs)
            socket.on('connect', () => {
                socket.on('join', user => app.sendBill(user))
                socket.on('bill', bill => console.log("Got bill."))
                socket.on('select', this.friendSelected)
                socket.on('deselect', this.friendDeselected)
                socket.emit('join', prefs)
            })
            this.screen = 'bill'
        },
        joinBill: function () {
            socket = io.connect('https://billsplit-server.now.sh')
            let payTo = window.location.href.split('?').reduceRight(_ => _).split('=').reduceRight(_ => _).split('#')[0].toLowerCase()
            console.log('paying', payTo)
            let prefs = {
                user: this.username,
                room: payTo
            }
            socket.on('connect', () => {
                socket.on('bill', bill => {
                    console.log("Got bill.", bill)
                    this.items = bill.items
                    this.items.map(item => {
                        if (item.payee && item.payee != this.username) {
                            let friend = item.payee
                            if (this.payees.indexOf(friend) < 0) {
                                this.payees.push(friend)
                                this.colors.push(getRandomColor())
                            }
                        }
                    })
                    this.tip = bill.tip || this.tip
                })
                socket.on('select', this.friendSelected)
                socket.on('deselect', this.friendDeselected)
                socket.emit('join', prefs)
            })
        },
        friendSelect: function (i) {
            let mode = 'void'
            if (this.items[i].payee == this.username) {
                this.items[i].payee = ''
                mode = 'deselect'
            } else {
                this.items[i].payee = this.username
                mode = 'select'
            }
            let payload = {
                user: this.username,
                itemIndex: i
            }
            socket.emit(mode, payload)
        },
        friendSelected: function (data) {
            console.log('select', data)
            let friend = data.user
            let i = data.itemIndex
            if (this.payees.indexOf(friend) < 0) {
                this.payees.push(friend)
                this.colors.push(getRandomColor())
            }
            this.items[i].payee = friend
        },
        friendDeselected: function (data) {
            console.log('deselect', data)
            let friend = data.user
            let i = data.itemIndex
            if (this.payees.indexOf(friend) < 0) {
                this.payees.push(friend)
                this.colors.push(getRandomColor())
            }
            this.items[i].payee = ''
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
            socket.emit('finish', bill)
            this.screen = 'finish'
        },
        makeReport: function () {
            // TODO: make report of bill
        }
    }
})