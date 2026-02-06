;; Strategy Router Unit Tests

(define-constant deployer tx-sender)
(define-constant adapter-zest .adapter-zest)

;; Test: Register new strategy
(define-public (test-register-strategy)
  (let
    (
      (result (contract-call? .strategy-router register-strategy 
        "zest-lending" 
        adapter-zest 
        u3 
        u4000
      ))
    )
    (asserts! (is-ok result) (err u100))
    (ok true)
  )
)

;; Test: Deactivate strategy
(define-public (test-deactivate-strategy)
  (begin
    (unwrap-panic (contract-call? .strategy-router register-strategy 
      "test-strategy" 
      adapter-zest 
      u3 
      u3000
    ))
    
    (let
      (
        (result (contract-call? .strategy-router deactivate-strategy "test-strategy"))
      )
      (asserts! (is-ok result) (err u110))
      (ok true)
    )
  )
)
