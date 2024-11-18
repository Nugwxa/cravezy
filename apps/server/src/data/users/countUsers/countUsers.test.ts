import countUsers from './countUsers'
import prisma from '@/lib/prisma'

// Mock the Prisma client
jest.mock('@/lib/prisma', () => ({
  user: {
    count: jest.fn(),
  },
}))

describe('countUsers', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Success Cases', () => {
    it('should return total count of users when no filters are provided', async () => {
      const mockCount = 10
      ;(prisma.user.count as jest.Mock).mockResolvedValue(mockCount)

      const result = await countUsers()

      expect(result).toEqual({
        success: true,
        message: expect.stringContaining('count'),
        data: mockCount,
        statusCode: 200,
      })
      expect(prisma.user.count).toHaveBeenCalledWith({
        where: {},
        skip: undefined,
        take: undefined,
      })
    })

    it('should filter users by ID when provided', async () => {
      const mockCount = 1
      const mockId = 'test-id-123'
      ;(prisma.user.count as jest.Mock).mockResolvedValue(mockCount)

      const result = await countUsers({ id: mockId })

      expect(result).toEqual({
        success: true,
        message: expect.stringContaining('count'),
        data: mockCount,
        statusCode: 200,
      })
      expect(prisma.user.count).toHaveBeenCalledWith({
        where: { id: mockId },
        skip: undefined,
        take: undefined,
      })
    })

    it('should apply pagination when options are provided', async () => {
      // Mock data for paginated results
      const mockCount = 5
      const pagination = { page: 2, perPage: 10 }
      ;(prisma.user.count as jest.Mock).mockResolvedValue(mockCount)

      const result = await countUsers({ pagination })

      expect(result).toEqual({
        success: true,
        message: expect.stringContaining('count'),
        data: mockCount,
        statusCode: 200,
      })
      // Verify skip is calculated as (page - 1) * perPage
      expect(prisma.user.count).toHaveBeenCalledWith({
        where: {},
        skip: 10, // (2-1) * 10
        take: 10,
      })
    })
  })

  describe('Validation Cases', () => {
    it('should return validation error for invalid pagination parameters', async () => {
      // Mock invalid input data
      const invalidInput = {
        pagination: { page: -1, perPage: 0 },
      }

      const result = await countUsers(invalidInput)

      // Verify the error response and that database was not called
      expect(result.success).toBe(false)
      expect(result.statusCode).toBe(400)
      expect(result.message).toBe('Invalid input')
      expect(result.errors).toBeDefined() // Kinda redundant but hey ¯\_(ツ)_/¯
      expect(result.errors).toContain('Invalid page')
      expect(result.errors).toContain('Must have at least 1 item on a page')
      expect(result.data).toBeUndefined()
      expect(prisma.user.count).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock console.error to prevent output during test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      // Mock Prisma to throw an error
      ;(prisma.user.count as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const result = await countUsers()

      // Verify error handling and response
      expect(result).toEqual({
        success: false,
        message: expect.stringContaining('unexpected'),
        statusCode: 500,
      })
      // Verify error was logged with correct message
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error counting users:',
        expect.any(Error)
      )

      // Cleanup: Restore console.error to its original implementation
      consoleSpy.mockRestore()
    })
  })
})
