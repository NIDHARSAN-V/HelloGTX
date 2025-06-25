import ProductFilter from '@/Components/Shopping-view/Filter'
import ShoppingProductTile from '@/Components/Shopping-view/Product_Tile'
import ProductDetailsDialog from '@/Components/Shopping-view/ProductDetails'
import { Button } from '@/Components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { sortOptions } from '@/config'
import { addToCart, fetchCartItems } from '@/Store/Shop/CartSlice'
import { fetchAllFilteredProduct, fetchProductDetails } from '@/Store/Shop/ProductsSlice'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'



//use Search Params 
function createSearchParamsHelper(filtersparams)
{

  const queryparams = [];

  for(const [key,value] of Object.entries (filtersparams))
  {
      if(Array.isArray(value) && value.length > 0)
      {
        const paramValue = value.join(',')
        queryparams.push(`${key}=${encodeURIComponent(paramValue)}`)
      }
  }

  return queryparams.join('&')
     
}







 function ShoppingListing() {
       


  const dispatch = useDispatch()


  const {productList , productDetails} = useSelector(state=>state.shopproducts)

  const {user} = useSelector(state=>state.auth)

 const {cartItems} = useSelector(state => state.shopcart)

// const {CartItems }= useSelector(state=>state.shopcart.items)
  

console.log(cartItems , "cartItemssss")

  const[filters , setFilters ] = useState({})

  const [sort , setSort] = useState(null)

  const [searchParams , setSearchParams] = useSearchParams()

  const [opendetailDia , setOpenDetailsDia] = useState(false)
  


  function handleSort(value)
  {
     setSort(value);
  }


  function handleFilter(getSectionId, getCurrentOption) {
    console.log(getSectionId, getCurrentOption);
    let cpyFilters = { ...filters };

    // If the section does not exist, initialize it with an array containing the current option
    if (!cpyFilters[getSectionId]) {
        cpyFilters[getSectionId] = [getCurrentOption];
    } else {
        const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);

        if (indexOfCurrentOption === -1) {
            // If the option is not already selected, add it
            cpyFilters[getSectionId].push(getCurrentOption);
        } else {
            // If the option is already selected, remove it
            cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);

            // If no options remain for this section, remove the section
            if (cpyFilters[getSectionId].length === 0) {
                delete cpyFilters[getSectionId];
            }
        }
    }

    console.log("Updated Filters:", cpyFilters);
    setFilters(cpyFilters);
    sessionStorage.setItem("filters" , JSON.stringify(cpyFilters) )

}

console.log("Product Details", productDetails)




// console.log(searchParams ,  'Search Params')
useEffect(()=>{
    
    if(filters && Object.keys(filters).length > 0)
    {
      const createQueryString = createSearchParamsHelper(filters)
      setSearchParams(new URLSearchParams(createQueryString))

    }

},[filters])






 console.log("Refresh Filters"  , filters)

 useEffect(() => {
  setSort('price-lowtohigh');
  setFilters(JSON.parse(sessionStorage.getItem('filters') || '{}')); // Use '{}' instead of {}
}, []);




useEffect(()=>{
    if(productDetails !== null )
    {
      setOpenDetailsDia(true)
    }
},[productDetails])

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

const handleGetProductDetails = function(getCurrentProductId)
{
    // console.log(getCurrentProductId)

    dispatch(fetchProductDetails(getCurrentProductId))
} 


// console.log(productList , "ProductList")
       useEffect(()=>{
        if(filters!==null && sort!==null)
            dispatch(fetchAllFilteredProduct({filterParams:filters ,sortParams:sort }))
       },[dispatch , sort ,filters])


  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
       {/* Sidebar filter component */}
       <ProductFilter filters={filters} handleFilter={handleFilter}/>

       {/* Product Listing Section */}
       <div className="bg-background w-full rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold mr-2">All Products</h2>

          <div className="flex items-center gap-4">
          <span className="text-muted-foreground">{productList?.data?.length || 0} Products</span>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4"/>
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className='w-[200px]'>


                   <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>




                   {sortOptions.map(sortItem => <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                    {sortItem.label}
                   </DropdownMenuRadioItem>)}
                      



                   </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
             
        {productList?.data?.length > 0 ? 
    productList.data.map((ProductItem) => (
        <ShoppingProductTile product={ProductItem} key={ProductItem._id}
        handleGetProductDetails={handleGetProductDetails}
        handleAddtoCart={handleAddtoCart}/>
    )) 
    : null
}


        </div>
       </div>
       <ProductDetailsDialog open={opendetailDia} setOpen={setOpenDetailsDia} productDetails={productDetails}/>
    </div>
  )
}

export default ShoppingListing;
