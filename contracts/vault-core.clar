;; Bitrex Vault Core Contract
;; Manages user deposits, withdrawals, and vault share tokens

;; Contract version
(define-constant CONTRACT-VERSION u1)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-INSUFFICIENT-BALANCE (err u101))
(define-constant ERR-ZERO-AMOUNT (err u102))
(define-constant ERR-INVALID-SHARES (err u103))
(define-constant ERR-VAULT-PAUSED (err u104))
(define-constant ERR-TRANSFER-FAILED (err u105))
(define-constant ERR-SHARE-CALCULATION-FAILED (err u106))

;; Contract owner (deployer)
(define-data-var contract-owner principal tx-sender)

;; Vault state
(define-data-var total-shares uint u0)
(define-data-var total-assets uint u0)
(define-data-var vault-paused bool false)

;; User vault shares
(define-map user-shares principal uint)

;; Vault configuration
(define-map vault-config 
  {key: (string-ascii 32)} 
  {value: uint}
)

;; Initialize default config values
(map-set vault-config {key: "min-deposit"} {value: u100000})
(map-set vault-config {key: "reserve-ratio"} {value: u500})

;; Authorization check
(define-private (is-contract-owner)
  (is-eq tx-sender (var-get contract-owner))
)

;; Calculate share price (sBTC per share, scaled by 1e8)
(define-read-only (get-share-price)
  (let
    (
      (total-supply (var-get total-shares))
      (total-value (var-get total-assets))
    )
    (if (is-eq total-supply u0)
      (ok u100000000)
      (ok (/ (* total-value u100000000) total-supply))
    )
  )
)

;; Convert shares to assets
(define-read-only (shares-to-assets (shares uint))
  (match (get-share-price)
    share-price (ok (/ (* shares share-price) u100000000))
    error (err error)
  )
)

;; Convert assets to shares
(define-read-only (assets-to-shares (assets uint))
  (match (get-share-price)
    share-price (ok (/ (* assets u100000000) share-price))
    error (err error)
  )
)

;; Get user share balance
(define-read-only (get-user-shares (user principal))
  (ok (default-to u0 (map-get? user-shares user)))
)

;; Get user vault value in sBTC
(define-read-only (get-user-value (user principal))
  (let
    (
      (user-share-balance (default-to u0 (map-get? user-shares user)))
    )
    (shares-to-assets user-share-balance)
  )
)

;; Get total shares supply
(define-read-only (get-total-shares)
  (ok (var-get total-shares))
)

;; Get total assets under management
(define-read-only (get-total-assets)
  (ok (var-get total-assets))
)

;; Check if vault is paused
(define-read-only (is-paused)
  (ok (var-get vault-paused))
)

;; Deposit sBTC and receive vault shares
;; @param amount - Amount of sBTC to deposit (satoshis)
;; @returns Shares minted to user
(define-public (deposit (amount uint))
  (let
    (
      (depositor tx-sender)
      (min-deposit (get value (map-get? vault-config {key: "min-deposit"})))
      (shares-to-mint (unwrap! (assets-to-shares amount) ERR-SHARE-CALCULATION-FAILED))
      (current-shares (default-to u0 (map-get? user-shares depositor)))
    )
    (asserts! (not (var-get vault-paused)) ERR-VAULT-PAUSED)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (>= amount (default-to u0 min-deposit)) ERR-INSUFFICIENT-BALANCE)
    
    (map-set user-shares depositor (+ current-shares shares-to-mint))
    (var-set total-shares (+ (var-get total-shares) shares-to-mint))
    (var-set total-assets (+ (var-get total-assets) amount))
    
    (ok shares-to-mint)
  )
)

;; Withdraw sBTC by burning vault shares
;; @param shares - Amount of shares to burn
;; @returns sBTC amount returned to user
(define-public (withdraw (shares uint))
  (let
    (
      (withdrawer tx-sender)
      (current-shares (default-to u0 (map-get? user-shares withdrawer)))
      (assets-to-return (unwrap! (shares-to-assets shares) ERR-SHARE-CALCULATION-FAILED))
    )
    (asserts! (not (var-get vault-paused)) ERR-VAULT-PAUSED)
    (asserts! (> shares u0) ERR-ZERO-AMOUNT)
    (asserts! (>= current-shares shares) ERR-INSUFFICIENT-BALANCE)
    
    (map-set user-shares withdrawer (- current-shares shares))
    (var-set total-shares (- (var-get total-shares) shares))
    (var-set total-assets (- (var-get total-assets) assets-to-return))
    
    (ok assets-to-return)
  )
)

;; Emergency pause toggle (admin only)
(define-public (toggle-pause)
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (var-set vault-paused (not (var-get vault-paused)))
    (ok (var-get vault-paused))
  )
)

;; Transfer contract ownership
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (var-set contract-owner new-owner)
    (ok new-owner)
  )
)

;; Update vault configuration (admin only)
(define-public (update-config (key (string-ascii 32)) (value uint))
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (map-set vault-config {key: key} {value: value})
    (ok value)
  )
)

;; Get complete vault information
(define-read-only (get-vault-info)
  (ok {
    total-shares: (var-get total-shares),
    total-assets: (var-get total-assets),
    share-price: (unwrap-panic (get-share-price)),
    paused: (var-get vault-paused),
    contract-version: CONTRACT-VERSION
  })
)
