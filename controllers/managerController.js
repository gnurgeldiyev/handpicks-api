const { Manager } = require('../models/manager');
const { hashPassword, unhashPassword } = require('../helpers/helper');

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

/** 
 * POST | login a manager with password
*/
exports.login = (req, res) => {
  const manager = req.body.manager;

  if (!manager 
    || !manager.email 
    || !manager.password) {
    return res.sendStatus(400);
  }

  Manager.findOne({ 
    email: manager.email
  })
  .then((response) => {
    if (!response) {
      return res.sendStatus(404);
    }
    if (unhashPassword(response.password).password === manager.password) {
      return res.status(200).json({ manager: response.profileToJson() });
    }
    return res.sendStatus(401);
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  })
}