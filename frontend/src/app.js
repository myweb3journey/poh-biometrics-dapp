import {React, useState} from "react";
import styles from './styles/Home.module.css';
import { Passage } from "@passageidentity/passage-js";
import axios from "axios";
import {ConnectButton} from "@rainbow-me/rainbowkit" 
 
function App() {
   const [input, setInput] = useState("");
   
 async function doHumanityCheck() {
       //do passage js things
       let psg = new Passage(process.env.REACT_APP_PASSAGE_APP_ID)

       //generate random user name
       const username = "random+" + Date.now() + "@passage.id"

       //register the user
       const authResult = await psg.register(username)
       console.log("doHumanityCheck - Auth Result: ", authResult.auth_token);

       //setting in local storage, but can also just store in memory
       //or do something else with it (e.g. send to API right away and combine functions)
       localStorage.setItem("psg_auth_token", authResult.auth_token)
       localStorage.setItem("wallet_address", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
 }
 
 
  async function verifyHumanityCheck() {
  const authToken = localStorage.getItem("psg_auth_token");
  const walletAddress = localStorage.getItem("wallet_address");

  axios
    .post(`http://localhost:7000/verifyProof`, {token: authToken, data: walletAddress}, {
    }
    )
    .then((response) => {
      const { status } = response.data;
      console.log("Response.data", response.data);
      setInput(status)
    })
}
return (
    <div className={styles.container}>

    <main className={styles.main}>
      <h1 className={styles.title} style={{ marginBottom: "4rem" }}>
        PoH Demo App
      </h1>
      <h1 className={styles.title} style={{ marginBottom: "2rem" }}>
        Using biometrics to generate Proof-of-Humanity
      </h1>
      <div className={styles.card3}>
            <ConnectButton />      
        </div>
      <div className={styles.card3}>
        <main>
        <div className={styles.card2}>
            <button className="button-85" onClick={doHumanityCheck}>Do Humanity Check</button>
        </div>
        <div className={styles.card2}>
            <button className="button-85" onClick={verifyHumanityCheck}>Verify humanity Check</button>
            <p>{input}</p>
        </div>
        </main>
      </div>
    </main>
  </div>
  );
}

export default App; 
