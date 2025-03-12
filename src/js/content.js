(async () => {
  const subredditUrl = "https://www.reddit.com/r/internacional";
  const title = "Não consuma merda";
  const subredditText = "Visite o subreddit do Internacional";
  
  const interFunFacts = [
    "Curiosidade: o Sport Club Internacional foi fundado em 1909.",
    "Curiosidade: o Internacional é conhecido como Colorado devido à cor vermelha de seu uniforme.",
    "Curiosidade: o Inter conquistou a Copa Libertadores da América em 2006 e 2010.",
    "Curiosidade: o Estádio Beira-Rio é a casa do Internacional desde 1969.",
    "Curiosidade: o Internacional venceu o Campeonato Brasileiro em 1975, 1976 e 1979.",
    "Curiosidade: em 2006, o Internacional venceu o Mundial de Clubes da FIFA.",
    "Curiosidade: o mascote do Inter é o Saci, uma figura do folclore brasileiro.",
    "Curiosidade: o Inter venceu a Copa Sul-Americana em 2008.",
    "Curiosidade: o Internacional conquistou a Recopa Sul-Americana em 2007 e 2011.",
    "Curiosidade: o Internacional venceu a Copa do Brasil em 1992.",
    "Curiosidade: o Inter é o maior campeão gaúcho.",
    "Curiosidade: o Inter tem um museu, o Museu do Beira-Rio, que conta sua história.",
    "Curiosidade: o Internacional foi o primeiro clube gaúcho a conquistar um título nacional.",
    "Curiosidade: o Inter já teve ídolos estrangeiros, como o argentino Guiñazu.",
    "Curiosidade: o Inter é conhecido por sua torcida leal, que apoia o time em qualquer situação.",
    "Curiosidade: o Inter é um dos clubes brasileiros com maior número de títulos internacionais.",
    "Curiosidade: o Inter tem um centro de treinamento moderno, o CT Parque Gigante.",
  ];
  const usedInterFunFacts = new Set();

  const sulCanoenseFunFacts = [
    "Curiosidade: o Grêmio foi rebaixado para a Série B em 1991, 2004 e 2021.",
    "Curiosidade: o Grêmio perdeu por 5 x 0 para o Flamengo na semifinal da Libertadores 2019.",
    "Curiosidade: o Grêmio perdeu por 5 x 0 (agregado) para o Boca Juniors na final da Libertadores 2007.",
    "Curiosidade: o Grêmio perdeu por 3 x 0 para o Caxias na final do Campeonato Gaúcho 2000.",
    "Curiosidade: o Grêmio perdeu para o Palmeiras na final da Copa do Brasil de 2020.",
    "Curiosidade: o Grêmio perdeu para o Novo Hamburgo na final do Campeonato Gaúcho de 2017.",
    "Curiosidade: o Grêmio perdeu para o Corinthians na final da Copa do Brasil de 1995.",
    "Curiosidade: o Grêmio perdeu para o Vasco da Gama na final da Copa do Brasil de 1997.",
  ];
  const usedSulCanoenseFunFacts = new Set();

  const getUnusedFunFact = (funFacts, usedFunFacts) => {
    let funFact = '';
    const totalFacts = funFacts.length;
    const totalUsed = usedFunFacts.size;

    do {
      funFact = funFacts[Math.floor(Math.random() * totalFacts)];
    } while (totalUsed < totalFacts && usedFunFacts.has(funFact));

    usedFunFacts.add(funFact);
  }

  function getRandomFunFact() {
    if (window.location.href.includes("gremio")) return getUnusedFunFact(sulCanoenseFunFacts, usedSulCanoenseFunFacts);
    
    return getUnusedFunFact(interFunFacts, usedInterFunFacts);
  }

  function findParent(node, parentClass) {
    if (node.classList?.contains(parentClass)) {
      return node;
    }

    if (node.parentNode) {
      return findParent(node.parentNode, parentClass);
    }
  }

  function replaceOcurrences(rootNode, terms) {
    function traverse(node) {
      if (
        node.nodeType === Node.TEXT_NODE &&
        node.parentNode.tagName !== "SCRIPT"
      ) {
        terms.forEach(({ searchRegex, condition, replacement }) => {
          if (condition instanceof Function) {
            if (!condition()) {
              return;
            }
          }

          if (searchRegex.test(node.nodeValue)) {
            node.nodeValue = node.nodeValue.replace(searchRegex, replacement);
          }
        });
      }

      for (let child of node.childNodes) {
        traverse(child);
      }
    }

    traverse(rootNode);
  }

  function addUniqueFunFact(node) {
    const funFact = getRandomFunFact();
    node.innerText = funFact;
  }

  function removeCrap(crapNode) {
    let funFactSelectors = [];
    let titleNode = undefined;
    
    
    let parent = findParent(crapNode, "feed-post-body");
    if (parent) {
      titleNode = parent.querySelector("h2 a");
      funFactSelectors = [
        ".bstn-fd-relatedtext .feed-post-body-title",
        ".feed-post-metadata",
        ".feed-post-body-resumo",
      ];
    }
    
    if (!parent) {
      parent = findParent(crapNode, "type-materia");
      if (parent) {
        titleNode = parent.querySelector(".bstn-hl-title");
        funFactSelectors = [".bstn-hl-summary"];
      }
    }

    if (!parent) {
      parent = findParent(crapNode, "post-agrupador-materia");
      if (parent) {
        titleNode = parent.querySelector("li > div > div");
        funFactSelectors = ["li > div > a"];
      }
    }

    if (parent) {
      const funFactNodes = parent.querySelectorAll(funFactSelectors.join(","))
      funFactNodes.forEach((node, index) => {
        if (index == funFactNodes.length - 1) node.innerText = subredditText;
        else addUniqueFunFact(node);
      });

      for (const link of parent.querySelectorAll("a")) {
        link.setAttribute("href", subredditUrl);
        link.setAttribute("target", "_blank");

        const imgLink = link.querySelector('img');
        if (imgLink) {
          imgLink.setAttribute('alt', subredditText);
          imgLink.setAttribute('title', subredditText);
        } else {
          link.innerText = subredditText;
        }
      }

      if (titleNode) titleNode.innerText = title;
    }
  }

  function dontConsumeCrap(rootNode) {
    if (rootNode.innerText?.includes("Vida Real")) {
      const links = rootNode.querySelectorAll("a");

      for (const link of links) {
        const href = link.getAttribute("href") ?? "";

        if (href.includes("/vida-real/")) {
          removeCrap(link);
        }
      }
    }
  }

  async function easterEggs(rootNode) {
    let terms = [];

    // Replace Renato Portaluppi/Gaúcho with Renato Carioca
    const realName = "Renato Carioca";
    terms.push(...[
      {
        searchRegex: new RegExp("Renato (Portaluppi|Ga(ú|u)cho)", "ig"),
        condition: undefined,
        replacement: realName,
      },
      {
        searchRegex: new RegExp("Portaluppi", "ig"),
        condition: undefined,
        replacement: realName,
      },
      {
        searchRegex: new RegExp("Renato(?! Carioca)", "ig"),
        condition: () => {
          return (
            window.location.href.includes("gremio") ||
            window.location.href.includes("internacional")
          );
        },
        replacement: realName,
      },
    ]);

    // Replace Grêmio with Sul-Canoense
    terms.push(...[
      {
        searchRegex: new RegExp("Gr(ê|e)mio", "ig"),
        condition: undefined,
        replacement: "Sul-Canoense",
      },
    ]);

    replaceOcurrences(rootNode, terms);
  }

  function onMutation(mutations) {
    for (const { target } of mutations) {
      dontConsumeCrap(target);
      easterEggs(target);
    }
  }

  const mo = new MutationObserver(onMutation);
  mo.observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["href"],
  });
})();
