const Interaction = require("../../Models/Leads/followUpInteraction.model");
const Query = require("../../Models/Query/queryPackage.model");
const Lead = require("../../Models/Leads/lead.model");
const mongoose = require("mongoose");
const { sendRemainderEmailEmployee } = require("../../Services/EmployeeRemainder.service");



// ======================
// 1. CREATE NEW FOLLOW-UP
// ======================
const createFollowUp = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { 
      type, 
      direction, 
      summary, 
      sentiment, 
      requiresFollowUp, 
      followUpDetails,
      callDetails,
      emailDetails,
      whatsappDetails,
      employeeId,
      employeeEmail
    } = req.body;
    
    // Validate required fields
    if (!queryId || !type || !summary) {
      return res.status(400).json({
        message: "Missing required fields: queryId, type, and summary are required"
      });
    }

    // Check if query exists
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
  
    // Create new interaction
    const newInteraction = new Interaction({
      queryId: queryId,
      type,
      direction: type.includes('call') ? direction : undefined,
      summary,
      sentiment: sentiment || "neutral",
      requiresFollowUp: requiresFollowUp || false,
      followUpDetails: requiresFollowUp ? followUpDetails : undefined,
      callDetails: type.includes('call') ? callDetails : undefined,
      emailDetails: type === 'email' ? emailDetails : undefined,
      whatsappDetails: type === 'whatsapp' ? whatsappDetails : undefined,
      keywords: extractKeywords(summary),
      pointsEarned: calculatePoints(type, summary),
      assignedTo: employeeId || null
    });

    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    console.log("Follow up details received:", newInteraction.followUpDetails.scheduledAt);
 

    sendRemainderEmailEmployee(employeeEmail , newInteraction.followUpDetails.scheduledAt );

    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

    const savedInteraction = await newInteraction.save();

    










    

    // Add interaction reference to query's followupId array
    await Query.findByIdAndUpdate(
      queryId,
      { 
        $push: { followupId: savedInteraction._id },
        $set: { updatedAt: new Date() }
      }
    );

    // Update lead status if this is a significant follow-up
    if (requiresFollowUp && followUpDetails?.priority === 'high') {
      await Lead.findByIdAndUpdate(query.leadId, {
        $set: { 
          status: 'follow_up',
          updatedAt: new Date()
        },
        $push: {
          statusHistory: {
            status: 'follow_up',
            changedBy: employeeId || 'system',
            timestamp: new Date(),
            notes: `New follow-up created: ${summary}`
          }
        }
      });
    }

    console.log('Follow-up created successfully:', savedInteraction._id);

    res.status(201).json({
      message: "Follow-up created successfully",
      interaction: savedInteraction,
      queryUpdated: true
    });

  } catch (error) {
    console.error("Error creating follow-up:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// ======================
// 2. GET ALL FOLLOW-UPS FOR A QUERY
// ======================
const getFollowUpsByQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    
    const interactions = await Interaction.find({ queryId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'queryId',
        select: 'name leadId',
        populate: {
          path: 'leadId',
          select: 'firstName lastName email phone'
        }
      });

    res.json({
      message: "Follow-ups retrieved successfully",
      interactions,
      count: interactions.length
    });
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// 3. GET SINGLE FOLLOW-UP
// ======================
const getFollowUpById = async (req, res) => {
  try {
    const { interactionId } = req.params;
    
    const interaction = await Interaction.findById(interactionId)
      .populate({
        path: 'queryId',
        select: 'name leadId',
        populate: {
          path: 'leadId',
          select: 'firstName lastName email phone'
        }
      });

    if (!interaction) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    res.json({
      message: "Follow-up retrieved successfully",
      interaction
    });
  } catch (error) {
    console.error("Error fetching follow-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//scheduleFollowUp








// ======================
// 4. UPDATE FOLLOW-UP
// ======================
const updateFollowUp = async (req, res) => {
  try {
    const { interactionId } = req.params;
    const { 
      type, 
      direction, 
      summary, 
      sentiment, 
      requiresFollowUp, 
      followUpDetails,
      callDetails,
      emailDetails,
      whatsappDetails,
      employee 
    } = req.body;

    // Check if interaction exists
    const existingInteraction = await Interaction.findById(interactionId);
    if (!existingInteraction) {
      return res.status(404).json({ message: "Follow-up not found" });
    }




    // Prepare update data
    const updateData = {
      type: type || existingInteraction.type,
      summary: summary || existingInteraction.summary,
      sentiment: sentiment || existingInteraction.sentiment,
      requiresFollowUp: requiresFollowUp !== undefined ? requiresFollowUp : existingInteraction.requiresFollowUp,
      updatedAt: new Date()
    };

    // Add conditional fields
    if (type && type.includes('call')) {
      updateData.direction = direction || existingInteraction.direction;
      updateData.callDetails = callDetails || existingInteraction.callDetails;
    }

    if (type === 'email') {
      updateData.emailDetails = emailDetails || existingInteraction.emailDetails;
    }

    if (type === 'whatsapp') {
      updateData.whatsappDetails = whatsappDetails || existingInteraction.whatsappDetails;
    }

    if (requiresFollowUp && followUpDetails) {
      updateData.followUpDetails = {
        ...existingInteraction.followUpDetails,
        ...followUpDetails
      };
    }

    // Update keywords if summary changed
    if (summary && summary !== existingInteraction.summary) {
      updateData.keywords = extractKeywords(summary);
    }

    const updatedInteraction = await Interaction.findByIdAndUpdate(
      interactionId,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'queryId',
      select: 'name leadId'
    });

    console.log('Follow-up updated successfully:', updatedInteraction._id);

    res.json({
      message: "Follow-up updated successfully",
      interaction: updatedInteraction
    });

  } catch (error) {
    console.error("Error updating follow-up:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// ======================
// 5. DELETE FOLLOW-UP
// ======================
const deleteFollowUp = async (req, res) => {
  try {
    const { interactionId } = req.params;

    // Check if interaction exists
    const interaction = await Interaction.findById(interactionId);
    if (!interaction) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    // Remove interaction reference from query
    await Query.findByIdAndUpdate(
      interaction.queryId,
      { 
        $pull: { followupId: interactionId },
        $set: { updatedAt: new Date() }
      }
    );

    // Delete the interaction
    await Interaction.findByIdAndDelete(interactionId);

    console.log('Follow-up deleted successfully:', interactionId);

    res.json({
      message: "Follow-up deleted successfully",
      deletedInteractionId: interactionId
    });

  } catch (error) {
    console.error("Error deleting follow-up:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// ======================
// 6. MARK FOLLOW-UP AS COMPLETED
// ======================
const markFollowUpCompleted = async (req, res) => {
    console.log("Marking follow-up as completed...*******************************");
  try {
    
    const { interactionId } = req.params;
    const { notes, employee } = req.body;

    const interaction = await Interaction.findById(interactionId);
    if (!interaction) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    if (!interaction.requiresFollowUp) {
      return res.status(400).json({ message: "This interaction does not require follow-up" });
    }

    const updatedInteraction = await Interaction.findByIdAndUpdate(
      interactionId,
      {
        'followUpDetails.completed': true,
        'followUpDetails.completedAt': new Date(),
        'followUpDetails.notes': notes || interaction.followUpDetails.notes,
        updatedAt: new Date()
      },
      { new: true }
    ).populate({
      path: 'queryId',
      select: 'name leadId'
    });

    // Award points for completion
    updatedInteraction.pointsEarned += 5;
    await updatedInteraction.save();

    res.json({
      message: "Follow-up marked as completed",
      interaction: updatedInteraction
    });

  } catch (error) {
    console.error("Error marking follow-up as completed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// 7. GET PENDING FOLLOW-UPS
// ======================




const getPendingFollowUps = async (req, res) => {
  try {
    const { queryId } = req.params;

    const pendingFollowUps = await Interaction.find({
      queryId: queryId,
      requiresFollowUp: true,
      'followUpDetails.completed': false
    })
    .sort({ 'followUpDetails.scheduledAt': 1 })
    .populate({
      path: 'queryId',
      select: 'name leadId',
      populate: {
        path: 'leadId',
        select: 'firstName lastName email phone'
      }
    });

    res.json({
      message: "Pending follow-ups retrieved successfully",
      pendingFollowUps,
      count: pendingFollowUps.length
    });
  } catch (error) {
    console.error("Error fetching pending follow-ups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// HELPER FUNCTIONS
// ======================
const extractKeywords = (summary) => {
  if (!summary) return [];
  
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = summary.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  return [...new Set(words)].slice(0, 5); // Return unique words, max 5
};

const calculatePoints = (type, summary) => {
  let points = 0;
  
  // Base points by type
  const typePoints = {
    'outbound_call': 10,
    'inbound_call': 8,
    'meeting': 15,
    'email': 5,
    'whatsapp': 4,
    'sms': 3,
    'chat': 2
  };
  
  points += typePoints[type] || 5;
  
  // Bonus points for detailed summaries
  if (summary && summary.length > 50) {
    points += 3;
  }
  
  return points;
};





const findFollowupByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid or missing employeeId" });
    }

    console.log("Finding follow-ups for employee ID:", employeeId);

    const followUps = await Interaction.find({ 
      assignedTo: employeeId,
      followUpDetails: { $exists: true, $ne: null },
      "followUpDetails.completed": false
    });

    console.log("Follow-ups found:", followUps.length);

    return res.status(200).json(followUps);

  } catch (error) {
    console.error("Error finding follow-ups by employee ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};







module.exports = {
  createFollowUp,
  getFollowUpsByQuery,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
  markFollowUpCompleted,
  getPendingFollowUps,
  findFollowupByEmployeeId
};