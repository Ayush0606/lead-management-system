import express from 'express';
import Lead from '../models/lead.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Create Lead
router.post('/', requireAuth, async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Leads (with pagination & filters)
router.get('/', requireAuth, async (req, res) => {
  const { page = 1, limit = 20, ...filters } = req.query;
  const query = buildLeadQuery(filters);
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query).skip(skip).limit(Math.min(parseInt(limit), 100));
  res.json({
    data: leads,
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / parseInt(limit))
  });
});

// Get Single Lead
router.get('/:id', requireAuth, async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// Update Lead
router.put('/:id', requireAuth, async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// Delete Lead
router.delete('/:id', requireAuth, async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ message: 'Lead deleted' });
});

// Helper: Build query from filters
function buildLeadQuery(filters) {
  const query = {};
  // String fields: email, company, city
  if (filters.email) query.email = { $regex: filters.email, $options: 'i' };
  if (filters.company) query.company = { $regex: filters.company, $options: 'i' };
  if (filters.city) query.city = { $regex: filters.city, $options: 'i' };
  // Enums: status, source
  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;
  // Numbers: score, lead_value
  if (filters.score) query.score = parseInt(filters.score);
  if (filters.score_gt) query.score = { ...query.score, $gt: parseInt(filters.score_gt) };
  if (filters.score_lt) query.score = { ...query.score, $lt: parseInt(filters.score_lt) };
  if (filters.lead_value) query.lead_value = parseFloat(filters.lead_value);
  if (filters.lead_value_gt) query.lead_value = { ...query.lead_value, $gt: parseFloat(filters.lead_value_gt) };
  if (filters.lead_value_lt) query.lead_value = { ...query.lead_value, $lt: parseFloat(filters.lead_value_lt) };
  // Dates: created_at, last_activity_at
  if (filters.created_at) query.created_at = new Date(filters.created_at);
  if (filters.created_before) query.created_at = { ...query.created_at, $lt: new Date(filters.created_before) };
  if (filters.created_after) query.created_at = { ...query.created_at, $gt: new Date(filters.created_after) };
  if (filters.last_activity_at) query.last_activity_at = new Date(filters.last_activity_at);
  if (filters.last_activity_before) query.last_activity_at = { ...query.last_activity_at, $lt: new Date(filters.last_activity_before) };
  if (filters.last_activity_after) query.last_activity_at = { ...query.last_activity_at, $gt: new Date(filters.last_activity_after) };
  // Boolean: is_qualified
  if (filters.is_qualified !== undefined) query.is_qualified = filters.is_qualified === 'true';
  return query;
}

export default router;
