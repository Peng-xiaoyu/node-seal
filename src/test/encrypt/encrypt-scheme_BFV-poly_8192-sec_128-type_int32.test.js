describe('encrypt on BFV', () => {
  describe('polyModulusDegree 8192', () => {
    test('128-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.BFV
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 8192
      })

      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 8192,
          bitSizes: Int32Array.from([43,43,44,44,44])
        })
      })

      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus({
        plainModulus: Morfix.PlainModulus.Batching({
          polyModulusDegree: 8192,
          bitSize: 20
        })
      })

      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc128
      })

      expect(context.parametersSet).toBe(true)

      const encoder = Morfix.BatchEncoder({
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

      // Create data to be encrypted
      const array = Int32Array.from({
        length: 8192
      }).map((x, i) =>  i)

      // Encode the Array
      const plainText = encoder.encode({
        array
      })

      // Encrypt the PlainText
      const cipherText = encryptor.encrypt({
        plainText
      })

      // Decrypt the CipherText
      const decryptedPlainText = decryptor.decrypt({
        cipherText
      })

      // Decode the PlainText
      const decodedArray = encoder.decode({
        plainText: decryptedPlainText
      })

      expect(decodedArray).toBeInstanceOf(Int32Array)
      // Check values
      expect(decodedArray).toEqual(array)
    })
  })
})
