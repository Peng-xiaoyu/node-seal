const fs = require('fs')

const {
  SCHEME_TYPES,
  SECURITY_LEVELS,
  POLYMODULUS_DEGREES,
  BFV_COEFF_MOD_BIT_SIZES,
  CKKS_COEFF_MOD_BIT_SIZES,
  ARRAY_SIZES,
  SCHEME_TYPES_CONSTRUCTOR,
  SECURITY_LEVELS_CONSTRUCTOR,
  ENCODERS_CONSTRUCTOR,
  TYPES,
  TYPES_CONSTRUCTOR,
  ENCODE_ACTIONS_CONSTRUCTOR,
  DECODE_ACTIONS_CONSTRUCTOR
} = require('./constants')

const genTests = (verb) => {
  for (let schemeType in SCHEME_TYPES) {
    for (let polyModDeg in POLYMODULUS_DEGREES) {
      for (let secLevel in SECURITY_LEVELS) {
        for (let type in TYPES) {

          // Skip data types that the Scheme doesn't support
          if (!TYPES_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]) {
            continue
          }
          const folderName = `${verb}`
          const fileName = `${verb}-scheme_${SCHEME_TYPES[schemeType]}-poly_${POLYMODULUS_DEGREES[polyModDeg]}-sec_${SECURITY_LEVELS[secLevel]}-type_${TYPES[type]}.test.js`
          const code = []

          // Skip certain generated tests that are known to fail
          let skip = false
          if (
            // Fails because there's only 1 coeffModulus
            POLYMODULUS_DEGREES[polyModDeg] === POLYMODULUS_DEGREES.BITS_4096 && SECURITY_LEVELS[secLevel] === SECURITY_LEVELS.BITS_256
          ) {
            skip = true
          }

          code.push(`describe${skip ? '.skip': ''}('${verb} on ${schemeType}', () => {
  describe('polyModulusDegree ${POLYMODULUS_DEGREES[polyModDeg]}', () => {
    test('${SECURITY_LEVELS[secLevel]}-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: ${SCHEME_TYPES_CONSTRUCTOR[schemeType]}
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]}
      })
`)

          if (schemeType === SCHEME_TYPES.BFV) {
            code.push(`
      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSizes: Int32Array.from([${BFV_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]]}])
        })
      })

      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus({
        plainModulus: Morfix.PlainModulus.Batching({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSize: 20
        })
      })
`)
          }

          if (schemeType === SCHEME_TYPES.CKKS) {
            code.push(`
      // Create a suitable set of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: ${POLYMODULUS_DEGREES[polyModDeg]},
          bitSizes: Int32Array.from([${CKKS_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]]}])
        })
      })
`)
          }


          code.push(`
      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: ${SECURITY_LEVELS_CONSTRUCTOR[SECURITY_LEVELS[secLevel]]}
      })

      expect(context.parametersSet).toBe(true)

      const encoder = ${ENCODERS_CONSTRUCTOR[SCHEME_TYPES[schemeType]]}({
        context
      })

      const keyGenerator = Morfix.KeyGenerator({
        context
      })

      const publicKey = keyGenerator.getPublicKey()
      const secretKey = keyGenerator.getSecretKey()
      const encryptor = Morfix.Encryptor({
        context,
        publicKey
      })
      const decryptor = Morfix.Decryptor({
        context,
        secretKey
      })
`)

          // Data to encode
          code.push(`
      // Create data to be encrypted
      const array = ${TYPES_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]}.from({
        length: ${ARRAY_SIZES[SCHEME_TYPES[schemeType]][POLYMODULUS_DEGREES[polyModDeg]]}
      }).map((x, i) =>  i)
`)


          // If BFV don't include the scale
          // Encode the data
          code.push(`
      // Encode the Array
      const plainText = encoder.${ENCODE_ACTIONS_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]}({
        array${schemeType === SCHEME_TYPES.CKKS ? `,\n        scale: Math.pow(2, ${Math.min(...CKKS_COEFF_MOD_BIT_SIZES[SECURITY_LEVELS[secLevel]][POLYMODULUS_DEGREES[polyModDeg]])})` : ''}${SCHEME_TYPES[schemeType] === SCHEME_TYPES.BFV ? TYPES[type] === TYPES.INT32 ? '' : ',\n        signed: false' : ''}
      })
`)
          code.push(`
      // Encrypt the PlainText
      const cipherText = encryptor.encrypt({
        plainText
      })

      // Decrypt the CipherText
      const decryptedPlainText = decryptor.decrypt({
        cipherText
      })

      // Decode the PlainText
      const decodedArray = encoder.${DECODE_ACTIONS_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]}({
        plainText: decryptedPlainText${SCHEME_TYPES[schemeType] === SCHEME_TYPES.BFV ? TYPES[type] === TYPES.INT32 ? '' : ',\n        signed: false' : ''}
      })

      expect(decodedArray).toBeInstanceOf(${TYPES_CONSTRUCTOR[SCHEME_TYPES[schemeType]][TYPES[type]]})
      ${schemeType === SCHEME_TYPES.CKKS ? `// Hacks to get quick approximate values. Convert ±0 to 0 by adding 0.
      const approxValues = array.map(x => 0 + Math.round(x))
      const approxDecrypted = decodedArray.map(x => 0 + Math.round(x))
      // Check values
      expect(approxDecrypted).toEqual(approxValues)
` : 
      `// Check values
      expect(decodedArray).toEqual(array)`}
    })
  })
})
`)
          fs.mkdirSync(`${process.cwd()}/${folderName}/`, {recursive: true})
          fs.writeFileSync(`./${folderName}/${fileName}`, code.join(''))
        }
      }
    }
  }
}

genTests('encrypt')
