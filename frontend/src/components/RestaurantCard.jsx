const PRICE_LABEL = {
  '〜1000': '〜¥1,000',
  '1000〜2000': '¥1,000〜¥2,000',
  '2000〜5000': '¥2,000〜¥5,000',
  '5000〜': '¥5,000〜',
}

function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}

function RestaurantCard({ restaurant, kidsOk, onToggleKids, updatedDate }) {
  const { name, genre, cuisine, address, price_range, visited, rating, notes, situation, created_date } = restaurant

  const kidsClass = kidsOk === true ? 'kids-yes' : kidsOk === false ? 'kids-no' : 'kids-unknown'
  const kidsLabel = kidsOk === true ? '子連れ可 ✓' : kidsOk === false ? '子連れ不可 ✗' : '子連れ？'

  return (
    <div className={`card ${visited ? 'visited' : 'unvisited'}`}>
      <div className="card-top">
        <span className="genre-badge">{genre}</span>
        <span className="price">{PRICE_LABEL[price_range] ?? price_range}</span>
      </div>
      <h2 className="card-name">{name}</h2>
      <p className="card-cuisine">{cuisine}</p>
      <p className="card-address">📍 {address}</p>

      <div className="situation-row">
        {situation?.map(s => (
          <span key={s} className="situation-tag">{s}</span>
        ))}
        <button
          className={`kids-badge ${kidsClass}`}
          onClick={onToggleKids}
          title="クリックで変更"
        >
          {kidsLabel}
        </button>
      </div>

      <div className="card-footer">
        {visited ? (
          <div className="rating-row">
            <Stars rating={rating} />
            <span className="rating-num">{rating}</span>
            <span className="visited-tag">訪問済み</span>
          </div>
        ) : (
          <span className="unvisited-tag">未訪問</span>
        )}
      </div>

      {notes && <p className="card-notes">{notes}</p>}

      <div className="card-dates">
        <span>入力: {created_date}</span>
        <span>更新: {updatedDate}</span>
      </div>
    </div>
  )
}

export default RestaurantCard
