;; Zest Adapter Unit Tests

;; Test: Deposit to Zest
(define-public (test-deposit)
  (let
    (
      (result (contract-call? .adapter-zest deposit u100000000))
      (balance (unwrap-panic (contract-call? .adapter-zest get-balance)))
    )
    (asserts! (is-ok result) (err u200))
    (asserts! (is-eq balance u100000000) (err u201))
    (ok true)
  )
)

;; Test: Withdraw from Zest
(define-public (test-withdraw)
  (begin
    (unwrap-panic (contract-call? .adapter-zest deposit u100000000))
    
    (let
      (
        (result (contract-call? .adapter-zest withdraw u50000000))
        (balance (unwrap-panic (contract-call? .adapter-zest get-balance)))
      )
      (asserts! (is-ok result) (err u210))
      (asserts! (is-eq balance u50000000) (err u211))
      (ok true)
    )
  )
)
