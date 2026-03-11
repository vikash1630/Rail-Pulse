import React, { useState } from 'react'
import Navbar from './Navbar'

const API_URI = import.meta.env.VITE_API_URL

const Train = () => {

  const [trainNumber, setTrainNumber] = useState("")

  const getDetails = async (e) => {
    e.preventDefault()   // stop page refresh

    const res = await fetch(`${API_URI}/api/train/number?number=${trainNumber}`, {
      method: "GET",
      credentials: "include"
    })

    const data = await res.json()
    console.log(data)
  }

  return (
    <div>
      <Navbar>

      <div>
        <p>Hello</p>

        <form onSubmit={getDetails}>
          <input
            type="number"
            placeholder="Enter Train Number"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
          />

          <input type="submit" value="Submit" />
        </form>

      </div>
      </Navbar>
    </div>
  )
}

export default Train