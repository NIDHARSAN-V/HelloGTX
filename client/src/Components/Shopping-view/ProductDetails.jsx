import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/Store/Shop/CartSlice";
import { toast } from "sonner";
import { setProductDetails } from "@/Store/Shop/ProductsSlice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {



const {user} = useSelector(state=>state.auth)
const dispatch = useDispatch()

  if (!productDetails) return null; // Prevents errors if productDetails is undefined

  const handleAddtoCart = function(getCurrentProductId)
  {
    dispatch(addToCart({userId : user.id , productId : getCurrentProductId , quantity:1})).then(data => {
     if(data.payload.success)
     {
      
      
      toast.success("Product Added to Cart")
       
       dispatch(fetchCartItems({userId:user.id})).then(data =>{
        console.log(data)
      })
     }
    })
  }
  

function handleDialogClose()
{
   setOpen(false)
   dispatch(setProductDetails())
}


  return (
    <Dialog open={open} onOpenChange={()=>{
      handleDialogClose()
    }}>
      <DialogContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        {/* Product Image Section */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails.image}
            alt={productDetails.title || "Product Image"}
            width={600}
            height={600}
            className="aspect-square w-full object-cover transition-all duration-300 ease-in-out transform hover:scale-105"
          />
        </div>

        {/* Product Details Section */}
        <div>
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails.title}</h1>
            <p className="text-muted-foreground text-xl mb-4 mt-5">{productDetails.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-primary">${productDetails.price}</p>
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-0.5 mb-3">
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
            </div>
            <span className="text-muted-foreground">(4.5)</span>
          </div>

          {/* Add to Cart Button */}
          <div>
            <Button className="w-full mt-4"
            onClick={()=>{
              handleAddtoCart(productDetails._id)
            }}>Add to Cart</Button>
          </div>

          {/* Separator */}
          <Separator className="mt-6" />

          {/* Reviews Section */}
          <div className="max-h-[300px] overflow-hidden flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="flex overflow-x-auto gap-6 scroll-smooth transition-all duration-500 ease-in-out">
              {/* Review 1 */}
              <div className="flex-shrink-0 w-80 flex flex-col items-start gap-2">
                <div className="flex gap-4 items-center">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">Nidharsan</h3>
                    <div className="flex items-center gap-0.5">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">This is an awesome product!</p>
              </div>

              {/* Review 2 */}
              <div className="flex-shrink-0 w-80 flex flex-col items-start gap-2">
                <div className="flex gap-4 items-center">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">John Doe</h3>
                    <div className="flex items-center gap-0.5">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">Amazing quality, highly recommend!</p>
              </div>

              {/* Review 3 */}
              <div className="flex-shrink-0 w-80 flex flex-col items-start gap-2">
                <div className="flex gap-4 items-center">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">Alice Smith</h3>
                    <div className="flex items-center gap-0.5">
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                      <StarIcon className="w-5 h-5 fill-primary" />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">Totally worth the price!</p>
              </div>
            </div>

            {/* Add Review Input */}
            <div className="mt-6 flex gap-4 items-center">
              <Input placeholder="Write a review..." className="flex-1" />
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
