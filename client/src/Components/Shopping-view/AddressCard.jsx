import React from 'react'
import { Card, CardFooter, CardHeader } from '../ui/card'
import {Button} from '../ui/button'
import { Label } from '../ui/label'

function AddressCard({addressInfo , handleDeleteAddress , handleEditAddress}) {
  return (
   <Card>
    <CardHeader className='grid gap-4 p-4'>
           <Label>Address : {addressInfo.address}</Label>
           <Label>City : {addressInfo.city}</Label>
           <Label>PinCode : {addressInfo.pincode}</Label>
           <Label>Phone : {addressInfo.phone}</Label>
           <Label>Notes : {addressInfo.notes}</Label>
    </CardHeader>
    <CardFooter className=' mt-4 flex justify-between p-3'>
       <Button onClick={function()
        {
          handleEditAddress(addressInfo)
        }
       }>Edit</Button>
       <Button onClick={function()
        {
          handleDeleteAddress(addressInfo)
        }
       }>Delete</Button>
    </CardFooter>
   </Card>

  )
}

export default AddressCard
