# WebFreelanceHub: Team Portfolio

Mumbai ki freelance web development team ka animated portfolio website, jisme **admin panel** hai. Content (team, projects, reviews) code badle bina admin panel se update hota hai.

**Stack:** HTML + CSS + JavaScript (no build step) · Supabase (database, login, image storage) · GitHub (code) · static hosting (Netlify / Cloudflare Pages / Vercel)

---

## 1. Website mein kya hai

| Section | Data kahan se aata hai |
| --- | --- |
| Hero, About, Services, Process, Pricing, FAQ, Contact | Code mein likha hai (`index.html`, FAQ `main.js` mein) |
| **Team** | Supabase table `team` |
| **Projects** | Supabase table `projects` |
| **Reviews** | Supabase table `reviews` (sirf **approved** wale) |
| **Contact messages** | Visitor ka message Supabase table `messages` mein save hota hai |

### Pages
- `index.html`: main one-page portfolio
- `projects.html`: "See all projects" page (saare projects)
- `admin.html`: admin panel (login ke baad). Iska link public menu mein nahi hai, seedha `/admin.html` kholna padta hai

### Features
- Animated hero (particles, floating blobs, typing text, gradient text), cursor glow aur custom cursor
- Scroll reveal, 3D tilt cards, magnetic buttons, number counters, scroll progress bar
- Dark / Light mode toggle (choice browser mein yaad rehti hai)
- Projects: **Live Projects** aur **All Projects** tabs, main page par max 6 cards, uske baad "See all projects" button
- Reviews: sirf approved reviews dikhte hain, na ho to "Reviews coming soon"
- Chatbot (Services, Pricing, Timeline, Contact) aur floating WhatsApp button
- Contact form: message database mein save hota hai **aur** WhatsApp khulta hai
- SEO: meta tags, Open Graph, structured data, `robots.txt`, `sitemap.xml`
- Mobile friendly, reduced-motion setting ka respect

---

## 2. Folder structure

```
team-portfolio/
├── index.html          Main portfolio page
├── projects.html       All projects page
├── admin.html          Admin panel
├── robots.txt          Search engine rules
├── sitemap.xml         Search engine sitemap
├── README.md           Ye file
├── css/
│   └── style.css       Poora design + animations + dark/light theme
├── js/
│   ├── supabase.js     Supabase connection (URL + publishable key)
│   ├── common.js       Shared helpers: project card, "live" logic
│   ├── main.js         Main page: render, animations, live data, chatbot, form
│   ├── projects.js     projects.html ka logic
│   └── admin.js        Admin panel: login + add/edit/delete (CRUD)
├── database/
│   └── schema.sql      Supabase tables, security rules, images bucket
└── images/
    ├── og.png          Share preview image (1200x630)
    └── (team photos, screenshots)
```

---

## 3. Ye kaise kaam karta hai

```
Admin (admin.html) --login--> Supabase (database + images)
                                    |
                                    v
Visitor (index.html / projects.html) <-- data padhta hai
```

1. Admin `admin.html` par login karke project / team / review add karta hai. Images Supabase ke `images` bucket mein upload hoti hain.
2. Visitor ka browser `main.js` ke through Supabase se data padhta hai aur cards banata hai. **Redeploy ki zaroorat nahi**, admin mein badlo aur site par refresh karo.
3. Agar tables khali hain to `main.js` ke andar ke **dummy team/projects** dikhte hain (design dekhne ke liye). Asli data add hote hi wo replace ho jate hain.

### Important rules
- **Live project** = jis project mein *Live demo URL* bhara ho. Khali ho to wo sirf "All Projects" mein dikhta hai.
- **Review** public tabhi hota hai jab admin mein **Approved** ho.
- Cards ke buttons (Live Demo / GitHub) tabhi dikhte hain jab link bhara ho.
- Team ka order `Order` field se tay hota hai (chhota number pehle).

---

## 4. Setup (pehli baar)

### A. Supabase
1. `supabase.com` par project banao.
2. **SQL Editor** mein `database/schema.sql` ka poora code paste karke **Run** karo (tables, security aur `images` bucket ban jayenge).
3. **Authentication → Users → Add user**: admin ka email + password (Auto Confirm ON).
4. **Authentication → Sign In / Providers**: **Allow new users to sign up** ko **OFF** karo. *Ye zaroori hai*, warna koi bhi bahar wala account bana ke admin ban sakta hai.
5. **Project Settings → API Keys** se **Project URL** aur **publishable (anon) key** copy karo.

### B. Keys daalo
`js/supabase.js` mein:

```js
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-PUBLISHABLE-KEY';
```

> Publishable / anon key frontend mein daalna safe hai, kyunki database ko RLS policies protect karti hain.
> **`service_role` / secret key kabhi code mein ya GitHub par mat daalna.**

### C. Placeholders badlo
| Kya | Kahan | Kaise |
| --- | --- | --- |
| `91XXXXXXXXXX` (WhatsApp number) | `index.html` (1 jagah), `js/main.js` (2 jagah) | `91` + 10 digit, bina `+` ya space |
| `YOUR-SITE.vercel.app` (site ka link) | `index.html`, `robots.txt`, `sitemap.xml` | Deploy ke baad asli link |
| Team / projects / pricing | `js/main.js` ke upar ke arrays, `index.html` ka Pricing section | Asli details |

### D. Local mein chalao
VS Code mein **Live Server** extension se `index.html` par right click → **Open with Live Server**. (Seedha double-click karne se kuch browser features limited ho sakte hain.)

---

## 5. Admin panel kaise use karna hai

`https://your-site/admin.html` → email + password se login.

| Tab | Kya kar sakte ho |
| --- | --- |
| **Projects** | Add / Edit / Delete, screenshot upload, tech (comma se alag), live demo + GitHub link |
| **Team** | Add / Edit / Delete, photo upload, skills, order |
| **Reviews** | Add / Edit / Delete, **Approve / Unapprove** |
| **Messages** | Contact form ke messages padhna aur delete karna |

**Image tips:** 200-300 KB se kam rakho (team photo square, project screenshot ~800x500). Badi images site slow karti hain aur storage jaldi bharti hai.

---

## 6. Deploy (site ko online daalna)

1. Code GitHub repo (`WebFreelanceHub/team-portfolio`) mein push karo.
2. Hosting par repo import karo: **Framework: Other**, Build command **khali**, Output directory **khali** (ya root).
3. Deploy ke baad link milega. Phir `YOUR-SITE...` wali jagah asli link daalo aur push karo.
4. Custom domain optional hai (hosting ki Settings → Domains).

> **Hosting note:** Vercel ka free Hobby plan officially non-commercial use ke liye hai. Freelance business ki site ke liye **Netlify** ya **Cloudflare Pages** safer hain (deploy ka tareeka almost same).

### Update karna
```bash
git add .
git commit -m "update"
git push
```
Push karte hi hosting par site apne aap update ho jati hai. Content badalna ho to sirf admin panel kaafi hai.

---

## 7. Dhyan rakhne wali baatein

- **Supabase free plan:** 7 din inactivity ke baad project pause ho jata hai. Dashboard se **Resume** kar sakte ho. Limits badalti rehti hain, `supabase.com/pricing` check karte raho.
- **Admin password** strong rakho aur kisi ko mat do. `admin.html` ka link public menu mein mat daalo.
- **Demo data:** testing ke liye daale hue demo projects / reviews / team members live site dikhane se pehle hata do. Fake reviews clients ka bharosa tod sakte hain.
- Reviews ke liye client ki **permission** lo.
- Images ke naam mein space ya special characters mat rakho (admin upload mein ye apne aap saaf ho jate hain).

---

## 8. Common problems

| Problem | Reason / Fix |
| --- | --- |
| Admin login nahi ho raha (`Invalid login credentials`) | Admin user Supabase mein bana nahi, ya email/password galat |
| `new row violates row-level security` | Login nahi hai, ya `schema.sql` poora run nahi hua |
| Site par data nahi aa raha, dummy dikh raha hai | `js/supabase.js` mein URL/key galat, ya tables khali hain. Browser `F12` → **Console** dekho |
| Reviews nahi dikh rahe | Admin mein review **Approved** nahi hai |
| Project "Live Projects" tab mein nahi aa raha | Uska **Live demo URL** khali hai |
| "See all projects" button nahi dikh raha | Total projects 6 ya kam hain |
| Photo nahi dikh rahi | File ka naam ya path galat. Admin se upload karna sabse aasan hai |
| Site 7 din baad band lag rahi hai | Supabase project pause ho gaya, dashboard se Resume karo |
| Purani site dikh rahi hai | Browser cache. `Ctrl + Shift + R` |

---

## 9. Aage ke ideas

- Visitors ke liye "Write a review" form (`approved = false` se aayega, admin approve karega)
- Blog / case study section
- Google Analytics ya hosting analytics
- Har project ke liye alag detail page
- Apna domain (lagbhag ₹500-800 per year)

---

**Team:** WebFreelanceHub, Mumbai, India
