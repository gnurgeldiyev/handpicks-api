const { Manager } = require('../models/manager');
const { hashPassword, unhashPassword } = require('../helpers/helper');
const { isEmail, isLength } = require('validator');
/** 
 * GET | get all managers
*/
exports.getAllManagers = (req, res) => {
  const deleted = req.query.deleted;
  if (!deleted) {
    Manager.find({ deleted: false }).sort({ role: 1 })
      .then((response) => {
        if (!response.length) {
          return res.sendStatus(404);
        }
        let managers = [];
        response.forEach((manager) => {
          managers.push(manager.profileToJson());
        });
        return res.status(200).json({ managers });
      })
      .catch((err) => {
        return res.status(500).json({ err: err.message });
      });
    } else {
      if (deleted !== 'true') {
        return res.sendStatus(400);
      }
      Manager.find({ deleted: true }).sort({ role: 1 })
        .then((response) => {
          if (!response.length) {
            return res.sendStatus(404);
          }
          let managers = [];
          response.forEach((manager) => {
            managers.push(manager.profileToJson());
          });
          return res.status(200).json({ managers });
        })
        .catch((err) => {
          return res.status(500).json({ err: err.message });
        });
    }
}
/** 
 * GET | get only editors
*/
exports.getAllEditors = (req, res) => {
  Manager.find({ role: 'editor', deleted: false })
    .then((response) => {
      if (!response.length) {
        return res.sendStatus(404);
      }
      let editors = [];
      response.forEach((editor) => {
        editors.push(editor.profileToJson());
      });
      return res.status(200).json({ editors });
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
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
    });
}
/** 
 * POST | add a new manager
*/
exports.addNewManager = (req, res) => {
  const newManager = req.body.manager;
  if (!newManager 
    || !newManager.email
    || !isEmail(newManager.email) 
    || !newManager.name 
    || !newManager.lastname 
    || !newManager.password
    || !newManager.role
    || !isLength(newManager.password, { min:6 })) {
    return res.sendStatus(400);
  }
  let manager = new Manager({
    username: newManager.email.split('@')[0],
    email: newManager.email,
    password: hashPassword(newManager.password),
    name: newManager.name,
    lastname: newManager.lastname,
    role: newManager.role
  });
  manager.save()
    .then((response) => {
      return res.status(201).json({ manager: response.profileToJson() });
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
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
    email: manager.email,
    deleted: false
  })
    .then((response) => {
      if (!response) {
        return res.sendStatus(404);
      }
      if (unhashPassword(response.password).password !== manager.password) {
        return res.sendStatus(401);
      }
      Manager.findByIdAndUpdate(response._id, {
        $set: {
          token: response.generateToken()
        }
      }, { new: true })
        .then((response) => {
          return res.status(200).json({ manager: response.profileToJson() });
        })
        .catch((err) => {
          return res.status(500).json({ err: err.message });
        });
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    });
}
/** 
 * POST | logout the manager
*/
exports.logout = (req, res) => {
  const manager = req.body.manager; 
  if (!manager 
    || !manager.id 
    || !manager.token) {
    return res.sendStatus(400);
  }
  Manager.findOneAndUpdate({
    _id: manager.id,
    token: manager.token
  }, {
    $set: {
      token: null
    }
  }, { new: true })
    .then((response) => {
      if (!response) {
        return res.status(400).json({ err: "User token does not match with stored token."});
      }
      return res.sendStatus(204);
    })
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    });
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
  if (manager.password && !isLength(manager.password, { min:6 })) {
    return res.sendStatus(422);
  }
  const updateManager = {};
  if (manager.name) {
    updateManager.name = manager.name;
  }
  if (manager.lastname) {
    updateManager.lastname = manager.lastname;
  }
  if (manager.role) {
    updateManager.role = manager.role;
  }
  if (manager.password) {
    updateManager.password = hashPassword(manager.password);
  }
  Manager.findByIdAndUpdate(managerId, {
    $set: updateManager
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
  Manager.findByIdAndUpdate(managerId, {
      $set: {
        deleted: true
      }
    })
    .then(() => {
      return res.sendStatus(204);
    }) 
    .catch((err) => {
      return res.status(500).json({ err: err.message });
    })
}