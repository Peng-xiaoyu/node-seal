# List of Changes

See [Microsoft's Change log](https://github.com/microsoft/SEAL/blob/master/Changes.md)
for more details on each SEAL version change.

## Version 3.2.0

Feat:
- No more dealing with `Vector` types! All methods now accept a valid 
 TypedArray as a parameter or return one where applicable

Deprecated:
- In `BatchEncode`, replace `encodeVectorInt32`, `encodeVectorUInt32` with `BatchEncode.encode` using a TypedArray
- In `BatchEncode`, replace `decodeVectorInt32`, `decodeVectorUInt32` with `BatchEncode.decode`. This method returns
  a either an Int32Array or Uint32Array with the results. 
- In `CKKSEncode`, replace `decodeVectorDouble` with `CKKSEncode.decode`. This method returns
  a Float64Array with the results.
- Creating a `Vector` is now obsolete, however it is still available.
- `CoeffModulus.Create` now accepts `bitSizes` as an Int32Array in addition to the legacy Vector type.

## Version 3.1.1

Some methods now accept optional parameters and if omitted, 
will return an instance for you. This change allows more compact
syntax.

Feat:
- `BatchEncoder.encoder` returns a `PlainText` if one is not specified in the arguments.
- `CKKSEncoder.encoder` returns a `PlainText` if one is not specified in the arguments.
- `Encryptor.encrypt` returns a `CipherText` if one is not specified in the arguments.
- `Decryptor.decrypt` returns a `PlainText` if one is not specified in the arguments.

## Version 3.1.0

Fix:
- `Context.getContextData({ parmsId })` now returns an instance of `ContextData`
- `Context.keyContextData` now returns an instance of `ContextData`
- `Context.firstContextData` now returns an instance of `ContextData`
- `Context.lastContextData` now returns an instance of `ContextData`
- `EncryptionParameters.plainModulus` now returns a wrapped instance of `SmallModulus` instead of the raw WASM instance.
- `EncryptionParameters.coeffModulus` returns an array of BigInts containing the primes instead of an overly complex
 `vector<SmallModulus>` which had no direct methods to extract the internal values and was therefore useless.
 
Feat:
- Added `ContextData` binding which can be used for inspecting a `Context` information in greater detail.
- Added `EncryptionParameterQualifiers` binding to be used for advanced debugging.

Breaking:
- `SmallModulus.value` now returns a BigInt containing the value stored inside 
  the instance instead of a string.

## Version 3.0.6

Fix:
- Added missing ParmsIdType binding which allows for `parmsId` to be passed 
  into all related methods correctly without throwing an unbound type exception.
- ParmsIdType has an instance method which returns an array of bigints for
  read-only inspection.
  
Chore:
- Updated to the latest release of emsdk version (1.39.6) and rebuilt dist.
  This has removed some build warnings in seal:build and introduced 
  harmless others during seal:make.

## Version 3.0.5

Chore:
- Updated to the latest release of emsdk version (1.39.5) and rebuilt dist

## Version 3.0.4

Fix:
- IntegerEncoder:

  C++ Binding encode now uses the method which accepts a destination 
  plaintext as a parameter and returns void.
  
  The respective JavaScript wrapper now returns the result of decode.

## Version 3.0.3

Fix:
- Latest bundle for npm was not built correctly. Rebuilt with exception handling
  and the other changes.

## Version 3.0.2

Feat:
- Added `delete` method to applicable components. This method should
  be called before dereferencing a JavaScript component. This is 
  because there is no way to automatically call the destructors 
  on C++ objects.

## Version 3.0.1

No updates to core library functionality.

Chore:
- Removed unnecessary files from the packed distribution. 
  Size is now ~2MB for both Node.js and browser versions 
  instead of ~20MB.
- Removed use of 'new' keyword for all objects.

Docs:
- Updated documentation

## Version 3.0.0

Feat: 
- All functions will throw nicely. Previously, if the WASM threw an exception you had to
   manually invoke `Seal.Exception.getHuman()` to obtain the human readable string. This is
   now done automatically.
- Slight reduction in code size due to the major refactoring.
   
Refactor:
- Library is now written with no `classes` - now using object composition, making it much easier
   to extend in the future.
- All tests use the low level API and can now be viewed as examples.

Breaking:
- Morfix high level APIs are no longer present as they would fail upon more complex
   functions and ultimately because they didn't ease the burden of learning SEAL.

## Version 2.2.2

Feat:
- Replaced the previous base64 implementation
- Saving/loading from strings is now much faster

## Version 2.2.1

Feat:
- Compiled with intrinsics (wasm_simd128.h)
- Code execution should be noticeably faster (no benchmarks, yet)

## Version 2.2.0

Microsoft SEAL 3.4.5

Feat:
- Supporting [zlib](https://github.com/madler/zlib) - `deflate` is by default enabled.
- SecretKeys will be saved with no compression for security. This can be overridden.

## Version 2.1.14

Microsoft SEAL 3.4.5

No updates to core library functionality.

## Version 2.1.13

Feat:
- Upgraded emscripten to LLVM backend
- Code size is now ~10% smaller
 
## Version 2.1.12

Refactor:
- Library initialization is now slightly faster as it is done on callback instead of a timer checking a ready state
 
Chore:
- Updated emsdk toolchain to be on the latest version
- Build scripts now build a static SEAL library which is then converted to JS
- Build scripts now include an additional argument to remove `import.meta.url` from the output build from webpack
 
## Version 2.1.11

Refactor:
- Moved all emscripten dependent code that was added to Microsoft SEAL to bindings.cpp. This cleans up the codebase and
  leaves the SEAL library left untouched for future upstream merges.
  
Fix:
- Encryption Parameters loading/saving methods are now instance methods instead of static. Should not affect any
  users since we use an adapter class.
 
## Version 2.1.10

Chore:
- removed unused code that we aren't supporting for now (int64, complex double, etc)

## Version 2.1.9

Refactor:
- Renamed emscripten binding method to reflect previous change for the Exponentiate method that uses cast uint32_t
- Fixed a bug when passing in more than 2 parameters to `cipherTransformToNtt`

## Version 2.1.8

Refactor:
- Exponentiate method accepts an `exponent` as a uint32_t which is then cast to a uint64_t to be compatible
  with the native implementation. Reasonable exponentiations shouldn't exceede 2^32 in realistic use-cases.

## Version 2.1.7

Refactor:
- Conversion from JS TypedArrays and C++ Vectors (and vice versa) are now an order of magnitude faster
- Added `shrinkToFit` and `setZero` to PlainText
- Removed unused methods for the encoders which we do not support now (Int64, etc)
- Added `sizeCapacity` method to CipherText

## Version 2.1.6
 
 Bugfix:
  - `delete` method to prevent memory leak when objects are created with `inject` methods.
  
## Version 2.1.5

Added an Exception class to retrieve the human readable exception string thrown from emscripen.

## Version 2.1.4

Microsoft SEAL 3.4.4

No updates to core library functionality.

## Version 2.1.3

Microsoft SEAL 3.4.3

## Version 2.1.2

Microsoft SEAL 3.4.2

## Version 2.1.1

Microsoft SEAL 3.4.1

## Version 2.1.0

Microsoft SEAL 3.4.0

## Version 2.0.4

Microsoft SEAL 3.3.4

## Version 2.0.3

Microsoft SEAL 3.3.3

## Version 2.0.2

Microsoft SEAL 3.3.2

## Version 2.0.1

Microsoft SEAL 3.3.1

## Version 2.0.0

Microsoft SEAL 3.3.0

### Features
This version includes a core update to version 3.3.0 of Microsoft SEAL in web assembly. 

### API Changes

There is now an exposed low level API in web assembly which can be found in [src/lib/Seal.js](src/lib/Seal.js).
This can be used by more advanced users who wish to be as close to the original library as 
possible without much abstraction.
