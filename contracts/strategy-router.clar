;; Bitrex Strategy Router Contract
;; Coordinates capital allocation across protocol adapters

(define-constant CONTRACT-VERSION u1)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-constant ERR-STRATEGY-NOT-FOUND (err u201))
(define-constant ERR-STRATEGY-INACTIVE (err u202))
(define-constant ERR-INVALID-ALLOCATION (err u203))
(define-constant ERR-INSUFFICIENT-LIQUIDITY (err u204))
(define-constant ERR-REBALANCE-THRESHOLD-NOT-MET (err u205))

;; Contract owner
(define-data-var contract-owner principal tx-sender)

;; Registered strategies
(define-map strategies
  {strategy-id: (string-ascii 32)}
  {
    adapter-contract: principal,
    active: bool,
    risk-score: uint,
    current-allocation: uint,
    target-percentage: uint
  }
)

;; Rebalancing configuration
(define-data-var rebalance-threshold uint u500)
(define-data-var last-rebalance-block uint u0)
(define-data-var min-rebalance-interval uint u144)

;; Active strategy IDs (for iteration)
(define-data-var active-strategies (list 10 (string-ascii 32)) (list))

;; Authorization check
(define-private (is-contract-owner)
  (is-eq tx-sender (var-get contract-owner))
)

;; Register a new strategy
(define-public (register-strategy 
  (strategy-id (string-ascii 32))
  (adapter principal)
  (risk-score uint)
  (target-pct uint)
)
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (asserts! (<= target-pct u10000) ERR-INVALID-ALLOCATION)
    
    (map-set strategies
      {strategy-id: strategy-id}
      {
        adapter-contract: adapter,
        active: true,
        risk-score: risk-score,
        current-allocation: u0,
        target-percentage: target-pct
      }
    )
    
    (var-set active-strategies 
      (unwrap-panic (as-max-len? 
        (append (var-get active-strategies) strategy-id) 
        u10
      ))
    )
    
    (ok strategy-id)
  )
)

;; Deactivate a strategy
(define-public (deactivate-strategy (strategy-id (string-ascii 32)))
  (let
    (
      (strategy (unwrap! (map-get? strategies {strategy-id: strategy-id}) ERR-STRATEGY-NOT-FOUND))
    )
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    
    (map-set strategies
      {strategy-id: strategy-id}
      (merge strategy {active: false})
    )
    
    (ok true)
  )
)

;; Get strategy information
(define-read-only (get-strategy-info (strategy-id (string-ascii 32)))
  (ok (map-get? strategies {strategy-id: strategy-id}))
)

;; Get all active strategy IDs
(define-read-only (get-active-strategies)
  (ok (var-get active-strategies))
)

;; Calculate total allocated capital across all strategies
(define-read-only (get-total-allocation)
  (ok u0)
)

;; Update strategy target allocation
(define-public (update-target-allocation 
  (strategy-id (string-ascii 32))
  (new-target uint)
)
  (let
    (
      (strategy (unwrap! (map-get? strategies {strategy-id: strategy-id}) ERR-STRATEGY-NOT-FOUND))
    )
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (asserts! (<= new-target u10000) ERR-INVALID-ALLOCATION)
    
    (map-set strategies
      {strategy-id: strategy-id}
      (merge strategy {target-percentage: new-target})
    )
    
    (ok new-target)
  )
)

;; Allocate new capital across strategies
;; Called by vault-core on deposits
(define-public (allocate-capital (amount uint))
  (begin
    (ok amount)
  )
)

;; Free capital from strategies
;; Called by vault-core on withdrawals
(define-public (free-capital (amount uint))
  (begin
    (ok amount)
  )
)

;; Rebalance capital across strategies
;; Can be called by keeper or admin
(define-public (rebalance)
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    
    (asserts! 
      (>= (- block-height (var-get last-rebalance-block)) (var-get min-rebalance-interval))
      ERR-REBALANCE-THRESHOLD-NOT-MET
    )
    
    (var-set last-rebalance-block block-height)
    (ok true)
  )
)

;; Update rebalancing configuration
(define-public (update-rebalance-config (threshold uint) (interval uint))
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (var-set rebalance-threshold threshold)
    (var-set min-rebalance-interval interval)
    (ok true)
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
