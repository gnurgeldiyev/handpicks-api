const { Client } = require('../models/client');

/** 
 * GET | get all clients
*/
exports.getAllClients = (req, res) => {
  Client.find()
  .then((response) => {
    if (!response) {
      return res.sendStatus(404);
    }
    let clients = [];
    response.forEach((client) => {
      clients.push(client.clientToJson());
    });
    return res.status(200).json({ clients });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * GET | get the clients by clientId
*/
exports.getClientById = (req, res) => {
  const clientId = req.params.clientId;

  Client.findById(clientId)
  .then((response) => {
    return res.status(200).json({ client: response.clientToJson() });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * POST | add a new API client
*/
exports.addNewClient = (req, res) => {
  const newClient = req.body.client;
  console.log(newClient);
  if (!newClient
    || !newClient.name) {
    return res.sendStatus(400);   
  }

  let client = new Client({
    name: newClient.name
  });

  client.save()
  .then((response) => {
    Client.findOneAndUpdate({ name: response.name }, {
      $set: {
        api_key: response.generateApiKey()
      }
    }, { new: true })
    .then((response) => {
      return res.status(201).json({ client: response.clientToJson() });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message
      });
    });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * PUT | update the client
*/
exports.updateClient = (req, res) => {
  const clientId = req.params.clientId;
  const client = req.body.client;

  if (!client
    || !client.name) {
    return res.sendStatus(400);
  }

  Client.findByIdAndUpdate(clientId, {
    $set: {
      name: client.name
    }
  }, { new: true })
  .then((response) => {
    return res.status(200).json({ client: response.clientToJson() });
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}

/** 
 * DELETE | delete the client
*/
exports.deleteClient = (req, res) => {
  const clientId = req.params.clientId;

  Client.findByIdAndRemove(clientId)
  .then(() => {
    return res.sendStatus(204);
  })
  .catch((err) => {
    return res.status(500).json({
      err: err.message
    });
  });
}