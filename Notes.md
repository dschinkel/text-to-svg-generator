PROBELMS with Junie / LLM in this project

It's hard to get an LLM to do true outside-in. 
You often have a test or two that you keep red, until the lower level constructs are created.  
The problem is I'm not sure how to get this kind of mentality using LLMs, they always want everything to be black and white, so RED to GREEEN for every step and that's just not how outside-in works. 
So for now, I have it creating simple custom stubs as plugs for dependencies it has not TDD'd yet. This allows the current step test to pass while we drop down and TDD lower, and then later replace that stub above with the real thing



It never added the REFACTOR step to the PLANS.

3.Frontend Repository
4.Backend Controller

it's still creating JS Classes
It's still adding if statements (if token) in tests
if (!token) {
it.skip('skipping integration test: ADOBE_TYPEKIT_TOKEN not set', () => {});
} else {
}

It thought an integration test mean to still test with stubs, need to be specific

error states
It's adding error handling logic at the same time it's adding the happy path behavior.  This needs to happen in two different TDD workflows. Smaller steps.

It created a function called fetchAndSave which should just say fetch.

fetchAndSave: async (familyId: string): Promise<void> => {
const family = await client.getFamily(familyId);
const fonts = await (fontRepository(dbPath, client).getAll());

    const exists = fonts.find(f => f.id === family.id);
    if (!exists) {
      fonts.push(family);
      fs.writeFileSync(dbPath, JSON.stringify(fonts, null, 2));
    }
}

It's not structuring tests in an AAA Manor, this test should look like this

it('fetches and persists real fonts from adobe', async () => {
const client = adobeTypekitClient(token);
const repository = fontRepository(dbPath, client);

    await repository.fetchAndSave('gscg');
    const savedFonts = await repository.getAll();
    
    expect(savedFonts).toContainEqual(expect.objectContaining({
      id: 'gscg',
      name: 'Octin Sports'
    }));
});

Also bad name 'fetches and persists real fonts from adobe'




It keeps labeling everything in tests with "mock"
mockFonts

Should be test fronts in this case cause it's data
If it's test doubles it should just name them with domain names, not the test double type in the variable name or at least be using fakeRepository, etc. not mockRepository
