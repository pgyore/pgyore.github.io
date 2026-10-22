// Placement IDs: 9 Crockford base32 characters plus Crockford's mod-37 check symbol.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const CHECK = ALPHABET + "*~$=U";

function parse(raw) {
  const s = raw.trim().toUpperCase().replace(/^\$/, "").replace(/[\s-]/g, "").replace(/O/g, "0").replace(/[IL]/g, "1");
  if (s.length !== 10) return null;
  let r = 0;
  for (const c of s.slice(0, 9)) {
    const v = ALPHABET.indexOf(c);
    if (v < 0) return null;
    r = (r * 32 + v) % 37;
  }
  return CHECK[r] === s[9] ? s : null;
}

const display = id => `$${id.slice(0, 4)}-${id.slice(4, 8)}-${id.slice(8)}`;

const raw = new URLSearchParams(location.search).get("id") ?? decodeURIComponent(location.hash.slice(1));
const id = raw ? parse(raw) : null;
const view = !raw ? "about" : id ? "invite" : "invalid";
for (const el of document.querySelectorAll("[data-view]")) el.hidden = el.dataset.view !== view;

if (id) {
  document.title = `Placement ${display(id)} · Corporate Links`;
  document.getElementById("placement-id").textContent = display(id);
  document.getElementById("open").href = `corporatelinks://placement/${encodeURIComponent(id)}`;
  const copy = document.getElementById("copy");
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(display(id));
      copy.textContent = "Copied";
    } catch {
      copy.textContent = "Copy failed: select the ID above";
    }
  });
}
