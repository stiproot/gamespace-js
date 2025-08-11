use anchor_lang::prelude::*;

declare_id!("BqvmMSVZZ6fNXHegCahrgSkD6STpiBASVpvbsAgmbNxC");

#[program]
pub mod sol_manager {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
