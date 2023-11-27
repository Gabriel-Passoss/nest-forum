import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/forum/application/crypto/encrypter'
import { HashGenerator } from '@/domain/forum/application/crypto/hash-generator'
import { HashComparer } from '@/domain/forum/application/crypto/hash-comparer'

import { JWTEncrypter } from './jwt-encrypter'
import { BCryptHasher } from './bcrypt-hasher'

@Module({
  imports: [],
  providers: [
    {
      provide: Encrypter,
      useClass: JWTEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BCryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BCryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptoModule {}
