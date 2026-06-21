(function () {
  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function flattenUniversities(ugc) {
    ugc = ugc || {};
    return ["public", "private", "international"].flatMap(function (type) {
      return arr(ugc[type]).map(function (u) {
        return Object.assign({ type: type }, u);
      });
    });
  }

  function avg(rows) {
    return rows.length ? Math.round((rows.reduce(function (a, b) { return a + b; }, 0) / rows.length) * 10) / 10 : null;
  }

  function normalizeSubmittedTestimonial(t) {
    var subjectSlug = t.subjectSlug || t.undergradSubjectSlug;
    var subjectName = t.subjectName || t.undergradSubjectName;
    var university = t.undergradUniversity || t.university;
    return {
      id: t.id,
      schemaVersion: t.schemaVersion || 1,
      subjectSlug: subjectSlug,
      subjectName: subjectName,
      uni: university,
      university: university,
      currentCity: t.currentCity,
      currentCountry: t.currentCountry,
      hscGroup: t.hscGroup,
      session: t.session,
      role: [t.designation, t.profession].filter(Boolean).join(" · ") || t.jobTitle || t.currentStatus,
      again: String(t.wouldChooseAgain || "").toLowerCase(),
      chooseAgainReason: t.chooseAgainReason,
      good: t.goodExperience || t.bestPart,
      bad: t.badExperience || t.worstPart,
      whoShould: t.whoShouldTake || t.wishKnew,
      whoShouldNot: t.whoShouldNotTake,
      opportunities: t.futureOpportunities || t.jobTitle,
      currentStatus: t.currentStatus,
      academicPressure: t.academicPressure,
      facultyQuality: t.facultyQuality,
      jobReality: t.jobReality,
      subjectWorthRating: t.subjectWorthRating,
      source: "approved-submission",
      approvedAt: t.approvedAt
    };
  }

  function summarizeTestimonials(testimonials) {
    var bySubject = {};
    var byUniversity = {};
    arr(testimonials).forEach(function (t) {
      var subjectSlug = t.subjectSlug || t.undergradSubjectSlug || t.subject_slug;
      if (subjectSlug) {
        bySubject[subjectSlug] = bySubject[subjectSlug] || {
          count: 0,
          wouldAgainYes: 0,
          wouldAgainNo: 0,
          academicPressure: [],
          facultyQuality: [],
          jobReality: [],
          subjectWorthRating: [],
          whoShould: [],
          whoShouldNot: [],
          futureOpportunities: [],
          regretReasons: [],
          hscGroups: {},
          examples: []
        };
        var bucket = bySubject[subjectSlug];
        bucket.count += 1;
        var again = String(t.again || t.wouldChooseAgain || "").toLowerCase();
        if (again === "yes") bucket.wouldAgainYes += 1;
        if (again === "no") bucket.wouldAgainNo += 1;
        ["academicPressure", "facultyQuality", "jobReality", "subjectWorthRating"].forEach(function (key) {
          var n = Number(t[key]);
          if (Number.isFinite(n)) bucket[key].push(n);
        });
        if (t.whoShould || t.whoShouldTake) bucket.whoShould.push(t.whoShould || t.whoShouldTake);
        if (t.whoShouldNot || t.whoShouldNotTake) bucket.whoShouldNot.push(t.whoShouldNot || t.whoShouldNotTake);
        if (t.opportunities || t.futureOpportunities) bucket.futureOpportunities.push(t.opportunities || t.futureOpportunities);
        if (t.chooseAgainReason) bucket.regretReasons.push(t.chooseAgainReason);
        if (t.hscGroup) bucket.hscGroups[t.hscGroup] = (bucket.hscGroups[t.hscGroup] || 0) + 1;
        if (bucket.examples.length < 3) bucket.examples.push(t);
      }
      var uni = t.uni || t.undergradUniversity || t.university;
      if (uni) {
        byUniversity[uni] = byUniversity[uni] || { count: 0, subjects: {} };
        byUniversity[uni].count += 1;
        if (subjectSlug) byUniversity[uni].subjects[subjectSlug] = (byUniversity[uni].subjects[subjectSlug] || 0) + 1;
      }
    });
    Object.keys(bySubject).forEach(function (slug) {
      var bucket = bySubject[slug];
      bucket.avgAcademicPressure = avg(bucket.academicPressure);
      bucket.avgFacultyQuality = avg(bucket.facultyQuality);
      bucket.avgJobReality = avg(bucket.jobReality);
      bucket.avgSubjectWorthRating = avg(bucket.subjectWorthRating);
      bucket.wouldAgainRate = bucket.count ? Math.round((bucket.wouldAgainYes / bucket.count) * 100) : null;
      bucket.regretRate = bucket.count ? Math.round((bucket.wouldAgainNo / bucket.count) * 100) : null;
      bucket.whoShould = bucket.whoShould.slice(0, 3);
      bucket.whoShouldNot = bucket.whoShouldNot.slice(0, 3);
      bucket.futureOpportunities = bucket.futureOpportunities.slice(0, 3);
      bucket.regretReasons = bucket.regretReasons.slice(0, 3);
      delete bucket.academicPressure;
      delete bucket.facultyQuality;
      delete bucket.jobReality;
      delete bucket.subjectWorthRating;
    });
    return { bySubject: bySubject, byUniversity: byUniversity };
  }

  function bcs(subject) {
    var relevance = subject.bcs_relevance || "medium";
    var defaults = ["Admin", "Police", "Foreign", "Customs", "Taxation", "Audit & Accounts"];
    var map = {
      agriculture: ["Agriculture", "Fisheries", "Livestock", "Forest"],
      law: ["Judicial Service", "Admin", "Police"],
      economics: ["Economic", "Statistics", "Admin"],
      "public-administration": ["Admin", "Police", "Foreign", "Customs"],
      "political-science": ["Admin", "Police", "Foreign"],
      bangla: ["Education", "Admin"],
      english: ["Education", "Foreign", "Admin"],
      mathematics: ["Education", "Statistics"],
      statistics: ["Statistics", "Economic"],
      cse: ["ICT/general govt tech roles", "Admin"],
      eee: ["Technical roles where advertised", "Admin"]
    };
    return { relevance: relevance, relevant: relevance !== "low", cadre_options: map[subject.slug] || map[subject.field] || defaults };
  }

  function fourthSubjectRules(subject) {
    var mathHeavy = ["cse", "eee", "civil-engineering", "mechanical-engineering", "architecture", "physics", "mathematics", "statistics"];
    var bioHeavy = ["pharmacy", "botany", "zoology", "microbiology", "biochemistry", "biotechnology", "agriculture"];
    var rules = [];
    if (mathHeavy.indexOf(subject.slug) >= 0) {
      rules.push({
        condition: "Verify Higher Mathematics / admission-test mathematics requirements.",
        consequence: "Biology as optional without a strong math route can block or weaken eligibility at selective programs."
      });
    }
    if (bioHeavy.indexOf(subject.slug) >= 0) {
      rules.push({
        condition: "Biology background is strongly preferred and sometimes required.",
        consequence: "Students without Biology should verify each university circular before shortlisting."
      });
    }
    return rules;
  }

  function difficultyFlags(subject) {
    var hardWords = ["calculus", "algorithm", "data structures", "thermodynamics", "electromagnetic", "organic chemistry", "econometrics", "statistics", "quantum", "structural", "compiler", "operating systems", "thesis"];
    return arr(subject.curriculum).flatMap(function (phase) {
      return arr(phase.items).filter(function (item) {
        var lower = String(item).toLowerCase();
        return hardWords.some(function (word) { return lower.indexOf(word) >= 0; });
      }).slice(0, 3).map(function (item) {
        return {
          year: phase.year,
          course: item,
          risk: "weed-out",
          note: "Common pressure point for students who choose the subject by name rather than daily workload."
        };
      });
    }).slice(0, 8);
  }

  function build() {
    var subjects = arr(window.DB_Subjects);
    var jobs = arr(window.DB_Jobs);
    var ugc = window.UGCData || {};
    var universities = flattenUniversities(ugc);
    var universitiesById = Object.fromEntries(universities.map(function (u) { return [u.id, u]; }));
    var testimonials = arr(window.PFData && window.PFData.testimonials).concat(arr(window.DB_Testimonials));
    var stats = summarizeTestimonials(testimonials);
    var jobsBySubject = {};
    jobs.forEach(function (job) {
      arr(job.related_subjects).forEach(function (slug) {
        jobsBySubject[slug] = jobsBySubject[slug] || [];
        jobsBySubject[slug].push(job);
      });
    });
    var enrichedSubjects = subjects.map(function (subject) {
      var seatMap = (window.SubjectSeats || {})[subject.slug] || {};
      var ids = (window.SubjectUniIds || {})[subject.slug] || Object.keys(seatMap);
      var offerings = ids.map(function (id) {
        var uni = universitiesById[id] || { id: id, name: id.toUpperCase(), type: "unknown" };
        return {
          university_id: id,
          university_name: uni.name,
          university_short: uni.short || id.toUpperCase(),
          university_type: uni.type,
          city: uni.city,
          degree_name: subject.degree || subject.name,
          department: subject.name,
          subject_slug: subject.slug,
          subject_name: subject.name,
          seats: seatMap[id] || null
        };
      });
      return Object.assign({}, subject, {
        offerings: offerings,
        total_seats: Object.values(seatMap).reduce(function (sum, n) { return sum + (Number(n) || 0); }, 0),
        related_jobs: jobsBySubject[subject.slug] || [],
        testimonial_stats: stats.bySubject[subject.slug] || { count: 0, wouldAgainYes: 0, wouldAgainNo: 0 },
        bcs: bcs(subject),
        fourth_subject_rules: fourthSubjectRules(subject),
        difficulty_flags: difficultyFlags(subject)
      });
    });
    var subjectsBySlug = Object.fromEntries(enrichedSubjects.map(function (s) { return [s.slug, s]; }));
    function applyStats() {
      stats = summarizeTestimonials(testimonials);
      enrichedSubjects.forEach(function (subject) {
        subject.testimonial_stats = stats.bySubject[subject.slug] || { count: 0, wouldAgainYes: 0, wouldAgainNo: 0 };
      });
    }

    function applyOverlay(overlay) {
      if (!overlay) return;
      var uniMap = new Map(universities.map(function (u) { return [u.id, u]; }));
      arr(overlay.universities).forEach(function (u) {
        if (!u.id) return;
        uniMap.set(u.id, Object.assign({ type: u.type || "admin" }, uniMap.get(u.id) || {}, u));
      });
      universities.length = 0;
      universities.push.apply(universities, Array.from(uniMap.values()));
      universitiesById = Object.fromEntries(universities.map(function (u) { return [u.id, u]; }));

      var jobMap = new Map(jobs.map(function (j) { return [j.slug, j]; }));
      arr(overlay.jobs).forEach(function (j) {
        if (!j.slug) return;
        jobMap.set(j.slug, Object.assign({}, jobMap.get(j.slug) || {}, j));
      });
      jobs.length = 0;
      jobs.push.apply(jobs, Array.from(jobMap.values()));

      arr(overlay.subjects).forEach(function (s) {
        var existing = subjectsBySlug[s.slug];
        if (existing) Object.assign(existing, s);
        else {
          var subject = Object.assign({
            field: "admin",
            hsc: ["Science", "Commerce", "Arts"],
            hsc_groups: ["science", "commerce", "arts"],
            curriculum: [],
            related_interests: [],
            offerings: [],
            related_jobs: [],
            testimonial_stats: { count: 0, wouldAgainYes: 0, wouldAgainNo: 0 },
            difficulty_flags: [],
            fourth_subject_rules: [],
            bcs: bcs(s)
          }, s);
          enrichedSubjects.push(subject);
          subjectsBySlug[subject.slug] = subject;
        }
      });

      arr(overlay.offerings).forEach(function (o) {
        var subject = subjectsBySlug[o.subject_slug];
        if (!subject) {
          subject = {
            slug: o.subject_slug,
            name: o.subject_name || o.subject_slug,
            field: "admin",
            hsc: ["Science", "Commerce", "Arts"],
            hsc_groups: ["science", "commerce", "arts"],
            curriculum: [],
            offerings: [],
            related_jobs: [],
            testimonial_stats: { count: 0, wouldAgainYes: 0, wouldAgainNo: 0 },
            related_interests: []
          };
          enrichedSubjects.push(subject);
          subjectsBySlug[subject.slug] = subject;
        }
        var uni = universitiesById[o.university_id] || { id: o.university_id, name: o.university_name || o.university_id, type: "admin" };
        var offering = {
          university_id: o.university_id,
          university_name: o.university_name || uni.name,
          university_short: uni.short || o.university_id.toUpperCase(),
          university_type: uni.type || "admin",
          city: uni.city,
          degree_name: o.degree_name || subject.degree || subject.name,
          department: o.department || subject.name,
          subject_slug: subject.slug,
          subject_name: o.subject_name || subject.name,
          seats: o.seats == null ? null : Number(o.seats),
          source_url: o.source_url
        };
        var key = [offering.university_id, offering.subject_slug, offering.department, offering.degree_name].join("::");
        var map = new Map(arr(subject.offerings).map(function (row) { return [[row.university_id, row.subject_slug, row.department, row.degree_name].join("::"), row]; }));
        map.set(key, Object.assign({}, map.get(key) || {}, offering));
        subject.offerings = Array.from(map.values());
        subject.total_seats = subject.offerings.reduce(function (sum, row) { return sum + (Number(row.seats) || 0); }, 0);
      });

      var jobsBySubjectLive = {};
      jobs.forEach(function (job) {
        arr(job.related_subjects).forEach(function (slug) {
          jobsBySubjectLive[slug] = jobsBySubjectLive[slug] || [];
          jobsBySubjectLive[slug].push(job);
        });
      });
      enrichedSubjects.forEach(function (subject) {
        subject.related_jobs = jobsBySubjectLive[subject.slug] || subject.related_jobs || [];
      });

      if (overlay.searchSignals) window.EduPathSearchSignals = overlay.searchSignals;
      applyStats();
    }

    function signal(type, payload) {
      if (typeof fetch !== "function") return;
      if (typeof navigator === "undefined" || !navigator.sendBeacon) {
        fetch("/api/search-signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({ type: type }, payload || {}))
        }).catch(function () {});
        return;
      }
      navigator.sendBeacon("/api/search-signal", new Blob([JSON.stringify(Object.assign({ type: type }, payload || {}))], { type: "application/json" }));
    }

    function ranked(rows, type, q) {
      var signals = window.EduPathSearchSignals || {};
      var clicks = signals.clicks || {};
      return rows.map(function (row) {
        var id = row.slug || row.id || row.title;
        var name = row.name || row.title || "";
        var text = (row.slug + " " + name).toLowerCase();
        var score = 0;
        if (text === q) score += 100;
        if (text.indexOf(q) === 0) score += 50;
        if (text.indexOf(q) >= 0) score += 25;
        if (type === "subject") {
          score += Math.min(20, (row.testimonial_stats?.count || 0) * 2);
          score += Math.min(12, Math.round((row.total_seats || 0) / 100));
          score += Math.min(10, arr(row.related_jobs).length * 2);
        }
        score += Math.min(30, Number(clicks[type + ":" + id]) || 0);
        score += Math.min(20, Number(clicks["query:" + q + ":" + type + ":" + id]) || 0);
        return Object.assign({ _score: score }, row);
      }).sort(function (a, b) { return b._score - a._score; });
    }

    return {
      ready: true,
      subjects: enrichedSubjects,
      subjectsBySlug: subjectsBySlug,
      jobs: jobs,
      universities: universities,
      testimonials: testimonials,
      hscMapping: window.DB_HSCMapping || {},
      interestsMapping: window.DB_InterestsMapping || {},
      testimonialStats: stats,
      subject: function (slug) { return subjectsBySlug[slug] || null; },
      offerings: function (slug) { return subjectsBySlug[slug] ? subjectsBySlug[slug].offerings : []; },
      jobsForSubject: function (slug) { return subjectsBySlug[slug] ? subjectsBySlug[slug].related_jobs : []; },
      testimonialsForSubject: function (slug) { return testimonials.filter(function (t) { return t.subjectSlug === slug || t.subject_slug === slug; }); },
      trackSearchClick: function (query, entityType, entityId) {
        signal("click", { query: query, entityType: entityType, entityId: entityId });
      },
      loadApprovedTestimonials: async function () {
        try {
          var overlayRes = await fetch("/api/data-overlay");
          if (overlayRes.ok) {
            var overlayJson = await overlayRes.json();
            applyOverlay(overlayJson.overlay);
          }
          var res = await fetch("/api/testimonials-approved");
          if (!res.ok) return { ok: false, count: 0 };
          var json = await res.json();
          var existing = new Set(testimonials.map(function (t) { return t.id; }));
          var added = arr(json.rows).map(normalizeSubmittedTestimonial).filter(function (t) { return t.id && !existing.has(t.id); });
          if (!added.length) return { ok: true, count: testimonials.length, added: 0 };
          testimonials.push.apply(testimonials, added);
          if (window.PFData && Array.isArray(window.PFData.testimonials)) {
            window.PFData.testimonials.push.apply(window.PFData.testimonials, added);
          }
          applyStats();
          window.dispatchEvent(new CustomEvent("edupath:testimonials-loaded", { detail: { added: added.length } }));
          return { ok: true, count: testimonials.length, added: added.length };
        } catch (err) {
          console.warn("Approved testimonial load failed:", err.message);
          return { ok: false, count: testimonials.length, error: err.message };
        }
      },
      search: function (query) {
        var q = String(query || "").trim().toLowerCase();
        if (!q) return { subjects: [], universities: [], jobs: [] };
        signal("query", { query: q });
        var subjectRows = enrichedSubjects.filter(function (s) { return (s.slug + " " + s.name + " " + s.desc + " " + arr(s.related_interests).join(" ") + " " + arr(s.offerings).map(function (o) { return o.university_name; }).join(" ")).toLowerCase().indexOf(q) >= 0; });
        var universityRows = universities.filter(function (u) { return (u.name + " " + (u.short || "") + " " + (u.city || "")).toLowerCase().indexOf(q) >= 0; });
        var jobRows = jobs.filter(function (j) { return (j.title + " " + arr(j.related_subjects).join(" ")).toLowerCase().indexOf(q) >= 0; });
        return {
          subjects: ranked(subjectRows, "subject", q).slice(0, 12),
          universities: ranked(universityRows, "university", q).slice(0, 12),
          jobs: ranked(jobRows, "job", q).slice(0, 12)
        };
      }
    };
  }

  window.EduPathDB = build();
})();
