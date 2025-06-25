import React from 'react'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCartItems, updateCartQuantity } from '@/Store/Shop/CartSlice'

function UserCartItemContent({cartItem}) {
 

   const dispatch  = useDispatch()
   const {user} = useSelector(state => state.auth)

  function handleDeleteCartItem(getcartItem)
  {
         dispatch(deleteCartItems({userId:user.id , productId :getcartItem.productId }))
  }

  function handleUpdateQuantity(getCartItem , action)
  {
    dispatch(updateCartQuantity({userId:user.id , productId:getCartItem.productId , quantity:
      action==="plus" ?
      getCartItem.quantity +1 :getCartItem.quantity -1 }))
  }
  return (
     <div className="flex items-center space-x-4">
      <img src={cartItem.image} alt="" className='w-20 h-20 rounded object-cover'/>

      <div className="flex-1">
        <h3 className='font-extrabold'>
          {cartItem.title}
        </h3>

        <div className='flex items-center mt-1 gap-2'>
          <Button variant="outline" size="icon" disabled={cartItem.quantity===1}  onClick={()=>{handleUpdateQuantity(cartItem , 'minus')}}>
              <Minus className='w-8 h-8'/>
          </Button>

          <span className='font-semibold'>{cartItem.quantity}</span>
          <Button variant="outline" size="icon" onClick={()=>{handleUpdateQuantity(cartItem , 'plus')}}>
              <Plus className='w-8 h-8'/>
          </Button>

        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${(cartItem.price * cartItem.quantity).toFixed(2)}
        </p>

        <Trash onClick={function()
          {
            handleDeleteCartItem(cartItem)
          }
        }className='cursor-pointer mt-1' size={20}/>
      </div>
     </div>
  )
}

export default UserCartItemContent
