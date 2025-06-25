import React from 'react';

import img from "../../assets/account.jpg"
import Address from '@/Components/Shopping-view/Address';
import { useSelector } from 'react-redux';
import UserCartItemContent from '@/Components/Shopping-view/Cart_ItemContent';
import { Button } from '@/Components/ui/button';

function ShoppingCheckout() {
  const { cartItems } = useSelector(state => state.shopcart)



  const totalCartAmount = Array.isArray(cartItems.items) && cartItems.items.length > 0
    ? cartItems.items.reduce((sum, currentItem) => {
      const price = currentItem?.salePrice > 0 ? currentItem.salePrice : currentItem.price || 0;
      const quantity = currentItem?.quantity || 0;
      return sum + price * quantity;
    }, 0)
    : 0;




  console.log("CartItems", cartItems)
  return (
    <div className="flex flex-col">

      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className='h-full w-full object-cover object-center' />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-5 ">

        <Address />

        <div className="flex flex-col gap-4" >
          {
            cartItems && cartItems.items.length > 0 ?
              cartItems.items.map(cartitem => <UserCartItemContent cartItem={cartitem} />


              )

              :
              null
          }
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className='mt-4 w-full'>
            <Button className='w-full'>Checkout with Paypal</Button>
          </div>

          
        </div>



      </div>

    </div>
  )
}

export default ShoppingCheckout
