// Google Apps Script: スプレッドシートのデータをJSON APIとして公開する
// デプロイ方法: デプロイ → 新しいデプロイ → ウェブアプリ → アクセス: 全員
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const [headers, ...rows] = sheet.getDataRange().getValues();

  const restaurants = rows.map((row, i) => {
    const r = Object.fromEntries(headers.map((h, j) => [h, row[j]]));
    return {
      id: i + 1,
      name: r.name,
      genre: r.genre,
      cuisine: r.cuisine,
      address: r.address,
      price_range: r.price_range,
      visited: r.visited === true || r.visited === 'TRUE' || r.visited === 'true',
      rating: r.rating || null,
      notes: r.notes || '',
    };
  });

  return ContentService
    .createTextOutput(JSON.stringify(restaurants))
    .setMimeType(ContentService.MimeType.JSON);
}
