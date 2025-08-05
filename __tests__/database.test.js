import { addEntry, getEntries, deleteEntry, initDB } from '../src/database';

describe('Database Operations', () => {
  beforeAll(async () => {
    // Initialize the database before all tests
    initDB();
  });

  it('should add an entry', async () => {
    const uri = 'file:///test/photo1.jpg';
    const title = 'Test Photo 1';
    const result = await addEntry(uri, title);
    expect(result).toBe('Entry added successfully');
  });

  it('should retrieve entries', async () => {
    const entries = await getEntries();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].uri).toBe('file:///test/photo1.jpg');
    expect(entries[0].title).toBe('Test Photo 1');
  });

  it('should delete an entry', async () => {
    const entries = await getEntries();
    const idToDelete = entries[0].id;
    const result = await deleteEntry(idToDelete);
    expect(result).toBe('Entry deleted successfully');
    const updatedEntries = await getEntries();
    expect(updatedEntries.length).toBe(entries.length - 1);
  });
});


