const fs = require("fs");
const path = require("path");
const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

html = html.replace(
  `<div class="hex-stack reveal" aria-label="Strategy Production Growth">
              <div class="hex-item"><span class="hex-num" data-i18n="journey1t">Strategy</span><p data-i18n="journey1d">What to say, to whom, and why it matters.</p></div>
              <div class="hex-item"><span class="hex-num" data-i18n="journey2t">Production</span><p data-i18n="journey2d">Content that carries the message with craft and clarity.</p></div>
              <div class="hex-item"><span class="hex-num" data-i18n="journey3t">Growth</span><p data-i18n="journey3d">Distribution and optimization that move the audience.</p></div>
            </div>`,
  `<div class="about-visual reveal">
              <div class="about-visual-main">
                <img src="assets/img/visuals/studio-camera.jpg" alt="" loading="lazy" width="900" height="600" />
                <div class="about-visual-caption" data-i18n="aboutVisualCap">Creative production in service of marketing</div>
              </div>
              <div class="about-visual-stack">
                <div class="hex-item"><span class="hex-num" data-i18n="journey1t">Strategy</span><p data-i18n="journey1d">What to say, to whom, and why it matters.</p></div>
                <div class="hex-item"><span class="hex-num" data-i18n="journey2t">Production</span><p data-i18n="journey2d">Content that carries the message with craft and clarity.</p></div>
                <div class="hex-item"><span class="hex-num" data-i18n="journey3t">Growth</span><p data-i18n="journey3d">Distribution and optimization that move the audience.</p></div>
              </div>
            </div>`
);

const creativeNew = `<section id="creative" class="creative-band band-paper has-index" data-index="01">
        <div class="container">
          <div class="section-head section-head--editorial reveal">
            <span class="svc-tag" data-i18n="creativeTag">Creative production</span>
            <h2 class="font-headline-xl" data-i18n="creativeTitle">The content that gives marketing something to work with</h2>
            <p class="font-body-md" data-i18n="creativeSub">Studio-grade video, animation, and motion, built for campaigns, not for the shelf. 100+ animated films across healthcare and real estate.</p>
          </div>
          <div class="creative-bento reveal">
            <article class="bento-item bento-item--lg">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="x4Ya98nRnog" data-yt-title="Bees Motion reel" aria-label="Play reel">
                <img src="assets/img/thumbs/x4Ya98nRnog.jpg" alt="Bees Motion creative reel" loading="lazy" width="1280" height="720" />
                <span class="yt-facade-play" aria-hidden="true"></span>
                <span class="bento-label" data-i18n="prod1t">Video & films</span>
              </button>
            </article>
            <article class="bento-item">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="jNYuQoRHNfg" data-yt-title="Motion graphics" aria-label="Play motion">
                <img src="assets/img/thumbs/jNYuQoRHNfg.jpg" alt="Motion graphics work" loading="lazy" width="640" height="360" />
                <span class="yt-facade-play" aria-hidden="true"></span>
                <span class="bento-label" data-i18n="prod2t">Motion graphics</span>
              </button>
            </article>
            <article class="bento-item">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="CtjHnqYOX3I" data-yt-title="2D 3D animation" aria-label="Play animation">
                <img src="assets/img/thumbs/CtjHnqYOX3I.jpg" alt="Animation work" loading="lazy" width="640" height="360" />
                <span class="yt-facade-play" aria-hidden="true"></span>
                <span class="bento-label" data-i18n="prod3t">2D / 3D animation</span>
              </button>
            </article>
            <article class="bento-item">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="qhmdOad_0Dw" data-yt-title="Explainer" aria-label="Play explainer">
                <img src="assets/img/thumbs/qhmdOad_0Dw.jpg" alt="Explainer video" loading="lazy" width="640" height="360" />
                <span class="yt-facade-play" aria-hidden="true"></span>
                <span class="bento-label" data-i18n="prod4t">Explainer videos</span>
              </button>
            </article>
            <article class="bento-item">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="heeNhPdB25E" data-yt-title="Social content" aria-label="Play social">
                <img src="assets/img/thumbs/heeNhPdB25E.jpg" alt="Social video" loading="lazy" width="640" height="360" />
                <span class="yt-facade-play" aria-hidden="true"></span>
                <span class="bento-label" data-i18n="prod5t">Social & short-form</span>
              </button>
            </article>
            <article class="bento-item bento-item--wide">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="wzUNAKqOE8Q" data-yt-title="Medical content" aria-label="Play medical">
                <img src="assets/img/thumbs/wzUNAKqOE8Q.jpg" alt="Medical content" loading="lazy" width="1280" height="720" />
                <span class="yt-facade-play" aria-hidden="true"></span>
                <span class="bento-label" data-i18n="prod6t">Medical content</span>
              </button>
            </article>
          </div>
          <div class="hero-ctas reveal" style="margin-top: 28px">
            <a class="btn btn-pill btn-on-light" href="#contact" data-i18n="ctaProduction" data-track="cta_creative">Discuss a content project</a>
            <a class="btn btn-pill btn-outline-dark" href="case-study-imc.html" data-i18n="ctaExploreWork">Explore our work</a>
          </div>
        </div>
      </section>`;

html = html.replace(/<section id="creative"[\s\S]*?<\/section>/, creativeNew);

html = html.replace(
  '<section id="services" class="band-mist has-index" data-index="02">',
  '<section id="services" class="band-mist has-index has-bg-media" data-index="02" style="--section-bg: url(assets/img/visuals/analytics.jpg)">'
);

html = html.replace(
  '<section id="process" class="band-ink has-index" data-index="03">',
  '<section id="process" class="band-ink has-index has-bg-media has-bg-media--dark" data-index="03" style="--section-bg: url(assets/img/visuals/abstract-creative.jpg)">'
);

html = html.replace(
  `<div class="systems-grid systems-grid--3">
            <a class="systems-card systems-card--emphasis reveal" href="case-study-imc.html">
              <span class="systems-sector" data-i18n="sysMedSector">Healthcare</span>
              <h3 data-i18n="sysMedName">Healthcare marketing & creative content</h3>
              <p data-i18n="sysMedBody">Patient education, hospital brand content, medical animation, awareness campaigns, and digital distribution. Proven with International Medical Center.</p>
              <span class="systems-cta" data-i18n="sysMedCta">Discuss a healthcare campaign</span>
            </a>
            <a class="systems-card reveal" href="case-study-real-estate.html">
              <span class="systems-sector" data-i18n="sysPropSector">Real estate</span>
              <h3 data-i18n="sysPropName">Real estate marketing & creative content</h3>
              <p data-i18n="sysPropBody">Launch campaigns, property storytelling, social video, motion, and lead-focused digital marketing. For architectural visualization and project experiences, we collaborate with Graphics House.</p>
              <span class="systems-cta" data-i18n="sysPropCta">Plan your project campaign</span>
            </a>
            <a class="systems-card reveal" href="#contact">
              <span class="systems-sector" data-i18n="sysCorpSector">Corporate & commercial</span>
              <h3 data-i18n="sysCorpName">Corporate marketing & creative content</h3>
              <p data-i18n="sysCorpBody">Brand films, explainers, social campaigns, and performance marketing for companies and consumer brands.</p>
              <span class="systems-cta" data-i18n="sysCorpCta">Talk to our team</span>
            </a>
          </div>`,
  `<div class="systems-grid systems-grid--3">
            <a class="systems-card systems-card--media systems-card--emphasis reveal" href="case-study-imc.html">
              <div class="systems-media">
                <img src="assets/img/thumbs/CtjHnqYOX3I.jpg" alt="" loading="lazy" width="640" height="360" />
              </div>
              <div class="systems-body">
                <span class="systems-sector" data-i18n="sysMedSector">Healthcare</span>
                <h3 data-i18n="sysMedName">Healthcare marketing & creative content</h3>
                <p data-i18n="sysMedBody">Patient education, hospital brand content, medical animation, awareness campaigns, and digital distribution. Proven with International Medical Center.</p>
                <span class="systems-cta" data-i18n="sysMedCta">Discuss a healthcare campaign</span>
              </div>
            </a>
            <a class="systems-card systems-card--media reveal" href="case-study-real-estate.html">
              <div class="systems-media">
                <img src="assets/img/thumbs/WoYMS7Xs7cY.jpg" alt="" loading="lazy" width="640" height="360" />
              </div>
              <div class="systems-body">
                <span class="systems-sector" data-i18n="sysPropSector">Real estate</span>
                <h3 data-i18n="sysPropName">Real estate marketing & creative content</h3>
                <p data-i18n="sysPropBody">Launch campaigns, property storytelling, social video, motion, and lead-focused digital marketing. For architectural visualization and project experiences, we collaborate with Graphics House.</p>
                <span class="systems-cta" data-i18n="sysPropCta">Plan your project campaign</span>
              </div>
            </a>
            <a class="systems-card systems-card--media reveal" href="#contact">
              <div class="systems-media">
                <img src="assets/img/visuals/corporate.jpg" alt="" loading="lazy" width="640" height="360" />
              </div>
              <div class="systems-body">
                <span class="systems-sector" data-i18n="sysCorpSector">Corporate & commercial</span>
                <h3 data-i18n="sysCorpName">Corporate marketing & creative content</h3>
                <p data-i18n="sysCorpBody">Brand films, explainers, social campaigns, and performance marketing for companies and consumer brands.</p>
                <span class="systems-cta" data-i18n="sysCorpCta">Talk to our team</span>
              </div>
            </a>
          </div>`
);

html = html.replace(
  `<div class="signature-grid">
            <a class="signature-card reveal" href="case-study-imc.html">
              <span class="signature-kicker" data-i18n="sysMedSector">Healthcare</span>
              <h3 data-i18n="sigMedName">MedMotion™</h3>
              <p data-i18n="sigMedBody">Healthcare creative content & digital marketing, patient education, medical motion, campaigns, and steady channel presence.</p>
              <span class="signature-cta" data-i18n="sigMedCta">IMC case study</span>
            </a>
            <a class="signature-card reveal" href="case-study-real-estate.html">
              <span class="signature-kicker" data-i18n="sysPropSector">Real estate</span>
              <h3 data-i18n="sigPropName">PropMotion™</h3>
              <p data-i18n="sigPropBody">Real estate creative content & campaigns, launch storytelling, social video, and lead-focused digital marketing.</p>
              <span class="signature-cta" data-i18n="sigPropCta">Real estate case</span>
            </a>
          </div>`,
  `<div class="signature-grid">
            <a class="signature-card signature-card--media reveal" href="case-study-imc.html">
              <div class="signature-media">
                <img src="assets/img/thumbs/CtjHnqYOX3I.jpg" alt="MedMotion" loading="lazy" width="800" height="450" />
              </div>
              <div class="signature-body">
                <span class="signature-kicker" data-i18n="sysMedSector">Healthcare</span>
                <h3 data-i18n="sigMedName">MedMotion™</h3>
                <p data-i18n="sigMedBody">Healthcare creative content & digital marketing, patient education, medical motion, campaigns, and steady channel presence.</p>
                <span class="signature-cta" data-i18n="sigMedCta">IMC case study</span>
              </div>
            </a>
            <a class="signature-card signature-card--media reveal" href="case-study-real-estate.html">
              <div class="signature-media">
                <img src="assets/img/thumbs/H66KNP1sQCk.jpg" alt="PropMotion" loading="lazy" width="800" height="450" />
              </div>
              <div class="signature-body">
                <span class="signature-kicker" data-i18n="sysPropSector">Real estate</span>
                <h3 data-i18n="sigPropName">PropMotion™</h3>
                <p data-i18n="sigPropBody">Real estate creative content & campaigns, launch storytelling, social video, and lead-focused digital marketing.</p>
                <span class="signature-cta" data-i18n="sigPropCta">Real estate case</span>
              </div>
            </a>
          </div>`
);

if (!html.includes("work-reel")) {
  html = html.replace(
    `<div class="work-cases reveal">
            <a class="work-case" href="case-study-imc.html">
              <span class="work-case-sector" data-i18n="sysMedSector">Healthcare</span>
              <h3 data-i18n="csHubImcName">International Medical Center</h3>
              <p data-i18n="csHubImcBlurb">Healthcare content for International Medical Center: educational motion and cartoon series built for trust, clarity, and continuous digital presence.</p>
              <span class="work-case-cta" data-i18n="csHubRead">Read the case</span>
            </a>
            <a class="work-case" href="case-study-real-estate.html">
              <span class="work-case-sector" data-i18n="sysPropSector">Real estate</span>
              <h3 data-i18n="sigPropName">PropMotion™</h3>
              <p data-i18n="csHubGhBlurb">Real estate creative content and marketing assets that help sell the project story, in collaboration with Graphics House where visualization is needed.</p>
              <span class="work-case-cta" data-i18n="csHubRead">Read the case</span>
            </a>
          </div>`,
    `<div class="work-cases reveal">
            <a class="work-case work-case--media" href="case-study-imc.html">
              <div class="work-case-media">
                <img src="assets/img/thumbs/CtjHnqYOX3I.jpg" alt="" loading="lazy" width="800" height="450" />
              </div>
              <div class="work-case-body">
                <span class="work-case-sector" data-i18n="sysMedSector">Healthcare</span>
                <h3 data-i18n="csHubImcName">International Medical Center</h3>
                <p data-i18n="csHubImcBlurb">Healthcare content for International Medical Center: educational motion and cartoon series built for trust, clarity, and continuous digital presence.</p>
                <span class="work-case-cta" data-i18n="csHubRead">Read the case</span>
              </div>
            </a>
            <a class="work-case work-case--media" href="case-study-real-estate.html">
              <div class="work-case-media">
                <img src="assets/img/thumbs/WoYMS7Xs7cY.jpg" alt="" loading="lazy" width="800" height="450" />
              </div>
              <div class="work-case-body">
                <span class="work-case-sector" data-i18n="sysPropSector">Real estate</span>
                <h3 data-i18n="sigPropName">PropMotion™</h3>
                <p data-i18n="csHubGhBlurb">Real estate creative content and marketing assets that help sell the project story, in collaboration with Graphics House where visualization is needed.</p>
                <span class="work-case-cta" data-i18n="csHubRead">Read the case</span>
              </div>
            </a>
          </div>
          <div class="work-reel reveal" aria-label="Selected productions">
            <article class="work-reel-item">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="glKO_84lwZo" data-yt-title="IMC series" aria-label="Play">
                <img src="assets/img/thumbs/glKO_84lwZo.jpg" alt="" loading="lazy" width="640" height="360" />
                <span class="yt-facade-play" aria-hidden="true"></span>
              </button>
            </article>
            <article class="work-reel-item">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="qhmdOad_0Dw" data-yt-title="Healthcare motion" aria-label="Play">
                <img src="assets/img/thumbs/qhmdOad_0Dw.jpg" alt="" loading="lazy" width="640" height="360" />
                <span class="yt-facade-play" aria-hidden="true"></span>
              </button>
            </article>
            <article class="work-reel-item">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="H66KNP1sQCk" data-yt-title="Real estate film" aria-label="Play">
                <img src="assets/img/thumbs/H66KNP1sQCk.jpg" alt="" loading="lazy" width="640" height="360" />
                <span class="yt-facade-play" aria-hidden="true"></span>
              </button>
            </article>
            <article class="work-reel-item">
              <button type="button" class="yt-facade yt-facade--cover" data-yt-id="qCYcoSsy3fs" data-yt-title="Project film" aria-label="Play">
                <img src="assets/img/thumbs/qCYcoSsy3fs.jpg" alt="" loading="lazy" width="640" height="360" />
                <span class="yt-facade-play" aria-hidden="true"></span>
              </button>
            </article>
          </div>`
  );
}

html = html.replace(
  '<section id="why" class="why-band band-ink">',
  '<section id="why" class="why-band band-ink has-bg-media has-bg-media--dark" style="--section-bg: url(assets/img/visuals/strategy-meeting.jpg)">'
);

html = html.replace(
  `<section id="agency" class="agency-band band-paper agency-band--rail">
        <div class="container agency-inner reveal">
          <span class="svc-tag" data-i18n="agencyTag">Agency partners</span>
          <h2 class="font-headline-xl" data-i18n="agencyTitle">Your client. Your strategy. Our production depth.</h2>
          <p class="font-body-md" data-i18n="agencyBody">You own the relationship and the brief. We extend your team with motion, video, animation, and campaign execution, never competing for the account.</p>
          <a class="btn btn-pill btn-on-light" href="#contact" data-track="cta_agency" data-i18n="ctaAgency">Become a production partner</a>
        </div>
      </section>`,
  `<section id="agency" class="agency-band band-paper agency-band--split">
        <div class="container agency-split reveal">
          <div class="agency-copy">
            <span class="svc-tag" data-i18n="agencyTag">Agency partners</span>
            <h2 class="font-headline-xl" data-i18n="agencyTitle">Your client. Your strategy. Our production depth.</h2>
            <p class="font-body-md" data-i18n="agencyBody">You own the relationship and the brief. We extend your team with motion, video, animation, and campaign execution, never competing for the account.</p>
            <a class="btn btn-pill btn-on-light" href="#contact" data-track="cta_agency" data-i18n="ctaAgency">Become a production partner</a>
          </div>
          <div class="agency-photo">
            <img src="assets/img/visuals/agency-collab.jpg" alt="" loading="lazy" width="900" height="700" />
          </div>
        </div>
      </section>`
);

html = html.replace(
  '<section id="packages" class="band-warm">',
  '<section id="packages" class="band-warm has-bg-media has-bg-media--soft" style="--section-bg: url(assets/img/visuals/analytics.jpg)">'
);

html = html.replace(
  '<section id="contact" class="band-paper">',
  '<section id="contact" class="band-paper has-bg-media has-bg-media--soft" style="--section-bg: url(assets/img/visuals/studio-camera.jpg)">'
);

html = html.replace(/\?v=20260813[a-z]/g, "?v=20260813v");

fs.writeFileSync(htmlPath, html);
const hits = (html.match(/assets\/img\/(thumbs|visuals)\//g) || []).length;
console.log("done media refs:", hits);
console.log({
  bento: html.includes("creative-bento"),
  about: html.includes("about-visual"),
  reel: html.includes("work-reel"),
  agency: html.includes("agency-split"),
});
