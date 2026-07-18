/* eslint-env node */
'use strict';

const nodePath = require('path');
const test = require( 'tape' );
const puppeteer = require( 'puppeteer' );
const path = `file://${nodePath.resolve(__dirname, '../public/index.html')}`;
const scriptPath = nodePath.resolve(__dirname, '../public/assets/scripts/select-a11y.js');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const createBrowser = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.goto( path );

  return [ browser, page ];
};

test( 'Creation du select-a11y simple', async t => {
  const [ browser, page ] = await createBrowser();

  const {label, select} = await page.evaluate(() => {
    const wrapper = document.querySelector('.form-group');
    const selectA11y = wrapper.querySelector('.select-a11y');
    const label = wrapper.firstElementChild;

    return {
      label: {
        stayed: label && label.getAttribute('for') === 'select-option',
        id: label && label.id
      },
      select: selectA11y !== null
    }
  });

  t.true( label.stayed, 'Le label n’est pas déplacé' );
  t.true( select, 'Le conteneur de select-a11y est créé' );

  const { tagHidden, live, button } = await page.evaluate(() => {
    const selectA11y = document.querySelector('.form-group > .select-a11y');
    const tagHidden = selectA11y.querySelector('.tag-hidden');
    const live = selectA11y.querySelector('[aria-live]');
    const button = selectA11y.querySelector('button[aria-expanded]');
    const label = selectA11y.querySelector('label');


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
        isClosed: button && button.getAttribute('aria-expanded') === 'false',
        labelledby: button && button.getAttribute('aria-labelledby')
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
  t.true( button.labelledby.includes( label.id ), 'Le bouton est lié au label via l’attribut « aria-labelledby »');

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
    const selects = Array.from(document.querySelectorAll('select'))
      .filter(select => select.closest('.select-a11y').querySelector('button[aria-expanded]'));

    return selects.map(select => {
      const wrapper = select.closest('.select-a11y');
      const label = document.querySelector(`label[for="${select.id}"]`);

      const button = wrapper.querySelector('button[aria-expanded]');

      if(select.multiple){
        const selectedValues = Array.from(select.selectedOptions).map(option => option.value);
        const listItems = Array.from(wrapper.querySelectorAll('.tag-item')).map(item => item.firstElementChild.textContent.trim());

        return {
          multiple: true,
          label: label ? label.textContent.trim() : '',
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

test( 'Création de la liste lors de l’ouverture du select simple', async t => {
  const [ browser, page ] = await createBrowser();

  await page.click('.form-group button');

  const data = await page.evaluate(() => {
    const wrapper = document.querySelector('.select-a11y');
    const select = wrapper.querySelector('select');
    const container = document.querySelector('.a11y-container');
    const help = container.firstElementChild;
    const label = container.querySelector('label');
    const input = container.querySelector('input');
    const options = container.querySelectorAll('[role="option"]');

    const listBox = container.querySelector('[role="listbox"]');

    return {
      hasContainer: wrapper.contains(container),
      help: {
        isParagraph: help.tagName === 'P',
        id: help.id
      },
      label: {
        for: label.getAttribute('for')
      },
      input: {
        id: input.id,
        describedby: input.getAttribute('aria-describedby')
      },
      list: {
        length: options.length
      },
      options: {
        length: select.options.length
      },
      listBox: {
        multiple: listBox.hasAttribute('aria-multiselectable')
      },
    }
  });

  t.true(data.hasContainer, 'La liste est créée lors de l’activation du bouton');
  t.true(data.help.isParagraph, 'Le texte explicatif est présent');
  t.same(data.help.id, data.input.describedby, 'Le texte explicatif est lié au champ de recherche via l’attribut « aria-describedby »');
  t.same(data.label.for, data.input.id, 'Le label est lié au champ de recherche via l’attribut « for »');
  t.same(data.list.length, data.options.length, 'La liste crée contient le même nombre d’options que le select');
  t.false(data.listBox.multiple, 'La liste pour le select ne contient pas d’attribut « aria-multiselectable »');

  await browser.close();

  t.end();
});

test( 'Création de la liste lors de l’ouverture du select multiple', async t => {
  const [ browser, page ] = await createBrowser();

  await page.click('.multiple button');

  const data = await page.evaluate(() => {
    const wrapper = document.querySelector('.multiple .select-a11y');
    const select = wrapper.querySelector('select');
    const container = document.querySelector('.multiple .a11y-container');
    const help = container.firstElementChild;
    const label = container.querySelector('label');
    const input = container.querySelector('input');
    const options = container.querySelectorAll('[role="option"]');

    const listBox = container.querySelector('[role="listbox"]');

    return {
      hasContainer: wrapper.contains(container),
      help: {
        isParagraph: help.tagName === 'P',
        id: help.id
      },
      label: {
        for: label.getAttribute('for')
      },
      input: {
        id: input.id,
        describedby: input.getAttribute('aria-describedby')
      },
      list: {
        length: options.length
      },
      options: {
        length: select.options.length
      },
      listBox: {
        multiple: listBox.getAttribute('aria-multiselectable')
      },
    }
  });

  t.true(data.hasContainer, 'La liste est créée lors de l’activation du bouton');
  t.true(data.help.isParagraph, 'Le texte explicatif est présent');
  t.same(data.help.id, data.input.describedby, 'Le texte explicatif est lié au champ de recherche via l’attribut « aria-describedby »');
  t.same(data.label.for, data.input.id, 'Le label est lié au champ de recherche via l’attribut « for »');
  t.same(data.list.length, data.options.length, 'La liste crée contient le même nombre d’options que le select');
  t.same(data.listBox.multiple, 'true', 'La liste pour le select contient l’attribut « aria-multiselectable »');

  await browser.close();

  t.end();
});

test( 'Gestion du champ de recherche', async t => {
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
    const options = document.querySelectorAll('.multiple [role="option"]')

    return {
      focused: input === activeElement,
      selectionStart: input.selectionStart,
      selectionEnd: input.selectionEnd,
      length: input.value.length,
      displayedOptions: options.length
    }
  });

  t.true(data.focused, 'Le focus est dans le champ');
  t.same(data.selectionStart, data.selectionEnd, 'Le focus ne sélectionne pas tout le texte du champ');
  t.same(data.selectionStart, data.length, 'Le curseur est positionné en fin de texte');
  t.same(data.displayedOptions, 2, 'La liste des options est filtrée lorsque qu’un texte est saisi dans le champ');

  await page.type('#a11y-select-element-js', 'eee');

  const noResult = await page.evaluate(() => {
    return document.querySelectorAll('.multiple .a11y-no-suggestion') !== undefined
  });

  t.true(noResult, 'La liste affiche un message d’erreur lorsqu’il n’y a pas d’option s’approchant du texte saisi dans le champ');

  await browser.close();

  t.end();
});

test( 'Gestion de la selection au clavier d’un select', async t => {
  const [ browser, page ] = await createBrowser();

  await page.focus('.form-group button');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await page.keyboard.press('Space');

  await wait(10);

  const spacePressed = await page.evaluate(() => {
    const button = document.querySelector('.form-group button');
    const select = document.querySelector('.form-group select');
    const activeElement = document.activeElement;

    return {
      closed: button.getAttribute('aria-expanded') === 'false',
      focus: activeElement === button,
      selectedLabel: [button.firstElementChild.textContent.trim()],
      selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
    }
  });

  t.true(spacePressed.closed, 'L’appui sur la barre d’espace sur une option ferme la liste des options');
  t.true(spacePressed.focus, 'L’appui sur la barre d’espace sur une option rend le focus au bouton d’ouverture');
  t.same(spacePressed.selectedOptions.length, 1, 'Le select comporte une options sélectionnée' );
  t.same(spacePressed.selectedLabel, spacePressed.selectedOptions, 'L’appui sur la barre d’espace sur une option sélectionne l’option');

  await page.reload();

  await page.focus('.form-group button');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await page.keyboard.press('Enter');

  await wait(10);

  const enterPressed = await page.evaluate(() => {
    const button = document.querySelector('.form-group button');
    const select = document.querySelector('.form-group select');
    const activeElement = document.activeElement;

    return {
      closed: button.getAttribute('aria-expanded') === 'false',
      focus: activeElement === button,
      active: activeElement.tagName,
      selectedLabel: [button.firstElementChild.textContent.trim()],
      selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
    }
  });

  t.true(enterPressed.closed, 'L’appui sur la touche entrée sur une option ferme la liste des options');
  t.true(enterPressed.focus, 'L’appui sur la touche entrée sur une option rend le focus au bouton d’ouverture');
  t.same(enterPressed.selectedOptions.length, 1, 'Le select comporte une options sélectionnée' );
  t.same(enterPressed.selectedLabel, enterPressed.selectedOptions, 'L’appui sur la touche entrée sur une option sélectionne l’option');

  await browser.close();

  t.end();
});

test( 'Gestion de la selection au clavier d’un select multiple', async t => {
  const [ browser, page ] = await createBrowser();

  await page.focus('.form-group.multiple button');
  await page.keyboard.press('Enter');

  await page.keyboard.press('Tab');

  await page.keyboard.press('Space');

  await wait(10);

  const spacePressed = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');
    const select = document.querySelector('.multiple select');
    const activeElement = document.activeElement;

    return {
      open: button.getAttribute('aria-expanded') === 'true',
      selected: activeElement.getAttribute('aria-selected') === 'true',
      selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
    }
  });

  t.true(spacePressed.open, 'L’appui sur la barre d’espace sur une option ne ferme pas la liste des options d’un select multiple');
  t.true(spacePressed.selected, 'L’appui sur la barre d’espace sur une option sélectionne l’option');
  t.same(spacePressed.selectedOptions.length, 2, 'Le select comporte 2 options sélectionnées' );

  await page.keyboard.press('Tab');

  await page.keyboard.press('Enter');

  await wait(10);

  const enterPressed = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');
    const select = document.querySelector('.multiple select');
    const activeElement = document.activeElement;
    const wrapper = document.querySelector('.form-group.multiple .select-a11y');
    const list = Array.from(wrapper.querySelectorAll('.list-selected .tag-item'));

    return {
      closed: button.getAttribute('aria-expanded') === 'false',
      focus: activeElement === button,
      selectedItems: list.map(item => item.firstElementChild.textContent.trim()),
      selectedOptions: Array.from(select.selectedOptions).map(option => option.value)
    }
  });

  t.true(enterPressed.closed, 'L’appui sur la touche entrée sur une option ferme la liste des options');
  t.true(enterPressed.focus, 'L’appui sur la touche entrée sur une option rend le focus au bouton d’ouverture');
  t.same(enterPressed.selectedOptions.length, 2, 'Le select comporte 2 options sélectionnées' );
  t.same(enterPressed.selectedItems, enterPressed.selectedOptions, 'L’appui sur la touche entrée sur une option sélectionne l’option');

  await browser.close();

  t.end();
});

test( 'Suppression des options via la liste des options sélectionnées', async t => {
  const [ browser, page ] = await createBrowser();

  await page.click('.multiple button');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');

  await page.focus('.form-group.multiple .list-selected .tag-item:nth-child(3) [role="button"]');
  await page.keyboard.press('Enter');

  const secondButtonFocused = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.form-group.multiple .list-selected .tag-item:nth-child(2) [role="button"]');
  });

  t.true(secondButtonFocused, 'Le focus est placé sur le bouton précédant dans l’ordre du document lors de la suppression');

  await page.focus('.form-group.multiple .list-selected .tag-item:nth-child(1) [role="button"]');
  await page.keyboard.press('Enter');

  const firstButtonFocused = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.form-group.multiple .list-selected .tag-item:nth-child(1) [role="button"]');
  });

  t.true(firstButtonFocused, 'Le focus est placé sur le premier bouton dans l’ordre du document lors de la suppression du premier bouton');

  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  const inputFocused = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.multiple .a11y-container input');
  });

  t.true(inputFocused, 'Le focus est placé dans le champ de recherche lorsque tous les boutons de suppression ont disparu');

  await browser.close();

  t.end();
});

test( 'Gestion de la liste au blur', async t => {
  const [ browser, page ] = await createBrowser();

  await page.click('.multiple button');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  const containerFocus = await page.evaluate(() => {
    const wrapper = document.querySelector('.multiple .select-a11y');
    const button = document.querySelector('.multiple button');

    return {
      isInsideSelect: wrapper.contains(document.activeElement),
      expanded: button.getAttribute('aria-expanded')
    }
  });

  t.same(containerFocus.isInsideSelect && containerFocus.expanded, 'true', 'La liste reste ouverte lorsque le focus reste dans le select');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');

  await wait(10);

  const buttonBlurTopExpanded = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');

    return button.getAttribute('aria-expanded');
  });

  t.same(buttonBlurTopExpanded, 'false', 'La liste est fermée lorsque le focus est en dehors du select');

  await page.click('.multiple button');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await wait(10);

  const select = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');
    const selected = document.querySelector('.form-group.multiple .tag-item [role="button"]');

    return {
      expanded: button.getAttribute('aria-expanded'),
      selectionFocused: selected === document.activeElement
    }
  });

  t.same(select.selectionFocused && select.expanded, false, 'La liste est fermée lorsque le focus est sur les boutons de la liste de sélection');

  await page.click('.multiple button');

  await wait(10);

  await page.click('body')

  await wait(20);

  const focused = await page.evaluate(() => {
    const button = document.querySelector('.multiple button');

    return button === document.activeElement
  });

  t.true(focused, 'La liste est fermée lorsqu’on clique en dehors');

  await browser.close();

  t.end();
});

test( 'Gestion de la liste du select simple au clic', async t => {
  const [ browser, page ] = await createBrowser();

  await page.click('.form-group button');

  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');

  await wait(10);

  const clickStatus = await page.evaluate(() => {
    const activeElement = document.activeElement;
    const opener = document.querySelector('.form-group button');

    return {
      expanded: opener.getAttribute('aria-expanded'),
      openerFocused: opener === activeElement
    }
  });

  t.same(clickStatus.expanded, 'false', 'La liste est refermée après un clic sur une option');
  t.true(clickStatus.openerFocused, 'Le focus est replacé sur le bouton ouvrant la liste');

  await page.click('.form-group button');

  await page.keyboard.down('Meta');
  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');
  await page.keyboard.up('Meta');

  await wait(10);

  const metaClickStatus = await page.evaluate(() => {
    const activeElement = document.activeElement;
    const opener = document.querySelector('.form-group button');

    return {
      expanded: opener.getAttribute('aria-expanded'),
      openerFocused: opener === activeElement
    }
  });

  t.same(metaClickStatus.expanded, 'false', 'La liste est refermée après un meta + clic sur une option');
  t.true(metaClickStatus.openerFocused, 'Le focus est replacé sur le bouton ouvrant la liste');

  await browser.close();

  t.end();
});

test( 'Gestion de la liste du select multiple au clic', async t => {
  const [ browser, page ] = await createBrowser();

  await page.click('.multiple button');

  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');

  await wait(10);

  const clickStatus = await page.evaluate(() => {
    const activeElement = document.activeElement;
    const opener = document.querySelector('.multiple button');

    return {
      expanded: opener.getAttribute('aria-expanded'),
      openerFocused: opener === activeElement
    }
  });

  t.same(clickStatus.expanded, 'true', 'La liste reste ouverte après un clic sur une option');
  t.false(clickStatus.openerFocused, 'Le focus n’est pas replacé sur le bouton ouvrant la liste');

  await page.keyboard.down('Meta');
  await page.click('.multiple .a11y-suggestions [role="option"]:nth-child(2)');
  await page.keyboard.up('Meta');

  await wait(10);

  const metaClickStatus = await page.evaluate(() => {
    const activeElement = document.activeElement;
    const opener = document.querySelector('.multiple button');
    const option = document.querySelector('.multiple .a11y-suggestions [role="option"]:nth-child(2)')

    return {
      expanded: opener.getAttribute('aria-expanded'),
      optionFocused: option === activeElement
    }
  });

  t.same(metaClickStatus.expanded, 'true', 'La liste n’est pas refermée après un meta + clic sur une option');
  t.true(metaClickStatus.optionFocused, 'Le focus reste sur l’option cliquée');

  await browser.close();

  t.end();
});

test( 'Navigation au clavier', async t => {
  const [ browser, page ] = await createBrowser();

  await page.focus('.form-group button');

  await page.keyboard.press('Enter');

  await page.keyboard.press('ArrowDown');

  const firstElementSelected = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
  });

  t.true(firstElementSelected, 'La touche « flèche bas » déplace le focus sur le premier élément de la liste');

  await page.keyboard.press('ArrowUp');

  const lastElementSelected = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(4)');
  });

  t.true(lastElementSelected, 'La touche « flèche haut » déplace le focus sur le dernier élément de la liste lorsque le premier élément à le focus');

  await page.keyboard.press('ArrowDown');

  const backToFirstElementSelected = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
  });

  t.true(backToFirstElementSelected, 'La touche « flèche bas » déplace le focus sur le premier élément de la liste lorsque le dernier élément à le focus');

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');

  const nextElement = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(3)');
  });

  t.true(nextElement, 'La touche « flèche bas » déplace le focus sur l’élement suivant');

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');

  const previous = await page.evaluate(() => {
    return document.activeElement === document.querySelector('.select-a11y [role=option]:nth-child(1)');
  });

  t.true(previous, 'La touche « flèche haut » déplace le focus sur l’élement précédent');

  await browser.close();

  t.end();
});

test( 'Reset du forumlaire', async t => {
  const [ browser, page ] = await createBrowser();

  await page.click('.form-group button');

  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');

  await wait(10);

  await page.click('.multiple button');

  await page.click('.a11y-suggestions [role="option"]:nth-child(2)');

  await wait(10);

  await page.click('[type="reset"]');

  await wait(10);

  const [singleState, multipleState] = await page.evaluate(() => {
    const singleSelect = document.querySelector('select[data-select-a11y]:not([multiple])');
    const multipleSelect = document.querySelector('select[data-select-a11y][multiple]');
    const wrapper = document.querySelector('.form-group.multiple .select-a11y');
    const list = Array.from(wrapper.querySelectorAll('.list-selected .tag-item'));

    return [
      {
        selectedValue: singleSelect.value,
        label: document.querySelector('.form-group button span').textContent.trim(),
      },
      {
        selectedOptions: Array.from(multipleSelect.selectedOptions).map(option => option.value),
        selectedItems: list.map(item => item.firstElementChild.textContent.trim()),
      }
    ]
  });

  t.same(singleState.selectedValue, singleState.label, 'Le reset de formulaire change le texte du bouton d’ouverture')

  const selectedOptionsMatches = multipleState.selectedOptions.every((option, index) =>{
    return option === multipleState.selectedItems[index];
  })

  t.true(selectedOptionsMatches, 'Le reset de formulaire change la liste des éléments sélectionnés')

  await browser.close();

  t.end();
});

test( 'Required déplacé sur le composant visible', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setContent(`
    <form id="form">
      <label for="required-select">Required select</label>
      <select id="required-select" required>
        <option value="">Choisir</option>
        <option value="a">A</option>
      </select>
      <button type="submit">Envoyer</button>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  const data = await page.evaluate(async () => {
    const select = document.getElementById('required-select');
    const form = document.getElementById('form');
    let submitCount = 0;

    form.addEventListener('submit', event => {
      submitCount++;
      event.preventDefault();
    });

    new Select(select);

    const button = document.querySelector('.btn-select-a11y');
    const wrapper = document.querySelector('.select-a11y');

    const init = {
      selectRequired: select.hasAttribute('required'),
      ariaRequired: button.getAttribute('aria-required'),
      wrapperRequired: wrapper.classList.contains('select-a11y-required'),
      ariaInvalid: button.getAttribute('aria-invalid'),
    };

    form.requestSubmit();
    await new Promise(resolve => setTimeout(resolve, 20));

    const invalidSubmit = {
      submitCount,
      ariaInvalid: button.getAttribute('aria-invalid'),
      wrapperInvalid: wrapper.classList.contains('select-a11y-invalid'),
      focusVisible: document.activeElement === button,
    };

    button.click();
    document.querySelector('[role="option"][data-index="1"]').click();
    await new Promise(resolve => setTimeout(resolve, 20));

    const afterSelection = {
      value: select.value,
      ariaInvalid: button.getAttribute('aria-invalid'),
      wrapperInvalid: wrapper.classList.contains('select-a11y-invalid'),
    };

    form.requestSubmit();
    await new Promise(resolve => setTimeout(resolve, 20));

    return {
      init,
      invalidSubmit,
      afterSelection,
      validSubmitCount: submitCount,
    };
  });

  t.false(data.init.selectRequired, 'L’attribut required est retiré du select masqué');
  t.same(data.init.ariaRequired, null, 'Le bouton visible ne porte pas aria-required');
  t.true(data.init.wrapperRequired, 'Le composant visible expose la classe required');
  t.same(data.init.ariaInvalid, null, 'Le composant visible n’est pas invalide avant submit');
  t.same(data.invalidSubmit.submitCount, 0, 'Le submit est bloqué quand aucune valeur required n’est choisie');
  t.same(data.invalidSubmit.ariaInvalid, 'true', 'Le composant visible expose aria-invalid après submit échoué');
  t.true(data.invalidSubmit.wrapperInvalid, 'La classe invalid est posée sur le composant');
  t.true(data.invalidSubmit.focusVisible, 'Le focus est placé sur le composant visible');
  t.same(data.afterSelection.value, 'a', 'Une valeur est sélectionnée');
  t.same(data.afterSelection.ariaInvalid, null, 'aria-invalid est retiré après sélection');
  t.false(data.afterSelection.wrapperInvalid, 'La classe invalid est retirée après sélection');
  t.same(data.validSubmitCount, 1, 'Le submit passe quand une valeur est choisie');

  await browser.close();

  t.end();
});

test( 'Mot clé en cours ajouté lors du submit', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setContent(`
    <form id="keyword-form">
      <label for="keyword-select">Mots clés</label>
      <select id="keyword-select" multiple></select>
      <button type="submit">Envoyer</button>
    </form>
    <form id="required-keyword-form">
      <label for="required-keyword-select">Mots clés requis</label>
      <select id="required-keyword-select" multiple required></select>
      <button type="submit">Envoyer</button>
    </form>
    <form id="regex-keyword-form">
      <label for="regex-keyword-select">Mots clés filtrés</label>
      <select id="regex-keyword-select" multiple></select>
      <button type="submit">Envoyer</button>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  const data = await page.evaluate(async () => {
    const keywordForm = document.getElementById('keyword-form');
    const keywordSelect = document.getElementById('keyword-select');
    let keywordSubmitCount = 0;
    keywordForm.addEventListener('submit', event => {
      keywordSubmitCount++;
      event.preventDefault();
    });

    new Select(keywordSelect, {
      keywordsMode: true,
      allowNewKeyword: true,
    });

    const keywordInput = keywordForm.querySelector('.form-control-a11y');
    keywordInput.value = '  Nouveau mot clé  ';
    keywordForm.requestSubmit();
    await new Promise(resolve => setTimeout(resolve, 20));

    const requiredForm = document.getElementById('required-keyword-form');
    const requiredSelect = document.getElementById('required-keyword-select');
    let requiredSubmitCount = 0;
    requiredForm.addEventListener('submit', event => {
      requiredSubmitCount++;
      event.preventDefault();
    });

    new Select(requiredSelect, {
      keywordsMode: true,
      allowNewKeyword: true,
    });

    const requiredInput = requiredForm.querySelector('.form-control-a11y');
    const requiredWrapper = requiredForm.querySelector('.select-a11y');
    requiredInput.value = 'Compétence requise';
    requiredForm.requestSubmit();
    await new Promise(resolve => setTimeout(resolve, 20));

    const regexForm = document.getElementById('regex-keyword-form');
    const regexSelect = document.getElementById('regex-keyword-select');
    let regexSubmitCount = 0;
    regexForm.addEventListener('submit', event => {
      regexSubmitCount++;
      event.preventDefault();
    });

    new Select(regexSelect, {
      keywordsMode: true,
      allowNewKeyword: true,
      regexFilter: /^[0-9]+$/,
      text: {
        regexErrorText: value => `Valeur refusée : ${value}`,
      },
    });

    const regexInput = regexForm.querySelector('.form-control-a11y');
    regexInput.value = 'abc';
    regexForm.requestSubmit();
    await new Promise(resolve => setTimeout(resolve, 20));

    return {
      keyword: {
        submitCount: keywordSubmitCount,
        values: Array.prototype.map.call(keywordSelect.selectedOptions, option => option.value),
        inputValue: keywordInput.value,
      },
      required: {
        submitCount: requiredSubmitCount,
        values: Array.prototype.map.call(requiredSelect.selectedOptions, option => option.value),
        inputValue: requiredInput.value,
        ariaInvalid: requiredInput.getAttribute('aria-invalid'),
        wrapperInvalid: requiredWrapper.classList.contains('select-a11y-invalid'),
      },
      regex: {
        submitCount: regexSubmitCount,
        values: Array.prototype.map.call(regexSelect.selectedOptions, option => option.value),
        inputValue: regexInput.value,
        inputFocused: document.activeElement === regexInput,
        notice: regexForm.querySelector('.a11y-no-suggestion').textContent,
      },
    };
  });

  t.same(data.keyword.submitCount, 1, 'Le formulaire non-required est soumis');
  t.same(data.keyword.values, ['Nouveau mot clé'], 'Le mot clé en cours est ajouté au submit');
  t.same(data.keyword.inputValue, '', 'Le champ de saisie est vidé après ajout');

  t.same(data.required.submitCount, 1, 'Le formulaire required est soumis après ajout du mot clé en cours');
  t.same(data.required.values, ['Compétence requise'], 'Le mot clé en cours satisfait le required');
  t.same(data.required.inputValue, '', 'Le champ required est vidé après ajout');
  t.same(data.required.ariaInvalid, null, 'Le champ required n’est pas marqué invalide');
  t.false(data.required.wrapperInvalid, 'Le composant required n’est pas marqué invalide');

  t.same(data.regex.submitCount, 0, 'Le submit est bloqué si le mot clé en cours ne respecte pas le filtre');
  t.same(data.regex.values, [], 'Le mot clé invalide n’est pas ajouté');
  t.same(data.regex.inputValue, 'abc', 'Le mot clé invalide reste dans le champ');
  t.true(data.regex.inputFocused, 'Le focus reste sur le champ invalide');
  t.same(data.regex.notice, 'Valeur refusée : abc', 'Le message d’erreur du filtre est affiché');

  await browser.close();

  t.end();
});

test( 'additionalDelimiters découpe les mots clés collés', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setContent(`
    <form>
      <label for="delimiters-select">Mots clés</label>
      <select id="delimiters-select" multiple></select>
      <label for="legacy-delimiters-select">Mots clés legacy</label>
      <select id="legacy-delimiters-select" multiple></select>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  const data = await page.evaluate(async () => {
    const pasteKeywords = (input, value) => {
      input.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'v',
        ctrlKey: true,
        bubbles: true,
      }));
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const select = document.getElementById('delimiters-select');
    new Select(select, {
      keywordsMode: true,
      allowNewKeyword: true,
      additionalDelimiters: [',', ';'],
    });

    pasteKeywords(select.closest('.select-a11y').querySelector('.form-control-a11y'), 'alpha, beta; gamma');

    const legacySelect = document.getElementById('legacy-delimiters-select');
    new Select(legacySelect, {
      keywordsMode: true,
      allowNewKeyword: true,
      additionalDelemiters: ['|'],
    });

    pasteKeywords(legacySelect.closest('.select-a11y').querySelector('.form-control-a11y'), 'delta| epsilon');

    await new Promise(resolve => setTimeout(resolve, 20));

    return {
      values: Array.prototype.map.call(select.selectedOptions, option => option.value),
      inputValue: select.closest('.select-a11y').querySelector('.form-control-a11y').value,
      legacyValues: Array.prototype.map.call(legacySelect.selectedOptions, option => option.value),
      legacyInputValue: legacySelect.closest('.select-a11y').querySelector('.form-control-a11y').value,
    };
  });

  t.same(data.values, ['alpha', 'beta', 'gamma'], 'Le nom corrigé additionalDelimiters découpe les mots clés collés');
  t.same(data.inputValue, '', 'Le champ est vidé après découpage complet');
  t.same(data.legacyValues, ['delta', 'epsilon'], 'L’ancien nom additionalDelemiters reste compatible');
  t.same(data.legacyInputValue, '', 'Le champ legacy est vidé après découpage complet');

  await browser.close();

  t.end();
});

test( 'Classe is-invalid synchronisée sur le composant visible', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setContent(`
    <form>
      <label for="server-invalid-select">Invalid select</label>
      <select id="server-invalid-select" class="is-invalid">
        <option value="">Choisir</option>
        <option value="a">A</option>
      </select>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  const data = await page.evaluate(async () => {
    const select = document.getElementById('server-invalid-select');
    new Select(select);

    const button = document.querySelector('.btn-select-a11y');
    const wrapper = document.querySelector('.select-a11y');

    const init = {
      ariaInvalid: button.getAttribute('aria-invalid'),
      wrapperInvalid: wrapper.classList.contains('select-a11y-invalid'),
    };

    select.classList.remove('is-invalid');
    await new Promise(resolve => setTimeout(resolve, 20));

    const afterRemove = {
      ariaInvalid: button.getAttribute('aria-invalid'),
      wrapperInvalid: wrapper.classList.contains('select-a11y-invalid'),
    };

    select.classList.add('is-invalid');
    await new Promise(resolve => setTimeout(resolve, 20));

    const afterAdd = {
      ariaInvalid: button.getAttribute('aria-invalid'),
      wrapperInvalid: wrapper.classList.contains('select-a11y-invalid'),
    };

    return {
      init,
      afterRemove,
      afterAdd,
    };
  });

  t.same(data.init.ariaInvalid, 'true', 'aria-invalid est posé si le select source a is-invalid');
  t.true(data.init.wrapperInvalid, 'La classe invalid est posée si le select source a is-invalid');
  t.same(data.afterRemove.ariaInvalid, null, 'aria-invalid est retiré quand is-invalid est retirée');
  t.false(data.afterRemove.wrapperInvalid, 'La classe invalid est retirée quand is-invalid est retirée');
  t.same(data.afterAdd.ariaInvalid, 'true', 'aria-invalid est reposé quand is-invalid est ajoutée');
  t.true(data.afterAdd.wrapperInvalid, 'La classe invalid est reposée quand is-invalid est ajoutée');

  await browser.close();

  t.end();
});

test( 'Autocomplete peut garder les suggestions sélectionnées visibles', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setRequestInterception(true);
  page.on('request', request => {
    if(request.url().startsWith('https://select-a11y.test/competences?search=')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          competences: [
            { text: 'amenagement', value: 'Aménagement du territoire' },
            { text: 'urbanisme', value: 'Urbanisme' },
          ],
        }),
      });
      return;
    }

    request.continue();
  });

  await page.setContent(`
    <form>
      <label for="autocomplete-select">Compétences</label>
      <select id="autocomplete-select" multiple></select>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  await page.evaluate(() => {
    const select = document.getElementById('autocomplete-select');
    new Select(select, {
      keywordsMode: true,
      url: search => `https://select-a11y.test/competences?search=${encodeURIComponent(search)}`,
      urlResultsArray: 'competences',
      urlValueField: 'text',
      urlLabelField: 'value',
      allowNewKeyword: false,
      preventCloseOnSelect: true,
      showSelectedAutocompleteResults: true,
    });

    const input = document.querySelector('.form-control-a11y');
    input.value = 'am';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await page.waitForFunction(() => document.querySelectorAll('.a11y-suggestions [role="option"]').length === 2);

  await page.click('.a11y-suggestions [data-value="amenagement"]');
  await wait(20);

  const selected = await page.evaluate(() => {
    const suggestion = document.querySelector('.a11y-suggestions [data-value="amenagement"]');
    const select = document.getElementById('autocomplete-select');

    return {
      suggestionVisible: suggestion !== null,
      suggestionSelected: suggestion && suggestion.getAttribute('aria-selected'),
      selectedValues: Array.prototype.map.call(select.selectedOptions, option => option.value),
      selectedTags: Array.prototype.map.call(document.querySelectorAll('.tag-item'), tag => tag.textContent.trim()),
      expanded: document.querySelector('.form-control-a11y').getAttribute('aria-expanded'),
    };
  });

  t.true(selected.suggestionVisible, 'La suggestion sélectionnée reste affichée');
  t.same(selected.suggestionSelected, 'true', 'La suggestion sélectionnée est marquée avec aria-selected');
  t.same(selected.selectedValues, ['amenagement'], 'La valeur est sélectionnée dans le select source');
  t.true(
    selected.selectedTags.some(tag => tag.includes('Aménagement du territoire')),
    'Le tag sélectionné est affiché'
  );
  t.same(selected.expanded, 'true', 'La liste autocomplete reste ouverte');

  await page.click('.a11y-suggestions [data-value="amenagement"]');
  await wait(20);

  const deselected = await page.evaluate(() => {
    const suggestion = document.querySelector('.a11y-suggestions [data-value="amenagement"]');
    const select = document.getElementById('autocomplete-select');

    return {
      suggestionVisible: suggestion !== null,
      suggestionSelected: suggestion && suggestion.getAttribute('aria-selected'),
      selectedValues: Array.prototype.map.call(select.selectedOptions, option => option.value),
      selectedTags: document.querySelectorAll('.tag-item').length,
    };
  });

  t.true(deselected.suggestionVisible, 'La suggestion désélectionnée reste affichée');
  t.same(deselected.suggestionSelected, null, 'La suggestion désélectionnée n’est plus marquée');
  t.same(deselected.selectedValues, [], 'La valeur est désélectionnée dans le select source');
  t.same(deselected.selectedTags, 0, 'Le tag est retiré');

  await browser.close();

  t.end();
});

test( 'Autocomplete vide la recherche à la fermeture après sélection', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setRequestInterception(true);
  page.on('request', request => {
    if(request.url().startsWith('https://select-a11y.test/close-selected?search=')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          results: [
            { text: 'alpha', value: 'Alpha' },
            { text: 'alpine', value: 'Alpine' },
          ],
        }),
      });
      return;
    }

    request.continue();
  });

  await page.setContent(`
    <form>
      <label for="autocomplete-close-selected">Mots clés</label>
      <select id="autocomplete-close-selected" multiple></select>
      <button type="button" id="outside-selected">Sortir</button>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  await page.evaluate(() => {
    const select = document.getElementById('autocomplete-close-selected');
    new Select(select, {
      keywordsMode: true,
      url: search => `https://select-a11y.test/close-selected?search=${encodeURIComponent(search)}`,
      urlResultsArray: 'results',
      urlValueField: 'text',
      urlLabelField: 'value',
      allowNewKeyword: true,
      preventCloseOnSelect: true,
    });
  });

  await page.type('.form-control-a11y', 'al');
  await page.waitForFunction(() => document.querySelectorAll('.a11y-suggestions [role="option"]').length === 2);
  await page.click('.a11y-suggestions [data-value="alpha"]');
  await page.click('#outside-selected');
  await wait(50);

  const data = await page.evaluate(() => {
    const wrapper = document.querySelector('.select-a11y');
    const input = wrapper.querySelector('.form-control-a11y');
    const select = document.getElementById('autocomplete-close-selected');

    return {
      values: Array.prototype.map.call(select.selectedOptions, option => option.value),
      inputValue: input.value,
      expanded: input.getAttribute('aria-expanded'),
      opened: wrapper.classList.contains('select-a11y-opened'),
      overlayVisible: wrapper.querySelector('.a11y-container') !== null,
    };
  });

  t.same(data.values, ['alpha'], 'La valeur autocomplete est sélectionnée');
  t.same(data.inputValue, '', 'La recherche est vidée à la fermeture après sélection');
  t.same(data.expanded, 'false', 'L’autocomplete est marqué fermé');
  t.false(data.opened, 'Le composant n’est plus marqué ouvert');
  t.false(data.overlayVisible, 'L’overlay autocomplete est retiré du DOM');

  await browser.close();

  t.end();
});

test( 'Autocomplete conserve la recherche sans sélection et se rouvre au focus', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setRequestInterception(true);
  page.on('request', request => {
    if(request.url().startsWith('https://select-a11y.test/close-empty?search=')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          results: [
            { text: 'alpha', value: 'Alpha' },
            { text: 'alpine', value: 'Alpine' },
          ],
        }),
      });
      return;
    }

    request.continue();
  });

  await page.setContent(`
    <form>
      <label for="autocomplete-close-empty">Mots clés</label>
      <select id="autocomplete-close-empty" multiple></select>
      <button type="button" id="outside-empty">Sortir</button>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  await page.evaluate(() => {
    const select = document.getElementById('autocomplete-close-empty');
    new Select(select, {
      keywordsMode: true,
      url: search => `https://select-a11y.test/close-empty?search=${encodeURIComponent(search)}`,
      urlResultsArray: 'results',
      urlValueField: 'text',
      urlLabelField: 'value',
      allowNewKeyword: true,
    });
  });

  await page.type('.form-control-a11y', 'al');
  await page.waitForFunction(() => document.querySelectorAll('.a11y-suggestions [role="option"]').length === 2);
  await page.click('#outside-empty');
  await wait(50);

  const closed = await page.evaluate(() => {
    const wrapper = document.querySelector('.select-a11y');
    const input = wrapper.querySelector('.form-control-a11y');
    const select = document.getElementById('autocomplete-close-empty');

    return {
      values: Array.prototype.map.call(select.selectedOptions, option => option.value),
      inputValue: input.value,
      expanded: input.getAttribute('aria-expanded'),
      opened: wrapper.classList.contains('select-a11y-opened'),
      overlayVisible: wrapper.querySelector('.a11y-container') !== null,
    };
  });

  await page.focus('.form-control-a11y');
  await page.waitForFunction(() => document.querySelectorAll('.a11y-suggestions [role="option"]').length === 2);

  const reopened = await page.evaluate(() => {
    const wrapper = document.querySelector('.select-a11y');
    const input = wrapper.querySelector('.form-control-a11y');

    return {
      inputValue: input.value,
      expanded: input.getAttribute('aria-expanded'),
      opened: wrapper.classList.contains('select-a11y-opened'),
      suggestions: wrapper.querySelectorAll('.a11y-suggestions [role="option"]').length,
    };
  });

  t.same(closed.values, [], 'Aucune valeur autocomplete n’est sélectionnée');
  t.same(closed.inputValue, 'al', 'La recherche est conservée à la fermeture sans sélection');
  t.same(closed.expanded, 'false', 'L’autocomplete est fermé après sortie du champ');
  t.false(closed.opened, 'Le composant n’est plus marqué ouvert après sortie du champ');
  t.false(closed.overlayVisible, 'L’overlay autocomplete est retiré après sortie du champ');
  t.same(reopened.inputValue, 'al', 'La recherche est toujours présente au retour focus');
  t.same(reopened.expanded, 'true', 'L’autocomplete est rouvert au retour focus');
  t.true(reopened.opened, 'Le composant est marqué ouvert au retour focus');
  t.same(reopened.suggestions, 2, 'Les suggestions sont rechargées au retour focus');

  await browser.close();

  t.end();
});

test( 'Autocomplete se ferme quand un mot clé libre est ajouté avec un séparateur', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setRequestInterception(true);
  page.on('request', request => {
    if(request.url().startsWith('https://select-a11y.test/keywords?search=')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          results: [
            { text: 'alpha', value: 'Alpha' },
            { text: 'beta', value: 'Beta' },
          ],
        }),
      });
      return;
    }

    request.continue();
  });

  await page.setContent(`
    <form>
      <label for="autocomplete-free-keyword-select">Mots clés</label>
      <select id="autocomplete-free-keyword-select" multiple></select>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  await page.evaluate(() => {
    const select = document.getElementById('autocomplete-free-keyword-select');
    new Select(select, {
      keywordsMode: true,
      url: search => `https://select-a11y.test/keywords?search=${encodeURIComponent(search)}`,
      urlResultsArray: 'results',
      urlValueField: 'text',
      urlLabelField: 'value',
      allowNewKeyword: true,
      additionalDelimiters: [','],
    });
  });

  await page.type('.form-control-a11y', 'nouveau');
  await page.waitForFunction(() => document.querySelectorAll('.a11y-suggestions [role="option"]').length === 2);
  await page.keyboard.press(',');
  await wait(50);

  const data = await page.evaluate(() => {
    const wrapper = document.querySelector('.select-a11y');
    const input = wrapper.querySelector('.form-control-a11y');
    const select = document.getElementById('autocomplete-free-keyword-select');

    return {
      values: Array.prototype.map.call(select.selectedOptions, option => option.value),
      inputValue: input.value,
      expanded: input.getAttribute('aria-expanded'),
      controls: input.getAttribute('aria-controls'),
      opened: wrapper.classList.contains('select-a11y-opened'),
      overlayVisible: wrapper.querySelector('.a11y-container') !== null,
      suggestions: wrapper.querySelectorAll('.a11y-suggestions [role="option"]').length,
    };
  });

  t.same(data.values, ['nouveau'], 'Le mot clé libre est ajouté dans le select source');
  t.same(data.inputValue, '', 'Le champ autocomplete est vidé');
  t.same(data.expanded, 'false', 'L’autocomplete est marqué fermé');
  t.same(data.controls, null, 'aria-controls est retiré quand la liste disparaît');
  t.false(data.opened, 'Le composant n’est plus marqué ouvert');
  t.false(data.overlayVisible, 'L’overlay autocomplete est retiré du DOM');
  t.same(data.suggestions, 0, 'Les anciennes suggestions autocomplete ne restent pas affichées');

  await browser.close();

  t.end();
});

test( 'Les contenus HTML-like sont rendus comme du texte', async t => {
  const [ browser, page ] = await createBrowser();

  await page.setContent(`
    <form>
      <label for="unsafe-select">Unsafe select</label>
      <select id="unsafe-select" multiple></select>
    </form>
  `);
  await page.addScriptTag({ path: scriptPath });

  const data = await page.evaluate(async () => {
    const payload = '<img src=x onerror="window.__selectA11yXss=true">';
    const select = document.getElementById('unsafe-select');
    window.__selectA11yXss = false;
    select.add(new Option(payload, payload, true, true));

    new Select(select, {
      text: {
        noResult: payload,
        help: payload,
        placeholder: payload,
        deleteItem: 'Supprimer {t}'
      }
    });

    const wrapper = document.querySelector('.select-a11y');
    const tag = wrapper.querySelector('.tag-item');
    const removeButton = wrapper.querySelector('.tag-item-supp');
    const opener = wrapper.querySelector('.btn-select-a11y');

    opener.click();
    const input = wrapper.querySelector('.a11y-container input');
    input.value = 'no-match';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 20));

    const overlay = wrapper.querySelector('.a11y-container');
    const noSuggestion = wrapper.querySelector('.a11y-no-suggestion');

    return {
      tagText: tag.firstElementChild.textContent.trim(),
      tagHasImage: tag.querySelector('img') !== null,
      removeTitle: removeButton.getAttribute('title'),
      overlayHasImage: overlay.querySelector('img') !== null,
      helpText: overlay.querySelector(`#a11y-usage-${select.id}-js`).textContent,
      placeholderText: overlay.querySelector('label').textContent,
      inputPlaceholder: input.getAttribute('placeholder'),
      noSuggestionText: noSuggestion.textContent,
      xssExecuted: window.__selectA11yXss,
    };
  });

  const payload = '<img src=x onerror="window.__selectA11yXss=true">';

  t.same(data.tagText, payload, 'Le libellé du tag est conservé comme texte');
  t.false(data.tagHasImage, 'Le libellé du tag ne crée pas d’élément HTML');
  t.same(data.removeTitle, `Supprimer ${payload}`, 'Le titre du bouton de suppression conserve le texte');
  t.false(data.overlayHasImage, 'Les textes de l’overlay ne créent pas d’élément HTML');
  t.same(data.helpText, payload, 'Le texte d’aide est conservé comme texte');
  t.same(data.placeholderText, payload, 'Le label du champ de recherche est conservé comme texte');
  t.same(data.inputPlaceholder, payload, 'Le placeholder est conservé comme attribut texte');
  t.same(data.noSuggestionText, payload, 'Le message aucun résultat est conservé comme texte');
  t.false(data.xssExecuted, 'Aucun gestionnaire injecté n’est exécuté');

  await browser.close();

  t.end();
});
