const FileSystem = require("../models/Sentfile.model"); 
const mongoose = require("mongoose"); 



const create = async (req, res) => {
  // #swagger.summary = 'Creates a new folder.'
  /*  #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {$ref: '#/definitions/CreateFolder'}
      }
  */
  try { 

    const newFolder = new FileSystem({
      name : "tes",
      description: "tes", 
    });

    await newFolder.save(); 

    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = create;

const update = async (req, res) => {
  // #swagger.summary = 'Creates a new folder.'
  /*  #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {$ref: '#/definitions/CreateFolder'}
      }
  */
  try { 

    const newFolder = new FileSystem({
      name : "tes",
      description: "tes", 
    });

    await newFolder.save(); 

    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = update;


const deleteItem = async (req, res) => {
  // #swagger.summary = 'Creates a new folder.'
  /*  #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {$ref: '#/definitions/CreateFolder'}
      }
  */
  try { 

    const newFolder = new FileSystem({
      name : "tes",
      description: "tes", 
    });

    await newFolder.save(); 

    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteItem;

const selectItem = async (req, res) => {
  // #swagger.summary = 'Creates a new folder.'
  /*  #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {$ref: '#/definitions/CreateFolder'}
      }
  */
  try { 

    const newFolder = new FileSystem({
      name : "tes",
      description: "tes", 
    });

    await newFolder.save(); 

    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = selectItem;


