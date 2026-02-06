;; Vault Core Unit Tests

(define-constant deployer tx-sender)
(define-constant user-1 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant user-2 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)

;; Test: Initial vault state
(define-public (test-initial-state)
  (let
    (
      (total-shares (unwrap-panic (contract-call? .vault-core get-total-shares)))
      (total-assets (unwrap-panic (contract-call? .vault-core get-total-assets)))
      (paused (unwrap-panic (contract-call? .vault-core is-paused)))
    )
    (asserts! (is-eq total-shares u0) (err u1))
    (asserts! (is-eq total-assets u0) (err u2))
    (asserts! (is-eq paused false) (err u3))
    (ok true)
  )
)

;; Test: Share price calculation
(define-public (test-share-price)
  (let
    (
      (initial-price (unwrap-panic (contract-call? .vault-core get-share-price)))
    )
    (asserts! (is-eq initial-price u100000000) (err u10))
    (ok true)
  )
)

;; Test: Assets to shares conversion
(define-public (test-assets-to-shares)
  (let
    (
      (shares (unwrap-panic (contract-call? .vault-core assets-to-shares u100000000)))
    )
    (asserts! (is-eq shares u100000000) (err u20))
    (ok true)
  )
)

;; Test: Shares to assets conversion
(define-public (test-shares-to-assets)
  (let
    (
      (assets (unwrap-panic (contract-call? .vault-core shares-to-assets u100000000)))
    )
    (asserts! (is-eq assets u100000000) (err u21))
    (ok true)
  )
)

;; Test: Emergency pause toggle
(define-public (test-pause-toggle)
  (begin
    (asserts! (is-eq (unwrap-panic (contract-call? .vault-core is-paused)) false) (err u30))
    (unwrap-panic (contract-call? .vault-core toggle-pause))
    (asserts! (is-eq (unwrap-panic (contract-call? .vault-core is-paused)) true) (err u31))
    (unwrap-panic (contract-call? .vault-core toggle-pause))
    (asserts! (is-eq (unwrap-panic (contract-call? .vault-core is-paused)) false) (err u32))
    (ok true)
  )
)
