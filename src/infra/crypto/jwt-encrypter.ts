import { Encrypter } from '@/domain/forum/application/crypto/encrypter'
import { JwtService } from '@nestjs/jwt'

export class JWTEncrypter implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}
