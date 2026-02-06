;; Fee Manager Unit Tests

;; Test: Calculate performance fee
(define-public (test-calculate-fee)
  (let
    (
      (initial-value u100000000)
      (new-value u110000000)
      (fee (unwrap-panic (contract-call? .fee-manager calculate-performance-fee new-value)))
    )
    (asserts! (is-eq fee u100000) (err u500))
    (ok true)
  )
)

;; Test: Fee rate update
(define-public (test-update-fee-rate)
  (let
    (
      (result (contract-call? .fee-manager update-fee-rate u200))
    )
    (asserts! (is-ok result) (err u510))
    (ok true)
  )
)
