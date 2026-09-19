/** Shown both for URLs that don't match any route and for a valid route with an unknown id. */
export function renderNotFound(): string {
  return `
    <div class="not-found">
      <h1>Not found</h1>
      <p>There's nothing here. Try the <a href="/trip">list of trips</a> or the <a href="/video">list of videos</a>.</p>
    </div>
  `;
}
