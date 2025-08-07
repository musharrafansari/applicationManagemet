import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    
    const user = request.user;
    console.log("user--->",user)
    let d = roles.includes(user.role);
    console.log("d->",d);
    
    return roles.includes(user.role);
  }
}