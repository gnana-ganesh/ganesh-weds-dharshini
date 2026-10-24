# gnanaganesh-weds-dharshini.gnanaganesh.in

Standalone mobile-friendly wedding invitation site (no build step — plain HTML/CSS/JS).

Sections: hero invitation · countdown · families · agenda · venue map · RSVP · traditional drone music toggle · add-to-calendar.

## 1. Edit placeholders

- `index.html` — names, venue, agenda times, Google Maps link, phone numbers
- `script.js` — `WEDDING_DATE` (top of file)
- Map embed: Google Maps → venue → Share → Embed a map → paste `src` into the `<iframe>` in `#venue`

## 2. Preview locally

```sh
cd /Users/gnanaganesh/ws/ganesh-weds-dharshini
python3 -m http.server 4322
# open http://localhost:4322
```

## 3. Deploy (Vercel, new project)

Your main site `gnanaganesh.in` is on Vercel; DNS is on Spaceship.

```sh
cd /Users/gnanaganesh/ws/ganesh-weds-dharshini
git init && git add -A && git commit -m "wedding invitation"
gh repo create ganesh-weds-dharshini --public --source=. --push
```

Then: Vercel dashboard → Add New → Project → import `ganesh-weds-dharshini` → Deploy (no framework preset needed, static).

## 4. Point the subdomain to it

1. Vercel → wedding project → Settings → Domains → add `gnanaganesh-weds-dharshini.gnanaganesh.in`
2. Vercel will show a CNAME target, usually `cname.vercel-dns.com`
3. Spaceship → domain `gnanaganesh.in` → DNS → add record:
   - Type: `CNAME`, Host: `ganesh-weds-dharshini`, Value: `cname.vercel-dns.com`, TTL: auto
4. Wait 5–60 min, open `https://gnanaganesh-weds-dharshini.gnanaganesh.in`

Do NOT point it at the main `gnanaganesh.in` project — that would serve your portfolio on both domains.
