import { Exception } from './exception'
import { ComprModeType } from './compr-mode-type'

export const PublicKey = ({ library }) => {
  const _Exception = Exception({ library })
  const _ComprModeType = ComprModeType({ library })
  let _instance = null
  try {
    _instance = new library.PublicKey()
  } catch (e) {
    throw _Exception.safe({ error: e })
  }

  /**
   * @implements PublicKey
   */

  /**
   * @interface PublicKey
   */
  return {
    /**
     * Get the underlying WASM instance
     *
     * @private
     * @readonly
     * @name PublicKey#instance
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
     * @name PublicKey#inject
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
     * @name PublicKey#delete
     */
    delete() {
      if (_instance) {
        _instance.delete()
        _instance = null
      }
    },

    /**
     * Save the PublicKey to a base64 string
     *
     * @function
     * @name PublicKey#save
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
     * Load a PublicKey from a base64 string
     *
     * @function
     * @name PublicKey#load
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
