const House = require("../../models/House");

exports.searchLocations = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.json({ data: [] });
  }

  try {
    const results = await House
      .find({
        $or: [
          { location: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
          { house_type: { $regex: query, $options: "i" } }
        ]
      })
      .limit(8);

    res.json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
