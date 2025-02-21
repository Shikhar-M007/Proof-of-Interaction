const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
const erc20TokenAddress = "YOUR_ERC20_TOKEN_ADDRESS"; // Replace with ERC-20 token contract address
const contractABI = [ /* Copy your contract ABI here */ ];
let web3;
let contract;
let userAccount;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];
        console.log("Connected Account:", userAccount);

        contract = new web3.eth.Contract(contractABI, contractAddress);
        fetchBalance();
        fetchDonors();
    } else {
        alert("Please install MetaMask!");
    }
}

async function fetchBalance() {
    if (!contract) return;
    const balance = await contract.methods.getBalance().call();
    document.getElementById("balance").innerText = web3.utils.fromWei(balance, "ether");

    const erc20Balance = await contract.methods.getERC20Balance().call();
    document.getElementById("erc20Balance").innerText = web3.utils.fromWei(erc20Balance, "ether");
}

async function sendTip() {
    if (!contract) return alert("Connect wallet first!");

    const amount = document.getElementById("amount").value;
    if (amount <= 0) return alert("Enter a valid amount!");

    try {
        await web3.eth.sendTransaction({
            from: userAccount,
            to: contractAddress,
            value: web3.utils.toWei(amount, "ether")
        });
        fetchBalance();
        fetchDonors();
        alert("Tip sent successfully!");
    } catch (error) {
        console.error(error);
        alert("Transaction failed!");
    }
}

async function sendERC20Tip() {
    const amount = document.getElementById("erc20Amount").value;
    if (amount <= 0) return alert("Enter a valid ERC-20 amount!");

    const tokenContract = new web3.eth.Contract(contractABI, erc20TokenAddress);
    await tokenContract.methods.approve(contractAddress, web3.utils.toWei(amount, "ether")).send({ from: userAccount });
    await contract.methods.tipERC20(web3.utils.toWei(amount, "ether")).send({ from: userAccount });

    fetchBalance();
    fetchDonors();
    alert("ERC-20 Tip sent successfully!");
}

async function fetchDonors() {
    if (!contract) return;
    const donors = await contract.methods.getDonors().call();
    let donorList = "";
    donors.forEach(donor => {
        donorList += `<li>${donor.donorAddress} tipped ${web3.utils.fromWei(donor.amount, "ether")} ETH</li>`;
    });
    document.getElementById("donors").innerHTML = donorList;
}

async function withdrawFunds() {
    await contract.methods.withdraw().send({ from: userAccount });
    fetchBalance();
    alert("Funds withdrawn successfully!");
}

async function withdrawERC20() {
    await contract.methods.withdrawERC20().send({ from: userAccount });
    fetchBalance();
    alert("ERC-20 withdrawn successfully!");
}

window.onload = connectWallet;
