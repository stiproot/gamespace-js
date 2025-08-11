anchor-build-program:
	anchor build

anchor-deploy-program:
	anchor program deploy target/deploy/sol_manager.so --program-v4 

sol-deploy-program:
	solana program-v4 deploy \
		--program-keypair ./sol_manager-keypair.json \
		--keypair ./payer-keypair.json \
		./target/deploy/sol_manager.so

sol-deploy-existing-program:
	solana program-v4 deploy --program-id ./sol_manager-keypair.json ./target/deploy/sol_manager.so
