describe('keypair on CKKS', () => {
  describe('polyModulusDegree 16384', () => {
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.CKKS
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 16384
      })

      // Create a suitable set of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 16384,
          bitSizes: Int32Array.from([60,39,39,39,60])
        })
      })

      const context = Morfix.Context({
        encryptionParams: parms,
        expandModChain: true,
        securityLevel: Morfix.SecurityLevel.tc256
      })

      expect(context.parametersSet).toBe(true)

      const keyGenerator = Morfix.KeyGenerator({
        context
      })

      const spyGetSecretKey = jest.spyOn(keyGenerator, 'getSecretKey')
      const secretKey = keyGenerator.getSecretKey()
      expect(spyGetSecretKey).toHaveBeenCalled()

      const spyGetPublicKey = jest.spyOn(keyGenerator, 'getPublicKey')
      const publicKey = keyGenerator.getPublicKey()
      expect(spyGetPublicKey).toHaveBeenCalled()


      const spySaveSecretKey = jest.spyOn(secretKey, 'save')
      const secretKeyBase64 = secretKey.save()
      expect(spySaveSecretKey).toHaveBeenCalled()

      const spySavePublicKey = jest.spyOn(publicKey, 'save')
      const publicKeyBase64 = publicKey.save()
      expect(spySavePublicKey).toHaveBeenCalled()


      const spyLoadSecretKey = jest.spyOn(secretKey, 'load')
      secretKey.load({context, encoded: secretKeyBase64})
      expect(spyLoadSecretKey).toHaveBeenCalled()

      const spyLoadPublicKey = jest.spyOn(publicKey, 'load')
      publicKey.load({context, encoded: publicKeyBase64})
      expect(spyLoadPublicKey).toHaveBeenCalled()
    })
  })
})
