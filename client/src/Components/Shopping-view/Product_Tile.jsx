import React from 'react'
import { Badge } from '../ui/badge'
import { Card,CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { BrandMap, CategoryMap } from '@/config'

function ShoppingProductTile({product , handleGetProductDetails , handleAddtoCart}) {
  return (


     <Card className='w-full max-w-sm mx-auto 
      '>
<div onClick={function()
   {
       handleGetProductDetails(product._id)
   }
}>
        <div className="relative">
          <img src={product.image} alt="" className='w-full h-[300px] object-cover rounded-t-lg '/>
          {product.salePrice > 0 ?
          <Badge className='absolute top-2 left-2  bg-red-500 hover:bg-red-600'>Sale</Badge>   : null
        }
        <CardContent className='p-4 '>

          <h2 className='text-xl font-bold mb-2'>{product.title}</h2>



          <div className='flex justify-between items-center mb-2'>

            
             <span className='text-lg text-muted-foreground'>{CategoryMap[product.category]}</span>


             <span className='text-lg text-muted-foreground'>{BrandMap[product.brand]}</span>


          </div>


          <div className='flex justify-between items-center mb-2'>
             <span className={` ${product.salePrice > 0 ? 'line-through' : ""} text-lg text-muted-foreground y text-primary`}>${
             product.salePrice
             }</span>
             <span className='text-lg text-muted-foreground y text-primary'>${product.price}</span>


          </div>
        </CardContent>
        </div>
        </div>
<CardFooter>
   <Button className='w-full' onClick={()=>handleAddtoCart(product._id)}>Add to Cart</Button>
</CardFooter>



     </Card>
  )
}

export default ShoppingProductTile
  