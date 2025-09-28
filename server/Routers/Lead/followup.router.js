const express = require('express');
const router = express.Router();
const {
  createFollowUp,
  getFollowUpsByQuery,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
  markFollowUpCompleted,
  getPendingFollowUps
} = require('../../Controllers/Lead/followup.controller');

// ======================
// FOLLOW-UP ROUTES
// ======================

// Create a new follow-up for a query
router.post('/query/:queryId/followup', createFollowUp);

// Get all follow-ups for a query
router.get('/query/:queryId/followups', getFollowUpsByQuery);

// Get pending follow-ups for a query
router.get('/query/:queryId/followups/pending', getPendingFollowUps);

// Get single follow-up by ID
router.get('/followup/:interactionId', getFollowUpById);

// Update a follow-up
router.put('/followup/:interactionId', updateFollowUp);

// Delete a follow-up
router.delete('/followup/:interactionId', deleteFollowUp);

// Mark follow-up as completed
router.patch('/followup/:interactionId/complete', markFollowUpCompleted);

module.exports = router;