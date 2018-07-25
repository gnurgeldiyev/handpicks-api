const { Manager } = require('../models/manager');
const { hashPassword } = require('../helpers/helper');

/** 
 * POST | add a new manager
*/
exports.addNewManager = (req, res) => {
  const newManager = req.body.manager;

  if (!newManager 
    || !newManager.email 
    || !newManager.name 
    || !newManager.lastname 
    || !newManager.password) {
    return res.sendStatus(400);
  }

  let manager = new Manager({
    username: newManager.email.split('@')[0],
    email: newManager.email,
    password: hashPassword(newManager.password),
    name: newManager.name,
    lastname: newManager.lastname,
  });

  manager.save()
  .then(() => {
    return res.status(201).json({
      manager: manager.profileToJson()
    });
  }).catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}