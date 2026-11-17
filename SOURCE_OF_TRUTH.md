# EduPath BD Source of Truth

EduPath BD is one product, deployed from the project root.

- `index.html` is the app. It is edited directly; there is no separate source it is generated from.
- Behaviour layered on top of it is loaded after it by these scripts: `ui-system.js`, `landing-override.js`, `matcher-override.js`, `no-footer.js`, `share-override.js`, `stories-override.js`.
- `subject/<slug>/index.html` pages are generated copies of `index.html` for SEO. After any change to `index.html`, run `python3 build_seo.py` and commit the result, or those pages go stale.
- `privacy.html` and `terms.html` are static drafts and need legal review.

Older versions (`pathfinder-bd.html`, `pathfinder-bd-v2.html`, `_deploy_current/`, `build.py` and the one-off patch scripts) were removed. They are recoverable from the git tag `pre-consolidation`.

## Data flow

- Browser: `window.EduPathDB` from `db/edupath-core.js`
- Server/API: `loadEduPathData()` from `server-lib/edupath-data.js`
- Live admin overlay: `central-db/edupath-overlay.json` in Vercel Blob, exposed publicly through `/api/data-overlay`

Primary data inputs:

- `db/subjects_db.js` - 55 undergraduate subject profiles, HSC rules, curricula, BCS relevance
- `db/jobs_db.js` - structured job and salary records
- `db/hsc_mapping.js` - HSC subject and interest mappings
- `university-subjects.js` - subject-to-university and known seat counts
- `db/testimonials_db.js` - reviewed static testimonial records
- Vercel Blob `testimonials/pending/` and `testimonials/approved/` - submitted and approved live testimonials. Submissions land in `pending` and are published only after approval at `/admin/testimonials.html`.
- Vercel Blob `central-db/edupath-overlay.json` - admin-added universities, subjects, offerings, seats, jobs, and search reinforcement signals

Admin surfaces:

- `/admin/` - central DB portal for manual entry, CSV upload, URL extraction, draft review, and JSON editing
- `/admin/testimonials.html` - testimonial review and approval

Compatibility data still present: `extracted/pfdata.js`, `extracted/subject-universities.js`, `extracted/career-data.js`. Treat as legacy until all screens render from `EduPathDB`.

## Deploying

Pushing to `main` builds a production deployment, but the `edupath-bd.vercel.app` domain is not moved automatically. Promote the new deployment in Vercel after it is Ready.
