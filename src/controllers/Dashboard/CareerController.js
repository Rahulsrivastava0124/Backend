const Career = require("../../models/Career");

// Create a new career posting
exports.createCareer = async (req, res) => {
  try {
    const {
      position,
      department,
      job_type,
      location,
      experience_level,
      salary_range,
      description,
      requirements,
      ending_date,
      is_active,
    } = req.body || {};

    // Validation
    if (!position)
      return res.status(400).json({ error: "Position is required" });
    if (!department)
      return res.status(400).json({ error: "Department is required" });
    if (!job_type)
      return res.status(400).json({ error: "Job type is required" });
    if (!location)
      return res.status(400).json({ error: "Location is required" });
    if (!experience_level)
      return res.status(400).json({ error: "Experience level is required" });
    if (!description)
      return res.status(400).json({ error: "Description is required" });

    const career = new Career({
      position,
      department,
      job_type,
      location,
      experience_level,
      salary_range: salary_range || null,
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      ending_date: ending_date || null,
      is_active: is_active !== undefined ? is_active : true,
    });

    await career.save();
    res.status(201).json(career);
  } catch (error) {
    console.error("Career creation error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all careers
exports.listCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get active careers only
exports.getActiveCareers = async (req, res) => {
  try {
    const careers = await Career.find({ is_active: true }).sort({
      createdAt: -1,
    });
    res.json(careers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single career by ID
exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career)
      return res.status(404).json({ error: "Career posting not found" });
    res.json(career);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a career by ID
exports.updateCareer = async (req, res) => {
  try {
    const {
      position,
      department,
      job_type,
      location,
      experience_level,
      salary_range,
      description,
      requirements,
      ending_date,
      is_active,
    } = req.body || {};

    const career = await Career.findById(req.params.id);
    if (!career)
      return res.status(404).json({ error: "Career posting not found" });

    // Update fields
    if (position !== undefined) career.position = position;
    if (department !== undefined) career.department = department;
    if (job_type !== undefined) career.job_type = job_type;
    if (location !== undefined) career.location = location;
    if (experience_level !== undefined)
      career.experience_level = experience_level;
    if (salary_range !== undefined) career.salary_range = salary_range;
    if (description !== undefined) career.description = description;
    if (requirements !== undefined) career.requirements = Array.isArray(requirements) ? requirements : [];
    if (ending_date !== undefined) career.ending_date = ending_date;
    if (is_active !== undefined) career.is_active = is_active;

    await career.save();
    res.json(career);
  } catch (error) {
    console.error("Career update error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a career by ID
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career)
      return res.status(404).json({ error: "Career posting not found" });
    res.json({ message: "Career posting deleted successfully", career });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get career count
exports.countCareers = async (req, res) => {
  try {
    const count = await Career.countDocuments();
    const activeCount = await Career.countDocuments({ is_active: true });
    res.json({ total: count, active: activeCount });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Toggle career active status
exports.toggleCareerStatus = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career)
      return res.status(404).json({ error: "Career posting not found" });

    career.is_active = !career.is_active;
    await career.save();
    res.json({
      message: `Career posting ${career.is_active ? "activated" : "deactivated"}`,
      career,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
