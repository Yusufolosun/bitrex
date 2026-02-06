;; Bitrex Zest Protocol Adapter
;; Handles sBTC lending integration

(impl-trait .strategy-trait.strategy-trait)

(define-constant CONTRACT-VERSION u1)
(define-constant STRATEGY-NAME "zest-lending")

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u300))
(define-constant ERR-INSUFFICIENT-BALANCE (err u301))
(define-constant ERR-DEPOSIT-FAILED (err u302))
(define-constant ERR-WITHDRAW-FAILED (err u303))

;; Contract owner
(define-data-var contract-owner principal tx-sender)

;; Current balance in Zest protocol
(define-data-var zest-balance uint u0)

;; Active status
(define-data-var active bool true)

;; Simulated APY (basis points)
(define-data-var current-apy uint u800)

;; Deposit sBTC into Zest protocol
(define-public (deposit (amount uint))
  (begin
    (var-set zest-balance (+ (var-get zest-balance) amount))
    (ok amount)
  )
)

;; Withdraw sBTC from Zest protocol
(define-public (withdraw (amount uint))
  (let
    (
      (current-balance (var-get zest-balance))
    )
    (asserts! (>= current-balance amount) ERR-INSUFFICIENT-BALANCE)
    (var-set zest-balance (- current-balance amount))
    (ok amount)
  )
)

;; Get current balance in Zest
(define-public (get-balance)
  (ok (var-get zest-balance))
)

;; Get current Zest lending APY
(define-public (get-apy)
  (ok (var-get current-apy))
)

;; Get strategy metadata
(define-public (get-strategy-info)
  (ok {
    name: STRATEGY-NAME,
    risk-score: u3,
    active: (var-get active)
  })
)
