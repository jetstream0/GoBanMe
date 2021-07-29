browser.bananocoinBananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');
let seed;
document.getElementById("balance-too-low").style.display = "none";
document.getElementById("log-out-1").onclick = log_out;
document.getElementById("log-out-2").onclick = log_out;
document.getElementById("go-button").onclick = go;
document.getElementById("send-button").onclick = pay;
document.getElementById("pay").onchange = display_amount;
function get_info() {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs_array) => {
    let url = tabs_array[0].url;
    let https = false;
    if (tabs_array[0].url.startsWith("http://")) {
      url = url.replace("http://","");
    } else if (tabs_array[0].url.startsWith("https://")) {
      url = url.replace("https://","");
      https = true;
    }
    url = url.split('/')[0];
    if (https) {
      url = "https://"+url+"/banano.json";
    } else {
      url = "http://"+url+"/banano.json";
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          document.getElementById("error-content").style.display = "none";
          document.getElementById("site-info").style.display = "block";
          document.getElementById("discover-tab").classList.add("unselected-tab");
          document.getElementById("settings-tab").classList.add("unselected-tab");
          content = JSON.parse(this.responseText);
          document.getElementById("address").innerText = content['address'].slice(0,9)+"..."+content['address'].slice(-7);
          document.getElementById("copy-address").onclick = navigator.clipboard.writeText(content['address']);
          document.getElementById("description").innerText = content['description'];
          document.getElementById("suggested-donation").innerText = content['suggested_donation'];
          document.getElementById("author").innerText = content['author'];
          //checks if suggested donation is float
          if (!isNaN(content['suggested_donation']) && content['suggested_donation'].toString().indexOf('.') != -1) {
            document.getElementById("pay").style.display = 'none';
            document.getElementById("pay-1").style.display = 'block';
            document.getElementById("pay-1").value = content['suggested_donation'];
          } else {
            document.getElementById("pay").style.display = 'block';
            document.getElementById("pay-1").style.display = 'none';
            document.getElementById("pay").value = content['suggested_donation'];
          }
          document.getElementById("send-button").value = "Send "+content['suggested_donation']+" Bananos";
        } else {
          document.getElementById("error-content").style.display = "block";
          document.getElementById("site-info").style.display = "none";
        }
      }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
  });
}
function display_amount() {
  document.getElementById('send-button').value = "Send "+String(document.getElementById("pay").value)+" Bananos";
}
function go() {
  if (document.getElementById('i-agree').checked) {
    document.getElementById("seed-enter").style.display = "none";
    seed = document.getElementById("seed").value;
    get_info();
  }
}
async function send_banano(address, value) {
  document.getElementById("balance-too-low").style.display = "none";
  await browser.bananocoinBananojs.sendBananoWithdrawalFromSeed(seed, 0, address, value).catch(err => {
    document.getElementById("balance-too-low").style.display = "block";
  });
}
function pay() {
  if (document.getElementById("pay").style.display == "block") {
    send_banano(document.getElementById("address").innerText, Number(document.getElementById("pay").value));
  } else {
    send_banano(document.getElementById("address").innerText, Number(document.getElementById("pay-1").value));
  }
}
async function log_out() {
  seed = undefined;
  document.getElementById("seed-enter").style.display = "block";
  document.getElementById("site-info").style.display = "none";
  document.getElementById("error-content").style.display = "none";
}