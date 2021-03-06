import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'
import { ParmsIdType } from './parms-id-type'

export const PlainText = ({ library }) => {
  const _Exception = Exception({ library })
  const _ComprModeType = ComprModeType({ library })
  const _library = library
  let _instance = null
  try {
    _instance = new library.Plaintext()
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @implements PlainText
   */

  /**
   * @interface PlainText
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name PlainText#instance
     * @type {instance}
     */
    get instance() {
      return _instance
    },

    /**
     * Inject this object with a raw WASM instance
     *
     * @private
     * @function
     * @name PlainText#inject
     * @param {Object} options Options
     * @param {instance} options.instance WASM instance
     */
    inject({ instance }) {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
      _instance = instance
    },

    /**
     * Delete the underlying WASM instance.
     *
     * Should be called before dereferencing this object to prevent the
     * WASM heap from growing indefinitely.
     * @function
     * @name PlainText#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Allocates enough memory to accommodate the backing array of the current
     * PlainText and copies it over to the new location. This function is meant
     * to reduce the memory use of the PlainText to smallest possible and can be
     * particularly important after modulus switching.
     *
     * @function
     * @name PlainText#shrinkToFit
     */
    shrinkToFit() {
      try {
        return _instance.shrinkToFit()
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Sets the PlainText polynomial to zero.
     *
     * @function
     * @name PlainText#setZero
     */
    setZero() {
      try {
        return _instance.setZero()
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Whether the current PlainText polynomial has all zero coefficients.
     *
     * @readonly
     * @name PlainText#isZero
     * @type {Boolean}
     */
    get isZero() {
      return _instance.isZero()
    },

    /**
     * The capacity of the current allocation.
     *
     * @readonly
     * @name PlainText#capacity
     * @type {Number}
     */
    get capacity() {
      return _instance.capacity()
    },

    /**
     * The coefficient count of the current PlainText polynomial.
     *
     * @readonly
     * @name PlainText#coeffCount
     * @type {Number}
     */
    get coeffCount() {
      return _instance.coeffCount()
    },

    /**
     * The significant coefficient count of the current PlainText polynomial.
     *
     * @readonly
     * @name PlainText#significantCoeffCount
     * @type {Number}
     */
    get significantCoeffCount() {
      return _instance.significantCoeffCount()
    },

    /**
     * Returns the non-zero coefficient count of the current PlainText polynomial.
     *
     * @readonly
     * @name PlainText#nonzeroCoeffCount
     * @type {Number}
     */
    get nonzeroCoeffCount() {
      return _instance.nonzeroCoeffCount()
    },

    /**
     * Returns a human-readable string description of the PlainText polynomial.
     *
     * The returned string is of the form "7FFx^3 + 1x^1 + 3" with a format
     * summarized by the following:
     * 1. Terms are listed in order of strictly decreasing exponent
     * 2. Coefficient values are non-negative and in hexadecimal format (hexadecimal
     * letters are in upper-case)
     * 3. Exponents are positive and in decimal format
     * 4. Zero coefficient terms (including the constant term) are omitted unless
     * the polynomial is exactly 0 (see rule 9)
     * 5. Term with the exponent value of one is written as x^1
     * 6. Term with the exponent value of zero (the constant term) is written as
     * just a hexadecimal number without x or exponent
     * 7. Terms are separated exactly by <space>+<space>
     * 8. Other than the +, no other terms have whitespace
     * 9. If the polynomial is exactly 0, the string "0" is returned
     *
     * @function
     * @name PlainText#toPolynomial
     * @throws std::invalid_argument if the PlainText is in NTT transformed form
     * @returns {String} Polynomial string
     */
    toPolynomial() {
      try {
        return _instance.toPolynomial()
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Whether the PlainText is in NTT form.
     *
     * @readonly
     * @name PlainText#isNttForm
     * @type {Boolean}
     */
    get isNttForm() {
      return _instance.isNttForm()
    },

    /**
     * The reference to parmsId of the PlainText. The parmsId must remain zero unless the
     * PlainText polynomial is in NTT form.
     *
     * @see {@link EncryptionParameters} for more information about parmsId.
     *
     * @readonly
     * @name PlainText#parmsId
     * @type {ParmsIdType}
     */
    get parmsId() {
      const instance = _instance.parmsId()
      const parmsId = ParmsIdType({ library: _library })
      parmsId.inject({ instance })
      return parmsId
    },

    /**
     * The reference to the scale. This is only needed when using the CKKS
     * encryption scheme. The user should have little or no reason to ever change
     * the scale by hand.
     *
     * @readonly
     * @name PlainText#scale
     * @type {Number}
     */
    get scale() {
      return _instance.scale()
    },

    /**
     * The currently used MemoryPoolHandle.
     *
     * @readonly
     * @name PlainText#pool
     * @type {MemoryPoolHandle}
     */
    get pool() {
      return _instance.pool()
    },

    /**
     * Save the PlainText to a base64 string
     *
     * @function
     * @name PlainText#save
     * @param {Object} options Options
     * @param {ComprModeType} [options.compression={@link ComprModeType.deflate}] The compression mode to use
     * @returns {String} Base64 encoded string
     */
    save({ compression = _ComprModeType.deflate } = {}) {
      try {
        return _instance.saveToString(compression)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Load a PlainText from a base64 string
     *
     * @function
     * @name PlainText#load
     * @param {Object} options Options
     * @param {Context} options.context Encryption context to enforce
     * @param {String} options.encoded Base64 encoded string
     */
    load({ context, encoded }) {
      try {
        _instance.loadFromString(context.instance, encoded)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    }
  }
}
