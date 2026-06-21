// EduPath BD — Share Your Story modal (quick-access version)
// No personal information is mandatory. Only consent checkboxes are required.

function ShareModal({ onClose }) {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const onSubmit = (e) => { e.preventDefault(); setDone(true); };

  return (
    <div
      style={{
        position:"fixed", inset:0, zIndex:80,
        background:"rgba(26,23,20,0.45)",
        display:"flex", alignItems:"flex-start", justifyContent:"center",
        padding:"64px 24px", overflow:"auto",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"var(--surface)", borderRadius:"var(--r-modal)",
          maxWidth:720, width:"100%", boxShadow:"var(--shadow-3)",
          padding:"36px 40px 32px", position:"relative",
        }}
      >
        <button onClick={onClose} aria-label="Close" style={{position:"absolute",top:16,right:16,background:"transparent",border:"none",cursor:"pointer",fontSize:24,color:"var(--text-muted)",lineHeight:1}}>×</button>

        {done ? (
          <div style={{textAlign:"center",padding:"32px 0"}}>
            <div style={{display:"inline-block",padding:"6px 14px",background:"#E2F1EA",color:"#0A5E44",borderRadius:100,fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:24}}>Thank you</div>
            <h2 className="display-2" style={{fontSize:36,lineHeight:1.15,marginBottom:16}}>Thank you{name ? `, ${name.split(" ")[0]}` : ""}.</h2>
            <p className="lead" style={{maxWidth:480,margin:"0 auto 28px"}}>Your response will be reviewed and published within 48 hours. It will also help our recommendation model give more accurate suggestions to the next student who needs it.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button className="pf-link" onClick={() => navigator.clipboard && navigator.clipboard.writeText("https://edupath-bd.vercel.app")}>Copy link to share →</button>
              <button className="btn btn-primary" onClick={onClose}>← Back to EduPath BD</button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="micro" style={{marginBottom:8}}>Share your story</div>
            <h2 className="display-2" style={{fontSize:32,lineHeight:1.15,marginBottom:6}}>Help the next 17-year-old.</h2>
            <p className="lead" style={{fontSize:15,marginBottom:12}}>About 3 minutes. Reviewed before publishing.</p>

            {/* Model training notice */}
            <div style={{background:"#E2F1EA",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:18,lineHeight:1}}>🧠</span>
              <div style={{fontSize:13,color:"#0A5E44",lineHeight:1.5}}>
                <strong>Your response trains our recommendation engine.</strong> Every submission makes the subject matcher more accurate for students who come after you.
                <div style={{marginTop:4,opacity:0.8}}>No personal information is required — fill in only what you're comfortable sharing.</div>
              </div>
            </div>

            <Section title="About you (all optional)">
              <Row>
                <Field label="Name or alias">
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First name, initials, or anonymous" style={inputStyle}/>
                </Field>
              </Row>
              <Row>
                <Field label="Age"><input type="number" placeholder="24" style={inputStyle}/></Field>
                <Field label="Current city"><input type="text" placeholder="Dhaka" style={inputStyle}/></Field>
                <Field label="Country"><input type="text" placeholder="Bangladesh" style={inputStyle}/></Field>
              </Row>
              <Row>
                <Field label="Current profession / title"><input type="text" placeholder="Software Engineer" style={inputStyle}/></Field>
                <Field label="Organization"><input type="text" placeholder="bKash" style={inputStyle}/></Field>
              </Row>
            </Section>

            <Section title="Your education (all optional)">
              <Row>
                <Field label="University"><input type="text" placeholder="BUET" style={inputStyle}/></Field>
                <Field label="Subject / Department"><input type="text" placeholder="Computer Science & Engineering" style={inputStyle}/></Field>
                <Field label="Session year"><input type="text" placeholder="2018-19" style={inputStyle}/></Field>
              </Row>
            </Section>

            <Section title="Your experience (share what you're comfortable with)">
              <Field label="What you liked about it"><textarea rows={3} placeholder="What worked for you? What surprised you in a good way?" style={inputStyle}/></Field>
              <Field label="What was hard or disappointing"><textarea rows={3} placeholder="The honest version. What was difficult, frustrating, or unfair?" style={inputStyle}/></Field>
              <Field label="Who should take this subject"><textarea rows={2} placeholder="Personality, interests, goals that suit it..." style={inputStyle}/></Field>
              <Field label="Who should NOT take this subject"><textarea rows={2} placeholder="Be honest — it helps students avoid wrong choices" style={inputStyle}/></Field>
              <Field label="Career opportunities you've actually seen"><textarea rows={2} placeholder="Real roles, industries, paths you've observed..." style={inputStyle}/></Field>
            </Section>

            <Section title="Reflection">
              <Field label="Would you choose this subject again?">
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {["Yes", "No", "Unsure"].map(o => (
                    <label key={o} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:100,border:"1.5px solid var(--ink-16)",cursor:"pointer",fontSize:14}}>
                      <input type="radio" name="again" style={{accentColor:"var(--green)"}}/>{o}
                    </label>
                  ))}
                </div>
              </Field>
            </Section>

            <Section title="Consent (required to publish)">
              <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:12,lineHeight:1.5}}>We only need consent to publish your story publicly. Your data also helps train our recommendation model — anonymised and never sold.</p>
              <label style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:14,lineHeight:1.5,marginBottom:10}}>
                <input type="checkbox" required style={{marginTop:4,accentColor:"var(--green)"}}/>
                I consent to this being shown on EduPath BD.
              </label>
              <label style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:14,lineHeight:1.5}}>
                <input type="checkbox" required style={{marginTop:4,accentColor:"var(--green)"}}/>
                I confirm this is my genuine experience.
              </label>
            </Section>

            <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:24}}>
              <button type="button" className="pf-link" onClick={onClose} style={{fontSize:14}}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit story →</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width:"100%", padding:"10px 14px",
  border:"1.5px solid var(--ink-16)", borderRadius:"var(--r-input)",
  background:"var(--surface)", color:"var(--text)",
  fontFamily:"inherit", fontSize:14, lineHeight:1.4,
  fontWeight:500, outline:"none", resize:"vertical",
};

function Section({ title, children }) {
  return (
    <div style={{marginBottom:24}}>
      <div style={{fontFamily:"var(--font-body)",fontWeight:700,fontSize:11,letterSpacing:".08em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:14,paddingBottom:8,borderBottom:"1px solid var(--ink-08)"}}>{title}</div>
      {children}
    </div>
  );
}
function Row({ children }) {
  return <div style={{display:"grid",gridTemplateColumns:`repeat(${React.Children.count(children)}, 1fr)`,gap:12,marginBottom:12}}>{children}</div>;
}
function Field({ label, required, children }) {
  return (
    <label style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
      <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{label}{required ? <span style={{color:"var(--terracotta)"}}> *</span> : null}</span>
      {children}
    </label>
  );
}

Object.assign(window, { ShareModal, Section, Row, Field, inputStyle });
