import * as XLSX from 'xlsx';

// ─── Publicaciones ────────────────────────────────────────────────────────────

export interface PubImportRow {
  _rowNum: number;
  titulo: string;
  autor: string;
  año: number | null;
  tipo: string;
  era: string;
  isbn: string;
  editorial: string;
  canon: boolean;
  paginas: number | null;
  descripcion: string;
  valid: boolean;
  errors: string[];
}

const VALID_TIPOS = ['novela', 'comic', 'antologia', 'audiolibro'];

// Normaliza nombres de era del Excel al valor canónico del timeline
const ERA_ALIASES: Record<string, string> = {
  'imperio galactico':            'Reinado del Imperio',
  'reinado del imperio':          'Reinado del Imperio',
  'republica galactica':          'Caída de los Jedi',
  'caida de los jedi':            'Caída de los Jedi',
  'rebelion':                     'Era de la Rebelión',
  'era de la rebelion':           'Era de la Rebelión',
  'republica antigua':            'Antigua República',
  'antigua republica':            'Antigua República',
  'primera orden':                'Ascenso de la Primera Orden',
  'ascenso de la primera orden':  'Ascenso de la Primera Orden',
  'era legado':                   'Ascenso de la Primera Orden',
  'nueva orden jedi':             'Ascenso de la Primera Orden',
  'imperio galactico / nueva republica': 'Nueva República',
  'antes de la republica':        'Amanecer Jedi',
  'amanecer jedi':                'Amanecer Jedi',
  'alta republica':               'Alta República',
  'nueva republica':              'Nueva República',
};

// Variantes aceptadas que se normalizan a un tipo válido
const TIPO_ALIASES: Record<string, string> = {
  'novela juvenil': 'novela',
  'young adult': 'novela',
  'junior': 'novela',
  'cómic': 'comic',
  'comics': 'comic',
  'antología': 'antologia',
  'anthology': 'antologia',
  'audio': 'audiolibro',
  'audiobook': 'audiolibro',
};

function normKey(k: string): string {
  return k.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function parsePubRow(rawRaw: Record<string, unknown>, rowNum: number): PubImportRow {
  // Normalizar claves a minúsculas sin acentos para tolerar MAYÚSCULAS y variantes
  const raw: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rawRaw)) raw[normKey(k)] = v;

  const errors: string[] = [];

  const titulo = String(raw['titulo'] ?? '').trim();
  const autor = String(raw['autor'] ?? '').trim();
  const añoRaw = raw['ano'] ?? raw['year'] ?? null;
  const año = añoRaw !== null && añoRaw !== '' ? Number(añoRaw) : null;

  if (!titulo) errors.push('título requerido');
  if (!autor) errors.push('autor requerido');
  if (año === null || isNaN(año)) errors.push('año requerido');

  const tipoRaw = String(raw['tipo'] ?? raw['type'] ?? 'novela').trim().toLowerCase();
  const tipoNorm = TIPO_ALIASES[tipoRaw] ?? tipoRaw;
  const tipo = VALID_TIPOS.includes(tipoNorm) ? tipoNorm : 'novela';

  const canonRaw = String(raw['canon'] ?? 'si').trim().toLowerCase();
  const canon = canonRaw !== 'no';

  const paginasRaw = raw['paginas'] ?? raw['pages'] ?? null;
  const paginas = paginasRaw !== null && paginasRaw !== '' ? Number(paginasRaw) : null;

  return {
    _rowNum: rowNum,
    titulo,
    autor,
    año,
    tipo,
    era: (() => { const e = String(raw['era'] ?? '').trim(); return ERA_ALIASES[normKey(e)] ?? e; })(),
    isbn: String(raw['isbn'] ?? '').trim(),
    editorial: String(raw['editorial'] ?? raw['publisher'] ?? '').trim(),
    canon,
    paginas: paginas !== null && !isNaN(paginas) ? paginas : null,
    descripcion: String(raw['descripcion'] ?? '').trim(),
    valid: errors.length === 0,
    errors,
  };
}

export function parsePubExcel(file: File): Promise<PubImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });
        resolve(rows.map((r, i) => parsePubRow(r, i + 2)));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function downloadPubTemplate(): void {
  const headers = ['titulo', 'autor', 'año', 'tipo', 'era', 'isbn', 'editorial', 'canon', 'paginas', 'descripcion'];
  const example = ['Heredero del Imperio', 'Timothy Zahn', 1991, 'novela', 'Nueva República', '978-0553296129', 'Bantam', 'si', 385, ''];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 4, 18) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Publicaciones');
  XLSX.writeFile(wb, 'plantilla_publicaciones.xlsx');
}

// ─── Colecciones ─────────────────────────────────────────────────────────────

export interface ColImportRow {
  _rowNum: number;
  nombre: string;
  autor: string;
  era: string;
  canon: boolean;
  descripcion: string;
  valid: boolean;
  errors: string[];
}

function parseColRow(rawRaw: Record<string, unknown>, rowNum: number): ColImportRow {
  const raw: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rawRaw)) raw[normKey(k)] = v;

  const errors: string[] = [];

  const nombre = String(raw['nombre'] ?? raw['name'] ?? '').trim();
  if (!nombre) errors.push('nombre requerido');

  const canonRaw = String(raw['canon'] ?? 'si').trim().toLowerCase();
  const canon = canonRaw !== 'no';

  return {
    _rowNum: rowNum,
    nombre,
    autor: String(raw['autor'] ?? raw['author'] ?? '').trim(),
    era: String(raw['era'] ?? '').trim(),
    canon,
    descripcion: String(raw['descripcion'] ?? '').trim(),
    valid: errors.length === 0,
    errors,
  };
}

export function parseColExcel(file: File): Promise<ColImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });
        resolve(rows.map((r, i) => parseColRow(r, i + 2)));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function downloadColTemplate(): void {
  const headers = ['nombre', 'autor', 'era', 'canon', 'descripcion'];
  const example = ['Saga Thrawn', 'Timothy Zahn', 'Nueva República', 'si', ''];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 4, 20) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Colecciones');
  XLSX.writeFile(wb, 'plantilla_colecciones.xlsx');
}
