import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../ui/table'

function ShoppingOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Order History 
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
               <TableHead>
                Order ID
               </TableHead>
               <TableHead>
                Order Date
               </TableHead>
               <TableHead>
                Order Status
               </TableHead>
               <TableHead>
                Order Price
               </TableHead>
               <TableHead>
                 <span className='sr-only'>Details</span>
               </TableHead>
            </TableRow>

          </TableHeader>

          <TableBody>
            <TableRow>


                



            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders
