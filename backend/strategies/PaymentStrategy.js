// backend/strategies/PaymentStrategy.js

/**
 * Strategy Pattern for Payment Methods.
 * OCP: New payment methods can be added by creating a new class without modifying the OrderService.
 */
class PaymentStrategy {
    /**
     * @returns {object} { orderStatus, paymentStatus }
     */
    process() {
        throw new Error('process() must be implemented');
    }
}

class CashPaymentStrategy extends PaymentStrategy {
    process() {
        return { 
            orderStatus: 'pending', 
            paymentStatus: 'pending', 
            dbMethod: 'cash_on_delivery',
            transactionReference: 'COD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
    }
}

class CardPaymentStrategy extends PaymentStrategy {
    process() {
        return { 
            orderStatus: 'confirmed', 
            paymentStatus: 'paid', 
            dbMethod: 'credit_card',
            transactionReference: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
    }
}

class JazzCashPaymentStrategy extends PaymentStrategy {
    process() {
        return { 
            orderStatus: 'confirmed', 
            paymentStatus: 'paid', 
            dbMethod: 'digital_wallet',
            transactionReference: 'JC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
    }
}

class BankPaymentStrategy extends PaymentStrategy {
    process() {
        return { 
            orderStatus: 'confirmed', 
            paymentStatus: 'paid', 
            dbMethod: 'bank_transfer',
            transactionReference: 'BANK-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
    }
}

module.exports = {
    cash:     new CashPaymentStrategy(),
    card:     new CardPaymentStrategy(),
    jazzcash: new JazzCashPaymentStrategy(),
    bank:     new BankPaymentStrategy()
};
