import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolManager } from "./target/types/sol_manager";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from "fs";

require("dotenv").config();

// Configuration
const RECIPIENT_ADDRESS = "ERF14r6A9tDA8FfVtbFWBU2A2SCd3eJp2KDSeSpn7y3m"; // Replace with actual recipient address
const TRANSFER_AMOUNT_SOL = 0.01; // Amount in SOL to transfer

async function main() {
  try {
    // Configure the client to use the local cluster
    anchor.setProvider(anchor.AnchorProvider.env());
    
    const program = anchor.workspace.solManager as Program<SolManager>;
    const provider = anchor.getProvider();

    // Load keypairs from files
    const payerKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync("./payer-keypair.json", "utf8")))
    );
    
    const trustedServiceKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync("./trusted-keypair.json", "utf8")))
    );

    // Load program keypair to derive authority
    const programKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync("./sol_manager-keypair.json", "utf8")))
    );

    console.log("Payer:", payerKeypair.publicKey.toString());
    console.log("Trusted Service:", trustedServiceKeypair.publicKey.toString());
    console.log("Program ID:", program.programId.toString());

    // Derive manager PDA (using payer as authority)
    const [managerPda, managerBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("manager"), payerKeypair.publicKey.toBuffer()],
      program.programId
    );

    console.log("Manager PDA:", managerPda.toString());

    // Check if manager is initialized
    try {
      const managerAccount = await program.account.solManager.fetch(managerPda);
      console.log("Manager found with authority:", managerAccount.authority.toString());
    } catch (error) {
      console.log("Manager not found, need to initialize first");
      
      // Initialize the manager
      console.log("Initializing manager...");
      const initTx = await program.methods
        .initialize()
        .accountsPartial({
          manager: managerPda,
          authority: payerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([payerKeypair])
        .rpc();
      
      console.log("Manager initialized. Transaction:", initTx);
      
      // Fund the manager PDA
      console.log("Funding manager PDA...");
      const fundTx = await provider.connection.requestAirdrop(
        managerPda,
        LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(fundTx);
      console.log("Manager PDA funded");
    }

    // Get recipient public key
    const recipient = new PublicKey(RECIPIENT_ADDRESS);

    // Convert SOL amount to lamports
    const transferAmount = Math.floor(TRANSFER_AMOUNT_SOL * LAMPORTS_PER_SOL);

    // Check manager balance
    const managerBalance = await provider.connection.getBalance(managerPda);
    console.log("Manager balance:", managerBalance / LAMPORTS_PER_SOL, "SOL");

    if (managerBalance < transferAmount) {
      throw new Error(`Insufficient balance. Manager has ${managerBalance / LAMPORTS_PER_SOL} SOL, need ${TRANSFER_AMOUNT_SOL} SOL`);
    }

    // Get recipient initial balance
    const initialRecipientBalance = await provider.connection.getBalance(recipient);
    console.log("Recipient initial balance:", initialRecipientBalance / LAMPORTS_PER_SOL, "SOL");

    // Perform the transfer
    console.log(`Transferring ${TRANSFER_AMOUNT_SOL} SOL to ${recipient.toString()}...`);
    
    const transferTx = await program.methods
      .transferSol(new anchor.BN(transferAmount))
      .accountsPartial({
        manager: managerPda,
        trustedService: trustedServiceKeypair.publicKey,
        recipient: recipient,
        systemProgram: SystemProgram.programId,
      })
      .signers([trustedServiceKeypair])
      .rpc();

    console.log("Transfer successful! Transaction:", transferTx);

    // Verify the transfer
    const finalManagerBalance = await provider.connection.getBalance(managerPda);
    const finalRecipientBalance = await provider.connection.getBalance(recipient);
    
    console.log("Final manager balance:", finalManagerBalance / LAMPORTS_PER_SOL, "SOL");
    console.log("Final recipient balance:", finalRecipientBalance / LAMPORTS_PER_SOL, "SOL");
    console.log("Amount transferred:", (finalRecipientBalance - initialRecipientBalance) / LAMPORTS_PER_SOL, "SOL");

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
