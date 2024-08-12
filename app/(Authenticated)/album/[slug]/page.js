import React from 'react'

const page = ({ params }) => {

  return (
    <div>
        <p>{params.slug}</p>
    </div>
  )
}

export default page