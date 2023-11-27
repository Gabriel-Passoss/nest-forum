import { hash, compare } from 'bcryptjs'

import { HashComparer } from '@/domain/forum/application/crypto/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/crypto/hash-generator'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BCryptHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return hash(plain, 8)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
