// EduPath BD — Subject → University mapping
// For each subject: which universities offer it, admission difficulty, and a key note.
// Uses university IDs from universities.js
// Admission tiers: "top" = BUET/DU-level competition | "strong" = competitive | "accessible" = moderate entry

(function () {
  window.SubjectUniversities = {

    // ── Engineering & Technology ───────────────────────────────────────────

    "cse": {
      public: [
        { id:"buet",  tier:"top",        note:"Best public option. ~3–8% admission rate. Requires strong HSC Science + admission test." },
        { id:"kuet",  tier:"top",        note:"Second-tier public eng. Very competitive. Strong placement record." },
        { id:"ruet",  tier:"top",        note:"Top choice outside Dhaka. Competitive but slightly below BUET cutoff." },
        { id:"sust",  tier:"top",        note:"Strong science university in Sylhet. Good research culture." },
        { id:"cuet",  tier:"strong",     note:"Chittagong region's top engineering option." },
        { id:"iut",   tier:"top",        note:"OIC scholarship — tuition free for OIC-member country students. Very selective." },
        { id:"ju",    tier:"strong",     note:"DU's sister university. Less competitive than BUET-tier. Good faculty." },
        { id:"nstu",  tier:"strong",     note:"Growing CS department. Less competitive. Good for regional students." },
        { id:"hstu",  tier:"strong",     note:"Northwest region. Admission via GST (university admission test cluster)." },
      ],
      private: [
        { id:"bracu",  tier:"top",    note:"Best private option. Strong industry links. Merit waivers available." },
        { id:"nsu",    tier:"top",    note:"Very strong for CS. NSU alumni network is the best in private sector." },
        { id:"aiub",   tier:"top",    note:"American-affiliated. Strong computing labs. Co-op programmes available." },
        { id:"uiu",    tier:"strong", note:"Good tech focus. Merit scholarship up to 100%." },
        { id:"ewu",    tier:"strong", note:"Solid option. Known for EEE but CS is strong too." },
        { id:"iub",    tier:"strong", note:"Good research environment. Smaller cohort." },
        { id:"diu",    tier:"strong", note:"Large intake. Broad scholarship schemes. Software park nearby." },
        { id:"bubt",   tier:"strong", note:"Budget-friendly. Decent industry connections." },
        { id:"baust",  tier:"strong", note:"Army-affiliated. Disciplined environment. Good infrastructure." },
        { id:"bauet",  tier:"strong", note:"Army-affiliated. Rajshahi region option." },
      ],
      admissionNote: "HSC Science (Physics + Mathematics mandatory). Public admission via GST cluster or individual tests.",
    },

    "eee": {
      public: [
        { id:"buet",  tier:"top",    note:"Premier EEE destination. Globally recognised graduates." },
        { id:"kuet",  tier:"top",    note:"Strong EEE with electronics focus." },
        { id:"ruet",  tier:"top",    note:"Competitive. Good for power systems track." },
        { id:"cuet",  tier:"strong", note:"Chittagong-based. Decent industry ties." },
        { id:"sust",  tier:"strong", note:"Active research groups in communications." },
        { id:"iut",   tier:"top",    note:"OIC scholarship. Very selective. Excellent for power/telecom." },
        { id:"nstu",  tier:"strong", note:"Growing. Lower cutoff than BUET-tier." },
      ],
      private: [
        { id:"bracu",  tier:"top",    note:"Strong EEE with embedded systems focus." },
        { id:"nsu",    tier:"top",    note:"Good labs. Strong alumni in telecom sector." },
        { id:"aiub",   tier:"top",    note:"Well-equipped labs. Industry links in telecoms." },
        { id:"uiu",    tier:"strong", note:"Solid option. Merit scholarship available." },
        { id:"ewu",    tier:"strong", note:"Known for EEE specifically. Active placement." },
        { id:"aust",   tier:"strong", note:"Good engineering faculty." },
        { id:"diu",    tier:"strong", note:"Large intake. Broad scholarship." },
      ],
      admissionNote: "HSC Science required. Mathematics and Physics are core. Admission via GST cluster for public universities.",
    },

    "civil-engineering": {
      public: [
        { id:"buet",  tier:"top",    note:"Only destination for top civil engineers. Structural + water resources tracks." },
        { id:"kuet",  tier:"top",    note:"Strong civil programme. Lower cutoff than BUET." },
        { id:"ruet",  tier:"top",    note:"Good structural engineering focus." },
        { id:"cuet",  tier:"strong", note:"Active in port/marine infrastructure projects." },
        { id:"sust",  tier:"strong", note:"Civil + environmental engineering combined." },
        { id:"duet",  tier:"strong", note:"Accepts HSC + diploma holders. Gazipur campus." },
      ],
      private: [
        { id:"bracu",  tier:"top",    note:"Good lab facilities. Urban design focus." },
        { id:"uiu",    tier:"strong", note:"Growing civil department." },
        { id:"uap",    tier:"strong", note:"Decent civil + architecture mix." },
        { id:"aust",   tier:"strong", note:"Good structural design programme." },
        { id:"diu",    tier:"strong", note:"Large intake. Accessible." },
      ],
      admissionNote: "HSC Science required. Strong mathematics needed. Public via GST cluster.",
    },

    "mechanical-engineering": {
      public: [
        { id:"buet",  tier:"top",    note:"Best mechanical programme. Thermal + manufacturing tracks." },
        { id:"kuet",  tier:"top",    note:"Strong industrial and mechanical focus." },
        { id:"ruet",  tier:"top",    note:"Good for manufacturing/industrial track." },
        { id:"cuet",  tier:"strong", note:"Chittagong port/industry context is valuable." },
        { id:"sust",  tier:"strong", note:"IPE (Industrial & Production Engineering) strong here." },
        { id:"duet",  tier:"strong", note:"Diploma-to-degree upgrade pathway available." },
      ],
      private: [
        { id:"bracu",  tier:"top",    note:"Good labs. Robotics electives available." },
        { id:"uiu",    tier:"strong", note:"Growing mechanical department." },
        { id:"aust",   tier:"strong", note:"Active in HVAC and industrial projects." },
        { id:"diu",    tier:"strong", note:"Accessible entry. Budget-friendly." },
      ],
      admissionNote: "HSC Science required. Physics and Mathematics core. Admission via GST.",
    },

    "architecture": {
      public: [
        { id:"buet",  tier:"top",    note:"Best architecture school in BD. 5-year B.Arch. Portfolio + test required." },
        { id:"ku",    tier:"strong", note:"Architecture + Urban Planning. Active design studios." },
        { id:"ruet",  tier:"strong", note:"Good architecture programme. Lower competition than BUET." },
        { id:"cuet",  tier:"strong", note:"Chittagong-based. Good for coastal/urban design." },
      ],
      private: [
        { id:"bracu",  tier:"top",    note:"Strong architecture + interior design. Very competitive private option." },
        { id:"nsu",    tier:"top",    note:"Good architecture programme with urban design focus." },
        { id:"uap",    tier:"strong", note:"Architecture and civil combined. Good studio culture." },
        { id:"uiu",    tier:"strong", note:"Growing programme. Affordable." },
        { id:"smuct",  tier:"strong", note:"Specialist in design and creative arts. Strong studio culture." },
        { id:"tuca",   tier:"good",   note:"Creative arts focus. Smaller cohort." },
      ],
      admissionNote: "HSC Science required. Drawing/portfolio test at most universities. 5-year B.Arch programme.",
    },

    // ── Business & Economics ───────────────────────────────────────────────

    "bba": {
      public: [
        { id:"du",    tier:"top",    note:"DU-IBA is the gold standard. ~2% admission rate. Highly competitive." },
        { id:"ju",    tier:"strong", note:"Good BBA. Jahangirnagar campus has an active business culture." },
        { id:"ru",    tier:"strong", note:"Large management faculty. Good for regional students." },
        { id:"cu",    tier:"strong", note:"Strong business school in Chittagong." },
        { id:"ku",    tier:"strong", note:"Business & Technology faculty." },
        { id:"sust",  tier:"strong", note:"Modern business curriculum." },
        { id:"jnu",   tier:"strong", note:"Dhaka-based. Accessible for city students." },
        { id:"brur",  tier:"strong", note:"Good BBA for Rangpur division students." },
        { id:"cou",   tier:"strong", note:"Growing business programme in Comilla." },
      ],
      private: [
        { id:"nsu",    tier:"top",    note:"Best private BBA. Strong MNC recruitment pipeline." },
        { id:"bracu",  tier:"top",    note:"BRAC Business School. Excellent for FMCG and development sector." },
        { id:"iub",    tier:"top",    note:"Good BBA. Strong alumni in banking and finance." },
        { id:"aiub",   tier:"strong", note:"Good BBA with IT integration." },
        { id:"ewu",    tier:"strong", note:"Solid BBA. Active career services." },
        { id:"uiu",    tier:"strong", note:"Good value. Merit scholarship available." },
        { id:"bubt",   tier:"strong", note:"Large BBA programme. Affordable." },
        { id:"diu",    tier:"strong", note:"Large intake. Accessible for all budgets." },
        { id:"stamford",tier:"good",  note:"Journalism and business combined strengths." },
        { id:"seu",    tier:"good",   note:"Accessible entry. City campus." },
        { id:"ulab",   tier:"strong", note:"Good liberal arts-infused BBA." },
      ],
      admissionNote: "Open to HSC Commerce, Science, and Arts groups. DU-IBA requires very high GPA + competitive exam. Private universities use their own tests.",
    },

    "accounting": {
      public: [
        { id:"du",    tier:"top",    note:"Accounting & Information Systems dept. Strong CA/ACCA pipeline." },
        { id:"ju",    tier:"strong", note:"Good accounting programme. Affiliated with ICAB." },
        { id:"ru",    tier:"strong", note:"Active accounting faculty." },
        { id:"cu",    tier:"strong", note:"Strong in Chittagong's trading/banking community." },
        { id:"ku",    tier:"strong", note:"Accounting and Finance." },
        { id:"jnu",   tier:"strong", note:"Dhaka-based. Convenient for city students." },
      ],
      private: [
        { id:"nsu",    tier:"top",    note:"Strong accounting + finance. ACCA exemptions available." },
        { id:"bracu",  tier:"top",    note:"Good accounting. ACCA-partnered curriculum." },
        { id:"iub",    tier:"strong", note:"Good accounting department." },
        { id:"ewu",    tier:"strong", note:"Solid accounting programme." },
        { id:"uiu",    tier:"strong", note:"BBA in Accounting. Affordable." },
        { id:"bubt",   tier:"strong", note:"Large intake. Budget-friendly." },
        { id:"diu",    tier:"strong", note:"Accessible. Scholarship available." },
      ],
      admissionNote: "Commerce HSC is preferred but Science and Arts are also eligible at most universities.",
    },

    "economics": {
      public: [
        { id:"du",    tier:"top",    note:"One of Asia's top Economics departments. Very competitive. Strong policy/research culture." },
        { id:"ju",    tier:"strong", note:"Good Economics. Active research publications." },
        { id:"ru",    tier:"strong", note:"Large Economics faculty. Good for applied economics." },
        { id:"cu",    tier:"strong", note:"Strong Economics programme." },
        { id:"ku",    tier:"strong", note:"Economics and Development focus." },
        { id:"sust",  tier:"strong", note:"Economics with tech integration." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"Good regional option in Rangpur." },
        { id:"cou",   tier:"strong", note:"Growing Economics dept." },
      ],
      private: [
        { id:"nsu",    tier:"top",    note:"Strong Economics with development focus." },
        { id:"bracu",  tier:"top",    note:"Good Economics. Dev econ is a strength." },
        { id:"iub",    tier:"strong", note:"Good Economics programme." },
        { id:"ewu",    tier:"strong", note:"Economics with business integration." },
        { id:"bubt",   tier:"good",   note:"Accessible entry." },
      ],
      admissionNote: "Open to HSC Science, Commerce, and Arts. Strong mathematics background helps significantly.",
    },

    "finance-banking": {
      public: [
        { id:"du",    tier:"top",    note:"Finance dept under Business Faculty. Strong banking sector recruitment." },
        { id:"ju",    tier:"strong", note:"Finance and Banking. Growing programme." },
        { id:"ru",    tier:"strong", note:"Finance with banking focus. Active placement." },
        { id:"cu",    tier:"strong", note:"Strong finance programme. Chittagong banking hub." },
        { id:"ku",    tier:"strong", note:"Finance and Banking." },
        { id:"jnu",   tier:"strong", note:"City campus. Good banking links." },
      ],
      private: [
        { id:"nsu",    tier:"top",    note:"Strong Finance. CFA prep resources available." },
        { id:"bracu",  tier:"top",    note:"Good finance. Strong ACCA pipeline." },
        { id:"iub",    tier:"strong", note:"Finance & Banking department. Good placement." },
        { id:"ewu",    tier:"strong", note:"Finance with FinTech modules." },
        { id:"uiu",    tier:"strong", note:"Good value. BBA in Finance." },
        { id:"bubt",   tier:"strong", note:"Affordable. Large intake." },
        { id:"diu",    tier:"strong", note:"Accessible. Wide scholarship." },
      ],
      admissionNote: "Commerce HSC preferred. Science and Arts also eligible. Good mathematics background is essential.",
    },

    // ── Natural Sciences ──────────────────────────────────────────────────

    "physics": {
      public: [
        { id:"du",    tier:"top",    note:"Premier physics dept. Research active. Links to BCSIR and BAEC." },
        { id:"buet",  tier:"top",    note:"Applied Physics programme. Maths-heavy. Excellent for research." },
        { id:"ju",    tier:"strong", note:"Active physics research. Good for academic path." },
        { id:"ru",    tier:"strong", note:"Large physics faculty. Good for regional students." },
        { id:"cu",    tier:"strong", note:"Active physics department." },
        { id:"sust",  tier:"strong", note:"Physics + applied sciences integration." },
        { id:"ku",    tier:"strong", note:"Good physics programme in Khulna." },
        { id:"jnu",   tier:"strong", note:"Dhaka-based. Accessible." },
        { id:"brur",  tier:"strong", note:"Regional option in Rangpur." },
        { id:"pust",  tier:"strong", note:"Physics at Pabna. Less competitive." },
      ],
      private: [
        { id:"nsu",    tier:"good",   note:"Limited physics. Applied science focus." },
        { id:"bracu",  tier:"good",   note:"Physics is available but limited research." },
        { id:"iub",    tier:"good",   note:"Small physics cohort. Research-focused." },
      ],
      admissionNote: "HSC Science required. Physics + Mathematics mandatory. Very limited private university options — public is strongly preferred.",
    },

    "chemistry": {
      public: [
        { id:"du",    tier:"top",    note:"Top chemistry dept. Strong pharma and industrial research links." },
        { id:"ju",    tier:"strong", note:"Active chemistry research. Biochemistry strong here." },
        { id:"ru",    tier:"strong", note:"Large chemistry faculty." },
        { id:"cu",    tier:"strong", note:"Good for industrial chemistry." },
        { id:"sust",  tier:"strong", note:"Chemistry with environmental focus." },
        { id:"ku",    tier:"strong", note:"Chemistry in Khulna." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"Chemistry in Rangpur." },
        { id:"hstu",  tier:"strong", note:"Chemistry with food science integration." },
      ],
      private: [
        { id:"nsu",    tier:"good",   note:"Limited. Applied chem only." },
        { id:"bracu",  tier:"good",   note:"Environmental chem focus." },
      ],
      admissionNote: "HSC Science required. Chemistry + Biology or Physics background needed. Public universities are the main route.",
    },

    "mathematics": {
      public: [
        { id:"du",    tier:"top",    note:"DU Maths is strong for pure + applied. Gateway to actuarial/quant careers." },
        { id:"buet",  tier:"top",    note:"Mathematics dept within engineering. High-level applied maths." },
        { id:"ju",    tier:"strong", note:"Active maths research. Good for academic path." },
        { id:"ru",    tier:"strong", note:"Large maths faculty." },
        { id:"cu",    tier:"strong", note:"Good maths programme." },
        { id:"sust",  tier:"strong", note:"Maths with computing integration." },
        { id:"ku",    tier:"strong", note:"Mathematics in Khulna." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"Mathematics in Rangpur." },
        { id:"hstu",  tier:"strong", note:"Applied Mathematics track." },
      ],
      private: [
        { id:"iub",    tier:"good",   note:"Applied Mathematics available. Small cohort." },
        { id:"nsu",    tier:"good",   note:"Applied/computational maths only." },
      ],
      admissionNote: "HSC Science with Mathematics required. Public universities dominate. Private options are very limited.",
    },

    "statistics": {
      public: [
        { id:"du",    tier:"top",    note:"Best statistics dept in BD. Strong biostats and econometrics tracks." },
        { id:"ju",    tier:"strong", note:"Good statistics programme. Biostatistics focus." },
        { id:"ru",    tier:"strong", note:"Statistics dept. Good for regional students." },
        { id:"cu",    tier:"strong", note:"Statistics in Chittagong." },
        { id:"ku",    tier:"strong", note:"Statistics in Khulna." },
        { id:"jnu",   tier:"strong", note:"Statistics in Dhaka." },
        { id:"iu",    tier:"strong", note:"Statistics at Islamic University, Kushtia." },
      ],
      private: [
        { id:"nsu",    tier:"good",   note:"Applied statistics via Data Science programme." },
      ],
      admissionNote: "HSC Science with Mathematics required. Public universities are almost the only route.",
    },

    "botany": {
      public: [
        { id:"du",    tier:"top",    note:"Strong plant science + agricultural biotechnology." },
        { id:"ju",    tier:"strong", note:"Active botany research. Ethnobotany strength." },
        { id:"ru",    tier:"strong", note:"Large botany faculty." },
        { id:"cu",    tier:"strong", note:"Botany in Chittagong. Good for forest ecosystem research." },
        { id:"ku",    tier:"strong", note:"Botany in Khulna. Sundarbans ecosystem context." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"Botany in Rangpur." },
        { id:"cou",   tier:"strong", note:"Growing botany dept." },
      ],
      private: [],
      admissionNote: "HSC Science (Biology mandatory) required. Almost exclusively through public universities.",
    },

    "zoology": {
      public: [
        { id:"du",    tier:"top",    note:"Strong zoology + fisheries biology research." },
        { id:"ju",    tier:"strong", note:"Active zoology research. Wetland ecology strength." },
        { id:"ru",    tier:"strong", note:"Large zoology faculty." },
        { id:"cu",    tier:"strong", note:"Zoology in Chittagong. Marine biology context." },
        { id:"ku",    tier:"strong", note:"Zoology in Khulna. Sundarbans wildlife context." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"Zoology in Rangpur." },
        { id:"cou",   tier:"strong", note:"Zoology in Comilla." },
      ],
      private: [],
      admissionNote: "HSC Science (Biology mandatory) required. Almost exclusively through public universities.",
    },

    // ── Social Sciences ───────────────────────────────────────────────────

    "sociology": {
      public: [
        { id:"du",    tier:"top",    note:"Best sociology dept. Strong for NGO/research careers." },
        { id:"ju",    tier:"strong", note:"Active sociology research." },
        { id:"ru",    tier:"strong", note:"Good sociology programme." },
        { id:"cu",    tier:"strong", note:"Sociology in Chittagong." },
        { id:"ku",    tier:"strong", note:"Sociology in Khulna." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"Good regional option." },
        { id:"cou",   tier:"strong", note:"Growing sociology dept." },
      ],
      private: [
        { id:"diu",    tier:"good",   note:"Sociology available. Small cohort." },
        { id:"nsu",    tier:"good",   note:"Social Sciences programme." },
      ],
      admissionNote: "Open to Science, Commerce, and Arts HSC. Public universities are far stronger for sociology.",
    },

    "political-science": {
      public: [
        { id:"du",    tier:"top",    note:"Strong poli-sci + IR. Gateway to BCS, diplomacy, think tanks." },
        { id:"ju",    tier:"strong", note:"Government & Politics dept. Active research." },
        { id:"ru",    tier:"strong", note:"Large political science faculty." },
        { id:"cu",    tier:"strong", note:"Political Science in Chittagong." },
        { id:"ku",    tier:"strong", note:"Good poli-sci programme." },
        { id:"iu",    tier:"strong", note:"Political Science at Islamic University." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"Political Science in Rangpur." },
        { id:"cou",   tier:"strong", note:"Growing poli-sci." },
      ],
      private: [],
      admissionNote: "Open to all HSC groups. Public universities dominate this subject.",
    },

    "social-work": {
      public: [
        { id:"du",    tier:"top",    note:"Social Welfare & Research dept. Strong NGO sector ties." },
        { id:"ju",    tier:"strong", note:"Social Work programme." },
        { id:"ru",    tier:"strong", note:"Active social work faculty." },
        { id:"cu",    tier:"strong", note:"Social Work in Chittagong." },
        { id:"ku",    tier:"strong", note:"Social Work in Khulna." },
      ],
      private: [
        { id:"diu",    tier:"good",   note:"Social Work available." },
      ],
      admissionNote: "Open to all HSC groups. Strongly NGO/development sector focused.",
    },

    "public-administration": {
      public: [
        { id:"du",    tier:"top",    note:"Public Administration dept. Direct BCS pipeline. Very strong." },
        { id:"ju",    tier:"strong", note:"Government & Politics includes PA." },
        { id:"ru",    tier:"strong", note:"Public Administration faculty." },
        { id:"cu",    tier:"strong", note:"PA in Chittagong." },
        { id:"ku",    tier:"strong", note:"PA in Khulna." },
        { id:"brur",  tier:"strong", note:"PA in Rangpur." },
        { id:"bup",   tier:"strong", note:"Bangladesh University of Professionals. Military-affiliated but strong in governance." },
      ],
      private: [],
      admissionNote: "Open to all HSC groups. Primarily a gateway to BCS cadre service. Public universities are the only meaningful route.",
    },

    "development-studies": {
      public: [
        { id:"du",    tier:"top",    note:"Development Studies dept. Strong UNDP/NGO/World Bank pipeline." },
        { id:"ju",    tier:"strong", note:"Development Studies programme." },
        { id:"ru",    tier:"strong", note:"Growing development studies." },
      ],
      private: [
        { id:"bracu",  tier:"top",    note:"BRAC University — unique advantage. BRAC is the world's largest NGO. Direct exposure." },
        { id:"nsu",    tier:"strong", note:"Social Sciences with development focus." },
        { id:"iub",    tier:"strong", note:"Development Studies programme." },
      ],
      admissionNote: "Open to all HSC groups. BRAC University is an unusually strong private option due to direct NGO links.",
    },

    // ── Arts & Humanities ─────────────────────────────────────────────────

    "bangla": {
      public: [
        { id:"du",    tier:"top",    note:"Bangla Language & Literature dept is prestigious. Gateway to BCS Education cadre." },
        { id:"ju",    tier:"strong", note:"Active Bangla research. Literary culture on campus." },
        { id:"ru",    tier:"strong", note:"Large Bangla faculty." },
        { id:"cu",    tier:"strong", note:"Bangla in Chittagong." },
        { id:"ku",    tier:"strong", note:"Bangla in Khulna." },
        { id:"iu",    tier:"strong", note:"Bangla at Islamic University." },
        { id:"sust",  tier:"strong", note:"Bangla in Sylhet." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"jkkniu",tier:"strong", note:"Named after national poet Kazi Nazrul Islam. Strong literary culture." },
        { id:"brur",  tier:"strong", note:"Bangla in Rangpur." },
        { id:"cou",   tier:"strong", note:"Bangla in Comilla." },
      ],
      private: [
        { id:"ulab",   tier:"good",   note:"Bangla available. Liberal arts context." },
        { id:"diu",    tier:"good",   note:"Bangla department. Affordable." },
      ],
      admissionNote: "Open to all HSC groups. Strong choice for BCS Education cadre and media careers.",
    },

    "english-lit": {
      public: [
        { id:"du",    tier:"top",    note:"English dept is highly competitive. Strong for corporate comms and academia." },
        { id:"ju",    tier:"strong", note:"Active English research. Good for ELT/content careers." },
        { id:"ru",    tier:"strong", note:"Large English faculty." },
        { id:"cu",    tier:"strong", note:"English in Chittagong." },
        { id:"sust",  tier:"strong", note:"English in Sylhet. Good gateway to IELTS/ELT industry." },
        { id:"ku",    tier:"strong", note:"English in Khulna." },
        { id:"iu",    tier:"strong", note:"English at Islamic University." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"English in Rangpur." },
        { id:"cou",   tier:"strong", note:"English in Comilla." },
      ],
      private: [
        { id:"nsu",    tier:"top",    note:"Good English dept. Strong for corporate communications." },
        { id:"bracu",  tier:"top",    note:"Good English. Strong writing-focused curriculum." },
        { id:"iub",    tier:"strong", note:"English dept. Small cohort, good teaching." },
        { id:"ewu",    tier:"strong", note:"English with media electives." },
        { id:"ulab",   tier:"strong", note:"Liberal arts English — best private option for literature lovers." },
        { id:"diu",    tier:"good",   note:"English. Accessible. Large intake." },
      ],
      admissionNote: "Open to all HSC groups. One of the few subjects where strong private options exist alongside public.",
    },

    "history": {
      public: [
        { id:"du",    tier:"top",    note:"History dept with archival research facilities. Strong for BCS." },
        { id:"ju",    tier:"strong", note:"Active history research." },
        { id:"ru",    tier:"strong", note:"Large history faculty." },
        { id:"cu",    tier:"strong", note:"History in Chittagong." },
        { id:"ku",    tier:"strong", note:"History in Khulna." },
        { id:"iu",    tier:"strong", note:"History at Islamic University." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"History in Rangpur." },
        { id:"cou",   tier:"strong", note:"History in Comilla." },
      ],
      private: [
        { id:"ulab",   tier:"good",   note:"History available in liberal arts programme." },
      ],
      admissionNote: "Open to all HSC groups. Almost exclusively through public universities. Strong BCS gateway.",
    },

    "islamic-studies": {
      public: [
        { id:"du",    tier:"top",    note:"Islamic Studies dept. Strong for Shariah finance and BCS." },
        { id:"iu",    tier:"top",    note:"Islamic University, Kushtia — specialist institution. Best for Islamic Studies." },
        { id:"ru",    tier:"strong", note:"Large Islamic Studies faculty." },
        { id:"cu",    tier:"strong", note:"Islamic Studies in Chittagong." },
        { id:"ku",    tier:"strong", note:"Islamic Studies in Khulna." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"brur",  tier:"strong", note:"Islamic Studies in Rangpur." },
      ],
      private: [
        { id:"iiuc",   tier:"strong", note:"International Islamic University Chittagong. Specialist institution. Strong for Islamic finance and education." },
      ],
      admissionNote: "Open to all HSC groups. IU (Kushtia) and IIUC are the specialist options.",
    },

    "philosophy": {
      public: [
        { id:"du",    tier:"top",    note:"Philosophy dept. Gateway to ethics consulting, BCS, and academia." },
        { id:"ju",    tier:"strong", note:"Philosophy programme." },
        { id:"ru",    tier:"strong", note:"Large philosophy faculty." },
        { id:"cu",    tier:"strong", note:"Philosophy in Chittagong." },
        { id:"ku",    tier:"strong", note:"Philosophy in Khulna." },
        { id:"iu",    tier:"strong", note:"Philosophy at Islamic University." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
      ],
      private: [],
      admissionNote: "Open to all HSC groups. Exclusively through public universities in practice.",
    },

    // ── Professional & Applied ─────────────────────────────────────────────

    "law": {
      public: [
        { id:"du",    tier:"top",    note:"DU Law Faculty. Top lawyers, judges, and BCS (Judicial) cadre come from here." },
        { id:"ru",    tier:"strong", note:"Strong law faculty in Rajshahi." },
        { id:"cu",    tier:"strong", note:"Law in Chittagong. Strong for commercial law." },
        { id:"ju",    tier:"strong", note:"Law at Jahangirnagar." },
        { id:"ku",    tier:"strong", note:"Law in Khulna." },
        { id:"iu",    tier:"strong", note:"Law at Islamic University." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
      ],
      private: [
        { id:"nsu",    tier:"top",    note:"Best private law school. Corporate law focus." },
        { id:"bracu",  tier:"top",    note:"Good law. IP and international law are strengths." },
        { id:"ewu",    tier:"strong", note:"Good law programme. Active moot courts." },
        { id:"diu",    tier:"strong", note:"Large law intake. Affordable." },
        { id:"premier",tier:"good",   note:"Law in Chittagong. Good for local bar." },
        { id:"edu",    tier:"good",   note:"East Delta University law. Chittagong." },
        { id:"portcity",tier:"good",  note:"Law in Chittagong port city." },
      ],
      admissionNote: "Open to all HSC groups. 4-year LLB (Honours). Strong private options exist here unlike most humanities subjects.",
    },

    "pharmacy": {
      public: [
        { id:"du",    tier:"top",    note:"DU Pharmacy is the best. ~3–5% admission. Strong pharma industry links." },
        { id:"ju",    tier:"strong", note:"Good pharmacy programme. Active research." },
        { id:"ru",    tier:"strong", note:"Pharmacy at Rajshahi." },
        { id:"cu",    tier:"strong", note:"Pharmacy in Chittagong." },
        { id:"ku",    tier:"strong", note:"Pharmacy in Khulna." },
        { id:"sust",  tier:"strong", note:"Pharmacy in Sylhet." },
        { id:"nstu",  tier:"strong", note:"Pharmacy at Noakhali." },
        { id:"just",  tier:"strong", note:"Pharmacy at Jessore." },
        { id:"pust",  tier:"strong", note:"Pharmacy at Pabna." },
      ],
      private: [
        { id:"nsu",    tier:"top",    note:"Good pharmacy. Industry ties." },
        { id:"bracu",  tier:"top",    note:"Strong pharmacy programme." },
        { id:"ewu",    tier:"strong", note:"Pharmacy programme." },
        { id:"hamdard",tier:"strong", note:"Strong pharmacy tradition. Unani medicine research." },
        { id:"edu",    tier:"strong", note:"Pharmacy in Chittagong." },
        { id:"iiuc",   tier:"strong", note:"Pharmacy at IIUC." },
        { id:"kyau",   tier:"strong", note:"Pharmacy at Khwaja Yunus Ali University. Hospital attached." },
        { id:"iub",    tier:"strong", note:"Pharmacy at IUB." },
        { id:"diu",    tier:"good",   note:"Pharmacy. Large intake. Accessible." },
        { id:"ndub",   tier:"good",   note:"Notre Dame University. Pharmacy available." },
      ],
      admissionNote: "HSC Science (Chemistry + Biology mandatory) required. Very competitive at public universities.",
    },

    "mbbs": {
      public: [
        { id:"du",    tier:"top",    note:"Dhaka Medical College (DU-affiliated). Most competitive public medical seat in BD." },
        { id:"ru",    tier:"top",    note:"Rajshahi Medical College. Second tier public medical." },
        { id:"cu",    tier:"top",    note:"Chittagong Medical College." },
        { id:"ju",    tier:"strong", note:"Mymensingh Medical College (MAG Osmani affiliated)." },
      ],
      private: [
        { id:"kyau",   tier:"strong", note:"Khwaja Yunus Ali Hospital attached. Good clinical exposure." },
        { id:"hamdard",tier:"good",   note:"Hamdard University — Unani & MBBS." },
      ],
      admissionNote: "HSC Science (Biology + Chemistry mandatory). GPA 9.0+ (with 4th subject) required for public. MBBS admission is centrally managed by DGHS. ~10% admission rate for public seats. Private medical colleges are separate from UGC and regulated by BMDC.",
      specialNote: "⚠ Medical education in Bangladesh is regulated by BMDC (Bangladesh Medical & Dental Council), not UGC. There are 37 government medical colleges and ~70+ private colleges. The annual centralized MBBS admission test (MCQ) determines public seat allocation.",
    },

    "nursing": {
      public: [
        { id:"du",    tier:"strong", note:"Nursing institute affiliated with Dhaka Medical. Clinical exposure is unmatched." },
      ],
      private: [],
      admissionNote: "⚠ Nursing education is regulated by Bangladesh Nursing and Midwifery Council (BNMC). Most institutes are nursing-specific (not university departments). Duration: 4-year B.Sc in Nursing. Clinical hospital attachment is mandatory.",
      specialNote: "Nursing institutes are separate from the UGC university system. Key public institutes: Dhaka Nursing College, Bangladesh Nursing Academy, and attached to all public medical colleges. Private options: Popular Nursing College, Holy Family, Square Hospital institutes.",
    },

    // ── Creative & Media ──────────────────────────────────────────────────

    "graphic-design": {
      public: [
        { id:"du",    tier:"top",    note:"Faculty of Fine Arts, DU. Highly competitive. 4-year BFA in Graphic Design." },
        { id:"ju",    tier:"strong", note:"Fine Arts dept at Jahangirnagar. Good studio culture." },
        { id:"cu",    tier:"strong", note:"Fine Arts in Chittagong." },
        { id:"jkkniu",tier:"strong", note:"Fine Arts focus. Named after Nazrul — strong cultural atmosphere." },
        { id:"ku",    tier:"strong", note:"Fine Arts and Drawing." },
      ],
      private: [
        { id:"smuct",  tier:"strong", note:"Specialist in creative technology. Best private for design." },
        { id:"ulab",   tier:"strong", note:"Good design programme. Liberal arts context." },
        { id:"tuca",   tier:"good",   note:"Tagore University — creative arts specialist." },
        { id:"bracu",  tier:"strong", note:"Architecture + design. UI/UX taught alongside." },
        { id:"nsu",    tier:"good",   note:"UI/UX component in architecture." },
      ],
      admissionNote: "Portfolio or drawing test required at most institutions. HSC group is secondary to portfolio quality. Public Fine Arts faculties are the most prestigious.",
    },

    "journalism": {
      public: [
        { id:"du",    tier:"top",    note:"Mass Communication & Journalism dept at DU. Best journalists in BD come from here." },
        { id:"ju",    tier:"strong", note:"Journalism & Media Studies dept. Active student publications." },
        { id:"ru",    tier:"strong", note:"Mass Communication in Rajshahi." },
        { id:"cu",    tier:"strong", note:"Journalism in Chittagong." },
        { id:"sust",  tier:"strong", note:"Mass Communication in Sylhet." },
        { id:"jnu",   tier:"strong", note:"Accessible from Dhaka." },
        { id:"ku",    tier:"strong", note:"Mass Communication in Khulna." },
      ],
      private: [
        { id:"bracu",  tier:"top",    note:"Good journalism. BRAC's development work provides context." },
        { id:"nsu",    tier:"strong", note:"Media and Communications programme." },
        { id:"stamford",tier:"strong",note:"Stamford — known for journalism and media. Active news lab." },
        { id:"diu",    tier:"good",   note:"Journalism available. Large intake." },
        { id:"ulab",   tier:"strong", note:"Media + journalism with liberal arts integration." },
        { id:"iub",    tier:"strong", note:"Media & Communication at IUB." },
      ],
      admissionNote: "Open to all HSC groups. Strong writing skills matter more than group. Public DU is the gold standard.",
    },

    // ── Agriculture & Natural Resources ───────────────────────────────────

    "agriculture": {
      public: [
        { id:"bau",    tier:"top",    note:"Bangladesh Agricultural University, Mymensingh. Best agri institution. Very competitive." },
        { id:"sau",    tier:"strong", note:"Sher-e-Bangla Agricultural University, Dhaka. Strong in crop science." },
        { id:"pstu",   tier:"strong", note:"PSTU in Patuakhali. Coastal agriculture focus." },
        { id:"hstu",   tier:"strong", note:"HSTU in Dinajpur. Northwest agriculture region." },
        { id:"sust",   tier:"strong", note:"Agri + food tech at SUST." },
        { id:"sau_sylhet",tier:"strong",note:"Sylhet Agricultural University. Northeast region." },
        { id:"bsmrstu",tier:"strong", note:"Gopalganj S&T University. Agriculture available." },
        { id:"just",   tier:"strong", note:"Agriculture at Jessore Uni." },
        { id:"nstu",   tier:"strong", note:"Food Science & Nutrition related." },
      ],
      private: [
        { id:"iubat",  tier:"good",   note:"IUBAT has agriculture programme. Affordable." },
        { id:"ebaub",  tier:"good",   note:"Exim Bank Agricultural University. Specialist agri." },
        { id:"diu",    tier:"good",   note:"Agriculture available at DIU." },
      ],
      admissionNote: "HSC Science with Biology required. BAU is the primary destination — very competitive. GST cluster for public agri universities.",
    },

    "fisheries": {
      public: [
        { id:"bau",    tier:"top",    note:"Fisheries faculty at BAU. Best aquaculture research in BD." },
        { id:"ku",     tier:"strong", note:"Fisheries and Marine Resource Management at KU." },
        { id:"pstu",   tier:"strong", note:"Fisheries at PSTU. Coastal/marine context." },
        { id:"hstu",   tier:"strong", note:"Fisheries at HSTU." },
        { id:"cvasu",  tier:"strong", note:"Aquatic science at CVASU, Chittagong." },
        { id:"sau_sylhet",tier:"strong",note:"Fisheries at Sylhet Agri Uni." },
      ],
      private: [],
      admissionNote: "HSC Science with Biology required. Primarily through public agricultural and general universities. Very limited private options.",
    },

    "forestry": {
      public: [
        { id:"bau",    tier:"top",    note:"Forestry faculty at BAU. Best forestry education in BD." },
        { id:"ku",     tier:"strong", note:"Forestry & Wood Technology at KU. Sundarbans proximity is an asset." },
        { id:"sust",   tier:"strong", note:"Forestry & Environmental Science at SUST." },
        { id:"bsmrstu",tier:"strong", note:"Forestry available at Gopalganj S&T." },
      ],
      private: [],
      admissionNote: "HSC Science with Biology required. Very limited options — BAU and KU are the primary destinations.",
    },

  }; // end SubjectUniversities
})();
