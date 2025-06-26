import { SentenceTemplate } from '../types';

export const SENTENCE_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about",
    "template": "I want to learn {subject} about {topic}",
    "blanks": [
      {
        "id": "subject",
        "placeholder": "what",
        "options": [
          "the basics", "advanced concepts", "practical applications", "history", "theory", "fundamentals", "everything",
          "a complete overview of", "a critical analysis of", "a deep dive into", "a beginner's guide to", "a brief history of",
          "a comprehensive guide to", "a timeline of", "an expert take on", "an introduction to", "a visual guide to",
          "the art of", "the best practices for", "the business side of", "the common mistakes in", "the common misconceptions about",
          "the core principles of", "the controversies surrounding", "the cultural impact of", "the data behind",
          "the day-to-day reality of", "the different schools of thought on", "the economic drivers of", "the environmental impact of",
          "the essential terminology for", "the ethical considerations of", "the evolution of", "the failures in",
          "the financial models of", "the future of", "the global perspective on", "the hidden story of", "the historical context of",
          "the key debates on", "the key figures in", "the language of", "the latest research on", "the legal framework of",
          "the long-term effects of", "the main figures behind", "the marketing of", "the mathematical foundations of",
          "the mythology of", "the narrative of", "the patterns within", "the philosophical underpinnings of",
          "the political dimensions of", "the psychological effects of", "the science behind", "the secret history of",
          "the short-term effects of", "the social implications of", "the step-by-step process of", "the structure of",
          "the success stories in", "the supply chain of", "the technological aspects of", "the tools used for",
          "the unanswered questions about", "the underlying mechanisms of", "a case study of", "a comparative analysis of",
          "a first-principles look at", "the key components of", "the origins of", "the key differences in",
          "the primary sources for", "the modern applications of", "the ancient wisdom of", "the statistical basis for",
          "the beginner, intermediate, and advanced stages of", "the commercial use of", "the DIY approach to",
          "the minimalist guide to", "the maximalist guide to", "the forensic analysis of", "the socioeconomic factors of",
          "the top 10 principles of", "the unspoken rules of", "the forgotten chapters of", "the high-level architecture of",
          "the low-level details of", "the competitive landscape of", "the strategic importance of", "the artistic interpretation of",
          "the molecular basis of", "the quantum mechanics of", "the neurological basis of", "the historical inaccuracies of",
          "the pop culture representation of", "the gamification of", "the data-driven approach to", "the human side of",
          "the quantitative analysis of", "the qualitative analysis of", "the automation of", "the UX/UI principles for",
          "the core curriculum of", "the advanced curriculum of", "the investment strategies for", "the health benefits of",
          "the spiritual side of", "the geopolitical impact of"
        ]
      },
      {
        "id": "topic",
        "placeholder": "topic",
        "options": [
          // Current 137
          "quantum physics", "machine learning", "cooking", "photography", "guitar playing", "stock trading", "web development", "3D printing", "accounting", "aerospace engineering", "agile methodologies", "American history", "ancient civilizations", "anthropology", "archaeology", "architecture", "artificial intelligence", "astronomy", "astrophysics", "augmented reality", "behavioral economics", "biochemistry", "bioinformatics", "marine biology", "blockchain technology", "botany", "Buddhism", "calligraphy", "capitalism", "carbon capture", "cell biology", "chaos theory", "chemical engineering", "Christianity", "civics", "civil engineering", "classical music", "climate change", "cloud computing", "cognitive behavioral therapy", "cognitive science", "the Cold War", "communism", "computer graphics", "computer vision", "constitutional law", "creative writing", "criminology", "CRISPR gene editing", "cryptocurrency", "cryptography", "cubism", "cybersecurity", "data science", "data visualization", "democracies", "DevOps", "digital marketing", "e-commerce", "ecology", "economics", "electrical engineering", "emotional intelligence", "entrepreneurship", "epigenetics", "ethics", "evolutionary biology", "existentialism", "fashion design", "film making", "game development", "game theory", "gardening", "generative AI", "genetics", "geology", "geopolitics", "graphic design", "hip-hop culture", "Hinduism", "home repair", "immunology", "impressionism", "the industrial revolution", "information theory", "interior design", "investment banking", "Islam", "jazz history", "journalism", "Judaism", "linguistics", "logic", "macroeconomics", "materials science", "mechanical engineering", "media studies", "meditation", "microbiology", "microeconomics", "mindfulness", "mobile app development", "modern art", "molecular biology", "music production", "music theory", "mycology", "mythology", "natural language processing", "negotiation", "neuroscience", "nuclear fusion", "nuclear physics", "nursing", "nutrition", "organic chemistry", "paleontology", "permaculture", "personal finance", "pharmacology", "philosophy", "photosynthesis", "planetary science", "political science", "project management", "psychology", "public speaking", "quantum computing", "real estate", "Renaissance art", "renewable energy", "robotics", "the Roman Empire", "sociology", "software engineering", "stoicism", "string theory", "supply chain management", "sustainable agriculture", "synthetic biology", "Taoism", "thermodynamics", "typography", "UI/UX design", "urban planning", "venture capital", "virtual reality", "virology", "woodworking", "world history", "zoology",
          // 1300+ New Topics
          "acoustics", "acting", "acupressure", "acupuncture", "aerodynamics", "aesthetics", "African history", "agricultural science", "air traffic control", "alchemy", "algebra", "alternative medicine", "analog electronics", "analytical chemistry", "anatomy", "anesthesiology", "animal behavior", "animation", "Antarctic exploration", "applied mathematics", "aquaculture", "aquascaping", "Arabic language", "arbitrage", "arboriculture", "archery", "Aristotelian logic", "art conservation", "art history", "art therapy", "arthropodology", "artificial neural networks", "Asian history", "asset allocation", "astrobiology", "astrology", "astronautics", "atomic physics", "audiology", "auditing", "Australian history", "authoritarianism", "autism spectrum disorders", "automotive design", "automotive engineering", "automotive repair", "avian biology", "aviation", "Aztec civilization", "Babylonian history", "baking", "ballet", "ballroom dancing", "bamboo construction", "banking", "bankruptcy law", "bartending", "basket weaving", "bass guitar", "batik", "beekeeping", "behavioral psychology", "Bengali language", "Big Bang cosmology", "Big Data analytics", "bioacoustics", "bioarchaeology", "bio-ceramics", "bioconjugation", "biodegradable plastics", "biodiversity", "bioelectricity", "bioethics", "biofuels", "biogeography", "bio-inspired design", "bioluminescence", "biomaterials", "biomechanics", "biomedical engineering", "biometrics", "biomimicry", "biophysics", "bioplastics", "bioremediation", "biosensors", "biostatistics", "biosynthesis", "biotechnology", "bird watching", "blacksmithing", "blogging", "boating", "body language", "bonsai", "bookbinding", "Boolean algebra", "brand management", "Brazilian Jiu-Jitsu", "bread making", "brewing", "bricklaying", "bridge (card game)", "broadcast journalism", "bryology", "building science", "business ethics", "business intelligence", "business law", "business strategy", "Byzantine history", "C programming", "C# programming", "C++ programming", "cabinet making", "cable management", "calculus", "Cambodian history", "camping", "Canadian history", "cancer biology", "candlemaking", "canoeing", "canopy science", "carbohydrate chemistry", "cardiology", "card magic", "cartography", "carving", "cascade effects", "casting (metal)", "cat behavior", "catalysis", "category theory", "CBT (Cognitive Behavioral Therapy)", "celebrity culture", "celestial mechanics", "Celtic history", "cement chemistry", "ceramics", "cetology", "Chakras", "chanting", "character design", "charcoal drawing", "cheese making", "chemical kinetics", "chemical synthesis", "chess", "child development", "child psychology", "Chinese history", "Chinese language (Mandarin)", "Chinese language (Cantonese)", "chiropractic", "choral music", "choreography", "chromatography", "cinematography", "circuit design", "circular economy", "circus arts", "cisgenesis", "city planning", "civil liberties", "civil rights history", "classical mechanics", "classification of species", "claymation", "climatology", "climbing", "clinical psychology", "clockmaking", "clothing design", "cloud architecture", "cloud seeding", "clowning", "cob construction", "cobalt chemistry", "cocktail making", "code-breaking", "codicology", "cognitive dissonance", "cognitive linguistics", "cognitive neuroscience", "cohousing", "coin collecting", "cold reading", "collaborative filtering", "collage art", "collective bargaining", "collective intelligence", "color grading", "color theory", "comedy writing", "cometology", "comic book art", "commercial law", "common law", "communication design", "community gardening", "community organizing", "comparative anatomy", "comparative literature", "comparative mythology", "comparative politics", "compassion", "competitive programming", "compiler design", "complex analysis", "complex systems", "component-based architecture", "composite materials", "composition (music)", "computational biology", "computational chemistry", "computational fluid dynamics", "computational geometry", "computational linguistics", "computational neuroscience", "computational photography", "computational physics", "computer-aided design (CAD)", "computer forensics", "computer hardware engineering", "computer networking", "computer security", "conceptual art", "concrete technology", "concurrent programming", "condensed matter physics", "conflict resolution", "Confucianism", "conformal field theory", "conservation biology", "conservation science", "conspiracy theories", "construction management", "constructivism (art)", "consumer psychology", "container gardening", "containerization (e.g., Docker)", "contemporary dance", "content marketing", "content strategy", "contract law", "control systems engineering", "convection", "convergence (economics)", "conversion rate optimization", "cooperatives", "copper chemistry", "copywriting", "coral reef ecology", "corporate finance", "corporate law", "corporate social responsibility", "corpus linguistics", "cosmetic chemistry", "cosmochemistry", "cosmology", "costume design", "counter-culture movements", "counter-terrorism", "couple therapy", "couture", "craniosacral therapy", "creative coding", "credit derivatives", "criminal justice", "critical thinking", "Croatian language", "crop science", "cross-cultural psychology", "cross-stitch", "crowdfunding", "crustaceology", "cryobiology", "cryogenics", "cryonics", "cryptanalysis", "crystal growing", "crystal healing", "crystallography", "cubist poetry", "cuisine", "cults", "cultural anthropology", "cultural geography", "cultural heritage", "cultural studies", "currency trading (Forex)", "customer relationship management (CRM)", "customer success", "cyber-espionage", "cybernetics", "cycling", "cytology", "Czech language", "dadaism", "dairy farming", "dance history", "dance therapy", "dark matter & dark energy", "data architecture", "data engineering", "data ethics", "data governance", "data journalism", "data mining", "data modeling", "data warehousing", "database administration", "database design", "DBT (Dialectical Behavior Therapy)", "decentralized finance (DeFi)", "decentralized autonomous organizations (DAOs)", "decision theory", "decolonization", "deconstruction (philosophy)", "deep ecology", "deep learning", "deep sea biology", "deer hunting", "demography", "dendrochronology", "dendrology", "dental hygiene", "dermatology", "desalination", "descriptive geometry", "design patterns (software)", "design thinking", "desktop publishing", "developmental biology", "developmental psychology", "dialectics", "diamond cutting", "dietetics", "differential equations", "differential geometry", "diffraction", "digital anthropology", "digital art", "digital audio workstations (DAW)", "digital citizenship", "digital forensics", "digital illustration", "digital logic", "digital painting", "digital sculpting", "digital signal processing (DSP)", "digital-to-analog converters", "diplomacy", "disability studies", "disaster relief", "discourse analysis", "discrete mathematics", "distillation", "distributed computing", "diving", "divination", "DJing", "DNA sequencing", "documentary filmmaking", "dog training", "dog breeds", "dolmens", "domain-driven design", "dominoes", "drama", "drawing", "dream analysis", "dressage", "drone technology", "drumming", "dry stone walling", "dumpster diving", "Dutch language", "dwarf planets", "dyeing", "dynamic programming", "dyslexia", "e-sports", "early childhood education", "earth sciences", "earthquake engineering", "earthships", "Eastern European history", "ecocriticism", "ecofeminism", "ecolinguistics", "econometrics", "economic development", "economic geography", "economic history", "economic inequality", "economic sociology", "ecopsychology", "ecotoxicology", "Ecuadorian history", "edible wild plants", "education policy", "educational psychology", "educational technology", "eels", "Egyptian hieroglyphs", "Egyptian history (ancient)", "Egyptian history (modern)", "elastomers", "elder care", "election forecasting", "electric vehicles", "electrocardiography (ECG)", "electrochemistry", "electrodynamics", "electroencephalography (EEG)", "electrolysis", "electromagnetism", "electronic music", "electronics", "electro-optics", "electroplating", "electrosurgery", "elemental analysis", "elementary particle physics", "embedded systems", "embroidery", "embryology", "emergency medicine", "emergent behavior", "emoticon history", "emotional design", "empires", "empirical research", "employee relations", "enameling", "enantiomers", "encryption", "endocrinology", "end-of-life care", "energy efficiency", "energy healing", "energy policy", "enology (winemaking)", "entomology", "environmental chemistry", "environmental DNA (eDNA)", "environmental economics", "environmental engineering", "environmental ethics", "environmental history", "environmental justice", "environmental law", "environmental microbiology", "environmental policy", "environmental psychology", "environmental remediation", "environmental science", "environmental sociology", "enzymology", "ephemera", "epidemiology", "epistemology", "equestrianism", "ergonomics", "erosion control", "espionage", "Estonian language", "etching", "ethnobotany", "ethnoecology", "ethnomusicology", "ethnopoetics", "ethology", "etymology", "eugenics", "eukaryotic cells", "European history", "euthanasia", "event management", "evidence-based medicine", "evolution of language", "exoplanetology", "experimental archaeology", "experimental economics", "experimental film", "experimental music", "experimental physics", "experimental psychology", "expert systems", "expressionism", "extrasolar planets", "extreme weather", "eye tracking", "fabric design", "facial recognition", "falconry", "family law", "family therapy", "fan fiction", "fantasy literature", "farming", "fashion history", "fashion illustration", "fat chemistry", "fats and oils", "fault tolerance", "fauna", "fauvism", "feng shui", "fermentation", "ferrofluids", "fertility", "festivals", "feudalism", "fiber optics", "fictional languages", "field hockey", "field recording", "figure drawing", "figure skating", "Fijian history", "file systems", "Filipino (Tagalog) language", "film criticism", "film history", "film noir", "film preservation", "film production", "film scoring", "film theory", "filter feeding", "financial accounting", "financial analysis", "financial engineering", "financial law", "financial markets", "financial modeling", "financial planning", "financial regulation", "fine art", "Finnish language", "fire safety", "firefighting", "first aid", "fiscal policy", "fish farming", "fisheries science", "fishing", "fission", "fitness", "flag design (vexillology)", "flamenco", "flavor chemistry", "flipping (reselling)", "floral design", "floristry", "floriography", "flow state", "fluid dynamics", "fluorescence", "fly fishing", "fly tying", "folklore", "food chemistry", "food preservation", "food science", "food security", "food styling", "footwear design", "foraging", "force fields", "foreign policy", "forensic accounting", "forensic anthropology", "forensic chemistry", "forensic engineering", "forensic linguistics", "forensic psychology", "forensic science", "forest bathing (shinrin-yoku)", "forest ecology", "forestry", "forging", "formal verification", "fossil fuels", "fossils", "fountain pen mechanics", "Fourier analysis", "fractal geometry", "franchising", "free diving", "free market capitalism", "free software movement", "free will", "freemasonry", "freestyle rap", "French cuisine", "French history", "French language", "frequency analysis", "freshwater biology", "friction", "friendship", "frugality", "fruit cultivation", "fuchsia cultivation", "fuel cells", "functional programming", "functional medicine", "fungi", "furniture design", "fusion power", "futurology", "fuzzy logic", "galactic astronomy", "Galois theory", "gambling", "game design", "gamification", "gamma-ray bursts", "gardening styles", "gas chromatography", "gastronomy", "gastro-physics", "gatekeeping", "gemology", "gender studies", "gene drives", "gene editing", "genealogy", "general relativity", "generative art", "genetic algorithms", "genetic counseling", "genetic engineering", "genetic modification", "genome sequencing", "genomics", "genre studies", "geobiology", "geocaching", "geochemistry", "geochronology", "geodesy", "geographical information systems (GIS)", "geohazards", "geoinformatics", "geological mapping", "geomagnetism", "geometric optics", "geometry", "geomorphology", "geophysics", "Georgian language", "geospatial analysis", "geostatistics", "geothermal energy", "geriatrics", "German history", "German language", "gerontology", "gestalt psychology", "gesture", "Ghanaian history", "ghostwriting", "giant squid", "gifted education", "gig economy", "gilding", "glassblowing", "glazing (pottery)", "gliding", "global health", "global history", "globalization", "Gnosticism", "Go (game)", "goal setting", "Goethe's theory of colors", "gold mining", "goldsmithing", "golf", "gondola construction", "gothic architecture", "gothic literature", "governance", "GPS technology", "graffiti art", "grammar", "graph theory", "graphical user interfaces (GUI)", "gravitational waves", "gravity", "gray goo", "Great Wall of China", "Greek history (ancient)", "Greek history (modern)", "Greek language", "Greek mythology", "green chemistry", "green infrastructure", "greenhouse effect", "greenhouse management", "grief counseling", "grid computing", "group dynamics", "group theory", "growth hacking", "guerrilla gardening", "guerrilla marketing", "guided imagery", "gun control debate", "gunsmithing", "gut microbiome", "gymnastics", "gyroscopes", "hagiography", "haiku", "hair styling", "ham radio", "hand-eye coordination", "handicrafts", "handwriting analysis", "haptics", "hard science fiction", "hardware engineering", "harmonica", "harmony (music)", "Hawaiian history", "Hawaiian language", "hazardous waste management", "headhunting (recruitment)", "health economics", "health informatics", "health policy", "healthcare administration", "hearing science", "heart anatomy", "heat transfer", "Hebrew language", "hedging (finance)", "Hegelian dialectic", "heliophysics", "helioseismology", "hematology", "heraldry", "herbalism", "herding", "hermeneutics", "herpetology", "heuristics", "hibernation", "holography", "home automation", "home brewing", "home economics", "homeopathy", "hominid evolution", "horology (study of time)", "horse breeding", "horse racing", "horticulture", "hospitality management", "host-pathogen interaction", "hot air ballooning", "houseplants", "housing policy", "human-computer interaction (HCI)", "human anatomy", "human augmentation", "human-centered design", "human evolution", "human factors", "human geography", "human migration", "human nutrition", "human physiology", "human resources", "human rights", "humanism", "humor", "Hungarian history", "Hungarian language", "hunting", "hurricanes", "hybrid vehicles", "hydraulic engineering", "hydrobiology", "hydro-climatology", "hydroelectric power", "hydrofoil technology", "hydrogen fuel cells", "hydrogeology", "hydrography", "hydrology", "hydrometallurgy", "hydroponics", "hydrotherapy", "hygiene", "hymnology", "hyper-reality", "hyperbolic geometry", "hypermedia", "hypnosis", "hypnotherapy", "ice carving", "ice climbing", "ice hockey", "ice skating", "Icelandic language", "ichthyology", "iconography", "idealism", "ideology", "idioms", "ikebana", "Illuminati", "illustration", "image processing", "imagism", "imitation", "immigrant studies", "immunogenetics", "immunotherapy", "improvisation (music)", "improvisational theatre", "Incan civilization", "incense making", "income inequality", "incunabula", "Indian classical music", "Indian cuisine", "Indian history", "Indian philosophy", "indigenous rights", "Indonesian history", "Indonesian language", "indoor gardening", "industrial design", "industrial engineering", "industrial organization", "industrial psychology", "infectious diseases", "inference", "inflation", "information architecture", "information retrieval", "information security", "information visualization", "infrared astronomy", "infrared spectroscopy", "infrastructure", "inorganic chemistry", "insect farming", "institutional economics", "instrumentalism", "insulation", "insurance", "intangible cultural heritage", "integrated circuits", "intellectual history", "intellectual property law", "intelligence (espionage)", "intelligent agents", "interactive design", "interactive fiction", "intercultural communication", "interfacial chemistry", "interferometry", "intergovernmental organizations (IGOs)", "interior architecture", "interlingua", "international business", "international development", "international economics", "international law", "international relations", "international trade", "internet history", "internet of things (IoT)", "internet privacy", "internet protocols (TCP/IP)", "interpersonal skills", "interpolation", "interpretive dance", "interstellar travel", "interviewing techniques", "intraday trading", "intrapersonal intelligence", "investment management", "ion channels", "ionic bonding", "ionospheric physics", "Iranian history", "Iraqi history", "Irish history", "Irish language", "ironwork", "irrigation", "Israeli history", "Italian cuisine", "Italian history", "Italian language", "ivory trade", "jacket design", "jade carving", "Jainism", "Jamaican history", "Japanese art", "Japanese cuisine", "Japanese history", "Japanese language", "Javanese language", "jazz dance", "jet propulsion", "jewelry making", "Jewish history", "jigsaws", "judo", "Jungian psychology", "jurisprudence", "juggling", "kabbalah", "kanban", "karate", "karting", "kayaking", "kempo", "Kenyan history", "kitesurfing", "knifemaking", "knitting", "knot theory", "knowledge management", "kombucha brewing", "Korean cuisine", "Korean history", "Korean language", "Krav Maga", "kung fu", "Kurdish history", "labor economics", "labor history", "labor law", "lacrosse", "lactation", "lake ecology", "lamination", "land art", "land reform", "land restoration", "landscape architecture", "landscape painting", "landscape photography", "landslides", "language acquisition", "language preservation", "lapidary", "large-scale integration (LSI)", "laryngology", "laser cutting", "laser technology", "Latin American history", "Latin language", "lattice theory", "Latvian language", "laughing", "laundry science", "law enforcement", "leadership", "lean manufacturing", "learning disabilities", "learning theory", "leasing", "leatherworking", "Lebanese history", "legal history", "legal reasoning", "legal writing", "legends", "legislation", "Lego building", "lenses", "lenticular printing", "lepidopterology", "letterpress printing", "lexicography", "libertarianism", "library science", "lichenology", "lie detection", "life coaching", "life extension", "life sciences", "lifeguarding", "light therapy", "lighthouses", "lighting design", "limericks", "limnology", "linear algebra", "linear programming", "linguistic anthropology", "lipidomics", "liquid crystals", "lithium-ion batteries", "lithography", "lithuanian language", "livestock management", "living walls", "lobbying", "local government", "lockpicking", "locks", "locomotives", "logic puzzles", "logistics", "logography", "loneliness", "longevity", "long-form journalism", "loop quantum gravity", "love", "low-temperature physics", "lucid dreaming", "luge", "luminescence", "lunar geology", "lunar missions", "lutherie (instrument making)", "luxury brand management", "lyric writing", "M-theory", "machine ethics", "machine translation", "machining", "macro-photography", "macrame", "mad science", "magic", "magnetism", "magneto-hydrodynamics", "magnetoreception", "magnets", "Mahjong", "mail art", "make-up artistry", "Malaysian history", "malacology", "malware analysis", "mammalogy", "management consulting", "management theory", "manicuring", "mantras", "manufacturing engineering", "manuscript illumination", "Maori history", "map making", "marathon running", "marble sculpture", "marbling (paper)", "marine archaeology", "marine biotechnology", "marine chemistry", "marine conservation", "marine engineering", "marine geology", "marine pollution", "marionettes", "market research", "market segmentation", "marketing analytics", "marketing automation", "marketing strategy", "marquetry", "marriage counseling", "martial arts", "Marxism", "masonry", "mass communication", "mass spectrometry", "massage therapy", "materials engineering", "maternal health", "mathematical biology", "mathematical finance", "mathematical logic", "mathematical modeling", "mathematical physics", "mathematics education", "matriarchy", "Mayan civilization", "maze generation", "measure theory", "meat science", "mechatronics", "media bias", "media effects", "media literacy", "media production", "media psychology", "medical anthropology", "medical diagnostics", "medical ethics", "medical history", "medical illustration", "medical imaging", "medical law", "medical physics", "medical sociology", "medical terminology", "medicinal chemistry", "medieval history", "megastructures", "meiosis", "melittology", "membrane biology", "memetics", "memory techniques", "mental health", "merchandising", "mesopotamian history", "metacognition", "meta-ethics", "metal detecting", "metal forming", "metal casting", "metallurgy", "metalworking", "metamaterials", "metaphor", "metaphysics", "meteorites", "meteorology", "meter (poetry)", "method acting", "metrology", "Mexican history", "micro-apartments", "micro-brewing", "micro-controllers", "micro-dosing", "micro-economics", "micro-electronics", "micro-farming", "micro-fauna", "micro-finance", "micro-fluidics", "micro-gravity", "micro-histology", "micro-hydro power", "micro-machining", "micro-management", "micro-meteorology", "micro-mobility", "micro-mosaics", "micro-organisms", "micro-plastics", "micro-propagation", "micro-scopy", "micro-services", "micro-surgery", "micro-tonal music", "micro-wave engineering", "midwifery", "military history", "military strategy", "milk chemistry", "millinery (hat making)", "milling", "mime", "mind control", "mind mapping", "mind-body problem", "mindfulness-based stress reduction (MBSR)", "mineralogy", "minimalism", "mining engineering", "Minoan civilization", "mirror making", "misinformation", "missile guidance systems", "missionary work", "mitochondrial biology", "mitosis", "mixed martial arts (MMA)", "mnemonics", "mobile forensics", "model building", "model railroading", "model theory", "modern dance", "modern history", "modernism (art)", "molecular gastronomy", "molecular genetics", "molecular mechanics", "molecular modeling", "mollusc culture", "monarchy", "monasticism", "monetary policy", "money laundering", "Mongolian history", "monkeys", "monocles", "monoculture", "monorails", "montage (film)", "Montessori education", "monumental sculpture", "moon landings", "moral psychology", "morality", "Moroccan history", "morphology (linguistics)", "mortgage banking", "mosaics", "mosses", "motivational psychology", "motorcycle maintenance", "motorcycle racing", "mountaineering", "mouse genetics", "movement ecology", "movie props", "muay thai", "mud bricks", "multiculturalism", "multilateralism", "multimedia journalism", "multinational corporations", "multiple intelligences", "multiverse theory", "mummification", "municipal bonds", "mural painting", "museology (museum studies)", "mushroom cultivation", "music cognition", "music education", "music ethnography", "music information retrieval", "music performance", "music psychology", "music therapy", "musical improvisation", "musical theatre", "musicals", "musicology", "mycoremediation", "myrmecology", "mystery novels", "mysticism", "nanobots", "nanomaterials", "nanomedicine", "nanotechnology", "narratology", "national parks", "nationalism", "native american history", "natural building", "natural dyeing", "natural farming", "natural gas", "natural hazards", "natural history", "natural law", "natural philosophy", "natural remedies", "natural language understanding (NLU)", "naturopathy", "nautical archaeology", "naval architecture", "naval history", "navigation", "Nazism", "near-death experiences", "needlepoint", "negligence", "neoclassicism", "neocolonialism", "Neolithic history", "neoliberalism", "neonatology", "neoteny", "nepotism", "network security", "network theory", "neural engineering", "neuro-linguistic programming (NLP)", "neuroanatomy", "neuroaesthetics", "neurochemistry", "neuro-economics", "neuro-ethics", "neuro-gastronomy", "neuro-genetics", "neuro-imaging", "neuro-immunology", "neuro-informatics", "neuro-law", "neuro-marketing", "neuro-mechanics", "neuropathology", "neuro-pharmacology", "neuro-philosophy", "neuro-plasticity", "neuro-prosthetics", "neuro-psychology", "neuro-radiology", "neuro-science of sleep", "neuro-theology", "neuro-transmitters", "neutrality", "neutrino physics", "new media art", "New Zealand history", "news production", "Newtonian physics", "Nicaraguan history", "Nigerian history", "nihilism", "ninjas", "nomadism", "non-Euclidean geometry", "non-governmental organizations (NGOs)", "non-profit management", "non-verbal communication", "Norse mythology", "North Korean politics", "Norwegian language", "notaphily (banknote collecting)", "novel writing", "nuclear chemistry", "nuclear engineering", "nuclear magnetic resonance (NMR)", "nuclear medicine", "nuclear policy", "nuclear proliferation", "nuclear safety", "nuclear waste management", "nuclear weapons", "number theory", "numerical analysis", "numismatics (coin collecting)", "nunchaku", "nursery management", "nursing ethics", "nutrient cycling", "nutrition science", "object-oriented programming (OOP)", "observational astronomy", "observational comedy", "obsessive-compulsive disorder (OCD)", "obstetrics", "ocean acidification", "ocean circulation", "ocean engineering", "ocean exploration", "oceanography", "ocean thermal energy conversion (OTEC)", "occultism", "occupational therapy", "off-grid living", "office politics", "offshore drilling", "oil painting", "old age", "olfaction (sense of smell)", "oligarchy", "olive oil production", "olympic history", "oncology", "online advertising", "online communities", "online dating", "online privacy", "ontology", "opera", "operating systems", "operations management", "operations research", "ophthalmology", "opinion polling", "optical computing", "optical engineering", "optical illusions", "optics", "optimal control theory", "options trading", "optogenetics", "optometry", "oral history", "oratory", "orchestration", "orchid cultivation", "organic architecture", "organic farming", "organic solar cells", "organizational behavior", "organizational psychology", "organometallic chemistry", "origami", "ornithology", "orthodontics", "orthopedics", "orthography", "osteopathy", "otolaryngology", "ottoman empire", "outdoor survival", "outer space law", "out-of-body experiences", "overland travel", "oyster farming", "ozone depletion"
        ]
      }
    ],
"example": "I want to learn the basics about quantum physics"
  },
  {
    id: 'review-for',
    template: 'I want to review {subject} for {purpose}',
    blanks: [
      {
        id: 'subject',
        placeholder: 'subject',
        options: [
          // Original 7
          'calculus', 'biology', 'chemistry', 'history', 'literature', 'economics', 'psychology',
          // ~80+ new options
          'abnormal psychology', 'accounting principles', 'advanced algorithms', 'algebra', 'American literature',
          'anatomy and physiology', 'ancient Greek', 'ancient history', 'anthropology', 'art history', 'astronomy',
          'biochemistry', 'British literature', 'business law', 'cell biology', 'chemical engineering', 'civics',
          'civil engineering', 'classical mechanics', 'clinical psychology', 'cognitive psychology', 'computer architecture',
          'computer networks', 'computer science fundamentals', 'constitutional law', 'contract law', 'corporate finance',
          'creative writing', 'criminal law', 'data structures', 'developmental psychology', 'differential equations',
          'digital logic design', 'discrete mathematics', 'ecology', 'electrical engineering', 'electromagnetism',
          'English composition', 'environmental science', 'European history', 'evolutionary biology', 'finance',
          'French', 'genetics', 'geology', 'geometry', 'German', 'human geography', 'immunology',
          'inorganic chemistry', 'intellectual property law', 'international relations', 'Japanese', 'journalism',
          'Latin', 'linear algebra', 'macroeconomics', 'Mandarin', 'marketing principles', 'materials science',
          'mechanical engineering', 'microbiology', 'microeconomics', 'modern history', 'molecular biology',
          'multivariable calculus', 'music theory', 'neuroscience', 'nursing fundamentals', 'operating systems',
          'organic chemistry', 'pathology', 'pharmacology', 'philosophy', 'physics', 'political science',
          'probability and statistics', 'public speaking', 'quantum mechanics', 'robotics', 'social psychology',
          'sociology', 'software engineering principles', 'Spanish', 'thermodynamics', 'tort law', 'trigonometry',
          'US history', 'world history', 'world literature', 'zoology'
        ]
      },
      {
        id: 'purpose',
        placeholder: 'purpose',
        options: [
          // Original 6
          'my exam', 'a job interview', 'a presentation', 'general knowledge', 'teaching others', 'a certification',
          // ~70+ new options
          'a bar exam', 'a board exam', 'a book club discussion', 'a budget meeting', 'a business pitch',
          'a coding challenge', 'a college application', 'a community workshop', 'a conference talk', 'a client meeting',
          'a creative brainstorming session', 'a court case', 'a debate competition', 'a dinner party conversation',
          'a grant application', 'a guest lecture', 'a hackathon', 'a holiday gathering', 'a homeschooling lesson',
          'a jury duty', 'a legislative testimony', 'a lifelong learning goal', 'a local government meeting',
          'a major life decision', 'a mentorship session', 'a mock trial', 'a Model UN conference', 'a museum tour',
          'a naturalization test', 'a new project kickoff', 'a panel discussion', 'a parent-teacher conference',
          'a performance review', 'a personal project', 'a PhD defense', 'a podcast interview', 'a product demo',
          'a promotion opportunity', 'a project proposal', 'a pub quiz', 'a quarterly business review', 'a scholarship interview',
          'a science fair', 'a technical interview', 'a thesis defense', 'a trivia night', 'a volunteer orientation',
          'a wedding toast', 'a whiteboarding session', 'a writing competition', 'a YouTube video script',
          'building a personal knowledge base', 'creating a course', 'designing a D&D campaign', 'explaining it to a friend',
          'helping my kids with homework', 'impressing my in-laws', 'making an informed decision', 'onboarding a new team member',
          'planning a trip', 'preparing a lesson plan', 'refreshing my memory', 'settling a bet',
          'staying current in my field', 'a technical deep-dive', 'understanding the news better', 'writing an article',
          'writing a book report', 'writing a business plan', 'my comprehensive exams', 'my final project'
        ]
      }
    ],
    example: 'I want to review calculus for my exam'
  },
  {
    id: 'learn-language',
    template: 'I want to learn {skill} in {language} {focus}',
    blanks: [
      {
        id: 'skill',
        placeholder: 'language skill',
        options: [
          'basic conversation', 'pronunciation', 'grammar fundamentals', 'vocabulary building', 'listening comprehension',
          'reading comprehension', 'writing skills', 'speaking fluency', 'business communication', 'academic writing',
          'idioms and expressions', 'slang and colloquialisms', 'formal speech', 'informal conversation', 'phone etiquette',
          'email writing', 'essay writing', 'storytelling', 'debate skills', 'presentation skills', 'interview skills',
          'cultural context', 'regional dialects', 'accent reduction', 'phonetics', 'intonation patterns',
          'sentence structure', 'verb conjugations', 'noun declensions', 'adjective agreement', 'prepositions',
          'articles and determiners', 'question formation', 'negation', 'conditional statements', 'subjunctive mood',
          'passive voice', 'reported speech', 'relative clauses', 'phrasal verbs', 'modal verbs',
          'tenses and aspects', 'word order', 'punctuation rules', 'capitalization', 'spelling patterns'
        ]
      },
      {
        id: 'language',
        placeholder: 'target language',
        options: [
          'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese (Mandarin)', 'Japanese', 'Korean',
          'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian',
          'Greek', 'Turkish', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian', 'Malay', 'Tagalog', 'Swahili',
          'Afrikaans', 'Zulu', 'Ukrainian', 'Romanian', 'Bulgarian', 'Croatian', 'Serbian', 'Slovak', 'Slovenian',
          'Estonian', 'Latvian', 'Lithuanian', 'Georgian', 'Armenian', 'Persian (Farsi)', 'Urdu', 'Bengali',
          'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi', 'Nepali', 'Sinhala', 'Burmese', 'Khmer', 'Lao'
        ]
      },
      {
        id: 'focus',
        placeholder: 'learning focus',
        options: [
          'for beginners', 'for intermediate learners', 'for advanced speakers', 'for business purposes', 'for travel',
          'for academic study', 'for professional certification', 'for cultural understanding', 'for literature appreciation',
          'for media consumption', 'for social interaction', 'for job interviews', 'for dating and relationships',
          'for medical situations', 'for legal contexts', 'for technical fields', 'for children', 'for teenagers',
          'for adults', 'for seniors', 'through immersion', 'through music and songs', 'through movies and TV',
          'through news and current events', 'through poetry and literature', 'through cooking and recipes',
          'through sports commentary', 'through gaming', 'through social media', 'through podcasts',
          'with native speaker examples', 'with cultural context', 'with historical background', 'step by step',
          'intensively', 'at a relaxed pace', 'with practical exercises', 'with real-world scenarios'
        ]
      }
    ],
    example: 'I want to learn basic conversation in Spanish for travel'
  },
  {
    id: 'improve-language-skill',
    template: 'I want to improve my {specific_skill} in {language} {method}',
    blanks: [
      {
        id: 'specific_skill',
        placeholder: 'specific skill',
        options: [
          'pronunciation', 'accent', 'listening skills', 'speaking fluency', 'reading speed', 'writing clarity',
          'vocabulary range', 'grammar accuracy', 'comprehension', 'translation skills', 'interpretation skills',
          'formal register', 'informal communication', 'technical terminology', 'academic language', 'business language',
          'conversational flow', 'cultural awareness', 'idiom usage', 'metaphor understanding', 'humor appreciation',
          'debate skills', 'presentation abilities', 'storytelling', 'description skills', 'explanation skills',
          'argumentation', 'persuasion techniques', 'negotiation language', 'diplomatic communication', 'small talk',
          'phone conversations', 'email writing', 'text messaging', 'social media posts', 'formal letters',
          'essay writing', 'creative writing', 'note-taking', 'summarizing', 'paraphrasing'
        ]
      },
      {
        id: 'language',
        placeholder: 'language',
        options: [
          'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean',
          'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian',
          'Greek', 'Turkish', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian', 'Tagalog', 'Swahili', 'Ukrainian'
        ]
      },
      {
        id: 'method',
        placeholder: 'learning method',
        options: [
          'through interactive exercises', 'through native speaker examples', 'through media immersion', 'through structured lessons',
          'through conversation practice', 'through pronunciation drills', 'through listening exercises', 'through reading practice',
          'through writing exercises', 'through grammar analysis', 'through vocabulary building', 'through cultural study',
          'through error correction', 'through shadowing techniques', 'through repetition and drilling', 'through storytelling',
          'through role-playing', 'through debates and discussions', 'through music and songs', 'through movies and TV shows',
          'through news articles', 'through podcasts', 'through audiobooks', 'through language exchange', 'through tutoring',
          'through self-study', 'through group classes', 'through online courses', 'through mobile apps', 'through flashcards',
          'using the direct method', 'using the communicative approach', 'using the natural approach', 'using total physical response'
        ]
      }
    ],
    example: 'I want to improve my pronunciation in French through native speaker examples'
  },
  {
    id: 'language-culture',
    template: 'I want to understand {cultural_aspect} of {language_culture} {context}',
    blanks: [
      {
        id: 'cultural_aspect',
        placeholder: 'cultural aspect',
        options: [
          'social customs', 'business etiquette', 'dining traditions', 'holiday celebrations', 'family structures',
          'educational systems', 'workplace culture', 'communication styles', 'non-verbal communication', 'personal space norms',
          'time concepts', 'relationship dynamics', 'social hierarchies', 'religious practices', 'historical context',
          'political systems', 'economic structures', 'art and literature', 'music and dance', 'sports culture',
          'fashion and style', 'food culture', 'drinking customs', 'entertainment preferences', 'humor and jokes',
          'taboos and sensitive topics', 'gift-giving customs', 'greeting rituals', 'farewell traditions', 'hospitality norms',
          'gender roles', 'age respect', 'authority relationships', 'conflict resolution', 'decision-making processes',
          'urban vs rural differences', 'generational gaps', 'class distinctions', 'regional variations', 'cultural values'
        ]
      },
      {
        id: 'language_culture',
        placeholder: 'culture/country',
        options: [
          'Spanish-speaking countries', 'France', 'Germany', 'Italy', 'Portugal', 'Brazil', 'Russia', 'China', 'Japan', 'Korea',
          'Arab countries', 'India', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic',
          'Hungary', 'Greece', 'Turkey', 'Israel', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Kenya', 'South Africa',
          'Ukraine', 'Romania', 'Bulgaria', 'Croatia', 'Serbia', 'Mexico', 'Argentina', 'Colombia', 'Peru', 'Chile',
          'Quebec (Canada)', 'Belgium', 'Switzerland', 'Austria', 'Morocco', 'Egypt', 'Lebanon', 'Singapore', 'Malaysia'
        ]
      },
      {
        id: 'context',
        placeholder: 'context',
        options: [
          'for better communication', 'for business interactions', 'for travel preparation', 'for academic study',
          'for cultural appreciation', 'for avoiding misunderstandings', 'for deeper relationships', 'for professional success',
          'for social integration', 'for personal growth', 'for historical understanding', 'for current events comprehension',
          'for media interpretation', 'for literature appreciation', 'for art understanding', 'for religious tolerance',
          'for political awareness', 'for economic insight', 'for educational purposes', 'for immigration preparation',
          'for expatriate life', 'for international relations', 'for diplomacy', 'for journalism', 'for anthropological study',
          'for linguistic research', 'for translation work', 'for interpretation services', 'for cultural consulting',
          'for teaching purposes', 'for cross-cultural training', 'for diversity awareness', 'for inclusion efforts'
        ]
      }
    ],
    example: 'I want to understand business etiquette of Japan for professional success'
  },
  {
    id: 'language-exam-prep',
    template: 'I want to prepare for {exam} in {language} {focus_area}',
    blanks: [
      {
        id: 'exam',
        placeholder: 'language exam',
        options: [
          'TOEFL', 'IELTS', 'TOEIC', 'Cambridge English (FCE, CAE, CPE)', 'DELE (Spanish)', 'DELF/DALF (French)',
          'TestDaF (German)', 'DSH (German)', 'Goethe Institute exams', 'CILS (Italian)', 'CELI (Italian)', 'CAPLE (Portuguese)',
          'TORFL (Russian)', 'HSK (Chinese)', 'JLPT (Japanese)', 'TOPIK (Korean)', 'ACTFL OPI', 'TEF (French)',
          'TCF (French)', 'SIELE (Spanish)', 'CCIP (Portuguese)', 'CELPE-Bras (Portuguese)', 'BULATS', 'TELC',
          'ÖSD (German)', 'CEFR assessment', 'university entrance exams', 'immigration language tests',
          'professional certification exams', 'teacher qualification exams', 'interpreter certification', 'translator certification'
        ]
      },
      {
        id: 'language',
        placeholder: 'language',
        options: [
          'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean',
          'Arabic', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Greek', 'Turkish'
        ]
      },
      {
        id: 'focus_area',
        placeholder: 'focus area',
        options: [
          'focusing on speaking skills', 'focusing on listening comprehension', 'focusing on reading comprehension', 'focusing on writing skills',
          'focusing on grammar accuracy', 'focusing on vocabulary expansion', 'focusing on test strategies', 'focusing on time management',
          'focusing on all skills equally', 'focusing on weak areas', 'focusing on high-frequency topics', 'focusing on academic language',
          'focusing on formal register', 'focusing on essay writing', 'focusing on oral presentation', 'focusing on interview skills',
          'with practice tests', 'with exam simulation', 'with score improvement', 'with confidence building',
          'with stress management', 'with cultural awareness', 'with pronunciation improvement', 'with fluency development',
          'with accuracy enhancement', 'with speed building', 'with comprehension strategies', 'with critical thinking'
        ]
      }
    ],
    example: 'I want to prepare for IELTS in English focusing on writing skills'
  },
  {
    id: 'understand-how',
    template: 'I want to understand how {process} works {context}',
    blanks: [
      {
        id: 'process',
        placeholder: 'process',
        options: [
          // Original 7
          'blockchain', 'photosynthesis', 'the stock market', 'neural networks', 'car engines', 'computers', 'vaccines',
          // ~80+ new options
          'a 3D printer builds objects', 'a battery stores energy', 'a bill becomes a law', 'a black hole forms',
          'a catalytic converter works', 'a company goes public (IPO)', 'a compiler translates code', 'a credit score is calculated',
          'a credit card transaction works', 'a democracy functions', 'a diesel engine works', 'a dishwasher cleans dishes',
          'a GPS system works', 'a jet engine functions', 'a large language model is trained', 'a laser works', 'a law is made',
          'a lock and key work', 'a microwave heats food', 'a nuclear power plant generates energy', 'a political campaign is run',
          'a quantum computer computes', 'a recommendation system suggests content', 'a refrigerator keeps things cool',
          'a rocket achieves orbit', 'a search engine ranks pages', 'a social media algorithm works',
          'a submarine works', 'a superconductor works', 'a touchscreen responds to touch', 'a transformer (AI model) works',
          'a tsunami forms', 'a virus spreads', 'a volcano erupts', 'advertising influences people', 'antibiotics fight bacteria',
          'artificial intelligence generates text', 'carbon capture technology works', 'carbon dating determines age',
          'cellular respiration creates energy', 'climate models predict the future', 'cloning works',
          'CRISPR gene editing alters DNA', 'cryptographic hashing secures data', 'desalination purifies water',
          'DNA replication occurs', 'dreams occur', 'an economy grows', 'evolution by natural selection works',
          'fermentation creates alcohol', 'financial markets fluctuate', 'fission and fusion release energy',
          'human memory is formed', 'inflation affects prices', 'interest rates are set', 'the Big Bang happened',
          'the brain processes information', 'the carbon cycle works', 'the electoral college works',
          'the Federal Reserve works', 'the food chain functions', 'the greenhouse effect warms the planet',
          'the human eye sees color', 'the immune system fights infection', 'the internet delivers data', 'the Krebs cycle works',
          'the legislative process works', 'the scientific method works', 'the tides are formed', 'mRNA vaccines work',
          'natural selection drives evolution', 'osmosis works', 'pasteurization kills bacteria',
          'plate tectonics shape continents', 'protein synthesis works', 'radios transmit sound',
          'solar panels generate electricity', 'supply and demand sets prices', 'synapses transmit signals in the brain'
        ]
      },
      {
        id: 'context',
        placeholder: 'context',
        options: [
          // Original 6
          'in detail', 'from scratch', 'for beginners', 'practically', 'theoretically', 'step by step',
          // ~70+ new options
          'as a flowchart', 'as a timeline', 'as if I were a child', 'as if I were an expert in another field',
          'at a chemical level', 'at a high level', 'at a molecular level', 'by analyzing the data',
          'by breaking it down into its core ideas', 'by building a simple model', 'by debunking common myths',
          'by examining its inputs and outputs', 'by examining the ethical implications', 'by exploring its future potential',
          'by looking at the code', 'by reading the original paper', 'by reverse-engineering it', 'focusing on its history',
          'focusing on its limitations', 'focusing on the key components', 'focusing on the pros and cons',
          'for a college student', 'for a five-year-old', 'for my specific use case', 'from a business standpoint',
          'from a biological perspective', 'from a consumer standpoint', 'from a first-principles approach',
          'from a global viewpoint', 'from a historical perspective', 'from a legal perspective', 'from a local viewpoint',
          'from a physical perspective', 'from a social perspective', 'in a comprehensive lecture', 'in a hands-on lab',
          'in a mind map', 'in a risk-assessment framework', 'in a single sentence', 'in a story', 'in a visual way',
          'in plain English', 'in simple terms', 'in under 5 minutes', 'in the context of current events',
          'through a case study', 'through a documentary', 'through a guided tutorial', 'through a simulation',
          'through an analogy', 'through an interactive diagram', 'with all the math', 'with an emphasis on design',
          'with an emphasis on efficiency', 'with a focus on its impact', 'with a hands-on project', 'with a historical narrative',
          'with a practical example', 'with real-world examples', 'with visual aids', 'without the jargon',
          'without the math', 'by interviewing an expert', 'for a technical audience', 'for a non-technical audience',
          'from an economic perspective', 'from a political perspective', 'in a debate format', 'in a song',
          'as a poem', 'through its successes and failures', 'from an engineering perspective'
        ]
      }
    ],
    example: 'I want to understand how blockchain works in detail'
  },
  {
    id: 'explore-relationship',
    template: 'I want to explore the relationship between {concept1} and {concept2}',
    blanks: [
      {
        id: 'concept1',
        placeholder: 'first concept',
        options: [
          // Original 7
          'music', 'exercise', 'diet', 'technology', 'climate', 'economics', 'psychology',
          // ~70+ new options
          'addiction', 'aging', 'agriculture', 'AI', 'architecture', 'art', 'artificial intelligence', 'attention',
          'automation', 'boredom', 'capitalism', 'child development', 'cities', 'climate change', 'colonialism',
          'communication', 'community', 'consciousness', 'conspiracy theories', 'consumerism', 'creativity', 'crime',
          'culture', 'curiosity', 'cynicism', 'democracy', 'disease', 'dopamine', 'dreams', 'education', 'empathy',
          'energy consumption', 'entertainment', 'environment', 'ethics', 'evolution', 'family structure', 'fashion',
          'fear', 'food production', 'free will', 'friendship', 'genetics', 'geography', 'globalization', 'government',
          'grief', 'gut microbiome', 'happiness', 'history', 'housing', 'humor', 'identity', 'ideology', 'immigration',
          'imperialism', 'inequality', 'inflammation', 'infrastructure', 'innovation', 'internet culture', 'isolation',
          'journalism', 'justice', 'language', 'law', 'leadership', 'literature', 'loneliness', 'love', 'media',
          'meditation', 'memory', 'mental health', 'migration', 'modernity', 'morality', 'mythology', 'nationalism',
          'nature', 'neuroscience', 'nutrition', 'optimism', 'parenting', 'philosophy', 'play', 'poetry', 'polarization',
          'politics', 'poverty', 'power', 'propaganda', 'psychedelics', 'public health', 'racism', 'religion',
          'remote work', 'ritual', 'science', 'sleep', 'social class', 'social media', 'spirituality', 'sports',
          'storytelling', 'stress', 'sugar', 'surveillance', 'tradition', 'transportation', 'trauma', 'travel',
          'trust', 'urbanization', 'violence', 'warfare', 'water', 'wealth', 'work', 'writing'
        ]
      },
      {
        id: 'concept2',
        placeholder: 'second concept',
        options: [
          // Original 7
          'health', 'productivity', 'society', 'the environment', 'politics', 'culture', 'education',
          // ~70+ new options
          'addiction', 'anxiety', 'artistic expression', 'authoritarianism', 'behavior', 'belief systems',
          'biological evolution', 'brain development', 'business success', 'career success', 'childhood development',
          'civic engagement', 'civilization', 'climate change', 'cognitive function', 'community building',
          'conflict', 'consciousness', 'consumer behavior', 'corporate profits', 'creativity', 'crime rates',
          'cultural evolution', 'cultural identity', 'decision making', 'democracy', 'depression', 'disease prevention',
          'economic growth', 'economic inequality', 'emotional regulation', 'empathy', 'employee morale', 'existential risk',
          'family dynamics', 'financial markets', 'free speech', 'friendship', 'gender roles', 'genetic expression',
          'geopolitical stability', 'global supply chains', 'global warming', 'happiness', 'historical narratives',
          'human behavior', 'human consciousness', 'human evolution', 'human migration', 'human rights', 'identity formation',
          'immune function', 'individual freedom', 'industrialization', 'information flow', 'innovation',
          'international relations', 'interpersonal relationships', 'justice', 'knowledge', 'language development',
          'learning outcomes', 'lifespan', 'long-term memory', 'love', 'market trends', 'media consumption',
          'mental well-being', 'moral values', 'motivation', 'personal growth', 'personal identity',
          'physical performance', 'political affiliation', 'political polarization', 'poverty', 'public opinion',
          'public policy', 'quality of life', 'radicalization', 'scientific discovery', 'self-esteem', 'sleep quality',
          'social bonds', 'social change', 'social cohesion', 'social justice', 'social mobility', 'social structures',
          'social trust', 'spirituality', 'stress levels', 'subjective well-being', 'technological advancement',
          'the economy', 'the future of work', 'the human experience', 'the justice system', 'the media landscape',
          'the natural world', 'the political process', 'the spread of ideas', 'thought patterns', 'urban development',
          'violence', 'voting behavior', 'war', 'wealth distribution', 'wisdom'
        ]
      }
    ],
    example: 'I want to explore the relationship between music and productivity'
  },
  {
    id: 'compare-contrast',
    template: 'I want to compare and contrast {item1} {operator} {item2}',
    blanks: [
      {
        id: 'item1',
        placeholder: 'first item',
        options: [
          // Original 6
          'Python', 'democracy', 'renewable energy', 'traditional art', 'classical music', 'capitalism',
          // ~70+ new options
          'a startup', 'a university degree', 'a vegetarian diet', 'active investing', 'agile development',
          'air travel', 'analog photography', 'apartments', 'Apple', 'Aristotle', 'artisan coffee',
          'asynchronous communication', 'a liberal arts education', 'a defined-benefit pension', 'a fixed mindset',
          'a command-line interface', 'a relational database', 'a sole proprietorship', 'a small town', 'a PhD',
          'books', 'bottom-up planning', 'buying a car', 'centralized systems', 'cities', 'common law',
          'direct democracy', 'dogs', 'early rising', 'electric cars', 'equity financing', 'extroverts',
          'Facebook', 'film photography', 'free market policies', 'free-to-play games', 'Freudian psychology',
          'fundamental analysis', 'generalists', 'globalization', 'higher education', 'home ownership',
          'imperative programming', 'in-office work', 'individualism', 'introverts', 'iOS',
          'Keynesian economics', 'Keynes', 'laptops', 'long-form content', 'mainstream media', 'Marx',
          'meritocracy', 'a minimalist lifestyle', 'monarchy', 'monolithic architecture', 'nature',
          'nature (genetics)', 'open-source software', 'optimism', 'Plato', 'prose',
          'public transportation', 'qualitative research', 'reading the book', 'realism (art)', 'remote work',
          'renting', 'socialism', 'suburbs', 'synchronous communication', 'a traditional publisher', 'vinyl records',
          'waterfall development', 'Western medicine'
        ]
      },
      {
        id: 'operator',
        placeholder: 'operator',
        options: [
          // Original 5 + more
          'vs', 'and', 'with', 'versus', 'alongside', 'in comparison to', 'as opposed to',
          'in contrast with', 'when compared with', 'next to', 'over', 'against', 'and the implications for'
        ]
      },
      {
        id: 'item2',
        placeholder: 'second item',
        options: [
          // Original 6
          'JavaScript', 'autocracy', 'fossil fuels', 'modern art', 'jazz music', 'socialism',
          // ~70+ new options
          'a large corporation', 'a vocational certificate', 'an omnivorous diet', 'passive investing',
          'waterfall development', 'rail travel', 'digital photography', 'houses', 'Google', 'Plato',
          'instant coffee', 'synchronous communication', 'a STEM education', 'a 401(k) or IRA', 'a growth mindset',
          'a graphical user interface (GUI)', 'a NoSQL database', 'a partnership or LLC', 'a big city', 'a master\'s degree',
          'movies', 'top-down planning', 'leasing a car', 'decentralized systems', 'the countryside', 'civil law',
          'representative democracy', 'cats', 'night owlishness', 'gas-powered cars', 'debt financing', 'introverts',
          'TikTok', 'digital photography', 'government intervention', 'premium (paid) games', 'Jungian psychology',
          'technical analysis', 'specialists', 'nationalism', 'vocational training', 'renting',
          'declarative programming', 'remote work', 'collectivism', 'extroverts', 'Android',
          'Austrian economics', 'Hayek', 'desktops', 'short-form content', 'independent media', 'Smith',
          'nepotism', 'a maximalist lifestyle', 'a republic', 'microservices architecture', 'nurture (environment)',
          'nurture (upbringing)', 'proprietary software', 'pessimism', 'Aristotle', 'poetry',
          'private cars', 'quantitative research', 'watching the movie', 'impressionism (art)', 'in-office work',
          'owning', 'communism', 'the city center', 'asynchronous communication', 'self-publishing', 'streaming music',
          'agile development', 'alternative medicine'
        ]
      }
    ],
    example: 'I want to compare and contrast Python vs JavaScript'
  }
];`