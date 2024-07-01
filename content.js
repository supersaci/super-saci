(async () => {
  const subredditUrl = 'https://www.reddit.com/r/internacional'
  const title = 'N&#xE3;o consuma merda'
  const summary = 'Visite o subreddit do Internacional'

  const funFacts = [
    "Curiosidade: o Sport Club Internacional foi fundado em 1909.",
    "Curiosidade: o Internacional é conhecido como Colorado devido à cor vermelha de seu uniforme.",
    "Curiosidade: o Inter conquistou a Copa Libertadores da América em 2006 e 2010.",
    "Curiosidade: o Estádio Beira-Rio é a casa do Internacional desde 1969.",
    "Curiosidade: o Internacional venceu o Campeonato Brasileiro em 1975, 1976 e 1979.",
    "Curiosidade: em 2006, o Internacional venceu o Mundial de Clubes da FIFA.",
    "Curiosidade: o mascote do Inter é o Saci, uma figura do folclore brasileiro.",
    "Curiosidade: o Internacional é um dos clubes mais tradicionais e respeitados do futebol brasileiro.",
    "Curiosidade: o Inter venceu a Copa Sul-Americana em 2008.",
    "Curiosidade: o Internacional conquistou a Recopa Sul-Americana em 2007 e 2011.",
    "Curiosidade: o Inter é conhecido por sua escola de base, que revelou grandes jogadores.",
    "Curiosidade: o Internacional venceu a Copa do Brasil em 1992.",
    "Curiosidade: o Inter e o maior campeão gaúcho.",
    "Curiosidade: o Internacional promove ações sociais através do Projeto Criança Colorada.",
    "Curiosidade: o Inter tem um museu, o Museu do Beira-Rio, que conta sua história.",
    "Curiosidade: o Internacional foi o primeiro clube gaúcho a conquistar um título nacional.",
    "Curiosidade: o Inter já teve ídolos estrangeiros, como o argentino Guiñazu.",
    "Curiosidade: o Inter é conhecido por sua torcida leal, que apoia o time em qualquer situação.",
    "Curiosidade: o Inter é um dos clubes brasileiros com maior número de títulos internacionais.",
    "Curiosidade: o Inter tem um centro de treinamento moderno, o CT Parque Gigante.",
  ];


  function getRandomFunFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    return funFacts[randomIndex];
  }

  function findParent(node, parentClass) {
    if (node.classList?.contains(parentClass)) {
      return node
    }

    if (node.parentNode) {
      return findParent(node.parentNode, parentClass)
    }
  }

  function replaceOcurrences(rootNode, terms) {
    function traverse(node) {
      if (node.nodeType === Node.TEXT_NODE && node.parentNode.tagName !== 'SCRIPT') {
        terms.forEach(({ searchRegex, condition, replacement }) => {
          if (condition instanceof Function) {
            if (!condition()) {
              return
            }
          }

          if (searchRegex.test(node.nodeValue)) {
            node.nodeValue = node.nodeValue.replace(searchRegex, replacement);
            console.log(`#${searchRegex.toString()}#`, node.parentNode.tagName, node.parentNode)
          }
        })
      }

      for (let child of node.childNodes) {
        traverse(child);
      }
    }

    traverse(rootNode);
  }

  function removeCrap(crapNode) {

    let parent = findParent(crapNode, 'feed-post-body')
    let titleNode = undefined
    let summaryNode = undefined
    let abstractNode = undefined

    if (parent) {
      titleNode = parent.querySelector('h2 p')
      summaryNode = parent.querySelector('.feed-post-metadata')
      abstractNode = parent.querySelector('.feed-post-body-resumo')
    } else {
      parent = findParent(crapNode, 'type-materia')
      if (parent) {
        titleNode = parent.querySelector('.bstn-hl-title')
        summaryNode = parent.querySelector('.bstn-hl-summary')
      }
    }

    if (parent) {
      const links = parent.querySelectorAll('a')

      for (const link of links) {
        link.setAttribute('href', subredditUrl)
        link.setAttribute('target', '_blank')
      }

      if (titleNode) titleNode.innerHTML = title
      if (summaryNode) summaryNode.innerHTML = summary
      if (abstractNode) abstractNode.innerHTML = getRandomFunFact()
    }
  }

  function dontConsumeCrap(rootNode) {
    if (rootNode.innerText?.includes('Vida Real')) {
      const links = rootNode.querySelectorAll('a')

      for (const link of links) {
        const href = link.getAttribute('href') ?? ''

        if (href.includes('/vida-real/')) {
          removeCrap(link)
        }
      }
    }
  }

  function easterEggs(rootNode) {
    const realName = 'Renato Carioca'

    const terms = [
      // Renato Carioca
      {
        searchRegex: new RegExp('Renato (Portaluppi|Ga(ú|u)cho)', 'ig'),
        condition: undefined,
        replacement: realName
      },
      {
        searchRegex: new RegExp('Portaluppi', 'ig'),
        condition: undefined,
        replacement: realName
      },
      {
        searchRegex: new RegExp('Renato(?! Carioca)', 'ig'),
        condition: () => {
          return window.location.href.includes('gremio') || window.location.href.includes('internacional')
        },
        replacement: realName
      },
      // Sul-Canoense
      {
        searchRegex: new RegExp('Gr(ê|e)mio', 'ig'),
        condition: undefined,
        replacement: 'Sul-Canoense'
      },
    ]

    replaceOcurrences(rootNode, terms)
  }

  function onMutation(mutations) {
    for (const { target } of mutations) {
      dontConsumeCrap(target)
      easterEggs(target)
    }
  }

  const mo = new MutationObserver(onMutation);
  mo.observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['href']
  });
})()