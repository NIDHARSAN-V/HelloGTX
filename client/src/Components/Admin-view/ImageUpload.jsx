import React, { useEffect, useRef } from 'react'
import { Label } from '../ui/label'
import { Button} from '../ui/button'
import { Input } from '../ui/input'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import axios from 'axios'
import { Skeleton } from '@mui/material'

function ProductImageUpload({ file, setFile, uploadedImageUrl, SetuploadedImageUrl,
  imageLoadingState , setImageLoadingState , isEditMode
 }) {

       const inputref = useRef(null)
  

       const handleImagefileChange = function(event)
       {
        console.log(event.target.files)
        const selectedFile = event.target.files[0]

        if(selectedFile)
        {
            setFile(selectedFile)
        }
       }



       const handleDragOver = function(event)
       {
             event.preventDefault();
       }


       const handleDrop = function(event)
       {
        event.preventDefault();
        const droppedFile =   event.dataTransfer.files?.[0];
        
        if(droppedFile)
        {
            setFile(droppedFile)
        }
       }





       const handleremovefile = function(event)
       {
          event.preventDefault()
          if(file)
          {
            setFile(null)

          }
          if(inputref.current)
          {
            inputref.current.value= ''
          }
       }


       const upload_Image_To_Cloudinary = async function() {
        const data = new FormData();
        data.append('my_file', file); // You need to append the file to the FormData object
      
        try {

          setImageLoadingState(true)
          const response = await axios.post('http://localhost:8000/api/admin/products/upload_image', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          console.log("Response from backend", response.data.result.url);
      
          if (response.data.success) {
            SetuploadedImageUrl(response.data.result.url); 
            setImageLoadingState(false)


          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
      



       useEffect(()=>
    {
        if(file!=null)
        {
            upload_Image_To_Cloudinary();
        }
    } , [file])





    return (
        <div className='w-full max-w-md mx-auto'>

            <Label className="text-lg font-semibold mb-2 block mt-4">
                Upload Image
            </Label>
             
            <div className={`${isEditMode ?  "opacity-50" : ""} border-2 border-dashed rounded-lg p-4 text-wrap`} onDragOver={handleDragOver} onDrop={handleDrop}>



            <Input type="file" ref={inputref} onChange={handleImagefileChange}  id="image-upload" className='hidden' disabled={isEditMode}/>



            {!file ?
            <Label htmlFor="image-upload" className={` ${isEditMode ? "cursor-not-allowed" :""}flex flex-col items-center justify-center h-32 cursor-pointer `}>
                <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-4 '/>
                <span>Drag & Drop or click to upload image</span>
            </Label> : 

            imageLoadingState ? <Skeleton className='h-10 bg-gray-800'/> :
            



            <div className='flex items-center justify-between'>
               <div className="flex items-center">
                <FileIcon className='w-8 h-8 text-primary mr-2' />
                <p className='text-sm font-medium text-wrap'>{file.name}</p>
               </div>

                <Button className='flex items-center justify-end' onClick={handleremovefile}>
                    <XIcon/>

                </Button>
                </div>
            }
            </div>

        </div>
    )
}

export default ProductImageUpload
