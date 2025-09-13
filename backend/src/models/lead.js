import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  city: { type: String },
  state: { type: String },
  source: { type: String, enum: ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'], required: true },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost', 'won'], required: true },
  score: { type: Number, min: 0, max: 100 },
  lead_value: { type: Number },
  last_activity_at: { type: Date, default: null },
  is_qualified: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
