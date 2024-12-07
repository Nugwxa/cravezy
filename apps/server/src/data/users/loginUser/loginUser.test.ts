import { supabase } from '@/lib/supabase'
import loginUser from './loginUser'

// Mock the supabase library
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}))

describe('loginUser Function', () => {
  const mockValidEmail = 'test@example.com'
  const mockValidPassword = 'validPassword123'

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should successfully log in and return access token', async () => {
    // Mock successful login response
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: {
        session: {
          access_token: 'mock-access-token',
        },
      },
      error: null,
    })

    const result = await loginUser({
      email: mockValidEmail,
      password: mockValidPassword,
    })

    expect(result).toEqual({
      statusCode: 200,
      success: true,
      message: 'Logged In',
      data: 'mock-access-token',
    })

    // Verify supabase method was called with correct parameters
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: mockValidEmail,
      password: mockValidPassword,
    })
  })

  it('should handle invalid credentials', async () => {
    // Mock invalid credentials error
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: {
        code: 'invalid_credentials',
        message: 'Invalid email or password',
      },
    })

    const result = await loginUser({
      email: mockValidEmail,
      password: 'wrongpassword',
    })

    expect(result).toEqual({
      statusCode: 401,
      success: false,
      message: 'Invalid email or password',
    })
  })

  it('should handle unexpected Supabase errors', async () => {
    // Mock unexpected Supabase error
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: {
        code: 'some_unexpected_error',
        message: 'Unexpected database error',
      },
    })

    const result = await loginUser({
      email: mockValidEmail,
      password: mockValidPassword,
    })

    // Update the test to check the returned object instead of throwing an error
    expect(result).toEqual({
      statusCode: 500,
      success: false,
      message: 'Database user login error: Unexpected database error',
    })
  })

  it('should handle network or other unexpected errors', async () => {
    // Mock network error
    ;(supabase.auth.signInWithPassword as jest.Mock).mockRejectedValue(
      new Error('Network connection error')
    )

    const result = await loginUser({
      email: mockValidEmail,
      password: mockValidPassword,
    })

    expect(result).toEqual({
      statusCode: 500,
      success: false,
      message: 'Network connection error',
    })
  })
})
