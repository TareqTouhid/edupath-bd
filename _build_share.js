const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const pos = h.indexOf('SCREEN — CONTRIBUTE');
const blockStart = h.lastIndexOf('<!--', pos);
const blockEnd = h.indexOf('</script>', pos) + '</script>'.length;
console.log('Block:', blockStart, '-', blockEnd, '=', Math.round((blockEnd-blockStart)/1024), 'KB');

const NEW_SHARE = `<!-- ═══════════════════════════════════════════════════════════════
     SCREEN — CONTRIBUTE  (Share Your Reality)
     ═══════════════════════════════════════════════════════════════ -->
<script type="text/javascript">
(function () {
  const { useState } = React;

  function StarScale({ label, subLabel, value, onChange }) {
    return React.createElement("div", { style: { marginBottom: 24 } },
      React.createElement("p", { style: { fontSize: 14, fontWeight: 600, marginBottom: 4 } }, label),
      React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", marginBottom: 10 } }, subLabel),
      React.createElement("div", { style: { display: "flex", gap: 8 } },
        [1,2,3,4,5].map(function(n) { return React.createElement("button", {
          key: n, onClick: function() { onChange(n); },
          style: {
            width: 44, height: 44, borderRadius: 8,
            border: "1.5px solid " + (value >= n ? "var(--green)" : "var(--ink-08)"),
            background: value >= n ? "var(--green)" : "var(--surface)",
            color: value >= n ? "white" : "var(--text)",
            fontSize: 15, fontWeight: 700, cursor: "pointer"
          }
        }, n); })
      ),
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4 } },
        React.createElement("span", { style: { fontSize: 11, color: "var(--text-muted)" } }, "1 = Very bad"),
        React.createElement("span", { style: { fontSize: 11, color: "var(--text-muted)" } }, "5 = Excellent")
      )
    );
  }

  function ScreenContribute({ go }) {
    var _useState = useState(1), section = _useState[0], setSection = _useState[1];
    var _useState2 = useState(false), submitted = _useState2[0], setSubmitted = _useState2[1];
    var _useState3 = useState({
      university: "", subject: "", status: "",
      wouldChooseAgain: "", academicPressure: 0, facultyQuality: 0, jobReality: 0,
      wishKnew: "", worstPart: "", bestPart: "",
      jobTitle: "", consent: false
    }), form = _useState3[0], setForm = _useState3[1];

    function set(key, val) { setForm(function(f) { var n = Object.assign({}, f); n[key] = val; return n; }); }

    var subjects = (window.DB_Subjects || []);
    var unis = window.UGCData
      ? (window.UGCData.public||[]).concat(window.UGCData.private||[]).map(function(u){return u.name;}).sort()
      : [];

    var inp = { width: "100%", padding: "10px 14px", fontSize: 14, border: "1.5px solid var(--ink-08)", borderRadius: 8, fontFamily: "var(--font-body)", outline: "none", background: "var(--surface)", boxSizing: "border-box" };
    var ta = Object.assign({}, inp, { minHeight: 100, resize: "vertical", display: "block" });
    var lbl = { fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 };
    var grp = { marginBottom: 20 };
    var pill = { padding: "12px 32px", color: "white", border: "none", borderRadius: "999px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" };
    var back = { padding: "12px 24px", background: "none", border: "1.5px solid var(--ink-08)", borderRadius: "999px", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)" };

    if (submitted) return React.createElement("div", { style: { padding: "80px 24px", textAlign: "center" } },
      React.createElement("div", { style: { fontSize: 48, marginBottom: 16 } }, "🙏"),
      React.createElement("h2", { style: { fontSize: 24, fontWeight: 700, marginBottom: 12 } }, "Thank you!"),
      React.createElement("p", { style: { color: "var(--text-muted)", fontSize: 15, maxWidth: 480, margin: "0 auto 32px" } },
        "Your experience will help thousands of HSC students make a better decision. It will be reviewed and published anonymously."
      ),
      React.createElement("button", { onClick: function(){ go("landing"); }, style: Object.assign({}, pill, { background: "var(--green)" }) }, "Back to home")
    );

    return React.createElement("div", { style: { padding: "48px 0 80px" } },
      React.createElement("div", { className: "pf-container", style: { maxWidth: 640, margin: "0 auto" } },
        React.createElement("button", { className: "pf-link", onClick: function(){ go("landing"); }, style: { fontSize: 13, marginBottom: 24 } }, "← Back to home"),
        React.createElement("h1", { className: "display-2", style: { fontSize: 30, marginBottom: 6 } }, "Share your reality"),
        React.createElement("p", { style: { fontSize: 14, color: "var(--text-muted)", marginBottom: 8 } }, "100% anonymous. Help the next generation make a better choice."),
        React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", background: "var(--ink-04)", padding: "8px 14px", borderRadius: 8, marginBottom: 32 } },
          "Your name and contact info will never be published. We only publish aggregated stats and anonymous quotes."
        ),

        // Progress bar
        React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 32 } },
          ["Foundation","Metrics","Story","Career","Publish"].map(function(s, i) {
            return React.createElement("div", { key: i, style: { flex: i+1===section?2:1, height: 6, borderRadius: 4, background: i+1<=section?"var(--green)":"var(--ink-08)", transition: "all 300ms" }, title: s });
          })
        ),

        // SECTION 1
        section === 1 && React.createElement("div", null,
          React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, marginBottom: 20 } }, "Section 1 — The Foundation"),
          React.createElement("div", { style: grp },
            React.createElement("label", { style: lbl }, "University Name *"),
            React.createElement("select", { value: form.university, onChange: function(e){ set("university", e.target.value); }, style: inp },
              React.createElement("option", { value: "" }, "Select your university…"),
              unis.map(function(u){ return React.createElement("option", { key: u, value: u }, u); })
            )
          ),
          React.createElement("div", { style: grp },
            React.createElement("label", { style: lbl }, "Subject / Department *"),
            React.createElement("select", { value: form.subject, onChange: function(e){ set("subject", e.target.value); }, style: inp },
              React.createElement("option", { value: "" }, "Select your subject…"),
              subjects.map(function(s){ return React.createElement("option", { key: s.slug, value: s.slug }, s.name); })
            )
          ),
          React.createElement("div", { style: grp },
            React.createElement("label", { style: lbl }, "Your current status *"),
            React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
              ["Current Student","Recent Graduate","Alumni (2+ years working)"].map(function(s){
                var sel = form.status === s;
                return React.createElement("button", { key: s, onClick: function(){ set("status", s); }, style: { padding: "10px 18px", borderRadius: "999px", cursor: "pointer", border: "1.5px solid " + (sel?"var(--green)":"var(--ink-08)"), background: sel?"var(--green)":"var(--surface)", color: sel?"white":"var(--text)", fontSize: 13, fontFamily: "var(--font-body)" } }, s);
              })
            )
          ),
          React.createElement("button", {
            disabled: !form.university||!form.subject||!form.status,
            onClick: function(){ setSection(2); },
            style: Object.assign({}, pill, { marginTop: 8, background: (form.university&&form.subject&&form.status)?"var(--green)":"var(--ink-08)", cursor: (form.university&&form.subject&&form.status)?"pointer":"not-allowed" })
          }, "Next →")
        ),

        // SECTION 2
        section === 2 && React.createElement("div", null,
          React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, marginBottom: 20 } }, "Section 2 — The Brutal Truth"),
          React.createElement("div", { style: Object.assign({}, grp, { background: "var(--ink-04)", borderRadius: 10, padding: "16px 20px", marginBottom: 28 }) },
            React.createElement("p", { style: { fontSize: 14, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 } }, "Knowing what you know now, would you choose this exact subject at this exact university again?"),
            React.createElement("div", { style: { display: "flex", gap: 12 } },
              ["Yes","No"].map(function(v){
                var sel = form.wouldChooseAgain===v;
                return React.createElement("button", { key: v, onClick: function(){ set("wouldChooseAgain",v); }, style: { flex:1, padding:"12px", borderRadius:8, cursor:"pointer", border:"1.5px solid "+(sel?"var(--green)":"var(--ink-08)"), background:sel?"var(--green)":"var(--surface)", color:sel?"white":"var(--text)", fontSize:15, fontWeight:600, fontFamily:"var(--font-body)" } }, v);
              })
            )
          ),
          React.createElement(StarScale, { label: "Academic Pressure & Workload", subLabel: "1 = Very chill  |  5 = Absolute nightmare / no sleep", value: form.academicPressure, onChange: function(v){ set("academicPressure",v); } }),
          React.createElement(StarScale, { label: "Faculty & Teaching Quality", subLabel: "1 = Terrible / outdated  |  5 = World-class mentors", value: form.facultyQuality, onChange: function(v){ set("facultyQuality",v); } }),
          React.createElement(StarScale, { label: "Job Market Reality", subLabel: "1 = Brutal / high unemployment  |  5 = High demand / easy placement", value: form.jobReality, onChange: function(v){ set("jobReality",v); } }),
          React.createElement("div", { style: { display: "flex", gap: 12, marginTop: 8 } },
            React.createElement("button", { onClick: function(){ setSection(1); }, style: back }, "← Back"),
            React.createElement("button", {
              disabled: !form.wouldChooseAgain||!form.academicPressure||!form.facultyQuality||!form.jobReality,
              onClick: function(){ setSection(3); },
              style: Object.assign({}, pill, { flex:1, background:(form.wouldChooseAgain&&form.academicPressure&&form.facultyQuality&&form.jobReality)?"var(--green)":"var(--ink-08)", cursor:(form.wouldChooseAgain&&form.academicPressure&&form.facultyQuality&&form.jobReality)?"pointer":"not-allowed" })
            }, "Next →")
          )
        ),

        // SECTION 3
        section === 3 && React.createElement("div", null,
          React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, marginBottom: 6 } }, "Section 3 — Your Story"),
          React.createElement("p", { style: { fontSize: 13, color: "var(--text-muted)", marginBottom: 24 } }, "These become anonymous quotes on subject pages. Be specific and honest."),
          React.createElement("div", { style: grp },
            React.createElement("label", { style: lbl }, "What do you wish you knew BEFORE enrolling?"),
            React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", marginBottom: 6 } }, 'e.g. "I thought CSE was just coding but it\'s 90% hardcore math in year 1–2…"'),
            React.createElement("textarea", { value: form.wishKnew, onChange: function(e){ set("wishKnew",e.target.value); }, style: ta, placeholder: "Be specific. What surprised you most?" })
          ),
          React.createElement("div", { style: grp },
            React.createElement("label", { style: lbl }, "What is the absolute WORST part about this degree?"),
            React.createElement("p", { style: { fontSize: 12, color: "var(--text-muted)", marginBottom: 6 } }, "Lab equipment? Politics? Outdated syllabus? Session jam?"),
            React.createElement("textarea", { value: form.worstPart, onChange: function(e){ set("worstPart",e.target.value); }, style: ta, placeholder: "Don’t hold back." })
          ),
          React.createElement("div", { style: grp },
            React.createElement("label", { style: lbl }, "What is the BEST part?"),
            React.createElement("textarea", { value: form.bestPart, onChange: function(e){ set("bestPart",e.target.value); }, style: ta, placeholder: "Alumni network, skills, campus life, specific opportunity…" })
          ),
          React.createElement("div", { style: { display: "flex", gap: 12 } },
            React.createElement("button", { onClick: function(){ setSection(2); }, style: back }, "← Back"),
            React.createElement("button", { onClick: function(){ setSection(form.status==="Current Student"?5:4); }, style: Object.assign({}, pill, { flex:1, background:"var(--green)" }) }, "Next →")
          )
        ),

        // SECTION 4
        section === 4 && React.createElement("div", null,
          React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, marginBottom: 8 } }, "Section 4 — After Graduation"),
          React.createElement("p", { style: { fontSize: 13, color: "var(--text-muted)", marginBottom: 24 } }, "Helps students understand real job outcomes. Optional."),
          React.createElement("div", { style: grp },
            React.createElement("label", { style: lbl }, "Current job title / profession"),
            React.createElement("input", { type: "text", value: form.jobTitle, onChange: function(e){ set("jobTitle",e.target.value); }, placeholder: "e.g. Software Engineer, Bank Officer, Freelancer…", style: inp })
          ),
          React.createElement("div", { style: { display: "flex", gap: 12 } },
            React.createElement("button", { onClick: function(){ setSection(3); }, style: back }, "← Back"),
            React.createElement("button", { onClick: function(){ setSection(5); }, style: Object.assign({}, pill, { flex:1, background:"var(--green)" }) }, "Next →")
          )
        ),

        // SECTION 5
        section === 5 && React.createElement("div", null,
          React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, marginBottom: 20 } }, "Section 5 — Publish Anonymously"),
          React.createElement("div", { style: { background: "var(--ink-04)", borderRadius: 10, padding: 20, marginBottom: 24 } },
            React.createElement("p", { style: { fontSize: 14, fontWeight: 600, marginBottom: 8 } }, "Your review summary"),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-muted)" } }, form.university + " · " + form.subject),
            React.createElement("p", { style: { fontSize: 13, color: "var(--text-muted)" } }, "Status: " + form.status),
            React.createElement("div", { style: { display: "flex", gap: 16, marginTop: 8 } },
              [["Pressure",form.academicPressure],["Faculty",form.facultyQuality],["Jobs",form.jobReality]].map(function(kv){
                return React.createElement("span", { key: kv[0], style: { fontSize: 12, color: "var(--green)", fontWeight: 600 } }, kv[0] + ": " + kv[1] + "/5");
              })
            )
          ),
          React.createElement("label", { style: { display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", marginBottom: 32 } },
            React.createElement("input", { type: "checkbox", checked: form.consent, onChange: function(e){ set("consent",e.target.checked); }, style: { marginTop: 2, flexShrink: 0 } }),
            React.createElement("span", { style: { fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 } }, "I agree to let EduPath BD publish this review anonymously to help future students. My personal contact info will never be shared.")
          ),
          React.createElement("div", { style: { display: "flex", gap: 12 } },
            React.createElement("button", { onClick: function(){ setSection(form.status==="Current Student"?3:4); }, style: back }, "← Back"),
            React.createElement("button", {
              disabled: !form.consent,
              onClick: function(){ setSubmitted(true); },
              style: Object.assign({}, pill, { flex:1, fontSize:16, fontWeight:700, padding:"14px 32px", background:form.consent?"var(--green)":"var(--ink-08)", cursor:form.consent?"pointer":"not-allowed" })
            }, "Submit my experience →")
          )
        )
      )
    );
  }

  Object.assign(window, { ScreenContribute });
})();
</script>`.replace(/\n/g, '\r\n');

h = h.slice(0, blockStart) + NEW_SHARE + h.slice(blockEnd);
fs.writeFileSync('index.html', h, 'utf8');
console.log('Done. Size:', Math.round(h.length/1024), 'KB');
