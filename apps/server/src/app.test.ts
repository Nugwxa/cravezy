import app from './app'
import request from 'supertest'

describe('Express App Test', () => {
  // Create a new supertest instance for each test
  const api = () => request(app)
  describe('Route handling', () => {
    // Test how the app handles undefined routes (404 cases)
    it('should return 404 for undefined endpoints', async () => {
      const response = await api().get('/undefined-endpoint')

      expect(response.status).toBe(404)
      expect(response.body).toMatchObject({
        success: false,
        message: expect.any(String),
      })
    })
  })

  describe('Error handling', () => {
    // Define test cases for different types of errors
    const errorCases = [
      {
        name: 'CORS error',
        errorType: 'cors',
        expectedStatus: 401,
        expectedBody: {
          success: false,
          message: 'CORS Error: Origin not allowed',
        },
      },
      {
        name: 'unexpected error',
        errorType: 'unexpected',
        expectedStatus: 500,
        expectedBody: {
          success: false,
          message: expect.stringContaining('Unexpected'), // Incase I change my mind on the format of this
        },
      },
    ] as const

    // Use it.each to run the same test structure with different test cases
    it.each(errorCases)(
      'should handle $name correctly',
      async ({ errorType, expectedStatus, expectedBody }) => {
        const response = await api()
          .get('/fake-endpoint')
          .set('x-simulate-error', errorType)

        expect(response.status).toBe(expectedStatus)
        expect(response.body).toMatchObject(expectedBody)
      }
    )
  })
})
