// const CustomPackageSchema = new mongoose.Schema({
//     // Package Details
//     name: { type: String, required: true },
//     description: String,
//     components: [{
//       type: { 
//         type: String, 
//         enum: [
//           "flight",
//           "hotel",
//           "activity",
//           "transport",
//           "visa",
//           "insurance",
//           "other"
//         ],
//         required: true
//       },
//       referenceId: mongoose.Schema.Types.ObjectId,
//       details: mongoose.Schema.Types.Mixed // Flexible storage
//     }],
  
//     // Pricing
//     basePrice: { type: Number, required: true },
//     markup: { type: Number, default: 0 },
//     totalPrice: { type: Number, required: true },
//     currency: { type: String, default: "USD" },
  
//     // Terms
//     cancellationPolicy: String,
//     paymentTerms: String,
  
//     // Status
//     status: { 
//       type: String, 
//       enum: ["draft", "published", "archived"],
//       default: "draft"
//     },
  
//     // Timestamps
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: Date
//   }, {
//     timestamps: true
//   });