import React, { useEffect, useState } from 'react'
import bannerOne from "../../assets/banner-1.webp"
import bannerTwo from "../../assets/banner-2.webp"
import bannerThree from "../../assets/banner-3.webp"
import { Button } from '@/Components/ui/button'
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightningIcon,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
  BadgeCheckIcon,
  FlameIcon,
  GemIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/Components/ui/card'
import { unstable_useEnhancedEffect } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProduct, fetchProductDetails } from '@/Store/Shop/ProductsSlice'
import ShoppingProductTile from '@/Components/Shopping-view/Product_Tile'
import { useNavigate } from 'react-router-dom'
import { addToCart, fetchCartItems } from '@/Store/Shop/CartSlice'
import { toast } from 'sonner'
import ProductDetailsDialog from '@/Components/Shopping-view/ProductDetails'

function ShoppingHome() {
  const slides = [bannerOne, bannerTwo, bannerThree]
  const [currentSlide, setCurrentSlide] = useState(0)
  const dispatch = useDispatch()
  const {productList , productDetails} = useSelector(state => state.shopproducts)
  const {user} = useSelector(state => state.auth)

  const [opendetailDia , setOpenDetailsDia] = useState(false)
  
  useEffect(()=>{
      if(productDetails !== null )
      {
        setOpenDetailsDia(true)
      }
  },[productDetails])
  

  const navigate  = useNavigate();


  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [slides.length]);



   useEffect(()=>{
    dispatch(fetchAllFilteredProduct({filterParams : {} , sortParams:'price-lowtohigh'}))
   },[dispatch])


   console.log("ProductList in Home" , productList)





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



  const category = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightningIcon },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ]

  const brand = [
    { id: "nike", label: "Nike", icon: TrophyIcon },
    { id: "adidas", label: "Adidas", icon: FlameIcon },
    { id: "puma", label: "Puma", icon: BadgeCheckIcon },
    { id: "levi", label: "Levi's", icon: GemIcon },
    { id: "zara", label: "Zara", icon: SparklesIcon },
    { id: "h&m", label: "H&M", icon: StarIcon },
  ]




  function handleNavigateToListingPage(item , section){
         sessionStorage.removeItem('filters');
         const currentFilter = {
          [section]:[item.id]
         }
         sessionStorage.setItem('filters' , JSON.stringify(currentFilter))
         navigate('/shop/listing')

  }




  const handleGetProductDetails = function(getCurrentProductId)
  {
      // console.log(getCurrentProductId , "In home Page")
  
      dispatch(fetchProductDetails(getCurrentProductId))
  } 




  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            alt={`Slide ${index + 1}`}
          />
        ))}

        <Button
          onClick={prevSlide}
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <Button
          onClick={nextSlide}
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>



      {/* Rest of your component remains the same */}




      {/* Category Section */}
      <section className="py-12 bg-gray-50 mb-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {category.map((item) => (
              <Card
              onClick={()=>handleNavigateToListingPage(item , 'category')}
                key={item.id}
                className="cursor-pointer transition-all duration-300 ease-in-out border border-gray-200 rotate-[2deg] hover:rotate-0 hover:border-2 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:ring-2 hover:ring-primary/60 hover:scale-105"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <item.icon className="w-12 h-12 text-primary mb-2" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>




      {/* Brand Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {brand.map((item) => (
              <Card

              onClick={()=>handleNavigateToListingPage(item , 'brand')}
                key={item.id}
                className="cursor-pointer transition-all duration-300 ease-in-out border border-gray-200 rotate-[2deg] hover:rotate-0 hover:border-2 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:ring-2 hover:ring-primary/60 hover:scale-105"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <item.icon className="w-12 h-12 text-primary mb-2" />
                  <span className="font-bold">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>





     {/* Featured Products */}


     <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Feature Products
        </h2>

        <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {productList.data && productList.data.length>0 ?
          productList.data.map(item => <ShoppingProductTile 
           key={item._id}
            product={item} handleGetProductDetails= {handleGetProductDetails}
            handleAddtoCart={handleAddtoCart}></ShoppingProductTile>)
          :null}

        </div>
      </div>
     </section>
      <ProductDetailsDialog open={opendetailDia} setOpen={setOpenDetailsDia} productDetails={productDetails}/>
    
      
    </div>
  )
}

export default ShoppingHome