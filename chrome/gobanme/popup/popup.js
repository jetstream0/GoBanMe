chrome.bananocoinBananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');
let seed;
document.getElementById("balance-too-low").style.display = "none";
document.getElementById("log-out-1").onclick = log_out;
document.getElementById("log-out-2").onclick = log_out;
document.getElementById("go-button").onclick = go;
document.getElementById("send-button").onclick = pay;
document.getElementById("pay").onchange = display_amount;
document.getElementById("tabs").style.display = "none";
document.getElementById("site-tab").onclick = switch_to_site_tab;
document.getElementById("discover-tab").onclick = switch_to_discover_tab;
document.getElementById("wallet-tab").onclick = switch_to_wallet_tab;
document.getElementById("wallet").style.display = "none";
document.getElementById("discover").style.display = "none";
document.getElementById("recieve-pending").onclick = recieve_pending;
function get_info() {
  chrome.tabs.query({active: true, currentWindow: true}).then((tabs_array) => {
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
          document.getElementById("tabs").style.display = "block";
          document.getElementById("error-content").style.display = "none";
          document.getElementById("site-info").style.display = "block";
          document.getElementById("site-tab").classList.add("selected-tab");
          document.getElementById("discover-tab").classList.add("unselected-tab");
          document.getElementById("wallet-tab").classList.add("unselected-tab");
          document.getElementById("wallet").style.display = "none";
          document.getElementById("discover").style.display = "none";
          content = JSON.parse(this.responseText);
          document.getElementById("address").innerText = content['address'].slice(0,9)+"..."+content['address'].slice(-7);
          document.getElementById("true-address").innerText = content['address'];
          document.getElementById("copy-address").onclick = copy_address;
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
          document.getElementById("tabs").style.display = "none";
          document.getElementById("error-content").style.display = "block";
          document.getElementById("site-info").style.display = "none";
          document.getElementById("wallet").style.display = "none";
          document.getElementById("discover").style.display = "none";
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
    seed = document.getElementById("seed").value;
    if (chrome.bananocoinBananojs.bananoUtil.isSeedValid(seed).valid) {
      document.getElementById("seed-enter").style.display = "none";
      get_info();
    }
  }
}
function copy_address() {
  navigator.clipboard.writeText(document.getElementById("true-address").innerText);
}
async function send_banano(address, value) {
  document.getElementById("balance-too-low").style.display = "none";
  await chrome.bananocoinBananojs.sendBananoWithdrawalFromSeed(seed, 0, address, value).catch(err => {
    console.log(err)
    document.getElementById("balance-too-low").style.display = "block";
  });
}
function pay() {
  if (document.getElementById("pay").style.display == "block") {
    send_banano(document.getElementById("true-address").innerText, Number(document.getElementById("pay").value));
  } else {
    send_banano(document.getElementById("true-address").innerText, Number(document.getElementById("pay-1").value));
  }
}
async function log_out() {
  seed = undefined;
  document.getElementById("seed-enter").style.display = "block";
  document.getElementById("site-info").style.display = "none";
  document.getElementById("wallet").style.display = "none";
  document.getElementById("discover").style.display = "none";
  document.getElementById("tabs").style.display = "none";
  document.getElementById("error-content").style.display = "none";
}
function switch_to_site_tab() {
  document.getElementById("site-tab").classList.add("selected-tab");
  document.getElementById("site-tab").classList.remove("unselected-tab")
  document.getElementById("discover-tab").classList.add("unselected-tab");
  document.getElementById("discover-tab").classList.remove("selected-tab")
  document.getElementById("wallet-tab").classList.remove("selected-tab");
  document.getElementById("wallet-tab").classList.add("unselected-tab");
  document.getElementById("wallet").style.display = "none";
  document.getElementById("site-info").style.display = "block";
  document.getElementById("discover").style.display = "none";
}
function switch_to_discover_tab() {
  document.getElementById("site-tab").classList.add("unselected-tab");
  document.getElementById("site-tab").classList.remove("selected-tab")
  document.getElementById("discover-tab").classList.add("selected-tab");
  document.getElementById("discover-tab").classList.remove("unselected-tab")
  document.getElementById("wallet-tab").classList.remove("selected-tab");
  document.getElementById("wallet-tab").classList.add("unselected-tab");
  document.getElementById("wallet").style.display = "none";
  document.getElementById("site-info").style.display = "none";
  document.getElementById("discover").style.display = "block";
}
function switch_to_wallet_tab() {
  document.getElementById("site-tab").classList.add("unselected-tab");
  document.getElementById("site-tab").classList.remove("selected-tab")
  document.getElementById("discover-tab").classList.add("unselected-tab");
  document.getElementById("discover-tab").classList.remove("selected-tab")
  document.getElementById("wallet-tab").classList.remove("unselected-tab");
  document.getElementById("wallet-tab").classList.add("selected-tab");
  document.getElementById("wallet").style.display = "block";
  document.getElementById("site-info").style.display = "none";
  document.getElementById("discover").style.display = "none";
  chrome.bananocoinBananojs.getBananoAccountFromSeed(seed, 0).then(async (current_address) => {
    document.getElementById("wallet-address").innerText = current_address;
    let raw = await chrome.bananocoinBananojs.getAccountBalanceRaw(current_address)
    let parts = await chrome.bananocoinBananojs.getBananoPartsFromRaw(raw);
    document.getElementById("balance").innerText = parts.banano;
  })
}
async function recieve_pending() {
  let rep = await chrome.bananocoin.bananojs.bananodeApi.getAccountRepresentative(document.getElementById("wallet-address").innerText);
  await chrome.bananocoinBananojs.receiveBananoDepositsForSeed(seed, 0, rep);
}