const router = require("express").Router();
const upload = require("../middlewares/multer.middleware"); 
const create = require("../controllers/test");
const update = require("../controllers/test");
const deleteItem = require("../controllers/test"); 
const selectItem = require("../controllers/test");



router.post("/test", create); 
router.get("/test", selectItem); 
router.put("/test", update); 
router.delete("/test", deleteItem); 

module.exports = router;
