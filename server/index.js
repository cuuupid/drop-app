const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const mongoose = require('mongoose')
mongoose.connect('mongodb://admin:Ebony123%24@ds115340.mlab.com:15340/eb')

var Receipt = mongoose.model('Receipt', new mongoose.Schema({
    items: Array,
    tip: Number
}))

/*

Receipt ({
    items: [
        {
            title: 'Gum',
            price: 0.99,
            payee: '@test-user'
        }
    ],
    tip: 0.15 // percent
})

*/

server.listen(80)

app.get('/', (q, s) => s.sendStatus(200))

/*

User flow:

User selects items and presses next
They join a room
They send a bill to the room
They are given a link which goes to a smaller webapp that will serve for the friends
Each time a friend clicks link, they are logged in and then they join the room
Each time someone joins room, the user emits bill event to the room so new person can get bill
Every time someone selects an item, everyone is updated
Every time someone deselects an item, everyone is updated
When they are done, the user selects tip amount, and then emits a finish event
On finish event, each friend is given a Venmo link to pay the amount they owe

*/

io.on('connection', socket => {
    console.log('new connection')
    socket.on('join', prefs => {
        let room = prefs.room
        let user = prefs.user
        console.log(user, 'joined', room)
        socket.join(room, e => {
            if (e) console.error(e)
            else {
                socket.in(room).emit('join', user)
                socket.on('bill', d => {
                    socket.in(room).emit('bill', d)
                })
                socket.on('select', d => {
                    socket.in(room).emit('select', d)
                })
                socket.on('deselect', d => {
                    socket.in(room).emit('deselect', d)
                })
                socket.on('complete', d => {
                    socket.in(room).emit('complete', d)
                })
                socket.on('finish', receipt => {
                    socket.in(room).emit('finish', receipt)
                    let bill = new Receipt({
                        items: receipt.items.map(item => {
                            return {
                                title: item.title,
                                price: item.price,
                                payee: item.payee
                            }
                        }),
                        tip: receipt.tip
                    })
                    bill.save()
                })
            }
        })
    })
})