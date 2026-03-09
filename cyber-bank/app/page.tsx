'use client'
import { useState } from 'react'

function Homepage() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>Homepage</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}

export default Homepage