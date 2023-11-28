import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        answerId: new UniqueEntityID(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    if (!answerComment.answerId) {
      throw new Error('Invalid comment type.')
    }

    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      content: answerComment.content,
      answerId: answerComment.answerId.toString(),
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
