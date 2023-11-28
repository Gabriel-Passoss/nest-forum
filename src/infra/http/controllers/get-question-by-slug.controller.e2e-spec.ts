import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()

    const user = await prisma.user.create({
      data: {
        name: 'Jhon Doe',
        email: 'jhondoe@email.com',
        password: '123456',
      },
    })

    await prisma.question.create({
      data: {
        title: 'Test question',
        content: 'Testing to create a new question',
        slug: 'test-question',
        authorId: user.id,
      },
    })

    accessToken = jwt.sign({ sub: user.id })
  })

  it('Should be able to get a question by slug', async () => {
    const response = await request(app.getHttpServer())
      .get('/questions/test-question')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Test question' }),
    })
  })
})
