// EduPath BD — App root + simple router

function App() {
  const [section, setSection] = useState("landing"); // landing | explore | detail | stories | matcher | contribute
  const [subjectSlug, setSubjectSlug] = useState("cse");
  const [shareOpen, setShareOpen] = useState(false);

  // Section transition animation
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [section, subjectSlug]);

  const go = (next, opts) => {
    if (next === "share") { setShareOpen(true); return; }
    if (opts && opts.subjectSlug) setSubjectSlug(opts.subjectSlug);
    setSection(next);
    setAnimKey(k => k + 1);
  };

  let body;
  switch (section) {
    case "explore": body = <ScreenExplore go={go} setSubjectSlug={setSubjectSlug}/>; break;
    case "detail":  body = <ScreenDetail   go={go} subjectSlug={subjectSlug}/>; break;
    case "stories":    body = <ScreenStories    go={go}/>; break;
    case "matcher":    body = <ScreenMatcher    go={go}/>; break;
    case "contribute": body = <ScreenContribute go={go}/>; break;
    case "careers":    body = <ScreenCareers    go={go}/>; break;
    default:           body = <ScreenLanding    go={go} setSubjectSlug={setSubjectSlug}/>;
  }

  return (
    <div className="pf-app" data-screen-label={section}>
      <Nav section={section === "detail" ? "explore" : section} go={go} shareOpen={shareOpen}/>
      <main className="pf-main">
        <div key={animKey} style={{animation:"pf-section-in 350ms cubic-bezier(0.2,0.8,0.2,1) both"}}>
          {body}
        </div>
      </main>
      {shareOpen ? <ShareModal onClose={() => setShareOpen(false)}/> : null}
      <style>{`@keyframes pf-section-in { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }`}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
