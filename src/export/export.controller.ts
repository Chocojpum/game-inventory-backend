import { Controller, Get, Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('excel')
  async exportToExcel(@Res() res: Response) {
    const buffer = await this.exportService.exportToExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=game-inventory.xlsx',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importFromExcel(@UploadedFile() file) {
    return this.exportService.importFromExcel(file.buffer);
  }
}