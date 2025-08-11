use anchor_lang::prelude::*;

declare_id!("Hex5kJsnZAdTv5xqVQCjM74t7ikuYojx4CPn2ssSVQYc");

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
