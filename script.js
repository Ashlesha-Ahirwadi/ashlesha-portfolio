// Portfolio page behaviour: project cards, filters, modal, nav, scroll reveal, counters.
(function () {
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ---------- project cards ---------- */
    var grid = document.getElementById('projectGrid');
    var projects = window.PROJECTS || [];
    // which of Kiki's lines describes each project (she says it when you hover a card)
    var KIKI_SAYS = { 'medicurious': 'medicurious', 'genai-azure': 'genai', 'fake-review-detection': 'fakereview',
        'stock-market-prediction': 'stock', 'lung-tumor-detection': 'lung', 'icu-insight': 'icu',
        'eeg-dream-visualization': 'eeg', 'storyteller-ai': 'story_ai', 'image-restoration': 'restore',
        'virtual-gym-trainer': 'gym', 'business-artist-connector': 'connector' };
    grid.innerHTML = projects.map(function (p) {
        return '<button class="clay-card project reveal" data-project="' + p.id + '" data-tags="' + p.tags.join(' ') + '" data-perch data-say="' + (KIKI_SAYS[p.id] || '') + '">' +
            '<div class="project-img"><img src="' + p.image + '" alt="" loading="lazy"></div>' +
            '<h3>' + p.name + '</h3>' +
            '<p>' + p.blurb + '</p>' +
            '<div class="tags">' + p.tech.slice(0, 3).map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
            '</button>';
    }).join('');

    /* ---------- filters ---------- */
    document.querySelectorAll('.clay-chip[data-filter]').forEach(function (chip) {
        chip.addEventListener('click', function () {
            document.querySelectorAll('.clay-chip[data-filter]').forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            var f = chip.getAttribute('data-filter');
            grid.querySelectorAll('.project').forEach(function (card) {
                var show = f === 'all' || card.getAttribute('data-tags').split(' ').indexOf(f) > -1;
                card.classList.toggle('hide', !show);
            });
        });
    });

    /* ---------- modal ---------- */
    var modal = document.getElementById('projectModal');
    function openProject(id) {
        var p = projects.filter(function (x) { return x.id === id; })[0];
        if (!p) return;
        document.getElementById('modalImage').src = p.image;
        document.getElementById('modalTitle').textContent = p.title;
        var points = p.description.split('\n').map(function (l) { return l.replace(/^•\s*/, '').trim(); }).filter(Boolean);
        document.getElementById('modalPoints').innerHTML = points.map(function (l) {
            var li = document.createElement('li'); li.textContent = l; return li.outerHTML;
        }).join('');
        document.getElementById('modalTags').innerHTML = p.tech.map(function (t) { return '<span>' + t + '</span>'; }).join('');
        document.getElementById('modalLinks').innerHTML = (p.links || []).map(function (l) {
            return '<a class="clay-btn clay-btn-sm clay-pink" href="' + l.url + '" target="_blank" rel="noopener"><i class="' + l.icon + '"></i> ' + l.text + '</a>';
        }).join('');
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal-close').focus();
    }
    function closeProject() { modal.hidden = true; document.body.style.overflow = ''; }
    grid.addEventListener('click', function (e) {
        var card = e.target.closest('.project'); if (card) openProject(card.getAttribute('data-project'));
    });
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeProject(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeProject(); });
    window.openProject = openProject;

    /* ---------- nav ---------- */
    var navLinks = document.getElementById('navLinks');
    document.getElementById('navToggle').addEventListener('click', function () { navLinks.classList.toggle('open'); });
    navLinks.addEventListener('click', function () { navLinks.classList.remove('open'); });
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    window.addEventListener('scroll', function () {
        var y = window.scrollY + 140, current = 'home';
        sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
        navLinks.querySelectorAll('a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
    }, { passive: true });

    /* ---------- hero: rotating "currently building" line ---------- */
    var rot = document.getElementById('rotWord');
    var words = ['multi-agent RAG systems', 'agentic workflows', 'LLM tools', 'production ML pipelines'], wi = 0;
    if (rot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(function () {
            rot.classList.add('out');
            setTimeout(function () { wi = (wi + 1) % words.length; rot.textContent = words[wi]; rot.classList.remove('out'); }, 350);
        }, 2600);
    }

    /* ---------- cards tilt gently toward the cursor ---------- */
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('pointermove', function (e) {
            var card = e.target.closest && e.target.closest('.project, .job, .post');
            if (!card) return;
            var r = card.getBoundingClientRect();
            card.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 6).toFixed(2) + 'deg');
            card.style.setProperty('--rx', (((e.clientY - r.top) / r.height - .5) * -5).toFixed(2) + 'deg');
        }, { passive: true });
    }

    /* ---------- reveal + counters ---------- */
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            en.target.classList.add('in');
            en.target.querySelectorAll('[data-count]').forEach(function (n) {
                var end = +n.getAttribute('data-count'), t0 = performance.now();
                (function tick(t) {
                    var k = Math.min(1, (t - t0) / 900);
                    n.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
                    if (k < 1) requestAnimationFrame(tick);
                })(t0);
            });
            io.unobserve(en.target);
        });
    }, { threshold: .15 });
    document.querySelectorAll('.hero .reveal').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
})();
