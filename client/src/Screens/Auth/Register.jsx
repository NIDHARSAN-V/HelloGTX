import CommonForm from '@/Components/Common/form'
import { registerFormControls } from '@/config'
import { registerUser } from '@/Store/AuthSlice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { toast } from "sonner"

const initialState = {
  userName: '',
  email: '',
  password: '' // Corrected typo: "passoword" to "password"
}

function Authregister() {

  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  function Onsubmit(event) {
    event.preventDefault() // Prevent the form from submitting and reloading the page
    console.log(formData)

    dispatch(registerUser(formData)).then((data) => {
      const success = data?.payload?.success || false

      if (success) {
        toast.success(data.payload.message) // Show a success toast
        console.log("in Register JSX")
        console.log(data.payload)

        navigate("/auth/login") // Navigate to login page after successful registration
      } else {
        toast.error('Registration failed. Please try again.') // Show an error toast if registration fails
        console.error("Registration failed:", data?.payload)
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Account</h1>
        <p className="mt-2">Already Have Account
          <Link to="/auth/login" className='font-medium text-primary hover:underline ml-2'>Login</Link>
        </p>
      </div>
      <CommonForm formControls={registerFormControls}
        buttonText={'SignUp'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={Onsubmit}
      />
    </div>
  )
}

export default Authregister
