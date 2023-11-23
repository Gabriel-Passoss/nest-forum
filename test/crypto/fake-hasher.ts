import { HashComparer } from '@/domain/forum/application/crypto/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/crypto/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
