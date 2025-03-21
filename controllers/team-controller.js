import TeamModel from "../models/Team.js";
export const create = async (req, res) => {
  try {
    const { name, age, address, position, imageUrl } = req.body;
    const doc = new TeamModel({
      name,
      age,
      address,
      position,
      imageUrl,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "cannot add teammate",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const team = await TeamModel.find().populate("user").exec();
    res.json(team);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get team",
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await TeamModel.findOneAndUpdate(
      { _id: id },
      { $inc: { viewsCount: 1 } }
    );
    res.json(doc);
  } catch (error) {
    res.status(500).json({
      message: "failed to get teammate",
    });
  }
};
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await TeamModel.findOneAndDelete({ _id: id });

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete teammate",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { name, age, address, position } = req.body;
    const id = req.params.id;

    const updatedTeammate = await TeamModel.findByIdAndUpdate(
      id,
      {
        name,
        age,
        address,
        position,
        user: req.userId,
      },
      { new: true }
    );

    if (!updatedTeammate) {
      return res.status(404).json({ message: "teammate not found" });
    }

    res.json({
      success: true,
      post: updatedTeammate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update teammate",
      error: error.message,
    });
  }
};
