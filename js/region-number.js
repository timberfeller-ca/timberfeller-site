/**
 * Shows the Timber phone number for the visitor's region.
 * Ontario (613) 209-4148 is in the page by default, so it works without this script.
 * Visitors whose browser is on Atlantic time (PEI, Nova Scotia, New Brunswick) get the PEI number (902) 816-1968.
 * No location lookup or outside service is used: only the browser's own time zone setting.
 * ?region=pe or ?region=on in the address forces one (for testing).
 */
(function () {
  const NUMBERS = {
    on: { e164: '+16132094148', shown: '613-209-4148', qr: 'img/text-quote-qr-on.png', place: 'Ontario' },
    pe: { e164: '+19028161968', shown: '902-816-1968', qr: 'img/text-quote-qr-pe.png', place: 'PEI' },
  };
  const ATLANTIC = ['America/Halifax', 'America/Moncton', 'America/Glace_Bay', 'America/Goose_Bay'];

  /** Returns 'pe' for Atlantic-time browsers (or ?region=pe), otherwise 'on'. */
  function region() {
    const forced = new URLSearchParams(location.search).get('region');
    if (forced === 'pe' || forced === 'on') return forced;
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* old browser: keep Ontario */ }
    return ATLANTIC.includes(tz) ? 'pe' : 'on';
  }

  const here = region();
  const n = NUMBERS[here];
  const other = NUMBERS[here === 'pe' ? 'on' : 'pe'];
  document.querySelectorAll('a[href^="sms:+16132094148"]').forEach((a) => {
    a.href = a.getAttribute('href').replace('+16132094148', n.e164);
    if (a.textContent.trim() === NUMBERS.on.shown) a.textContent = n.shown;
    if (a.textContent.trim() === 'Text ' + NUMBERS.on.shown) a.textContent = 'Text ' + n.shown;
  });
  document.querySelectorAll('.tnum').forEach((el) => { el.textContent = el.textContent.replace(NUMBERS.on.shown, n.shown); });
  document.querySelectorAll('img.tqr').forEach((img) => { img.src = n.qr; });
  document.querySelectorAll('.other-number').forEach((el) => {
    el.innerHTML = `In ${other.place}? Text <a href="sms:${other.e164}">${other.shown}</a>`;
  });
})();
