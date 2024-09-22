const componentsModel = require("../models/componentsModel");

const createDefaultComponents = async function (doc) {
  const defaultComponents = [
    { cName: "Profile", cLocationPath: "/app/profile" },
    { cName: "Dashboard", cLocationPath: "/app/dashboard" },
  ];

  for (const component of defaultComponents) {
    const existingComponent = await componentsModel.findOne({
      cName: component.cName,
    });

    if (existingComponent) {
      existingComponent.cOrg.push(doc._id);
      await existingComponent.save();
    } else {
      await componentsModel.create({
        ...component,
        cOrg: [doc._id],
      });
    }
  }
};

module.exports = {
  createDefaultComponents,
};
