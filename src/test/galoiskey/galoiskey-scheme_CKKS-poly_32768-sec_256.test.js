describe.skip('galoiskey on CKKS', () => {
  describe('polyModulusDegree 32768', () => {
    test('256-bit security', async () => {
      const { Seal } = require('../../index.js')
      const Morfix = await Seal
      const parms = Morfix.EncryptionParameters({
        schemeType: Morfix.SchemeType.CKKS
      })

      parms.setPolyModulusDegree({
        polyModulusDegree: 32768
      })

      // Create a suitable set of CoeffModulus primes (we use default set)
      parms.setCoeffModulus({
        coeffModulus: Morfix.CoeffModulus.Create({
          polyModulusDegree: 32768,
          bitSizes: Int32Array.from([52,53,53,53,53,53,53,53,53])
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

      const spyGenGaloisKeys = jest.spyOn(keyGenerator, 'genGaloisKeys')
      const galoisKeys = keyGenerator.genGaloisKeys()
      expect(spyGenGaloisKeys).toHaveBeenCalled()

      const spySaveGaloisKeys = jest.spyOn(galoisKeys, 'save')
      const base64 = galoisKeys.save()
      expect(spySaveGaloisKeys).toHaveBeenCalled()

      const spyLoadGaloisKeys = jest.spyOn(galoisKeys, 'load')
      galoisKeys.load({context, encoded: base64})
      expect(spyLoadGaloisKeys).toHaveBeenCalled()
    })
  })
})
