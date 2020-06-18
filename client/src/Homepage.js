import React, { useEffect, useRef, useState } from "react"
import Peer from "simple-peer"
import io from "socket.io-client"
import queryString from "query-string"

const hostname = "localhost:4000"
const socket = io(hostname)

const Homepage = ({ location }) => {
  const videoRef = useRef(null)
  const peerVideoRef = useRef(null)
  const [sessionActive, setSessionActive] = useState("")
  //  const [adminStream, adminSetStream] = useState("")
  const [name, setName] = useState("")
  const [totalNames, setTotalNames] = useState([])
  const [adminName, setAdminName] = useState("")
  const [peerName, setPeerName] = useState("")

  useEffect(() => {
    const { name } = queryString.parse(location.search)
    setName(name)
    console.log(name)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log(name)
        socket.emit("NewClient", name)
        //  adminSetStream(stream)
        videoRef.current.srcObject = stream
        videoRef.current.play()
        console.log(videoRef.current)

        let client = {}

        function InitPeer(type) {
          console.log("peer received")
          let peer = new Peer({
            initiator: type === "init" ? true : false,
            stream: stream,
            trickle: false,
          })

          console.log("peer", peer)

          peer.on("stream", (stream) => {
            console.log("stream", stream)
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = stream
              peerVideoRef.current.play()
            }
          })

          peer.on("close", () => {
            peerVideoRef.current.remove()
            peer.destroy()
            console.log("peer destroyed")
          })

          return peer
        }

        socket.on("CreatePeer", () => {
          client.gotAnswer = false

          let peer = InitPeer("init")
          peer.on("signal", (data) => {
            if (!client.gotAnswer) {
              socket.emit("offer", data)
            }
          })
          client.peer = peer
        })

        socket.on("backOffer", (offer) => {
          let peer = InitPeer("notInit")

          peer.on("signal", (data) => {
            socket.emit("Answer", data)
          })
          peer.signal(offer)
          client.peer = peer
        })

        socket.on("backAnswer", (answer) => {
          client.gotAnswer = true
          let peer = client.peer
          peer.signal(answer)
        })

        socket.on("SessionActive", () => {
          setSessionActive("Session is active , Please comeback later")
          videoRef.current.remove()
        })
      })
      .catch((err) => console.log(err))
  }, [location.search])

  // console.log(adminStream)
  socket.on("sending names peer", (data) => {
    setTotalNames(data)
  })

  useEffect(() => {
    totalNames &&
      totalNames.map((data, index) => {
        if (data === name) {
          setAdminName(data)
        } else {
          setPeerName(data)
        }
      })
  }, [totalNames, name])

  return (
    <div>
      <h4 className='heading'> Welcome to video chat</h4>
      <p className='heading'>{sessionActive}</p>

      <div className='col-12 col-sm-6 d-flex justify-content-center '>
        <h5 className='adminName'>{adminName}</h5>
        <div className='embed-responsive embed-responsive-16by9 videoAdmin'>
          <video ref={videoRef} className='embed-responsive-item' muted></video>
        </div>
      </div>

      <div className='col-12 col-sm-6 d-flex justify-content-center '>
        <h5 className='peerName'>{peerName}</h5>
        <div className='embed-responsive embed-responsive-16by9 videoPeer'>
          <video ref={peerVideoRef} className='"embed-responsive-item"'></video>
        </div>
      </div>
    </div>
  )
}

export default Homepage
