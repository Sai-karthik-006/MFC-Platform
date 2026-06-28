import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../responses/auth.response';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);