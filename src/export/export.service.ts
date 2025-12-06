import { Injectable } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { BacklogService } from '../backlog/backlog.service';
import { ConsolesService } from '../consoles/consoles.service';
import { ConsoleFamiliesService } from '../console-families/console-families.service';
import { PeripheralsService } from '../peripherals/peripherals.service';
import { CategoriesService } from '../categories/categories.service';
import { AttributesService } from '../attributes/attributes.service';
import * as XLSX from 'xlsx';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PathLike, readFileSync } from 'fs';

@Injectable()
export class ExportService {
  constructor(
    private gamesService: GamesService,
    private backlogService: BacklogService,
    private consolesService: ConsolesService,
    private consoleFamiliesService: ConsoleFamiliesService,
    private peripheralsService: PeripheralsService,
    private categoriesService: CategoriesService,
    private attributesService: AttributesService,
  ) {}

  async exportToExcel(): Promise<string> {
    const workbook = XLSX.utils.book_new();

    // Export Console Families
    const families = this.consoleFamiliesService.findAll();
    const familiesSheet = XLSX.utils.json_to_sheet(
      families.map((f) => ({
        ID: f.id,
        Name: f.name,
        Developer: f.developer,
        Generation: f.generation || '',
        'Created At': f.createdAt,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, familiesSheet, 'Console Families');

    // Export Games
    const games = this.gamesService.findAll();
    const gamesSheet = XLSX.utils.json_to_sheet(
      games.map((g) => ({
        ID: g.id,
        Title: g.title,
        'Alternate Titles': g.alternateTitles?.join('; ') || '',
        'Cover Art': g.coverArt,
        'Release Date': g.releaseDate,
        'Console Family ID': g.consoleFamilyId,
        'Console ID': g.consoleId || '',
        Developer: g.developer,
        Region: g.region,
        'Physical/Digital': g.physicalDigital,
        'Category IDs': g.categoryIds.join('; '),
        'Custom Attributes': JSON.stringify(g.customAttributes),
        'Created At': g.createdAt,
        'Updated At': g.updatedAt,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, gamesSheet, 'Games');

    // Export Backlog
    const backlogs = this.backlogService.findAll();
    const backlogSheet = XLSX.utils.json_to_sheet(
      backlogs.map((b) => ({
        ID: b.id,
        'Game ID': b.gameId,
        'Completion Date': b.completionDate,
        'Ending Type': b.endingType,
        'Completion Type': b.completionType,
        'Custom Attributes': JSON.stringify(b.customAttributes),
        'Created At': b.createdAt,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, backlogSheet, 'Backlog');

    // Export Consoles
    const consoles = this.consolesService.findAll();
    const consolesSheet = XLSX.utils.json_to_sheet(
      consoles.map((c) => ({
        ID: c.id,
        'Console Family ID': c.consoleFamilyId,
        'Release Date': c.releaseDate,
        Picture: c.picture,
        Region: c.region,
        Color: c.color,
        Model: c.model,
        'Custom Attributes': JSON.stringify(c.customAttributes),
        'Created At': c.createdAt,
        'Updated At': c.updatedAt,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, consolesSheet, 'Consoles');

    // Export Peripherals
    const peripherals = this.peripheralsService.findAll();
    const peripheralsSheet = XLSX.utils.json_to_sheet(
      peripherals.map((p) => ({
        ID: p.id,
        Name: p.name,
        'Console Family ID': p.consoleFamilyId,
        Quantity: p.quantity,
        Color: p.color,
        Picture: p.picture,
        'Custom Attributes': JSON.stringify(p.customAttributes),
        'Created At': p.createdAt,
        'Updated At': p.updatedAt,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, peripheralsSheet, 'Peripherals');

    // Export Categories
    const categories = this.categoriesService.findAll();
    const categoriesSheet = XLSX.utils.json_to_sheet(
      categories.map((c) => ({
        ID: c.id,
        Name: c.name,
        Type: c.type,
        Description: c.description || '',
        'Created At': c.createdAt,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Categories');

    // Export Attributes
    const attributes = this.attributesService.findAll();
    const attributesSheet = XLSX.utils.json_to_sheet(
      attributes.map((a) => ({
        ID: a.id,
        Name: a.name,
        Type: a.type,
        Options: a.options?.join('; ') || '',
        'Is Global': a.isGlobal,
        'Created At': a.createdAt,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, attributesSheet, 'Attributes');

    // --- FILE GENERATION AND SAVING ---

    // 1. Generate the file buffer
    const buffer: Buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    // 2. Define the output path
    const fileName = `game-inventory.xlsx`;

    // Define an 'exports' directory relative to the project root
    const exportDir = path.join(process.cwd(), 'exports');
    const filePath = path.join(exportDir, fileName);

    // 3. Ensure the output directory exists (recursive: true prevents error if it already exists)
    await fs.mkdir(exportDir, { recursive: true });

    // 4. Save the file (this will now overwrite the existing file if it exists)
    await fs.writeFile(filePath, buffer);

    return `Successfully exported all inventory data. File saved at: ${filePath}`;

    // return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async importFromExcel(buffer?: Buffer): Promise<any> {
    let workbook: XLSX.WorkBook;
    const localFilePath: PathLike = './exports/game-inventory.xlsx';
    if (buffer) {
      workbook = XLSX.read(buffer, { type: 'buffer' });
    } else {
      try {
        const localBuffer = readFileSync(localFilePath);
        workbook = XLSX.read(localBuffer, { type: 'buffer' });
        console.log(
          `No buffer provided. Successfully loaded workbook from local file: ${localFilePath}`,
        );
      } catch (error) {
        console.error('Error reading default local Excel file:', error);
        throw new Error(
          `Import failed: No buffer provided and failed to read the default local file at ${localFilePath}.`,
        );
      }
    }
    const result = {
      imported: {
        consoleFamilies: 0,
        games: 0,
        backlogs: 0,
        consoles: 0,
        peripherals: 0,
        categories: 0,
        attributes: 0,
      },
      errors: [],
    };

    const existingIds = {
      consoleFamilies: new Set(
        this.consoleFamiliesService.findAll().map((f) => f.id),
      ),
      games: new Set(this.gamesService.findAll().map((g) => g.id)),
      backlogs: new Set(this.backlogService.findAll().map((b) => b.id)),
      consoles: new Set(this.consolesService.findAll().map((c) => c.id)),
      peripherals: new Set(this.peripheralsService.findAll().map((p) => p.id)),
      categories: new Set(this.categoriesService.findAll().map((c) => c.id)),
      attributes: new Set(this.attributesService.findAll().map((a) => a.id)),
    };

    // Import Console Families first
    if (workbook.SheetNames.includes('Console Families')) {
      const sheet = workbook.Sheets['Console Families'];
      const data = XLSX.utils.sheet_to_json(sheet);
      for (const row of data as any[]) {
        try {
          const id = row.ID;
          if (id && !existingIds.consoleFamilies.has(id)) {
            this.consoleFamiliesService.create(
              {
                name: row.Name,
                developer: row.Developer,
                generation: row.Generation,
              },
              id,
            );
            result.imported.consoleFamilies++;
          }
        } catch (error) {
          result.errors.push(`Console family import error: ${error.message}`);
        }
      }
    }

    // Import Consoles
    if (workbook.SheetNames.includes('Consoles')) {
      const sheet = workbook.Sheets['Consoles'];
      const data = XLSX.utils.sheet_to_json(sheet);
      for (const row of data as any[]) {
        try {
          const id = row.ID;
          if (id && !existingIds.consoles.has(id)) {
            this.consolesService.create(
              {
                consoleFamilyId: row['Console Family ID'],
                releaseDate: row['Release Date'],
                picture: row.Picture,
                region: row.Region,
                color: row.Color,
                model: row.Model,
                customAttributes: row['Custom Attributes']
                  ? JSON.parse(row['Custom Attributes'])
                  : {},
              },
              id,
            );
            result.imported.consoles++;
          }
        } catch (error) {
          result.errors.push(`Console import error: ${error.message}`);
        }
      }
    }

    // Import Categories
    if (workbook.SheetNames.includes('Categories')) {
      const sheet = workbook.Sheets['Categories'];
      const data = XLSX.utils.sheet_to_json(sheet);
      for (const row of data as any[]) {
        try {
          const id = row.ID;
          if (id && !existingIds.categories.has(id)) {
            this.categoriesService.create(
              {
                name: row.Name,
                type: row.Type,
                description: row.Description,
              },
              id,
            );
            result.imported.categories++;
          }
        } catch (error) {
          result.errors.push(`Category import error: ${error.message}`);
        }
      }
    }

    // Import Attributes
    if (workbook.SheetNames.includes('Attributes')) {
      const sheet = workbook.Sheets['Attributes'];
      const data = XLSX.utils.sheet_to_json(sheet);
      for (const row of data as any[]) {
        try {
          const id = row.ID;
          if (id && !existingIds.attributes.has(id)) {
            this.attributesService.create(
              {
                name: row.Name,
                type: row.Type,
                options: row.Options ? row.Options.split('; ') : undefined,
                isGlobal: row['Is Global'],
              },
              id,
            );
            result.imported.attributes++;
          }
        } catch (error) {
          result.errors.push(`Attribute import error: ${error.message}`);
        }
      }
    }

    // Import Games
    if (workbook.SheetNames.includes('Games')) {
      const sheet = workbook.Sheets['Games'];
      const data = XLSX.utils.sheet_to_json(sheet);
      for (const row of data as any[]) {
        try {
          const id = row.ID;
          if (id && !existingIds.games.has(id)) {
            this.gamesService.create(
              {
                title: row.Title,
                alternateTitles: row['Alternate Titles']
                  ? row['Alternate Titles'].split('; ').filter((t) => t)
                  : undefined,
                coverArt: row['Cover Art'],
                releaseDate: row['Release Date'],
                consoleFamilyId: row['Console Family ID'],
                consoleId: row['Console ID'] || undefined,
                developer: row.Developer,
                region: row.Region,
                physicalDigital: row['Physical/Digital'],
                categoryIds: row['Category IDs']
                  ? row['Category IDs'].split('; ').filter((c) => c)
                  : [],
                customAttributes: row['Custom Attributes']
                  ? JSON.parse(row['Custom Attributes'])
                  : {},
              },
              id,
            );
            result.imported.games++;
          }
        } catch (error) {
          result.errors.push(`Game import error: ${error.message}`);
        }
      }
    }

    // Import Backlog - MUST be after games
    if (workbook.SheetNames.includes('Backlog')) {
      const sheet = workbook.Sheets['Backlog'];
      const data = XLSX.utils.sheet_to_json(sheet);
      for (const row of data as any[]) {
        try {
          const id = row.ID;
          if (id && !existingIds.backlogs.has(id)) {
            this.backlogService.create(
              {
                gameId: row['Game ID'],
                completionDate: row['Completion Date'] || null,
                endingType: row['Ending Type'],
                completionType: row['Completion Type'],
                customAttributes: row['Custom Attributes']
                  ? JSON.parse(row['Custom Attributes'])
                  : {},
              },
              id,
            );
            result.imported.backlogs++;
          }
        } catch (error) {
          result.errors.push(`Backlog import error: ${error.message}`);
        }
      }
    }

    // Import Peripherals
    if (workbook.SheetNames.includes('Peripherals')) {
      const sheet = workbook.Sheets['Peripherals'];
      const data = XLSX.utils.sheet_to_json(sheet);
      for (const row of data as any[]) {
        try {
          const id = row.ID;
          if (id && !existingIds.peripherals.has(id)) {
            this.peripheralsService.create(
              {
                name: row.Name,
                consoleFamilyId: row['Console Family ID'],
                quantity: row.Quantity,
                color: row.Color,
                picture: row.Picture,
                customAttributes: row['Custom Attributes']
                  ? JSON.parse(row['Custom Attributes'])
                  : {},
              },
              id,
            );
            result.imported.peripherals++;
          }
        } catch (error) {
          result.errors.push(`Peripheral import error: ${error.message}`);
        }
      }
    }

    return result;
  }
}
