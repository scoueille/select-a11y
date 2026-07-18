/* eslint-env node */
'use strict';

const nodePath = require('path');
const test = require('tape');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const scriptPath = nodePath.resolve(__dirname, '../public/assets/scripts/select-a11y.js');
const stylePath = nodePath.resolve(__dirname, '../public/assets/css/select-a11y.css');

const createBrowser = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  return [browser, page];
};

const setupPage = async (page, body) => {
  await page.setContent(`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Tests accessibilite select-a11y</title>
</head>
<body>
  <main>
    ${body}
  </main>
</body>
</html>`);
  await page.addStyleTag({ path: stylePath });
  await page.addScriptTag({ path: scriptPath });
};

const formatViolations = violations => violations.map(violation => {
  const targets = violation.nodes.map(node => node.target.join(' ')).join(', ');
  return `${violation.id} (${violation.impact || 'impact inconnu'}) - ${violation.help} - ${targets}`;
}).join('\n');

const assertNoAxeViolations = async (t, page, label) => {
  const results = await new AxePuppeteer(page).include('body').analyze();

  if(results.violations.length) {
    t.comment(formatViolations(results.violations));
  }

  t.same(results.violations, [], label);
};

test('axe-core - select simple ferme', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-simple">Choisir une option</label>
      <select id="select-simple">
        <option>Perceivable</option>
        <option>Operable</option>
        <option>Understandable</option>
        <option>Robust</option>
      </select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-simple'));
  });

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur un select simple ferme');
  await browser.close();

  t.end();
});

test('axe-core - select simple ouvert', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-simple-open">Choisir une option</label>
      <select id="select-simple-open">
        <option>Perceivable</option>
        <option>Operable</option>
        <option>Understandable</option>
        <option>Robust</option>
      </select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-simple-open'));
  });
  await page.click('#select-simple-open-button');

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur un select simple ouvert');
  await browser.close();

  t.end();
});

test('axe-core - select multiple avec elements selectionnes', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-multiple">Choisir plusieurs options</label>
      <select id="select-multiple" multiple>
        <option selected>Perceivable</option>
        <option selected>Operable</option>
        <option>Understandable</option>
        <option>Robust</option>
      </select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-multiple'));
  });

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur un select multiple avec tags');
  await browser.close();

  t.end();
});

test('axe-core - select multiple ouvert avec selection globale', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-select-all">Choisir plusieurs options</label>
      <select id="select-select-all" multiple>
        <option>Perceivable</option>
        <option>Operable</option>
        <option>Understandable</option>
        <option>Robust</option>
      </select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-select-all'), {
      selectAll: true,
      addCloseButton: true
    });
  });
  await page.click('.btn-select-a11y');

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur un select multiple ouvert avec select all');
  await browser.close();

  t.end();
});

test('axe-core - select multiple ouvert avec groupes', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-groups">Choisir plusieurs options groupees</label>
      <select id="select-groups" multiple>
        <option>Robust 1</option>
        <optgroup label="Groupe 1">
          <option>Perceivable</option>
          <option>Operable</option>
        </optgroup>
        <option>Understandable 1</option>
        <optgroup label="Groupe 2">
          <option>Understandable</option>
          <option>Robust</option>
        </optgroup>
      </select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-groups'), {
      selectAll: true,
      addCloseButton: true
    });
  });
  await page.click('.btn-select-a11y');

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur un select multiple ouvert avec optgroups');
  await browser.close();

  t.end();
});

test('axe-core - select ouvert sans resultat', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-no-result">Choisir une option</label>
      <select id="select-no-result">
        <option>Perceivable</option>
        <option>Operable</option>
      </select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-no-result'));
  });
  await page.click('#select-no-result-button');
  await page.type('#a11y-select-no-result-js', 'zzz');

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur un select ouvert sans resultat');
  await browser.close();

  t.end();
});

test('axe-core - required invalide apres submit echoue', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form id="required-form" action="#" method="post">
      <label for="select-required">Choisir une option obligatoire</label>
      <select id="select-required" required>
        <option value="">Choisir</option>
        <option value="a">Option A</option>
      </select>
      <button type="submit">Envoyer</button>
    </form>
  `);

  await page.evaluate(() => {
    const form = document.getElementById('required-form');
    form.addEventListener('submit', event => event.preventDefault());
    new Select(document.getElementById('select-required'));
    form.requestSubmit();
  });

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur un etat required invalide');
  await browser.close();

  t.end();
});

test('axe-core - etat serveur is-invalid', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-server-invalid">Choisir une option</label>
      <select id="select-server-invalid" class="is-invalid">
        <option>Perceivable</option>
        <option>Operable</option>
      </select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-server-invalid'));
  });

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur un etat serveur is-invalid');
  await browser.close();

  t.end();
});

test('axe-core - mode mots cles', async t => {
  const [browser, page] = await createBrowser();

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-keywords">Ajouter des mots cles</label>
      <select id="select-keywords" multiple>
        <option selected>Perceivable</option>
        <option selected>Operable</option>
      </select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-keywords'), {
      keywordsMode: true,
      allowNewKeyword: true
    });
  });

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur le mode mots cles');
  await browser.close();

  t.end();
});

test('axe-core - autocomplete avec suggestions', async t => {
  const [browser, page] = await createBrowser();

  await page.setRequestInterception(true);
  page.on('request', request => {
    if(request.url().startsWith('https://example.test/search')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          results: [
            { id: 'perceivable', label: 'Perceivable' },
            { id: 'operable', label: 'Operable' }
          ]
        })
      });
      return;
    }

    request.continue();
  });

  await setupPage(page, `
    <form action="#" method="post">
      <label for="select-autocomplete">Rechercher une option</label>
      <select id="select-autocomplete" multiple></select>
    </form>
  `);

  await page.evaluate(() => {
    new Select(document.getElementById('select-autocomplete'), {
      keywordsMode: true,
      url: 'https://example.test/search?q=',
      urlResultsArray: 'results',
      urlValueField: 'id',
      urlLabelField: 'label',
      allowNewKeyword: false,
      preventCloseOnSelect: true
    });
  });
  await page.type('#select-autocomplete-input', 'pe');
  await page.waitForFunction(() => document.querySelectorAll('.a11y-suggestions [role="option"]').length === 2);

  await assertNoAxeViolations(t, page, 'Aucune violation axe sur autocomplete avec suggestions');
  await browser.close();

  t.end();
});
