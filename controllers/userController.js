const getAllUser = (req, res) => {
  res.status(200).json({ message: "Get all user" });
};

const createUser = (req, res) => {
  console.log("create user:", req.body);
  const { name, age, phone, email } = req.body;
  console.log(name, age, phone, email);
  if (!name || !age || !phone || !email) {
    debugger;
    res.status(400);
    throw new Error("All fiels are mandatory");
  }
  res.status(201).json({ message: "Create user" });
};

const updateUser = (req, res) => {
  res.status(200).json({ message: `Update user for ${req.params.id}` });
};

const deleteUser = (req, res) => {
  res.status(201).json({ message: `Delete user for ${req.params.id}` });
};

const getUser = (req, res) => {
  res.status(200).json({ message: `Get user for ${req.params.id}` });
};

module.exports = { getAllUser, createUser, updateUser, deleteUser, getUser };
