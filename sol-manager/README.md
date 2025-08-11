# Solana Keypairs

**script:**
```sh
solana-keypair new -o sol_manager-keypair.json
``` 

Wrote new keypair to sol_manager-keypair.json
==========================================================================
pubkey: DoRW7H5S98aKAvmez8nPfx2gvY533Jm4KsjRLv2S8Ewe
==========================================================================

Wrote new keypair to trusted-keypair.json
==========================================================================
pubkey: 63vZVZ5UFKn7Jk8CCD3QWfoyGaNTLrVzKac4KVrCBpDV
==========================================================================

Wrote new keypair to payer-keypair.json
===========================================================================
pubkey: H7id3s5kZtLHqqeFWBpQ8hGWV1ir1b5KYsqmLdskWDeE
===========================================================================

Wrote new keypair to target_wallet-keypair.json
================================================================================
pubkey: ERF14r6A9tDA8FfVtbFWBU2A2SCd3eJp2KDSeSpn7y3m
================================================================================

Wrote new keypair to sol_manager_v2-keypair.json
================================================================================
pubkey: 6aaBth4uQFtvn71kXFBrzwb7FN8hXoSJ2oJSoVosF52K
================================================================================

 [programs.localnet]                                                         │ │
│ │    9 -  sol_manager = "BqvmMSVZZ6fNXHegCahrgSkD6STpiBASVpvbsAgmbNxC"                │ │
│ │    9 +  sol_manager = "DoRW7H5S98aKAvmez8nPfx2gvY533Jm4KsjRLv2S8Ewe"


solana program-v4 deploy --program-id
      DoRW7H5S98aKAvmez8nPfx2gvY533Jm4KsjRLv2S8Ewe --keypair ./payer-keypair.json
      ./target/deploy/sol_manager.so
