import { Injectable } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { BacklogService } from '../backlog/backlog.service';
import { ConsolesService } from '../consoles/consoles.service';
import { PeripheralsService } from '../peripherals/peripherals.service';
import { CategoriesService } from '../categories/categories.service';
import { AttributesService } from '../attributes/attributes.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ExportService {
  constructor(
    private gamesService: GamesService,
    private backlogService: BacklogService,
    private consolesService: ConsolesService,
    private peripheralsService: PeripheralsService,
    private categoriesService: CategoriesService,
    private attributesService: AttributesService,
  ) {}

  async exportToExcel(): Promise<Buffer> {
    const workbook = XLSX.utils.book_new();

    // Export Games
    const games = this.gamesService.findAll();
    const gamesSheet = XLSX.utils.json_to_sheet(games.map(g => ({
      ID: g.id,
      Title: g.title,
      'Alternate Titles': g.alternateTitles?.join('; ') || '',
      'Cover Art': g.coverArt,
      'Release Date': g.releaseDate,
      Platform: g.platform,
      'Console ID': g.consoleId || '',
      'Physical/Digital': g.physicalDigital,
      'Category IDs': g.categoryIds.join('; '),
      'Custom Attributes': JSON.stringify(g.customAttributes),
      'Created At': g.createdAt,
      'Updated At': g.updatedAt,
    })));
    XLSX.utils.book_append_sheet(workbook, gamesSheet, 'Games');

    // Export Backlog
    const backlogs = this.backlogService.findAll();
    const backlogSheet = XLSX.utils.json_to_sheet(backlogs.map(b => ({
      ID: b.id,
      'Game ID': b.gameId,
      'Completion Date': b.completionDate,
      'Ending Type': b.endingType,
      'Completion Type': b.completionType,
      'Custom Attributes': JSON.stringify(b.customAttributes),
      'Created At': b.createdAt,
    })));
    XLSX.utils.book_append_sheet(workbook, backlogSheet, 'Backlog');

    // Export Consoles
    const consoles = this.consolesService.findAll();
    const consolesSheet = XLSX.utils.json_to_sheet(consoles.map(c => ({
      ID: c.id,
      Name: c.name,
      Developer: c.developer,
      'Release Date': c.releaseDate,
      Picture: c.picture,
      Region: c.region,
      Color: c.color,
      Model: c.model,
      'Custom Attributes': JSON.stringify(c.customAttributes),
      'Created At': c.createdAt,
      'Updated At': c.updatedAt,
    })));
    XLSX.utils.book_append_sheet(workbook, consolesSheet, 'Consoles');

    // Export Peripherals
    const peripherals = this.peripheralsService.findAll();
    const peripheralsSheet = XLSX.utils.json_to_sheet(peripherals.map(p => ({
      ID: p.id,
      Name: p.name,
      'Console ID': p.consoleId,
      Quantity: p.quantity,
      Color: p.color,
      'Custom Attributes': JSON.stringify(p.customAttributes),
      'Created At': p.createdAt,
      'Updated At': p.updatedAt,
    })));
    XLSX.utils.book_append_sheet(workbook, peripheralsSheet, 'Peripherals');

    // Export Categories
    const categories = this.categoriesService.findAll();
    const categoriesSheet = XLSX.utils.json_to_sheet(categories.map(c => ({
      ID: c.id,
      Name: c.name,
      Type: c.type,
      Description: c.description || '',
      'Created At': c.createdAt,
    })));
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Categories');

    // Export Attributes
    const attributes = this.attributesService.findAll();
    const attributesSheet = XLSX.utils.json_to_sheet(attributes.map(a => ({
      ID: a.id,
      Name: a.name,
      Type: a.type,
      Options: a.options?.join('; ') || '',
      'Is Global': a.isGlobal,
      'Created At': a.createdAt,
    })));
    XLSX.utils.book_append_sheet(workbook, attributesSheet, 'Attributes');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async importFromExcel(buffer: Buffer): Promise<any> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const result = {
      imported: {
        games: 0,
        backlogs: 0,
        consoles: 0,
        peripherals: 0,
        categories: 0,
        attributes: 0,
      },
      errors: [],
    };

    // Import Consoles first (referenced by games and peripherals)
    if (workbook.SheetNames.includes('Consoles')) {
      const consolesSheet = workbook.Sheets['Consoles'];
      const consolesData = XLSX.utils.sheet_to_json(consolesSheet);
      for (const row of consolesData as any[]) {
        try {
          this.consolesService.create({
            name: row.Name,
            developer: row.Developer,
            releaseDate: row['Release Date'],
            picture: row.Picture,
            region: row.Region,
            color: row.Color,
            model: row.Model,
            customAttributes: row['Custom Attributes'] ? JSON.parse(row['Custom Attributes']) : {},
          });
          result.imported.consoles++;
        } catch (error) {
          result.errors.push(`Console import error: ${error.message}`);
        }
      }
    }

    // Import Categories
    if (workbook.SheetNames.includes('Categories')) {
      const categoriesSheet = workbook.Sheets['Categories'];
      const categoriesData = XLSX.utils.sheet_to_json(categoriesSheet);
      for (const row of categoriesData as any[]) {
        try {
          this.categoriesService.create({
            name: row.Name,
            type: row.Type,
            description: row.Description,
          });
          result.imported.categories++;
        } catch (error) {
          result.errors.push(`Category import error: ${error.message}`);
        }
      }
    }

    // Import Attributes
    if (workbook.SheetNames.includes('Attributes')) {
      const attributesSheet = workbook.Sheets['Attributes'];
      const attributesData = XLSX.utils.sheet_to_json(attributesSheet);
      for (const row of attributesData as any[]) {
        try {
          this.attributesService.create({
            name: row.Name,
            type: row.Type,
            options: row.Options ? row.Options.split('; ') : undefined,
            isGlobal: row['Is Global'],
          });
          result.imported.attributes++;
        } catch (error) {
          result.errors.push(`Attribute import error: ${error.message}`);
        }
      }
    }

    // Import Games
    if (workbook.SheetNames.includes('Games')) {
      const gamesSheet = workbook.Sheets['Games'];
      const gamesData = XLSX.utils.sheet_to_json(gamesSheet);
      for (const row of gamesData as any[]) {
        try {
          this.gamesService.create({
            title: row.Title,
            alternateTitles: row['Alternate Titles'] ? row['Alternate Titles'].split('; ') : undefined,
            coverArt: row['Cover Art'],
            releaseDate: row['Release Date'],
            platform: row.Platform,
            consoleId: row['Console ID'] || undefined,
            physicalDigital: row['Physical/Digital'],
            categoryIds: row['Category IDs'] ? row['Category IDs'].split('; ') : [],
            customAttributes: row['Custom Attributes'] ? JSON.parse(row['Custom Attributes']) : {},
          });
          result.imported.games++;
        } catch (error) {
          result.errors.push(`Game import error: ${error.message}`);
        }
      }
    }

    // Import Backlog
    if (workbook.SheetNames.includes('Backlog')) {
      const backlogSheet = workbook.Sheets['Backlog'];
      const backlogData = XLSX.utils.sheet_to_json(backlogSheet);
      for (const row of backlogData as any[]) {
        try {
          this.backlogService.create({
            gameId: row['Game ID'],
            completionDate: row['Completion Date'],
            endingType: row['Ending Type'],
            completionType: row['Completion Type'],
            customAttributes: row['Custom Attributes'] ? JSON.parse(row['Custom Attributes']) : {},
          });
          result.imported.backlogs++;
        } catch (error) {
          result.errors.push(`Backlog import error: ${error.message}`);
        }
      }
    }

    // Import Peripherals
    if (workbook.SheetNames.includes('Peripherals')) {
      const peripheralsSheet = workbook.Sheets['Peripherals'];
      const peripheralsData = XLSX.utils.sheet_to_json(peripheralsSheet);
      for (const row of peripheralsData as any[]) {
        try {
          this.peripheralsService.create({
            name: row.Name,
            consoleId: row['Console ID'],
            quantity: row.Quantity,
            color: row.Color,
            customAttributes: row['Custom Attributes'] ? JSON.parse(row['Custom Attributes']) : {},
          });
          result.imported.peripherals++;
        } catch (error) {
          result.errors.push(`Peripheral import error: ${error.message}`);
        }
      }
    }

    return result;
  }
}