const express = require("express");
const Passage = require("@passageidentity/passage-node");
const cors = require("cors");

// Additions 
const ethers = require('ethers');
const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");

// Additions: 
const app = express();

const PORT = 7000;
const CLIENT_URL = "http://localhost:3000";

require("dotenv").config(); 

app.use(express.json());

app.use(
    cors({
        origin: CLIENT_URL,
    })
);

const passageConfig = {
    appID: process.env.PASSAGE_APP_ID,
    apiKey: process.env.PASSAGE_API_KEY
};

let passage = new Passage(passageConfig);

app
    .post("/verifyProof", async (request, response) => {

        const {token, data} = request.body; 
        // token = request.body["token"];  
        // data = request.body["data"];

        console.log("Received Token: ", request.body["token"]);
        console.log("Received Data:", request.body["data"]);
        
        const user =  await passage.validAuthToken(token);
        
        console.log(user);
        
        if (user) {
            // User is now authenticated 

            // Generate timestamp: 
            let authenticated_date = new Date();
            let authenticated_dateInISO = authenticated_date.toISOString();

            // Generate hexlified timestamp:
            const timestamp = ethers.utils.hexZeroPad(
                ethers.utils.hexlify(
                  Math.floor(authenticated_date.getTime() / 1000)
                ),
                4
            );

            // Generate hash:
            const hash = ethers.utils.keccak256(
                ethers.utils.hexConcat([data, timestamp])
            );

            // Generate validator Signature:
            const validatorSignature = await wallet.signMessage(
                ethers.utils.arrayify(hash)
              );
      
            // Generate proof:
            const proof = ethers.utils.hexConcat([
            data,
            timestamp,
            validatorSignature
            ]);

            console.log({proof, authenticated_dateInISO});
            response.json({
                proof, timestamp: authenticated_dateInISO
            });
        } else {
            response.json({
                status: "failure",
            });
        }          
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
