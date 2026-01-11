import * as fs from 'fs';

export interface AdobeTypekitClient {
  getFamily: (familyId: string) => Promise<any>;
}

export const fontRepository = (dbPath: string, client: AdobeTypekitClient) => {
  const fetch = async (familyId: string): Promise<any> => {
    const variationsToTry = [familyId, `${familyId}-sans`, `${familyId}-wide` ];
    const families = [];

    for (const v of variationsToTry) {
      const family = await client.getFamily(v);
      if (family) {
        families.push(family);
      }
    }

    if (families.length === 0) {
      return null;
    }

    // Merge all matches into a single virtual family for the UI
    const primaryFamily = families[0];
    const allVariations = families.flatMap(f => f.variations || []);
    
    // De-duplicate variations by ID
    const uniqueVariations = Array.from(new Map(allVariations.map(v => [v.id, v])).values());

    const mergedFamily = {
      ...primaryFamily,
      id: familyId, // Use the searched ID as the family ID
      name: familyId.charAt(0).toUpperCase() + familyId.slice(1),
      variations: uniqueVariations
    };

    if (mergedFamily.css_stack === 'sans-serif') {
      mergedFamily.css_stack = `"${primaryFamily.slug}", sans-serif`;
    }

    await save(mergedFamily);
    return mergedFamily;
  };

  const save = async (family: any): Promise<void> => {
    const fonts = await getAll();
    const index = fonts.findIndex(f => 
      f.id === family.id || 
      (f.slug && family.slug && f.slug === family.slug) || 
      (f.name && family.name && f.name.toLowerCase() === family.name.toLowerCase())
    );
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

  const remove = async (id: string): Promise<void> => {
    const fonts = await getAll();
    const filtered = fonts.filter(f => f.id !== id);
    fs.writeFileSync(dbPath, JSON.stringify(filtered, null, 2));
  };

  return {
    getAll,
    save,
    fetch,
    remove
  };
};
