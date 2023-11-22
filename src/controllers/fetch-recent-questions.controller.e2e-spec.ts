import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent question (E2E)', () => {
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

    await prisma.question.createMany({
      data: [
        {
          title: 'Test question',
          content: 'Testing to create a new question',
          slug: 'test-question',
          authorId: user.id,
        },
        {
          title: 'Test question 2',
          content: 'Testing to create a new question 2',
          slug: 'test-question-2',
          authorId: user.id,
        },
        {
          title: 'Test question 3',
          content: 'Testing to create a new question 3',
          slug: 'test-question-3',
          authorId: user.id,
        },
      ],
    })

    accessToken = jwt.sign({ sub: user.id })
  })

  it('Should be able to create a question', async () => {
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Test question' }),
        expect.objectContaining({ title: 'Test question 2' }),
        expect.objectContaining({ title: 'Test question 3' }),
      ],
    })
  })
})
