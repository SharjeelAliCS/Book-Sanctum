let express = require('express');
let serverData = require('../data');
let cartTabQueries = require("../sqlQueries/cartTabQueries");
let cartTabQueryInstance = new cartTabQueries();

module.exports = function(app){

  let router = express.Router();

  router.get('/', get);
  router.get('/modifyCart', modifyCart);
  router.get('/checkout', checkout);


  function get(req, res, next) {
    data = req.query;
    cartTabQueryInstance.getCartList(serverData.users[req.sessionID].user,res);
  }

  function modifyCart(req, res, next) {
    console.log("testing for "+ req.sessionID)
    console.log(JSON.stringify(serverData.users))
    if(!serverData.users.hasOwnProperty(req.sessionID) || serverData.users[req.sessionID].user==''){
      res.json('');
    }
    else{
    data = JSON.parse(Object.keys(req.query)[0]);
    cartTabQueryInstance.addtoCart(serverData.users[req.sessionID].user, data["isbn"], data["quantity"], res);
    }
  }

  function checkout(req, res, next) {

    data = JSON.parse(Object.keys(req.query)[0]);
    console.log(data);
    cartTabQueryInstance.checkoutOrder(serverData.users[req.sessionID].user,data.card_number, data.address_id, res);

  }

  return router;
}
