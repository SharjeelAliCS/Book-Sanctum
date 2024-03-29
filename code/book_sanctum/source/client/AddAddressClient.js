let reloadPage = '';
function init(){

  reloadPage = localStorage.getItem('currPage');
}

function signup(){
  var country = document.getElementById("country").value;
  var state = document.getElementById("state").value;
  var city = document.getElementById("city").value;
  var street = document.getElementById("street").value;
  var aptNum = document.getElementById("aptNum").value;
  var code = document.getElementById("code").value;

  if(code==''|| aptNum=='' ||  street=='' ||  city=='' ||  state=='' || country==''){
    incorrectsignup("One of the fields is empty");
    return;
  }
  else{
    correctsignup();
  }

  reqObject = {
    "country": country,
    "state": state,
    "city": city,
    "code": code,
    "street": street,
    "apt": aptNum
  };
  account = JSON.parse(localStorage.getItem('registerData'));
  if(account==null){
    reqsignup(reqObject);
  }
  else{
    console.log("adding it");
    account.address = reqObject;
    localStorage.setItem('registerData', JSON.stringify(account));
    window.location.href = 'form?page=payment';
  }
}

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        signup();
    }
});

function reqsignup(reqObject){

  let userRequestJSON = JSON.stringify(reqObject) //make JSON string
  var request = $.ajax({
    url: "/form/addAddress",
    data: userRequestJSON,
    dataType: "json"
  });

  request.done(function (data) {

    window.location.href = reloadPage;

  })

  request.fail(function () {
    console.log("ERROR COULD NOT GET DATA")

  });

}
function correctsignup(){
  div = document.getElementById("incorrect");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

}

function incorrectsignup(text){
  //<b class="incorrect-text">Incorrect username or password</b>

  div = document.getElementById("incorrect");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  let divCard = document.createElement('div');
  console.log(div);
  divCard.innerHTML = '<b class="incorrect-text">'+text+'</b>';

  document.getElementById("incorrect").appendChild(divCard);
}
