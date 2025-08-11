const { PublicKey, Keypair } = require('@solana/web3.js');
const fs = require('fs');

const programId = new PublicKey('BqvmMSVZZ6fNXHegCahrgSkD6STpiBASVpvbsAgmbNxC');
const authorityKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('./sol_manager-keypair.json', 'utf8'))));
const [managerPda] = PublicKey.findProgramAddressSync([Buffer.from('manager'), authorityKeypair.publicKey.toBuffer()], programId);

console.log('Authority (from sol_manager-keypair.json):', authorityKeypair.publicKey.toString());
console.log('Manager PDA Address (holds the funds):', managerPda.toString());