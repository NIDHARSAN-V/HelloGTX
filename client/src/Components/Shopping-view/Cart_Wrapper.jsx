import React from 'react'
import { SheetContent, SheetHeader } from '../ui/sheet'
import { Button } from '../ui/button'
import UserCartItemContent from './Cart_ItemContent'
import { useNavigate } from 'react-router-dom'

function UserCartWrapper({ cartItems , setOpenCartSheet }) {
  // Calculate total cart amount safelyc

  const navigate = useNavigate()
  const totalCartAmount = Array.isArray(cartItems) && cartItems.length > 0
    ? cartItems.reduce((sum, currentItem) => {
        const price = currentItem?.salePrice > 0 ? currentItem.salePrice : currentItem.price || 0;
        const quantity = currentItem?.quantity || 0;
        return sum + price * quantity;
      }, 0)
    : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        Your Cart
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? 
          cartItems.map((item, index) => (
            <UserCartItemContent key={item.id || index} cartItem={item} />
          )) 
          : <p>Your cart is empty.</p>}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button className="w-full mt-5" onClick={()=>{
        navigate('/shop/checkout')
        setOpenCartSheet(false)
      }} >Check Out</Button>
    </SheetContent>
  )
}

export default UserCartWrapper
