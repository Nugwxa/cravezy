import request from 'supertest'
import express from 'express'

const app = express()

app.get('/test/:userId', (req, res) => {
  const { userId } = req.params
  res.send({ id: 'sui', userId })
})

describe('GET /test/:userId', () => {
  it('should respond with the correct userId', async () => {
    const userId = '12345'
    const response = await request(app).get(`/test/${userId}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: 'sui',
      userId: '12345',
    })
  })

  it('should return a 404 if no id is provided', async () => {
    // Not a good example but yeah, Just a test!
    const response = await request(app).get(`/test/`)

    expect(response.statusCode).toBe(404)
  })
})
