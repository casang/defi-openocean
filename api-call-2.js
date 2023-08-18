const axios = require('axios');
const config = require("json");

let { google } = require('googleapis');
let secretKey = require("./defi-396312-58fa6b26fbbb.json");

var token1 = [];
var token2 = [];
/*
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB - BSB
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC - BSB
  "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", //Binance-Peg Dai
  "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", //Cardanoo ADA
  "0x0Eb3a705fc54725037CC9e008bDede697f62F335",
  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "0x90C97F71E18723b0Cf0dfa30ee176Ab653E89F40",
  "0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1",
  "0x8ea5219a16c2dbf1d6335a6aa0c6bd45c50347c5",
  "0x4Be8c674C51674bEb729832682bBA5E5b105b6e2",
  "0xd17479997F34dd9156Deef8F95A52D81D265be9c",
  "0x55d398326f99059fF775485246999027B3197955",
];
*/

let jwtClient = new google.auth.JWT(
       secretKey.client_email,
       null,
       secretKey.private_key,
       ['https://www.googleapis.com/auth/spreadsheets']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully connected!");
    }
});

//Google Sheets API

//https://docs.google.com/spreadsheets/d/1UFg7gni5pSJSnztrhCuuEPX7GKE-H4sQbLdgQd8dXAE
let spreadsheetId = '1UFg7gni5pSJSnztrhCuuEPX7GKE-H4sQbLdgQd8dXAE';
let sheets = google.sheets('v4');

var dataToBeWritten = [];

async function updateSheet () {
    //Write the data to the range 
    sheets.spreadsheets.values.update({
        auth: jwtClient,
        spreadsheetId: spreadsheetId,
        range: 'DEX!A2',
        valueInputOption: 'USER_ENTERED',
        resource: {
            majorDimension: "ROWS",
            values: dataToBeWritten,
        }
      }, 
      function (err, response) {
        if (err)
          console.log('The API returned an error: ' + err);
        else
          console.log('%s cells updated.', response.updatedCells);
      });
};

async function readSheet () {
    //read the data to the range 

    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: 'Pools!A:B',
      }, (err, response) => {
          if (err) {
            console.log('The API returned an error: ' + err);
          } else {
            console.log('Pools');
            for (let v of response.data.values) { 
              if (v[0] === "")
                break;
              token1.push(v[0]);
            }
            for (let v of response.data.values) { 
              if (v[1] === "")
                break;
              token2.push(v[1]);
            }
            resolve ();
          }
        })
    })
};


function insertRowSheet(token1, token2, value) {
    var rowToBeWritten = [];        

    let d = Date.now;
    rowToBeWritten.push(token1);
    rowToBeWritten.push(token2);
    rowToBeWritten.push(value);
    //rowToBeWritten.push(c.Pessoa);
    //rowToBeWritten.push(utilJs.format("%d", c.Valor).replace(".", ","));

    dataToBeWritten.push(rowToBeWritten);
};

function initUpdateSheet ()
{
    dataToBeWritten = [];
}

async function main() {
    await readSheet ();
    initUpdateSheet ();
    await getOportunities ();
    updateSheet ();
};

//const urlSwap = "https://open-api.openocean.finance/v3/56/quote?inTokenAddress=0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3&outTokenAddress=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&amount=100&slippage=1&gasPrice=5";

/*
const Token = [
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB - BSB
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC - BSB
    "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", //Binance-Peg Dai
    "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", //Cardanoo ADA
    "0x0Eb3a705fc54725037CC9e008bDede697f62F335",
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    "0x90C97F71E18723b0Cf0dfa30ee176Ab653E89F40",
    "0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1",
    "0x8ea5219a16c2dbf1d6335a6aa0c6bd45c50347c5",
    "0x4Be8c674C51674bEb729832682bBA5E5b105b6e2",
    "0xd17479997F34dd9156Deef8F95A52D81D265be9c",
    "0x55d398326f99059fF775485246999027B3197955",
];
*/

async function getOportunities () {
    for (i = 1; i < token1.length; i++) {
      for (j = 1; j < token2.length; j++) {
        if (token1[i] === token2[j])
          continue;
        var url1 = {
        "url": 'https://open-api.openocean.finance/v3/56/quote',
        "inToken": token1[i],
        "outToken": token2[j],
        "amount": 100,
        "slippage": 1,
        "gasPrice": 5,
        };
    
      var u1 = url1.url + "?" + 
              "inTokenAddress=" + url1.inToken + "&" +
              "outTokenAddress=" + url1.outToken + "&" +
              "amount=" + url1.amount + "&" +
              "slippage=" + url1.slippage + "&" +
              "gasPrice=" + url1.gasPrice;
      

      let response = await axios.get(u1);
      var sJson = response.data;
          //console.log(response.data);
      if (sJson.data != undefined)
      {
        console.log(">>" + sJson.data.inToken.name, ":", sJson.data.inAmount /  (10 ** 18));  
        console.log(sJson.data.outToken.name, ":", sJson.data.outAmount /  (10 ** 18));  
        console.log(sJson.data.estimatedGas /  (10 ** 8));  

        var u2 = url1.url + "?" + 
                "inTokenAddress=" + sJson.data.outToken.address + "&" +
                "outTokenAddress=" + sJson.data.inToken.address + "&" +
                "amount=" + sJson.data.outAmount /  (10 ** 18) + "&" +
                "slippage=" + url1.slippage + "&" +
                "gasPrice=" + url1.gasPrice;

        response = await axios.get(u2);
        const sJson2 = response.data;
        if (sJson2.data != undefined){
          //console.log(response.data);
          console.log("<<" + sJson2.data.inToken.name, ":", sJson2.data.inAmount /  (10 ** 18));  
          console.log(sJson2.data.outToken.name, ":", sJson2.data.outAmount /  (10 ** 18));  
          console.log(sJson2.data.estimatedGas /  (10 ** 8));  

          insertRowSheet (sJson2.data.outToken.name, sJson2.data.inToken.name, sJson2.data.outAmount /  (10 ** 18));
        }
      }
    }   
  }
}

main ();
