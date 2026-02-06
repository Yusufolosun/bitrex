;; Bitflow Adapter Unit Tests

;; Test: Add liquidity
(define-public (test-add-liquidity)
  (let
    (
      (result (contract-call? .adapter-bitflow deposit u100000000))
      (balance (unwrap-panic (contract-call? .adapter-bitflow get-balance)))
    )
    (asserts! (is-ok result) (err u300))
    (asserts! (is-eq balance u100000000) (err u301))
    (ok true)
  )
)

;; Test: Remove liquidity
(define-public (test-remove-liquidity)
  (begin
    (unwrap-panic (contract-call? .adapter-bitflow deposit u100000000))
    
    (let
      (
        (result (contract-call? .adapter-bitflow withdraw u100000000))
        (balance (unwrap-panic (contract-call? .adapter-bitflow get-balance)))
      )
      (asserts! (is-ok result) (err u310))
      (asserts! (is-eq balance u0) (err u311))
      (ok true)
    )
  )
)
