const UPLOADS_BASE = 'https://www.franchisepk.com/public/user_img';
const PARTNER_LOGO_BASE = 'https://www.franchisepk.com/public/Admin/partners';

export function imageUrl(filename: string | undefined | null): string | undefined {
  if (!filename) return undefined;
  if (filename.startsWith('http')) return filename;
  return `${UPLOADS_BASE}/${filename}`;
}

export function partnerLogoUrl(filename: string | undefined | null): string | undefined {
  if (!filename) return undefined;
  if (filename.startsWith('http')) return filename;
  return `${PARTNER_LOGO_BASE}/${filename}`;
}
