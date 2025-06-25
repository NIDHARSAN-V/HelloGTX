import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader ,CardTitle} from '../ui/card'
import CommonForm from '../Common/form'
import { addressFormControls } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from '@/Store/Shop/AddressSlice'
import AddressCard from './AddressCard'
import { toast } from 'sonner'

function Address() {

    const dispatch = useDispatch()

    const {user} = useSelector(state => state.auth)
    const {addressList} = useSelector(state => state.shopaddress)

    const initialAddressFormData = {
        address:'',
        city:'',
        phone:'',
        pincode:'',
        notes:''
    }
    const [formData , setFormData] = useState(initialAddressFormData)

    const [currentEditedId , setCurrentEditedId] = useState(null);

    //    console.log(addressList , "In address")

function handleManageAddress(event) {
    event.preventDefault();
    if(addressList && addressList.length >= 3 && currentEditedId===null)
        {
            toast.error("Max 3 Address Only !!!")
            setFormData(initialAddressFormData)
        return;
    }
     

    if (currentEditedId !== null) {
        // Edit existing address
        dispatch(editAddress({
            userId: user.id,
            addressId: currentEditedId,
            formData
        })).then(data => {
            console.log(data)
            if (data.payload.success) {
                toast.success("Address Edited Successfully")
                dispatch(fetchAllAddress(user.id));
                setCurrentEditedId(null);
                setFormData(initialAddressFormData);
            }
        });
    } else {
        // Add new address
        dispatch(addNewAddress({
            ...formData,
            userId: user.id
        })).then(data => {
            if (data.payload.success) {
                toast.success("Address Added Successfully")
                dispatch(fetchAllAddress(user.id));
                setFormData(initialAddressFormData);
            }
        });
    }
}



    useEffect(()=>{
        dispatch(fetchAllAddress(user.id))
    },[dispatch])

    function isFormValid()
    {
        return Object.keys(formData).map(key => formData[key].trim()!=='').every(item=>item)

    }


    console.log(addressList , "Address List")

 


    function handleDeleteAddress(getCurrentAddress)
    {
         dispatch(deleteAddress({userId : user.id , addressId : getCurrentAddress._id})).then(data=>{
            if(data.payload.success)
            {
                dispatch(fetchAllAddress(user.id))
                toast.success("Address Deleted Succesfully")
            }

                
         })
    }


function handleEditAddress(getCurrentAddress) {
    // Set the ID of the address currently being edited
    setCurrentEditedId(getCurrentAddress._id);

    // Update the form data with the selected address details
    setFormData({
        ...formData, // Retain any other existing form data
        address: getCurrentAddress.address || '',
        city: getCurrentAddress.city || '',
        phone: getCurrentAddress.phone || '',
        pincode: getCurrentAddress.pincode || '',
        notes: getCurrentAddress.notes || ''
    });
}




  return (
   <Card>
        <div className='mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 '>
           {
    addressList && addressList.length > 0 ? (
        addressList.map(AddressItem => <AddressCard addressInfo={AddressItem} handleDeleteAddress={handleDeleteAddress} handleEditAddress={handleEditAddress}/>)
    ) : (
        "n"
    )
}

             
        </div>
        <CardHeader>
             <CardTitle>
                {currentEditedId!==null ? "Edit Address" : "Add Address"}
             </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">

            <CommonForm
            formControls = {addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId!==null ? "Edit" : "Add"}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}/>




        </CardContent>
   </Card>
  )
}

export default Address
