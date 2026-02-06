;; Strategy Trait
;; Common interface for all protocol adapters

(define-trait strategy-trait
  (
    ;; Deposit sBTC into the protocol
    ;; @param amount - Amount of sBTC to deposit (in satoshis)
    ;; @returns Response with deposited amount or error
    (deposit (uint) (response uint uint))
    
    ;; Withdraw sBTC from the protocol
    ;; @param amount - Amount of sBTC to withdraw (in satoshis)
    ;; @returns Response with withdrawn amount or error
    (withdraw (uint) (response uint uint))
    
    ;; Get current balance in the protocol
    ;; @returns Total sBTC deposited in this strategy
    (get-balance () (response uint uint))
    
    ;; Get current APY (in basis points, e.g., 500 = 5%)
    ;; @returns Current APY or error
    (get-apy () (response uint uint))
    
    ;; Get strategy metadata
    ;; @returns (name, risk-score, active-status)
    (get-strategy-info () (response {name: (string-ascii 32), risk-score: uint, active: bool} uint))
  )
)
