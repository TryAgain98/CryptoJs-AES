var keySize = 256;
var ivSize = 128;
var iterations = 100;

var password = "DungCute0308";


function encrypt (msg, pass) {
  var salt = CryptoJS.lib.WordArray.random(128/8);
  
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  var iv = CryptoJS.lib.WordArray.random(128/8);
  
  var encrypted = CryptoJS.AES.encrypt(msg, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  });
  
  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
  return transitmessage;
}

function decrypt (transitmessage, pass) {
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
  var encrypted = transitmessage.substring(64);
  
  var key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize/32,
      iterations: iterations
    });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
    iv: iv, 
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
    
  })
  return decrypted;
}


$(document).ready(function(){
  $("#encrypted-btn").click(function() {
    $(".action-btn").removeClass("btn-active")
    $("#encrypted-btn").addClass("btn-active")
    const content = $("#content").val()
    var start = new Date().getTime();
    var encrypted = encrypt(content, password);
    var end = new Date().getTime();
    var time = end - start;
    $(".result").text(encrypted)
    $(".time").text(`${time} milliseconds`)
  }),
  $("#decrypted-btn").click(function() {
    $(".action-btn").removeClass("btn-active")
    $("#decrypted-btn").addClass("btn-active")
    var content = $("#content").val().trim()
    var start = new Date().getTime();
    var decrypted = decrypt(content, password);
    var end = new Date().getTime();
    var time = end - start;
    $(".result").text(decrypted.toString(CryptoJS.enc.Utf8))
    $(".time").text(`${time} milliseconds`)
  });
});

// var encrypted = encrypt(message, password);
// var decrypted = decrypt(encrypted, password);
// $('#encrypted').text("Encrypted: "+encrypted);
// $('#decrypted').text("Decrypted: "+ decrypted.toString(CryptoJS.enc.Utf8) );
