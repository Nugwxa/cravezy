import { CreateUserDTO } from '@shared/types/user'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import createUser from './createUser'
import prisma from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    user: {
      create: jest.fn(),
    },
  },
}))

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
  supabaseAdmin: {
    auth: {
      admin: {
        deleteUser: jest.fn(),
      },
    },
  },
}))

describe('createUser', () => {
  const mockValidUserData: CreateUserDTO = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'ValidPass123!',
    isActive: true,
    role: 'EMPLOYEE',
  }

  const mockSupabaseUser = {
    id: 'mock-uuid',
    email: 'test@example.com',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
  describe('Successful User Creation', () => {
    it('should create a user when all data is valid', async () => {
      // Supabase signup mock
      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockSupabaseUser },
        error: null,
      })

      // Prisma transaction mock
      const mockPrismaUser = {
        ...mockValidUserData,
        id: mockSupabaseUser.id,
      }

      // Mock transaction to simulate Prisma's transactional behavior
      const mockTransaction = jest.fn(async (callback) => {
        return callback({
          user: {
            create: jest.fn().mockResolvedValue(mockPrismaUser),
          },
        })
      })

      ;(prisma.$transaction as jest.Mock).mockImplementation(mockTransaction)

      const result = await createUser(mockValidUserData)

      expect(result).toEqual({
        success: true,
        data: expect.objectContaining({
          id: mockSupabaseUser.id,
          email: mockValidUserData.email,
        }),
        message: 'User created successfully',
        statusCode: 201,
      })

      // Verify Prisma transaction was called
      expect(prisma.$transaction).toHaveBeenCalled()
    })
  })

  describe('Input Validation', () => {
    it('should return validation error for invalid input data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123',
      } as CreateUserDTO

      const result = await createUser(invalidData)

      expect(result).toEqual({
        success: false,
        statusCode: 400,
        message: 'Invalid request',
        errors: expect.any(Object),
      })
    })

    it('should handle email already in use', async () => {
      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { code: 'user_already_exists', message: 'User already exists' },
      })

      const result = await createUser(mockValidUserData)

      expect(result).toEqual({
        success: false,
        statusCode: 409,
        message: 'Email already in use',
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle Prisma creation failure and cleanup Supabase user', async () => {
      // Mock successful Supabase signup
      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockSupabaseUser },
        error: null,
      })

      // Mock Prisma transaction to reject
      ;(prisma.$transaction as jest.Mock).mockRejectedValue(
        new Error('Prisma creation failed')
      )

      // Mock successful Supabase user deletion
      ;(supabaseAdmin.auth.admin.deleteUser as jest.Mock).mockResolvedValue({})

      const result = await createUser(mockValidUserData)

      expect(result).toEqual({
        success: false,
        message: expect.stringContaining('Prisma creation failed'),
        statusCode: 500,
      })
      expect(supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith(
        mockSupabaseUser.id
      )
    })

    it('should handle invalid Supabase user object', async () => {
      // Mock Supabase signup with invalid user object
      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: 'mock-uuid' } }, // Missing email
        error: null,
      })

      const result = await createUser(mockValidUserData)

      expect(result).toEqual({
        success: false,
        message: expect.stringContaining(
          'Missing email or invalid user object'
        ),
        statusCode: 500,
      })
    })

    it('should handle unexpected Supabase signup errors', async () => {
      // Mock unexpected Supabase signup error
      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Unexpected Supabase error' },
      })

      const result = await createUser(mockValidUserData)

      expect(result).toEqual({
        success: false,
        message: expect.stringContaining('Unexpected Supabase error'),
        statusCode: 500,
      })
    })
  })
})
