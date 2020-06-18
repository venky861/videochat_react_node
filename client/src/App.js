import React from "react"
import "./App.css"
import Homepage from "./Homepage"
import InputComponent from "./InputComponent"
import { Switch, BrowserRouter as Router, Route } from "react-router-dom"
import Rough from "./Rough"

function App() {
  return (
    <Router>
      <Route exact path='/' component={InputComponent}></Route>

      <Switch>
        <Route path='/videochat' component={Homepage}></Route>
      </Switch>
    </Router>
  )
}

export default App
