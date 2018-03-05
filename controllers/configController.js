// The authentication controller.
const configController = {};

configController.getConfig = (req, res) => {
  res.json('todo');
};

// todo :error handling
/*
categoryController.getCategories = (req, res) => {
    Category.findAll({
      where: req.query,
      // include: [{all: true}]
    })
      .then((category) => {
        res.json(category);
      }).catch((error) => {
        res.json(error);
      });
  };
*/

module.exports = configController;
