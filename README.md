# Christina Holly Juarez Realty — Homepage

Static homepage for Christina Holly Juarez Realty, Valley Center & Pauma Valley, CA.
Plain HTML, CSS, and a small script. No build step, no dependencies.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page, all ten sections in order |
| `css/styles.css` | Styles (mobile-first) |
| `js/main.js` | Menu, quiz, contact form, and the three settings below |
| `assets/fonts/` | Fraunces and Inter, self-hosted (SIL Open Font License) |

To preview, open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Settings (top of `js/main.js`)

| Setting | What it does when filled in |
| --- | --- |
| `BOOKING_URL` | Every "Book a Seller Call" button opens this scheduling page. Empty: the buttons jump to the contact form. |
| `FORM_ENDPOINT` | The contact form posts here (Formspree, Basin, etc). |
| `GOOGLE_FORM_ACTION` + `GOOGLE_FORM_FIELDS` | The contact form quietly submits into a Google Form. Needs the form's `formResponse` address and each question's `entry.…` id (from the form's "Get pre-filled link"). |

With no form connection set, the contact form builds a ready-to-send text message to (760) 919-2548.
| `GOOGLE_REVIEWS_URL` | Shows a "Read all reviews on Google" link under the reviews. |

## Before launch: replace every placeholder

Search `index.html` for `PLACEHOLDER` to find each one.

- [ ] **Photos**: every block marked "Photo placeholder" (hero, spotlight, listings, browse tiles, sold stories, portrait)
- [ ] **Events**: real names, dates, and details in Very Valley Center
- [ ] **Local Spotlight**: a real local business or place, with their permission
- [ ] **Country Property Files**: real listings only (real address, price, specs)
- [ ] **Reviews**: real Google reviews, pasted word for word with name and date
- [ ] **Sold stories**: real closed sales only
- [ ] **Meet Christina**: confirm the bio wording is accurate
- [ ] **Locals Guide**: decide how it gets delivered (PDF, page, or text)
- [ ] **Settings**: connect the contact form (booking link and Google reviews link are set)

## Content rules

1. **Nothing invented.** No made-up stats, listings, reviews, people, or event dates. If it isn't real yet, it stays a placeholder.
2. **Describe the property, not the buyer.** Say what a home offers (acreage, a barn, a single-story layout). Never say who it is for.
3. **Reviews are verbatim.** Copy them from Google exactly. No edits, no paraphrasing.
4. **License on every page.** Christina Holly Juarez, Broker, CA DRE #01832633.

## Brand

- Deep Eucalyptus `#1F3D2B`, Warm Cream `#FAF7F0`, Muted Gold `#C9A227`
- Fraunces for headlines, Inter for body
- Tagline: *Small by design. Personal by default.*
