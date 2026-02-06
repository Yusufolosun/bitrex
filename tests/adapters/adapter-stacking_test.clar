;; Stacking Adapter Unit Tests

;; Test: Stack tokens
(define-public (test-stack)
  (let
    (
      (result (contract-call? .adapter-stacking deposit u100000000))
      (balance (unwrap-panic (contract-call? .adapter-stacking get-balance)))
    )
    (asserts! (is-ok result) (err u400))
    (asserts! (is-eq balance u100000000) (err u401))
    (ok true)
  )
)

;; Test: Unstack tokens
(define-public (test-unstack)
  (begin
    (unwrap-panic (contract-call? .adapter-stacking deposit u100000000))
    
    (let
      (
        (result (contract-call? .adapter-stacking withdraw u100000000))
        (balance (unwrap-panic (contract-call? .adapter-stacking get-balance)))
      )
      (asserts! (is-ok result) (err u410))
      (asserts! (is-eq balance u0) (err u411))
      (ok true)
    )
  )
)
