/* eslint-env node */
'use strict';

const nodePath = require('path');
const test = require( 'tape' );
const puppeteer = require( 'puppeteer' );
const path = `file://${nodePath.resolve(__dirname, '../public/index.html')}`;

const createBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto( path );

  return [ browser, page ];
};

test( 'Creation du select-a11y simple', async t => {
  const [ browser, page ] = await createBrowser();

  const {label, select} = await page.evaluate(() => {
    const wrapper = document.querySelector('.form-group');
    const selectA11y = wrapper.querySelector('.select-a11y');

    return {
      label: wrapper.firstElementChild.getAttribute('for') === 'select-option',
      select: selectA11y !== null
    }
  });

  t.true( label, 'Le label n’est pas déplacé' );
  t.true( select, 'Le conteneur de select-a11y est créé' );

  const { tagHidden, live, button} = await page.evaluate(() => {
    const selectA11y = document.querySelector('.form-group > .select-a11y');
    const tagHidden = selectA11y.querySelector('.tag-hidden');
    const live = selectA11y.querySelector('[aria-live]');
    const button = selectA11y.querySelector('button[aria-expanded]');


    return {
      tagHidden: {
        exists: tagHidden !== null,
        isHidden: tagHidden && tagHidden.getAttribute('aria-hidden') === 'true',
        select: tagHidden && tagHidden.firstElementChild.tagName
      },
      live: {
        exists: live !== null,
        isPolite: live && live.getAttribute('aria-live') === 'polite'
      },
      button: {
        exists: button !== null,
        isClosed: button && button.getAttribute('aria-expanded') === 'false'
      }
    }
  });

  t.true( tagHidden.exists, 'Le conteneur du select original est créé');
  t.same( tagHidden.select, 'SELECT', 'Le conteneur du select original contient bien le select original');
  t.true( tagHidden.isHidden, 'Le conteneur du select original est caché au lecteurs d’écran');

  t.true( live.exists, 'L‘élément de restitution vocal est créé');
  t.true( live.isPolite, 'L‘élément de restitution vocal est paramétré à « polite »');

  t.true( button.exists, 'Le bouton permettant d’ouvrir le select est créé');
  t.true( button.isClosed, 'Le bouton permettant d’ouvrir le select est paramétré comme fermé par défaut');

  await browser.close();

  t.end();
});

test( 'Creation du select-a11y multiple', async t => {
  const [ browser, page ] = await createBrowser();

  const {select} = await page.evaluate(() => {
    const wrapper = document.querySelector('.form-group');
    const selectA11y = wrapper.querySelector('.select-a11y');

    return {
      select: selectA11y !== null
    }
  });

  t.true( select, 'Le conteneur de select-a11y est créé' );

  const { tagHidden, live, button} = await page.evaluate(() => {
    const selectA11y = document.querySelectorAll('.form-group > .select-a11y')[1];
    const tagHidden = selectA11y.querySelector('.tag-hidden');
    const live = selectA11y.querySelector('[aria-live]');
    const button = selectA11y.querySelector('button[aria-expanded]');


    return {
      tagHidden: {
        exists: tagHidden !== null,
        isHidden: tagHidden && tagHidden.getAttribute('aria-hidden') === 'true',
        label: tagHidden && tagHidden.firstElementChild.tagName,
        hasSelect: tagHidden && tagHidden.querySelector('select') !== null
      },
      live: {
        exists: live !== null,
        isPolite: live && live.getAttribute('aria-live') === 'polite'
      },
      button: {
        exists: button !== null,
        isClosed: button && button.getAttribute('aria-expanded') === 'false'
      }
    }
  });

  t.true( tagHidden.exists, 'Le conteneur du select original est créé');
  t.true( tagHidden.hasSelect, 'Le conteneur du select original contient bien le select original');
  t.same( tagHidden.label, 'LABEL', 'Le conteneur du select original contient bien le label du select original');
  t.true( tagHidden.isHidden, 'Le conteneur du select original est caché au lecteurs d’écran');

  t.true( live.exists, 'L‘élément de restitution vocal est créé');
  t.true( live.isPolite, 'L‘élément de restitution vocal est paramétré à « polite »');

  t.true( button.exists, 'Le bouton permettant d’ouvrir le select est créé');
  t.true( button.isClosed, 'Le bouton permettant d’ouvrir le select est paramétré comme fermé par défaut');

  await browser.close();

  t.end();
});

test( 'État par défaut', async t => {
  const [ browser, page ] = await createBrowser();

  const selects = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));

    return selects.map(select => {
      const wrapper = select.closest('.select-a11y');
      const label = document.querySelector(`label[for=${select.id}]`);

      const button = wrapper.querySelector('button[aria-expanded]');

      if(select.multiple){
        const selectedValues = Array.from(select.selectedOptions).map(option => option.value);
        const listItems = Array.from(wrapper.querySelectorAll('.tag-item')).map(item => item.firstElementChild.textContent.trim());

        return {
          multiple: true,
          label: label.textContent.trim(),
          buttonLabel: button.textContent.trim(),
          values: selectedValues.join(':'),
          listItems: listItems.join(':'),
        }
      }
      else {
        return {
          multiple: false,
          buttonLabel: button.textContent.trim(),
          value: select.value,
        }
      }
    });
  });

  selects.forEach(select => {
    if(select.multiple){
      t.same(select.label, select.buttonLabel, 'Le select multiple affiche le label dans le bouton d’ouverture');
      t.same(select.listItems, select.values, 'Le select multiple affiche une liste des éléments sélectionnés par défaut');
    }
    else {
      t.same(select.buttonLabel, select.value, 'Le select affiche la valeur de l’élément sélectionné par défaut dans le bouton d’ourerture');
    }
  });

  await browser.close();

  t.end();
});


test( 'Position du curseur au focus du champ de recherche', async t => {
  const [ browser, page ] = await createBrowser();

  await page.click('.multiple button');

  await page.type('#a11y-select-element-js', 'ee');

  await page.keyboard.press('ArrowDown');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const data = await page.evaluate(() => {
    const input = document.getElementById('a11y-select-element-js');
    const activeElement = document.activeElement;

    return {
      focused: input === activeElement,
      selectionStart: input.selectionStart,
      selectionEnd: input.selectionEnd,
      length: input.value.length,
    }
  });

  t.true(data.focused, 'Le focus est dans le champ');
  t.same(data.selectionStart, data.selectionEnd, 'Le focus ne sélectionne pas tout le texte du champ');
  t.same(data.selectionStart, data.length, 'Le curseur est positionné en fin de texte');

  await browser.close();

  t.end();
});
