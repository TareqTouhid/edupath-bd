const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Find and replace the ScreenAllUniversities function opening
const OLD_OPEN = `  function ScreenAllUniversities({\n    go,\n    setUniversitySlug\n  }) {\n    const [searchQuery, setSearchQuery] = useState("");\n    const [typeFilter, setTypeFilter] = useState("all");\n    const [sortBy, setSortBy] = useState("name");\n    const allUnis = window.UGCData ? (window.UGCData.public || []).concat(window.UGCData.private || []).concat(window.UGCData.international || []) : [];`;

const NEW_OPEN = `  const UNI_IMAGES = {\n    buet:  "https://upload.wikimedia.org/wikipedia/commons/1/15/BUET_Campus_01.jpg",\n    du:    "https://upload.wikimedia.org/wikipedia/commons/6/6b/Karjon_hall.JPG",\n    bracu: "https://upload.wikimedia.org/wikipedia/commons/5/53/BRAC_University.jpg",\n    nsu:   "https://upload.wikimedia.org/wikipedia/commons/1/19/North_South_University_Campus_01.jpg",\n    kuet:  "https://upload.wikimedia.org/wikipedia/commons/1/17/KUET_campus_landscape.jpg",\n    ruet:  "https://upload.wikimedia.org/wikipedia/commons/b/bc/Rajshahi_University_of_Engineering_and_Technology_%28RUET%29_Campus.jpg",\n  };\n  function ScreenAllUniversities({\n    go,\n    setUniversitySlug\n  }) {\n    const [searchQuery, setSearchQuery] = useState("");\n    const [typeFilter, setTypeFilter] = useState("all");\n    const [sortBy, setSortBy] = useState("name");\n    const [dataReady, setDataReady] = useState(!!(window.UGCData && window.UGCData.public && window.UGCData.public.length));\n    useEffect(() => {\n      if (dataReady) return;\n      const t = setInterval(() => {\n        if (window.UGCData && window.UGCData.public && window.UGCData.public.length) {\n          setDataReady(true);\n          clearInterval(t);\n        }\n      }, 80);\n      return () => clearInterval(t);\n    }, []);\n    const allUnis = (dataReady && window.UGCData) ? (window.UGCData.public || []).concat(window.UGCData.private || []).concat(window.UGCData.international || []) : [];`;

if (!h.includes(OLD_OPEN)) {
  // Try with \r\n
  const OLD_CRLF = OLD_OPEN.replace(/\n/g, '\r\n');
  if (!h.includes(OLD_CRLF)) {
    console.error('Pattern not found (tried both LF and CRLF)');
    // Show what we have
    const pos = h.indexOf('function ScreenAllUniversities');
    console.log('Component at pos:', pos);
    console.log('Actual code:', JSON.stringify(h.slice(pos, pos + 400)));
    process.exit(1);
  }
  h = h.replace(OLD_CRLF, NEW_OPEN.replace(/\n/g, '\r\n'));
} else {
  h = h.replace(OLD_OPEN, NEW_OPEN);
}
console.log('Open fix:', h.includes('UNI_IMAGES') ? 'OK' : 'FAIL');

// Now replace the card UI: image + name + subject count (no "View details", no type emoji, no city)
const OLD_CARD = `/*#__PURE__*/React.createElement("h3", {\n      style: {\n        fontFamily: "var(--font-display)",\n        fontSize: 16,\n        fontWeight: 600,\n        marginBottom: 8\n      }\n    }, uni.name), /*#__PURE__*/React.createElement("p", {\n      style: {\n        fontSize: 12,\n        color: "var(--text-muted)",\n        marginBottom: 12\n      }\n    }, uni.type === "public" ? "\\uD83C\\uDFDB\\uFE0F Public" : "\\uD83C\\uDF93 Private"), /*#__PURE__*/React.createElement("p", {\n      style: {\n        fontSize: 13,\n        color: "var(--text)",\n        marginBottom: 8\n      }\n    }, "\\uD83D\\uDCCD ", uni.city || "Location TBD"), /*#__PURE__*/React.createElement("p", {\n      style: {\n        fontSize: 11,\n        color: "var(--green)",\n        fontWeight: 500\n      }\n    }, "View details \\u2192")`;

const NEW_CARD = `/*#__PURE__*/React.createElement("div", {\n      style: {\n        height: 120, overflow: "hidden", background: "#e8f0ea",\n        margin: "-20px -20px 14px -20px", borderRadius: "12px 12px 0 0",\n        position: "relative"\n      }\n    }, UNI_IMAGES[uni.id]\n      ? /*#__PURE__*/React.createElement("img", {\n          src: UNI_IMAGES[uni.id], alt: uni.name,\n          style: { width: "100%", height: "100%", objectFit: "cover" }\n        })\n      : /*#__PURE__*/React.createElement("div", {\n          style: {\n            width: "100%", height: "100%",\n            display: "flex", alignItems: "center", justifyContent: "center",\n            background: "linear-gradient(135deg, var(--green-8) 0%, var(--ink-04) 100%)"\n          }\n        }, /*#__PURE__*/React.createElement("span", {\n          style: {\n            fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,\n            color: "var(--green)", opacity: 0.5\n          }\n        }, uni.short || uni.name.slice(0,4).toUpperCase()))\n    ), /*#__PURE__*/React.createElement("h3", {\n      style: {\n        fontFamily: "var(--font-display)", fontSize: 15,\n        fontWeight: 600, marginBottom: 4, lineHeight: 1.3\n      }\n    }, uni.name), /*#__PURE__*/React.createElement("p", {\n      style: { fontSize: 12, color: "var(--text-muted)" }\n    }, (window.UniSubjects && window.UniSubjects[uni.id]) ? window.UniSubjects[uni.id].length + " subjects offered" : (uni.focus ? uni.focus.charAt(0).toUpperCase() + uni.focus.slice(1) : ""))`;

const OLD_CARD_CRLF = OLD_CARD.replace(/\n/g, '\r\n');
if (h.includes(OLD_CARD_CRLF)) {
  h = h.replace(OLD_CARD_CRLF, NEW_CARD.replace(/\n/g, '\r\n'));
  console.log('Card fix: OK (CRLF)');
} else if (h.includes(OLD_CARD)) {
  h = h.replace(OLD_CARD, NEW_CARD);
  console.log('Card fix: OK (LF)');
} else {
  console.error('Card pattern not found');
  // Find what's actually there
  const cardPos = h.indexOf('"View details \\u2192"');
  if (cardPos !== -1) console.log('View details ctx:', JSON.stringify(h.slice(cardPos-200, cardPos+30)));
}

// Also fix card padding to account for negative margin image
const OLD_PADDING = `padding: 20,\n        background: "var(--surface)",\n        border: "1px solid var(--ink-08)",\n        borderRadius: 12,\n        cursor: "pointer",\n        textAlign: "left",\n        transition: "all 200ms ease"`;
const OLD_PADDING_CRLF = OLD_PADDING.replace(/\n/g, '\r\n');
if (h.includes(OLD_PADDING_CRLF)) {
  h = h.replace(OLD_PADDING_CRLF, `padding: 20,\r\n        background: "var(--surface)",\r\n        border: "1px solid var(--ink-08)",\r\n        borderRadius: 12,\r\n        cursor: "pointer",\r\n        textAlign: "left",\r\n        overflow: "hidden",\r\n        transition: "all 200ms ease"`);
  console.log('Card overflow fix: OK');
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('Done, size:', Math.round(h.length/1024), 'KB');
