import * as fs from 'fs';

export interface AdobeTypekitClient {
  getFamily: (familyId: string) => Promise<any>;
}

export const fontRepository = (dbPath: string, client: AdobeTypekitClient) => {
  const getAll = async (): Promise<any[]> => {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  };

  const save = async (family: any): Promise<void> => {
    const fonts = await getAll();
    const exists = fonts.find(f => f.id === family.id);
    if (!exists) {
      fonts.push(family);
      fs.writeFileSync(dbPath, JSON.stringify(fonts, null, 2));
    }
  };

  const fetch = async (familyId: string): Promise<any> => {
    const family = await client.getFamily(familyId);
    await save(family);
    return family;
  };

  return {
    getAll,
    save,
    fetch
  };
};
