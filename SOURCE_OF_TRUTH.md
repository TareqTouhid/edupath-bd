# EduPath BD Source of Truth

The deployable production source is the project root.

Do not deploy from `_deploy_current/`; that folder is a historical staging snapshot and is ignored by Vercel.

Core runtime data should flow through:

- Browser: `window.EduPathDB` from `db/edupath-core.js`
- Server/API: `loadEduPathData()` from `api/lib/edupath-data.js`
- Live admin overlay: `central-db/edupath-overlay.json` in Vercel Blob, exposed publicly through `/api/data-overlay`

Primary data inputs:

- `db/subjects_db.js` - 55 undergraduate subject profiles, HSC rules, curricula, BCS relevance
- `db/jobs_db.js` - structured job and salary records
- `db/hsc_mapping.js` - HSC subject and interest mappings
- `university-subjects.js` - subject-to-university and known seat counts
- `db/testimonials_db.js` - reviewed static testimonial records
- Vercel Blob `testimonials/pending/` and `testimonials/approved/` - submitted and approved live testimonials
- Vercel Blob `central-db/edupath-overlay.json` - admin-added universities, subjects, offerings, seats, jobs, and search reinforcement signals

Admin surfaces:

- `/admin/` - central DB portal for manual entry, CSV upload, URL extraction, draft review, and JSON editing
- `/admin/testimonials.html` - testimonial review and approval

Current compatibility data still exists:

- `extracted/pfdata.js`
- `extracted/subject-universities.js`
- `extracted/career-data.js`

These should be treated as legacy compatibility sources until all screens fully render from `EduPathDB`.
