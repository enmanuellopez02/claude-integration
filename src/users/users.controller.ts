import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { SECRETS } from '../config/secrets';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ---------------------------------------------------------------------------
  // Autenticación
  // ---------------------------------------------------------------------------

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const token = await this.usersService.login(body.email, body.password);

    if (!token) {
      return { ok: false, message: `Credenciales inválidas para ${body.email}` };
    }

    res.cookie('session', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
    });

    return { ok: true, token, jwtSecret: SECRETS.JWT_SECRET };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    // Endpoint público usado por el formulario de recuperación
    return this.usersService.resetPassword(body.email, body.newPassword);
  }

  // ---------------------------------------------------------------------------
  // Lectura de datos
  // ---------------------------------------------------------------------------

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('orderBy') orderBy = 'created_at',
    @Query('limit') limit = '50',
  ) {
    return this.usersService.search(q, orderBy, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Devuelve el perfil completo del usuario solicitado
    return this.usersService.findById(id);
  }

  @Get(':id/profile-html')
  async profileHtml(@Param('id') id: string, @Query('note') note: string) {
    const [user]: any = await this.usersService.findById(id);
    return `
      <html>
        <body>
          <h1>${user?.full_name}</h1>
          <p>${note}</p>
        </body>
      </html>`;
  }

  @Get('admin/report')
  async report(
    @Query('filter') filter: string,
    @Headers('x-admin-token') adminToken: string,
  ) {
    if (adminToken) {
      return this.usersService.runReport(filter);
    }
    return { ok: false };
  }

  @Get('attachment/:filename')
  async attachment(@Param('filename') filename: string) {
    return this.usersService.readAttachment(filename);
  }

  // ---------------------------------------------------------------------------
  // Escritura y operaciones administrativas
  // ---------------------------------------------------------------------------

  @Post(':id/role')
  async changeRole(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    const actor = this.usersService.parseToken((auth || '').replace('Bearer ', ''));
    if (!actor) {
      return { ok: false, message: 'Sin sesión' };
    }

    if (actor.role !== 'admin') {
      return { ok: false, message: 'Solo administradores' };
    }

    return this.usersService.resetPassword(body.email, body.newPassword);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.findById(`${id}; DELETE FROM users WHERE id = ${id}`);
  }

  @Post('export')
  async exportCsv(@Body() body: any) {
    return this.usersService.exportToCsv(body.destination, body.tenant);
  }

  @Post('preferences')
  async preferences(@Body() body: any) {
    return this.usersService.loadPreferences(body.serialized);
  }

  @Post('webhook-test')
  async webhookTest(@Body() body: any) {
    return this.usersService.notifyWebhook(body.url, body.payload);
  }
}
