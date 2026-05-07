// repositories/BaseRepository.js

/**
 * Abstract base class for all repositories.
 * Enforces the Interface Segregation Principle (ISP) — subclasses only
 * implement what they need, but must at minimum follow this contract.
 * 
 * Satisfies DIP: services depend on this abstraction, not concrete DB calls.
 */
class BaseRepository {
    constructor(pool) {
        if (new.target === BaseRepository) {
            throw new Error('BaseRepository is abstract and cannot be instantiated directly.');
        }
        this.pool = pool;
    }
}

module.exports = BaseRepository;
