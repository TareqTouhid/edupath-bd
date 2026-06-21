# EduPath BD — Master Database Schema

## 1. subjects.js
```js
window.DB_Subjects = [
  {
    slug: "cse",
    name: "Computer Science & Engineering",
    field: "Engineering & Technology",
    desc: "...",
    hsc_groups: ["science"],                          // which HSC groups can apply
    hsc_subjects_required: ["Physics", "Mathematics"], // must-have HSC subjects
    hsc_subjects_preferred: ["Higher Mathematics", "ICT"], // bonus match
    ssc_subjects: ["Mathematics", "Science"],
    curriculum: {                                      // scraped 4-year outline
      year1: ["Structured Programming", "Calculus I", "Physics", "..."],
      year2: ["Data Structures", "Algorithms", "Database Systems", "..."],
      year3: ["Operating Systems", "Computer Networks", "AI", "..."],
      year4: ["Thesis", "Machine Learning", "Distributed Systems", "..."]
    },
    jobs: ["software-engineer", "data-scientist", "system-analyst"],
    interests: ["coding", "mathematics", "problem-solving", "technology"],
    admission_units: { "du": "Kha", "buet": "A", "kuet": "A" }
  }
]
```

## 2. universities.js (expanded)
```js
window.DB_Universities = [
  {
    id: "buet",
    name: "Bangladesh University of Engineering & Technology",
    short: "BUET",
    type: "public",
    city: "Dhaka",
    division: "Dhaka",
    website: "https://www.buet.ac.bd",
    departments: [
      {
        name: "Computer Science & Engineering",
        degree: "B.Sc. Engineering",
        subject_slug: "cse",
        seats: 120,
        duration_years: 4,
        min_ssc_gpa: 4.0,
        min_hsc_gpa: 4.0,
        admission_unit: "A"
      }
    ]
  }
]
```

## 3. jobs.js
```js
window.DB_Jobs = [
  {
    slug: "software-engineer",
    title: "Software Engineer",
    related_subjects: ["cse", "eee"],
    description: "...",
    salary: {
      bd: {
        entry: { min: 30000, max: 60000 },
        mid:   { min: 60000, max: 150000 },
        senior: { min: 150000, max: 400000 },
        currency: "BDT", unit: "monthly"
      },
      abroad: {
        usa:       { entry_min: 75000, entry_max: 110000, currency: "USD", unit: "yearly" },
        canada:    { entry_min: 65000, entry_max: 90000,  currency: "CAD", unit: "yearly" },
        uk:        { entry_min: 35000, entry_max: 55000,  currency: "GBP", unit: "yearly" },
        australia: { entry_min: 75000, entry_max: 100000, currency: "AUD", unit: "yearly" },
        uae:       { entry_min: 120000,entry_max: 220000, currency: "AED", unit: "yearly" },
        germany:   { entry_min: 45000, entry_max: 65000,  currency: "EUR", unit: "yearly" }
      },
      references: [
        { source: "Bdjobs Salary Report 2024", url: "https://..." },
        { source: "LinkedIn Salary Insights", url: "https://..." }
      ]
    }
  }
]
```

## 4. hsc_mapping.js
```js
window.DB_HSCMapping = {
  science: {
    subjects: ["Physics", "Chemistry", "Biology", "Higher Mathematics", "Mathematics", "ICT"],
    maps_to: {
      "Physics":            ["cse","eee","civil-engineering","mechanical-engineering","physics","architecture"],
      "Chemistry":          ["chemistry","pharmacy","chemical-engineering","food-tech"],
      "Biology":            ["botany","zoology","pharmacy","agriculture","fisheries","genetics"],
      "Higher Mathematics": ["cse","eee","civil-engineering","mechanical-engineering","mathematics","statistics"],
      "Mathematics":        ["cse","eee","mathematics","statistics","physics","economics"],
      "ICT":                ["cse","eee","information-technology"]
    }
  },
  commerce: {
    subjects: ["Accounting", "Business Studies", "Finance & Banking", "Economics", "Statistics", "ICT"],
    maps_to: {
      "Accounting":         ["accounting","finance-banking","bba"],
      "Business Studies":   ["bba","management","marketing","hrm"],
      "Finance & Banking":  ["finance-banking","economics","bba","accounting"],
      "Economics":          ["economics","development-studies","public-administration","statistics"],
      "Statistics":         ["statistics","economics","mathematics","cse"],
      "ICT":                ["cse","information-technology","bba"]
    }
  },
  arts: {
    subjects: ["Bangla", "English", "History", "Civics", "Islamic Studies", "Geography", "Sociology", "Economics"],
    maps_to: {
      "Bangla":             ["bangla","journalism","history","philosophy"],
      "English":            ["english","journalism","law","development-studies"],
      "History":            ["history","political-science","islamic-studies","philosophy"],
      "Civics":             ["political-science","public-administration","law","sociology"],
      "Islamic Studies":    ["islamic-studies","arabic","history","philosophy"],
      "Geography":          ["geography","environmental-science","agriculture","geology"],
      "Sociology":          ["sociology","social-work","anthropology","development-studies"],
      "Economics":          ["economics","development-studies","bba","statistics"]
    }
  }
}
```
