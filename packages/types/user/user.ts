import { Pagination } from '../general'

type UserRole = 'EMPLOYEE' | 'MANAGER'

export type UserIdentifierDTO =
  | { id: string; email?: string }
  | { id?: string; email: string }

export interface UserDTO {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  registrationDate: Date
}

export interface CreateUserDTO extends Pick<UserDTO, 'name' | 'email'> {
  role?: UserRole
  isActive?: boolean
}

export interface UpdateUserDTO
  extends Omit<Partial<UserDTO>, 'registrationDate'> {
  id: string
}

export interface GetUsersDTO {
  pagination?: Pagination
}

export interface CountUsersDTO {
  id?: string
  email?: string
  pagination?: Pagination
}

// export interface UpdateUserDTO
const user: UpdateUserDTO = {
  id: '',
}
