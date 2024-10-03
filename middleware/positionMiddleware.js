const mongoose = require("mongoose");
const orgpositionModel = require("../models/orgpositionModel");

const createDefaultOrgPosition = async function (doc) {
  await orgpositionModel.findOneAndUpdate(
    { Organization: doc.Organization },
    { $addToSet: { Position: doc._id } },
    { new: true, upsert: true }
  );
};

module.exports = {
  createDefaultOrgPosition,
};
