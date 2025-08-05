let mockEntries = [{ id: 1, uri: 'file:///test/photo1.jpg', title: 'Test Photo 1' }];

export const openDatabase = jest.fn(() => ({
  transaction: jest.fn((callback) => {
    callback({
      executeSql: jest.fn((sql, params, success, error) => {
        if (sql.includes("CREATE TABLE")) {
          success();
        } else if (sql.includes("INSERT")) {
          const newId = mockEntries.length > 0 ? Math.max(...mockEntries.map(e => e.id)) + 1 : 1;
          mockEntries.push({ id: newId, uri: params[0], title: params[1] });
          success(null, { rowsAffected: 1 });
        } else if (sql.includes("SELECT")) {
          success(null, { rows: { length: mockEntries.length, item: (index) => mockEntries[index] } });
        } else if (sql.includes("DELETE")) {
          mockEntries = mockEntries.filter(entry => entry.id !== params[0]);
          success(null, { rowsAffected: 1 });
        } else {
          error(new Error("Mock SQL error"));
        }
      }),
    });
  }),
}));


