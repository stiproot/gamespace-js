use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("6aaBth4uQFtvn71kXFBrzwb7FN8hXoSJ2oJSoVosF52K");

const TRUSTED_SERVICE_PUBKEY: &str = "63vZVZ5UFKn7Jk8CCD3QWfoyGaNTLrVzKac4KVrCBpDV";

#[program]
pub mod sol_manager {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let manager = &mut ctx.accounts.manager;
        manager.authority = ctx.accounts.authority.key();
        manager.bump = ctx.bumps.manager;
        msg!("Sol manager initialized with authority: {:?}", manager.authority);
        Ok(())
    }

    pub fn transfer_sol(
        ctx: Context<TransferSol>,
        amount: u64,
    ) -> Result<()> {
        // Verify the caller is the trusted service
        let trusted_pubkey = TRUSTED_SERVICE_PUBKEY.parse::<Pubkey>()
            .map_err(|_| ErrorCode::InvalidTrustedService)?;
        
        if ctx.accounts.trusted_service.key() != trusted_pubkey {
            return Err(ErrorCode::UnauthorizedCaller.into());
        }

        let manager = &ctx.accounts.manager;
        let manager_seeds = &[
            b"manager",
            manager.authority.as_ref(),
            &[manager.bump],
        ];
        let signer_seeds = &[&manager_seeds[..]];

        // Transfer SOL from PDA to recipient using invoke_signed
        **ctx.accounts.manager.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += amount;

        msg!("Transferred {} lamports to {:?}", amount, ctx.accounts.recipient.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + SolManager::LEN,
        seeds = [b"manager", authority.key().as_ref()],
        bump
    )]
    pub manager: Account<'info, SolManager>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferSol<'info> {
    #[account(
        mut,
        seeds = [b"manager", manager.authority.as_ref()],
        bump = manager.bump,
    )]
    pub manager: Account<'info, SolManager>,
    
    pub trusted_service: Signer<'info>,
    
    /// CHECK: This account is validated by the trusted service
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SolManager {
    pub authority: Pubkey,
    pub bump: u8,
}

impl SolManager {
    pub const LEN: usize = 32 + 1; // pubkey + bump
}

#[error_code]
pub enum ErrorCode {
    #[msg("Caller is not authorized to perform this action")]
    UnauthorizedCaller,
    #[msg("Invalid trusted service configuration")]
    InvalidTrustedService,
}
