import csv
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
INPUT = os.path.join(ROOT, 'data', 'restaurants.csv')
OUTPUT = os.path.join(ROOT, 'frontend', 'public', 'restaurants.json')

def main():
    restaurants = []
    with open(INPUT, encoding='utf-8') as f:
        for row in csv.DictReader(f):
            restaurants.append({
                'id': int(row['id']),
                'name': row['name'],
                'genre': row['genre'],
                'cuisine': row['cuisine'],
                'address': row['address'],
                'price_range': row['price_range'],
                'visited': row['visited'].lower() == 'true',
                'rating': float(row['rating']) if row['rating'] else None,
                'notes': row['notes'],
            })

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(restaurants, f, ensure_ascii=False, indent=2)

    print(f'変換完了: {len(restaurants)} 件 → {OUTPUT}')

if __name__ == '__main__':
    main()
