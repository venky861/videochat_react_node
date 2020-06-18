import React, { useState } from "react"
import { withRouter } from "react-router-dom"

const InputComponent = ({ history }) => {
  const [formData, setFormData] = useState({
    name: "",
  })

  const [err, setErr] = useState([])

  const { name } = formData

  const changeHandler = (event) => {
    event.preventDefault()
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const submitHandler = (event) => {
    event.preventDefault()
    //  console.log(name)

    let error = []
    if (!name) {
      error.push("Name cannot be empty")
    }

    if (error.length > 0) {
      setErr(error)
      setTimeout(() => {
        setErr([])
      }, 3000)
    } else {
      history.push(`/videochat?name=${name}`)
    }
  }

  const ListOfErrors =
    err.length > 0
      ? err.map((data, index) => {
          //    console.log(data)
          return <div key={index}>{data}</div>
        })
      : ""
  // console.log(name)

  return (
    <div className='container mt-4'>
      <div className='col-md-6 m-auto'>
        <div className='card  card-body card-color'>
          <h4 className=' text-center  mt-2'> Video Chat </h4>
          <h6 className='text-center mt-2 text-danger'> {ListOfErrors}</h6>
          <form onSubmit={(event) => submitHandler(event)}>
            <div className='form-group'>
              <label className='text-dark'>Enter your Name: </label>
              <input
                className='form-control'
                type='text'
                name='name'
                value={name}
                onChange={(event) => changeHandler(event)}
              />
            </div>

            <button className='btn btn-secondary form-control' type='submit'>
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default withRouter(InputComponent)
