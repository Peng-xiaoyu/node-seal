import { Exception } from './exception'
import { ParmsIdType } from './parms-id-type'
import { ContextData } from './context-data'

export const Context = ({
  library,
  encryptionParams,
  expandModChain,
  securityLevel
}) => {
  const _Exception = Exception({ library })
  const _printContext = library.printContext
  const _library = library
  let _instance = null
  try {
    _instance = new library.SEALContext(
      encryptionParams.instance,
      expandModChain,
      securityLevel
    )
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @implements Context
   */

  /**
   * @interface Context
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name Context#instance
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
     * @name Context#inject
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
     * @name Context#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Prints the context parameters to STDOUT (console.log)
     *
     * @function
     * @name Context#print
     */
    print() {
      try {
        _printContext(_instance)
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Returns the ContextData corresponding to encryption parameters with a given
     * parmsId. If parameters with the given parmsId are not found then the
     * function returns nullptr.
     *
     * @function
     * @name Context#getContextData
     * @param {Object} options Options
     * @param {ParmsIdType} options.parmsId Specific id to return ContextData for
     * @returns {ContextData} ContextData corresponding to encryption parameters
     */
    getContextData({ parmsId }) {
      try {
        const instance = _instance.getContextData(parmsId.instance)
        const contextData = ContextData({ library: _library })
        contextData.inject({ instance })
        return contextData
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * The ContextData corresponding to encryption parameters that are used for keys.
     *
     * @readonly
     * @name Context#keyContextData
     * @type {ContextData}
     */
    get keyContextData() {
      try {
        const instance = _instance.keyContextData()
        const contextData = ContextData({ library: _library })
        contextData.inject({ instance })
        return contextData
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * The ContextData corresponding to the first encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#firstContextData
     * @type {ContextData}
     */
    get firstContextData() {
      try {
        const instance = _instance.firstContextData()
        const contextData = ContextData({ library: _library })
        contextData.inject({ instance })
        return contextData
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Returns the ContextData corresponding to the last encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#lastContextData
     * @type {ContextData}
     */
    get lastContextData() {
      try {
        const instance = _instance.lastContextData()
        const contextData = ContextData({ library: _library })
        contextData.inject({ instance })
        return contextData
      } catch (e) {
        throw _Exception.safe({ error: e })
      }
    },

    /**
     * Whether the encryption parameters are set in a way that is considered valid by
     * Microsoft SEAL, the variable parameters_set is set to true.
     *
     * @readonly
     * @name Context#parametersSet
     * @type {Boolean}
     */
    get parametersSet() {
      return _instance.parametersSet()
    },

    /**
     * Returns a parmsIdType corresponding to the set of encryption parameters that are used for keys.
     *
     * @readonly
     * @name Context#keyParmsId
     * @type {ParmsIdType}
     */
    get keyParmsId() {
      const instance = _instance.keyParmsId()
      const parmsId = ParmsIdType({ library: _library })
      parmsId.inject({ instance })
      return parmsId
    },

    /**
     * Returns a parmsIdType corresponding to the first encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#firstParmsId
     * @type {ParmsIdType}
     */
    get firstParmsId() {
      const instance = _instance.firstParmsId()
      const parmsId = ParmsIdType({ library: _library })
      parmsId.inject({ instance })
      return parmsId
    },

    /**
     * The parmsIdType corresponding to the last encryption parameters that are used for data.
     *
     * @readonly
     * @name Context#lastParmsId
     * @type {ParmsIdType}
     */
    get lastParmsId() {
      const instance = _instance.lastParmsId()
      const parmsId = ParmsIdType({ library: _library })
      parmsId.inject({ instance })
      return parmsId
    },

    /**
     * Whether the coefficient modulus supports keyswitching. In practice,
     * support for keyswitching is required by Evaluator.relinearize,
     * Evaluator.applyGalois, and all rotation and conjugation operations. For
     * keyswitching to be available, the coefficient modulus parameter must consist
     * of at least two prime number factors.
     *
     * @readonly
     * @name Context#usingKeyswitching
     * @type {Boolean}
     */
    get usingKeyswitching() {
      return _instance.usingKeyswitching()
    }
  }
}
