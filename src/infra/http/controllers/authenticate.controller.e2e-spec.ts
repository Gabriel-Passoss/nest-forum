import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()

    await prisma.user.create({
      data: {
        name: 'Jhon Doe',
        email: 'jhondoe@email.com',
        password: await hash('123456', 8),
      },
    })
  })

  it('Should be able to authenticate an account', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jhondoe@email.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  it('Not should be able to authenticate with wrong password', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jhondoe@email.com',
      password: '123123',
    })

    expect(response.statusCode).toBe(401)
  })

  it('Not should be able to authenticate with wrong email', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jhondoee@email.com',
      password: '123123',
    })

    expect(response.statusCode).toBe(401)
  })
})
