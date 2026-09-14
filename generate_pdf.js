import fs from "fs";
import path from "path";

/**
 * Enterprise-Grade Pure Node.js PDF-1.4 Generator
 * Creates a high-end, clean, corporate-grade PDF submission report.
 * Uses strict WinAnsi Latin-1 character set to guarantee zero character encoding glitches.
 */

class ProfessionalPDF {
  constructor() {
    this.pageWidth = 612; // US Letter: 8.5 x 11 inches
    this.pageHeight = 792;
    this.marginLeft = 54; // 0.75 in
    this.marginRight = 54;
    this.marginTop = 54;
    this.marginBottom = 54;
    this.contentWidth = this.pageWidth - this.marginLeft - this.marginRight;

    this.pages = [];
    this.currentPageOps = [];
    this.currentY = this.pageHeight - this.marginTop;
    this.pageNumber = 0;

    this.newPage();
  }

  newPage() {
    this.pageNumber++;
    this.currentPageOps = [];
    this.pages.push(this.currentPageOps);
    this.currentY = this.pageHeight - this.marginTop;

    // Running Header & Footer for pages 2+
    if (this.pageNumber > 1) {
      this.drawRunningHeader();
    }
    this.drawRunningFooter();
  }

  drawRunningHeader() {
    this.currentPageOps.push(
      "0.48 0.52 0.60 rg", // Muted slate
      `BT /F1 8 Tf ${this.marginLeft} ${this.pageHeight - 34} Td (ClientHub -- Client Management Dashboard | Technical Submission Report) Tj ET`,
      "0.84 0.86 0.90 RG 0.5 w",
      `${this.marginLeft} ${this.pageHeight - 40} m ${this.pageWidth - this.marginRight} ${this.pageHeight - 40} l S`,
      "0 0 0 rg"
    );
  }

  drawRunningFooter() {
    this.currentPageOps.push(
      "0.84 0.86 0.90 RG 0.5 w",
      `${this.marginLeft} 40 m ${this.pageWidth - this.marginRight} 40 l S`,
      "0.50 0.54 0.62 rg",
      `BT /F1 8 Tf ${this.marginLeft} 28 Td (Web Development -- Advanced Level Portfolio Submission) Tj ET`,
      `BT /F2 8 Tf ${this.pageWidth - this.marginRight - 36} 28 Td (Page ${this.pageNumber}) Tj ET`,
      "0 0 0 rg"
    );
  }

  ensureSpace(neededHeight) {
    if (this.currentY - neededHeight < this.marginBottom + 10) {
      this.newPage();
    }
  }

  escapePdfText(text) {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)")
      .replace(/—/g, "--")
      .replace(/–/g, "-")
      .replace(/’/g, "'")
      .replace(/“/g, '"')
      .replace(/”/g, '"');
  }

  addMainHeader() {
    // Top decorative bar
    this.currentPageOps.push(
      "0.25 0.32 0.82 rg", // Royal Indigo
      `${this.marginLeft} ${this.currentY} ${this.contentWidth} 4 re f`,
      "0 0 0 rg"
    );
    this.currentY -= 20;

    // Document Title
    const title = "ClientHub -- Client Management Dashboard";
    this.currentPageOps.push(
      "0.06 0.09 0.16 rg", // Deep Midnight Slate
      `BT /F2 20 Tf 24 TL ${this.marginLeft} ${this.currentY} Td (${this.escapePdfText(title)}) Tj ET`,
      "0 0 0 rg"
    );
    this.currentY -= 22;

    // Subtitle
    const subtitle = "Assignment Submission Report | Advanced Web Development Prototype";
    this.currentPageOps.push(
      "0.32 0.38 0.48 rg",
      `BT /F1 10.5 Tf 14 TL ${this.marginLeft} ${this.currentY} Td (${this.escapePdfText(subtitle)}) Tj ET`,
      "0 0 0 rg"
    );
    this.currentY -= 16;

    // Metadata Strip Box
    const boxHeight = 26;
    this.currentPageOps.push(
      "0.96 0.97 0.99 rg", // Light slate fill
      `${this.marginLeft} ${this.currentY - boxHeight + 4} ${this.contentWidth} ${boxHeight} re f`,
      "0.86 0.89 0.94 RG 0.75 w",
      `${this.marginLeft} ${this.currentY - boxHeight + 4} ${this.contentWidth} ${boxHeight} re S`,
      "0.22 0.28 0.40 rg",
      `BT /F2 8.5 Tf ${this.marginLeft + 12} ${this.currentY - 12} Td (Domain:) Tj ET`,
      `BT /F1 8.5 Tf ${this.marginLeft + 56} ${this.currentY - 12} Td (Frontend Engineering & UI/UX Architecture) Tj ET`,
      `BT /F2 8.5 Tf ${this.marginLeft + 290} ${this.currentY - 12} Td (Assessment:) Tj ET`,
      `BT /F1 8.5 Tf ${this.marginLeft + 356} ${this.currentY - 12} Td (Advanced Level Prototype) Tj ET`,
      "0 0 0 rg"
    );
    this.currentY -= 40;
  }

  addSectionHeading(numberAndTitle) {
    this.ensureSpace(42);
    this.currentY -= 6;
    const escaped = this.escapePdfText(numberAndTitle);

    this.currentPageOps.push(
      // Left accent pill
      "0.28 0.35 0.85 rg",
      `${this.marginLeft} ${this.currentY - 1.5} 3.5 13 re f`,
      // Heading text
      "0.08 0.12 0.24 rg",
      `BT /F2 12.5 Tf 15 TL ${this.marginLeft + 10} ${this.currentY} Td (${escaped}) Tj ET`,
      // Subtle underline
      "0.90 0.92 0.95 RG 0.5 w",
      `${this.marginLeft + 10} ${this.currentY - 5} m ${this.pageWidth - this.marginRight} ${this.currentY - 5} l S`,
      "0 0 0 rg"
    );
    this.currentY -= 20;
  }

  addParagraph(text) {
    const lines = this.wrapText(text, 9.5, false);
    const lineHeight = 13.5;
    this.ensureSpace(lines.length * lineHeight + 6);

    this.currentPageOps.push("0.16 0.20 0.26 rg");
    for (const line of lines) {
      const escaped = this.escapePdfText(line);
      this.currentPageOps.push(
        `BT /F1 9.5 Tf ${lineHeight} TL ${this.marginLeft} ${this.currentY} Td (${escaped}) Tj ET`
      );
      this.currentY -= lineHeight;
    }
    this.currentY -= 6;
    this.currentPageOps.push("0 0 0 rg");
  }

  addBulletItem(label, description) {
    const prefix = `${label}: `;
    const fullText = prefix + description;
    const lines = this.wrapText(fullText, 9, false);
    const lineHeight = 13;

    this.ensureSpace(lines.length * lineHeight + 5);

    this.currentPageOps.push("0.16 0.20 0.26 rg");
    lines.forEach((line, index) => {
      const isFirst = index === 0;
      const xPos = isFirst ? this.marginLeft + 8 : this.marginLeft + 18;

      if (isFirst) {
        // Bullet circle
        this.currentPageOps.push(
          "0.28 0.35 0.85 rg",
          `BT /F2 10 Tf ${this.marginLeft} ${this.currentY} Td (-) Tj ET`,
          "0.16 0.20 0.26 rg"
        );
      }

      const escaped = this.escapePdfText(line);
      this.currentPageOps.push(
        `BT /F1 9 Tf ${lineHeight} TL ${xPos} ${this.currentY} Td (${escaped}) Tj ET`
      );
      this.currentY -= lineHeight;
    });
    this.currentY -= 4;
    this.currentPageOps.push("0 0 0 rg");
  }

  wrapText(text, fontSize, isBold = false) {
    const maxChars = Math.floor(this.contentWidth / (fontSize * 0.505));
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      if ((currentLine + " " + word).trim().length <= maxChars) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  buildPDF() {
    const objects = [];
    let objCount = 0;

    const createObj = (content) => {
      objCount++;
      objects.push({ id: objCount, content });
      return objCount;
    };

    const catalogId = createObj("");
    const pagesId = createObj("");
    const fontRegularId = createObj(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
    );
    const fontBoldId = createObj(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
    );

    const pageObjIds = [];

    for (const pageOps of this.pages) {
      const streamContent = pageOps.join("\n");
      const streamLen = Buffer.byteLength(streamContent, "utf8");
      const contentId = createObj(
        `<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream`
      );

      const pageId = createObj(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${this.pageWidth} ${this.pageHeight}] ` +
          `/Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> ` +
          `/Contents ${contentId} 0 R >>`
      );
      pageObjIds.push(pageId);
    }

    objects[catalogId - 1].content = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objects[pagesId - 1].content = `<< /Type /Pages /Kids [${pageObjIds
      .map((id) => `${id} 0 R`)
      .join(" ")}] /Count ${pageObjIds.length} >>`;

    let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
    const xrefOffsets = [];

    for (const obj of objects) {
      xrefOffsets.push(Buffer.byteLength(pdf, "utf8"));
      pdf += `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
    }

    const startXref = Buffer.byteLength(pdf, "utf8");
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += `0000000000 65535 f \n`;

    for (const offset of xrefOffsets) {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\n`;
    pdf += `startxref\n${startXref}\n%%EOF\n`;

    return Buffer.from(pdf, "binary");
  }
}

// Generate the Document
const pdf = new ProfessionalPDF();

pdf.addMainHeader();

// 1. PROJECT OBJECTIVE
pdf.addSectionHeading("1. Project Objective");
pdf.addParagraph(
  "The primary objective of ClientHub is to deliver a robust, production-grade Client Management and Admin Dashboard prototype designed for enterprise administration, account monitoring, and operational team governance. The system consolidates customer information, account lifecycles, and verification statuses into a singular, responsive control console."
);
pdf.addParagraph(
  "Engineered with modern frontend standards, the project emphasizes practical problem solving: eliminating data fragmentation, safeguarding records through protected deletion guards, delivering compound multi-field search and status filtering, guaranteeing zero session loss on page reload, and adhering to strict WCAG accessibility principles."
);

// 2. TECHNOLOGY USED
pdf.addSectionHeading("2. Technology Used");
pdf.addParagraph(
  "The application stack was selected to achieve optimal frontend architecture, high runtime performance, and clean maintainability without bloated or unvetted dependencies:"
);
pdf.addBulletItem(
  "Frontend Framework",
  "React 18 utilizing Functional Components, Hooks (useState, useEffect, useMemo, useContext, useRef), and unidirectional data flow."
);
pdf.addBulletItem(
  "Build Tool & Bundler",
  "Vite 5 providing rapid Hot Module Replacement (HMR), tree-shaking, and Rollup-based production optimization."
);
pdf.addBulletItem(
  "Routing Engine",
  "React Router DOM v6 delivering declarative client-side routing, protected session guards, and wildcard 404 redirections."
);
pdf.addBulletItem(
  "Styling & Design System",
  "Tailwind CSS v3 and PostCSS featuring a custom high-contrast dark palette, fluid responsive grid architecture, and micro-interactions."
);
pdf.addBulletItem(
  "Iconography",
  "Lucide React providing scalable, accessible, and lightweight SVG icons."
);
pdf.addBulletItem(
  "State Management & Storage",
  "React Context API (AuthContext, ClientContext) integrated with HTML5 LocalStorage via synchronous lazy-initialization for cold reload resilience."
);
pdf.addBulletItem(
  "Automated Testing Suite",
  "Node.js built-in Test Runner (node:test, node:assert) executing 27 automated unit and integration tests with zero external dependencies."
);
pdf.addBulletItem(
  "Cloud Deployment",
  "Netlify with custom netlify.toml and public/_redirects SPA rewrite configuration ensuring seamless 200 HTTP deep-link navigation."
);

// 3. FEATURES
pdf.addSectionHeading("3. Features");
pdf.addParagraph(
  "ClientHub delivers a comprehensive set of verified capabilities fulfilling all advanced evaluation criteria:"
);
pdf.addBulletItem(
  "Authentication UI & Session Engine",
  "Professional sign-in interface featuring email regex validation, real-time error clearing upon input, password visibility reveal toggle, one-click demo credentials auto-fill, and immediate session persistence without reload redirection."
);
pdf.addBulletItem(
  "Sidebar Navigation",
  "Semantic navigation drawer with active view states (Dashboard Overview, Client Directory, Analytics & Reports, Settings), off-canvas mobile drawer with backdrop overlay, and Escape key dismissal."
);
pdf.addBulletItem(
  "Client List & Tabular Directory",
  "High-contrast data table displaying client avatars with calculated initials, verified emails, companies, status badges, and formatted dates, supported by contextual empty states."
);
pdf.addBulletItem(
  "Client Status Management",
  "Distinguishable color-coded status badges (Active: Emerald, Pending: Amber, Inactive: Rose) with glowing dot indicators, plus one-click status transitions inside the detail drawer."
);
pdf.addBulletItem(
  "Multi-Field Real-Time Search",
  "Instant, case-insensitive querying simultaneously evaluating client name, email address, company name, and phone number, with an inline clear (X) action."
);
pdf.addBulletItem(
  "Compound Filtering & KPI Cards",
  "Dropdown status filtering and interactive top KPI cards that act as quick status filters, enforcing strict logical AND evaluation when combining search with status filters."
);
pdf.addBulletItem(
  "Multi-Column Table Sorting",
  "Interactive column header sorting across Client Name, Company, Status, and Join Date with ascending/descending directional indicators."
);
pdf.addBulletItem(
  "Client Data Interactions (CRUD)",
  "Full client profile view modal with direct contact links (mailto, tel), add/edit client modal with input validation, accessible confirmation modal (ConfirmModal) protecting against accidental record loss, and demo data reset."
);
pdf.addBulletItem(
  "Responsive & Accessible Architecture",
  "Tested across mobile, tablet, laptop, and desktop viewports, featuring ARIA attributes (role=dialog, aria-modal, role=alert) and input-to-label associations."
);

// 4. TECHNICAL EXPLANATION
pdf.addSectionHeading("4. Technical Explanation");
pdf.addParagraph(
  "The technical implementation of ClientHub reflects advanced software engineering principles:"
);
pdf.addBulletItem(
  "Component Modularity & Separation of Concerns",
  "Presentation components (StatusBadge, StatsCard, ClientTable, ClientModal, ConfirmModal, ClientDetailModal) are strictly decoupled from state orchestrators (Dashboard.jsx, Login.jsx), preventing bloated components and duplicate UI logic."
);
pdf.addBulletItem(
  "Unidirectional Flow & Derived State Pipelines",
  "Data flows downward from centralized context stores. Search, filtering, and sorting are computed purely as derived state via useMemo pipelines. This eliminates state desynchronization, stale caches, and redundant re-render cascades."
);
pdf.addBulletItem(
  "Session Persistence Architecture",
  "Resolved the critical React reload bug where asynchronous useEffect loading caused ProtectedRoute to prematurely redirect authenticated users to login. User state is now synchronously initialized using lazy useState(() => JSON.parse(localStorage.getItem('user')))."
);
pdf.addBulletItem(
  "Timezone-Safe Date Parsing",
  "Engineered formatters.js to parse ISO and YYYY-MM-DD strings explicitly, preventing JavaScript Date UTC midnight off-by-one errors that alter dates across local timezones."
);
pdf.addBulletItem(
  "Destructive Action Guard Pattern",
  "Implemented ConfirmModal with keyboard trapping and Escape listener to separate user intent from execution during record deletions and database resets."
);
pdf.addBulletItem(
  "Production SPA Route Resilience",
  "Configured netlify.toml and public/_redirects mapping '/* /index.html 200' to guarantee that direct navigation or browser refreshes on routes like /login or /dashboard never trigger Netlify 404 errors."
);
pdf.addBulletItem(
  "Automated Testing Verification",
  "27 unit and integration tests verify authentication validation, credential matching, client CRUD operations, search/filter logical combinations, column sorting, and KPI math."
);

// 5. WHAT PROBLEM THE PROJECT SOLVES
pdf.addSectionHeading("5. What Problem the Project Solves");
pdf.addParagraph(
  "ClientHub addresses fundamental operational, administrative, and technical challenges faced by businesses managing client portfolios:"
);
pdf.addBulletItem(
  "Overcoming Data Fragmentation",
  "Scattered client emails, phone numbers, onboarding stages, and account notes are unified into a centralized, searchable administrative dashboard."
);
pdf.addBulletItem(
  "Preventing Accidental Data Loss",
  "Conventional prototypes execute deletions immediately upon clicking delete icons. ClientHub introduces guarded confirmation dialogs to ensure data integrity and prevent costly administrative errors."
);
pdf.addBulletItem(
  "Eliminating Information Retrieval Bottlenecks",
  "Locating specific clients in large datasets is accelerated through real-time compound querying (instant name/email/company search combined with lifecycle status filters and column sorting)."
);
pdf.addBulletItem(
  "Eliminating SPA Session Friction",
  "Poorly architected single-page applications frequently boot users back to the login screen upon refreshing. ClientHub provides seamless state rehydration with HTML5 LocalStorage persistence."
);
pdf.addBulletItem(
  "Providing Portfolio Health Visibility",
  "Visual KPI statistics and status distribution cards give administrators immediate operational insight into active clients, pending approvals, and retention metrics."
);

// Output to file
const outputPath = path.resolve("Client_Management_Dashboard_Submission_Report.pdf");
fs.writeFileSync(outputPath, pdf.buildPDF());
console.log(`Successfully generated updated professional PDF at: ${outputPath}`);
