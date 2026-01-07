import * as fs from 'fs';

export interface AdobeTypekitClient {
  getFamily: (familyId: string) => Promise<any>;
}

export const fontRepository = (dbPath: string, client: AdobeTypekitClient) => {
  const fetch = async (familyId: string): Promise<any> => {
    const family = await client.getFamily(familyId);
    if (!family) {
      return null;
    }
    if (family.css_stack === 'sans-serif') {
      family.css_stack = `"${family.slug}", sans-serif`;
    }
    await save(family);
    return family;
  };

  const save = async (family: any): Promise<void> => {
    const fonts = await getAll();
    const index = fonts.findIndex(f => f.id === family.id);
    if (index === -1) {
      fonts.push(family);
    } else {
      fonts[index] = family;
    }
    fs.writeFileSync(dbPath, JSON.stringify(fonts, null, 2));
  };

  const getAll = async (): Promise<any[]> => {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  };

  return {
    getAll,
    save,
    fetch
  };
};
