let web3;
let userAccount;
const adminWallet = "0x7611329d4327AD2182718804aa1589538cC7a3ad"; // Admin's wallet address

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            console.log("Connected Account:", userAccount);

            document.getElementById("status").innerText = `Connected: ${userAccount}`;
            document.getElementById("adminWallet").innerText = adminWallet;
        } catch (error) {
            console.error("Wallet connection failed!", error);
            alert("Failed to connect MetaMask!");
        }
    } else {
        alert("Please install MetaMask to use this feature!");
    }
}

async function sendTip() {
    if (!web3 || !userAccount) {
        alert("Connect wallet first!");
        return;
    }

    const amount = document.getElementById("amount").value;
    if (amount <= 0) {
        alert("Enter a valid amount!");
        return;
    }

    try {
        const gasPrice = await web3.eth.getGasPrice(); // Get current gas price

        await web3.eth.sendTransaction({
            from: userAccount,
            to: adminWallet,
            value: web3.utils.toWei(amount, "ether"),
            gas: 21000,  // Standard gas limit for ETH transfer
            maxFeePerGas: gasPrice,
            maxPriorityFeePerGas: web3.utils.toWei("2", "gwei")
        });

        alert("Tip sent successfully!");
        addTransactionToList(userAccount, amount);
    } catch (error) {
        console.error(error);
        alert("Transaction failed: " + error.message);
    }
}

function addTransactionToList(address, amount) {
    const transactionsList = document.getElementById("transactions");
    const listItem = document.createElement("li");
    listItem.textContent = `${address} sent ${amount} ETH`;
    transactionsList.appendChild(listItem);
}

// Automatically connect on page load
window.onload = connectWallet;
