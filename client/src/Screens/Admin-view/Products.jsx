
import ProductImageUpload from '@/Components/Admin-view/ImageUpload'
import AdminProductTile from '@/Components/Admin-view/ProductTile'
import CommonForm from '@/Components/Common/form'
import { Button } from '@/Components/ui/button'
import { Sheet , SheetContent, SheetTitle , SheetHeader } from '@/Components/ui/sheet'
import { addProductFormElements } from '@/config'
import { addNewProduct, deleteProduct, editAProduct, fetchAllProduct } from '@/Store/Admin/ProductSlice'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from "sonner"

const initialFormData = {
  image:null,
  title:"",
  description:"",
  category:"",
  brand:'',
  price:"",
  salePrice:'',
  totalStock:""
}

function AdminProducts() {
  



  const [openCreateProductsDialog , SetopenCreateProductsDialog] = useState(false)

  const[formData ,setFormData] = useState(initialFormData)




  const[imageFile , setImageFile] = useState(null);

  const [uploadedImageUrl , SetuploadedImageUrl] = useState('')

  const[imageLoadingState , setImageLoadingState] = useState(false)

  const dispatch = useDispatch()

  const {productList} = useSelector(state => state.adminproducts)

const [currentEditId , setCurrentEditId] = useState(null)
  // console.log(formData)
  

function isFormValid()
{
    return Object.keys(formData).map((key) => formData[key]!=="").every((item) => item);
}

  const Onsubmit = function(event)
  {
          event.preventDefault();

          if(currentEditId!== null)
          {dispatch(editAProduct({id : currentEditId , formData}))
           .then((data => {
            console.log(data);
            if(data.payload.success)
            {
               dispatch(fetchAllProduct())
               setFormData(initialFormData)
               SetopenCreateProductsDialog(false)
            }
           }))
          }

        else{

          dispatch(addNewProduct({
            ...formData,
            image:uploadedImageUrl
          })).then((data)=>{
            // console.log(data , " Add form submit data")

            if(data.payload.success)
            {

                dispatch(fetchAllProduct())
                SetopenCreateProductsDialog(false)
                setImageFile(null);
                setFormData(initialFormData)
                toast.success("Product Added Successfully")


            }
          })
        }



          

          
          
  }



  useEffect(()=>{
    dispatch(fetchAllProduct())
  },[dispatch])

console.log("ProductList" , productList)

  // useEffect(() => {
  //            console.log("In Admin Product page" ,uploadedImageUrl)
  // }, [uploadedImageUrl])



  const handleDelete  = function(delProductId)
  {
        console.log("Delted Id" , delProductId)

        dispatch(deleteProduct(delProductId)).then(data =>{
          console.log(data)
          if(data.payload.success)
          {
            toast.success("Product Deleted Successfully")
            dispatch(fetchAllProduct())
          }
        })
  }

  return (
   
    <Fragment>

<div className="mb-5 w-full flex  justify-end">
        <Button onClick={
          function()
          {
            SetopenCreateProductsDialog(true)
          }
        }>Add New Product</Button>
         
      </div>



      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {(productList.data && productList.data.length > 0 )? (
  productList.data.map(productItem => <AdminProductTile key={productItem._id} product={productItem} setCurrentEditId={setCurrentEditId} SetopenCreateProductsDialog = {SetopenCreateProductsDialog} setFormData={setFormData}
  handleDelete={handleDelete}/>) 
      )
  : (<p>No products available</p>)}

       
      </div>


      
    
      



      











      <Sheet open={openCreateProductsDialog} onOpenChange={function()
        {
          SetopenCreateProductsDialog(false)
          setCurrentEditId(null)
          setFormData(initialFormData)
        }
      }>
       <SheetContent side="right" className="overflow-auto">
        <SheetHeader>
          <SheetTitle>
            {currentEditId !==null ?
            'Edit Product' : 'Add New Product'}
          </SheetTitle>
        </SheetHeader>

        <ProductImageUpload file={imageFile} setFile={setImageFile} uploadedImageUrl={uploadedImageUrl}  SetuploadedImageUrl={SetuploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState = {imageLoadingState}
        isEditMode={currentEditId !==null}/> 

        <div className="py-6">


          <CommonForm
          formControls={addProductFormElements}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditId!==null ? 'Edit' : 'Add'}
          onSubmit={Onsubmit}
          isBtnDisabled={!isFormValid()}/>


        </div>
       </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default AdminProducts
