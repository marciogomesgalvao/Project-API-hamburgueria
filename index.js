const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000
app.use(express.json())

const CreateOrder = []

const CheckMethod = (request, response, next) => { 
     
    console.log(request.method + request.url)
    next()
}

const CheckOrder = (request, response, next) => {

    const { id } = request.params

    const indexOrders = CreateOrder.findIndex(order => order.id === id)

    if (indexOrders < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.OrdersIndex = indexOrders
    request.orderId = id
    next()
}

app.get('/order', CheckMethod, (request, response) => {

    return response.json(CreateOrder)

})

app.post('/order', CheckMethod, (request, response) => {

    const { order, clienteName, price, status } = request.body

    const newOrder = { id: uuid.v4(), order, clienteName, price, status }

    CreateOrder.push(newOrder)

    return response.status(201).json(newOrder)
})

const CheckId = (request, response, next) => {
    const { id } = request.params

    const indexOrders = CreateOrder.findIndex(order => order.id === id)

    if (indexOrders < 0) {
        return response.status(404).json({ Error: "id not found" })
    }
    next()
}
app.put('/order/:id', CheckOrder, CheckId, CheckMethod, (request, response) => {

    const { order, clienteName, price, status } = request.body

    const indexOrders = request.OrdersIndex

    const id = request.orderId
    const ChangeOrders = { id, order, clienteName, price, status }

    CreateOrder[indexOrders] = ChangeOrders

    return response.json(ChangeOrders)
})

app.delete('/order/:id', CheckOrder, CheckId, CheckMethod, (request, response) => {

    const indexOrders = request.OrdersIndex

    CreateOrder.splice(indexOrders, 1)

    return response.status(204).json()
})

app.get('/order/:id', CheckId, CheckMethod, (request, response) => {

    const { id } = request.params
    const { order, clienteName, price, status } = request.body

    const index = CreateOrder.filter(order => order.id === id)

    return response.json(index)
})

app.patch('/order/:id', CheckId, CheckMethod, (request, response) => {

    const { id } = request.params
    const { order, clienteName, price, status } = request.body

    const ChangeId = CreateOrder.findIndex(order => order.id === id)

    CreateOrder[ChangeId].status = "Pronto"

    return response.json(CreateOrder)
})



app.listen(port, () => {
    console.log(`🔥Active server on port ${port}`)
}) 