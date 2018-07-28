const { Manager } = require('../models/manager');
const { hashPassword, unhashPassword } = require('../helpers/helper');
const validator = require('validator');

/** 
 * GET | get all managers
*/
exports.getAllManagers = (req, res) => {
  Manager.find().sort({ role: 1 })
  .then((response) => {
    if (!response) {
      return res.sendStatus(404);
    }

    let managers = [];
    response.forEach((manager) => {
      managers.push(manager.profileToJson());
    });
    return res.status(200).json({ managers });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * GET | get only editors
*/
exports.getAllEditors = (req, res) => {
  Manager.find({ role: 'editor' })
  .then((response) => {
    if (!response) {
      return res.sendStatus(404);
    }

    let editors = [];
    response.forEach((editor) => {
      editors.push(editor.profileToJson());
    });
    return res.status(200).json({ editors });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * GET | get manager by username
*/
exports.getManagerByUsername = (req, res) => {
  const managerId = req.params.managerId;

  Manager.findById(managerId)
  .then((response) => {
    return res.status(200).json({ manager: response.profileToJson() });
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  })
}

/** 
 * POST | add a new manager
*/
exports.addNewManager = (req, res) => {
  const newManager = req.body.manager;

  if (!newManager 
    || !newManager.email
    || !validator.isEmail(newManager.email) 
    || !newManager.name 
    || !newManager.lastname 
    || !newManager.password
    || !validator.isLength(newManager.password, { min:6 })) {
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
  })
  .catch((err) => {
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

/** 
 * PUT | update the manager
*/
exports.updateManager = async (req, res) => {
  const managerId = req.params.managerId;
  const manager = req.body.manager;

  if (!manager) {
    return res.sendStatus(400);
  }
  if (manager.email) {
    if (!validator.isEmail(manager.email)) {
      return res.sendStatus(422);
    }
  }
  if (manager.password) {
    if (!validator.isLength(manager.password, { min:6 })) {
      return res.sendStatus(422);
    }
  }

  const oldManager = await Manager.findById(managerId);

  Manager.findOneAndUpdate(managerId, {
    $set: {
      email: manager.email || oldManager.email,
      username: manager.username || oldManager.username,
      name: manager.name || oldManager.name,
      lastname: manager.lastname || oldManager.lastname,
      role: manager.role || oldManager.role,
      password: manager.password ? hashPassword(manager.password) : oldManager.password
    }
  }, { new: true })
  .then((response) => {
    return res.status(200).json({ manager: response.profileToJson() });
  })
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  });
}

/** 
 * DELETE | delete the manager
*/
exports.deleteManager = (req, res) => {
  const managerId = req.params.managerId;

  Manager.findByIdAndRemove(managerId)
  .then(() => {
    return res.sendStatus(204);
  }) 
  .catch((err) => {
    return res.status(500).json({ err: err.message });
  })
}