const express = require("express")
const app = express()
const socketio = require("socket.io")
const path = require("path")

const PORT = process.env.PORT || 6000
const server = app.listen(PORT, () => console.log(`Port is running on ${PORT}`))

app.use(express.static(path.join(__dirname, "public")))
// console.log(path.join(__dirname, "public"))

app.get("/", (req, res) => {
  res.send("this is new page")
})

app.get("/venky", (req, res) => {
  res.send("hello get request")
})

const io = socketio(server)

let clients = 0
let names = []
io.on("connection", (socket) => {
  console.log("socket connected")

  socket.on("NewClient", (name) => {
    names.push(name)
    console.log("names", names)
    if (clients < 2) {
      if (clients == 1) {
        console.log("someone joined")
        socket.emit("CreatePeer")
        io.emit("sending names peer", names)
      }
    } else {
      socket.emit("SessionActive")
    }
    clients++
    console.log("clients inside socket", clients)
  })

  socket.on("offer", (offer) => {
    socket.broadcast.emit("backOffer", offer)
  })

  socket.on("Answer", (data) => {
    socket.broadcast.emit("backAnswer", data)
  })
  socket.on("disconnect", () => {
    if (clients > 0) {
      clients--
    }
    console.log("user has left the chat")
  })
})

console.log("total clients", clients)
// console.log(server)

// Server static assest
if (process.env.NODE_ENV === "production") {
  //set static folder

  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}
