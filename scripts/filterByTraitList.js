const niceServant = require("../cache/atlas_jp/nice_servant_lang_en");
const { servantDescriptor } = require("./helpers/servantDescriptor");

let out = [];

// build list
niceServant
  .sort(({ collectionNo: a }, { collectionNo: b }) => a - b)
  .forEach(servant => {
    const checkTraits = traits => {
      const traitNames = traits.map(trait => trait.name);
      const traitIds = traits.map(trait => trait.id);

      /*** EDIT THIS LINE ***/
      return (
        !traitIds.includes(2631) && traitNames.includes("demonicBeastServant")
      );
      // 2631 hominidaeServant
      // 2632 demonicBeastServant;
    };
    const descriptor = servantDescriptor(servant, niceServant);

    // compile traits data
    const { traits: baseTraits } = servant;
    const ascensionTraits = Object.keys(
      servant.ascensionAdd.individuality.ascension
    ).map(stage => {
      const addTraits = servant.ascensionAdd.individuality.ascension[stage];
      const traits = addTraits.length > 0 ? addTraits : baseTraits;
      const check = checkTraits(traits);
      return {
        name: `Ascension Stage ${stage}`,
        check
      };
    });
    const costumeTraits = Object.keys(
      servant.ascensionAdd.individuality.costume
    ).map(id => {
      const addTraits = servant.ascensionAdd.individuality.costume[id];
      const traits = addTraits.length > 0 ? addTraits : baseTraits;
      const check = checkTraits(traits);
      return {
        name: `Costume ${id}`,
        check
      };
    });
    const addTraits = [...ascensionTraits, ...costumeTraits];

    // output

    // check if everything matches
    if (
      checkTraits(baseTraits) &&
      addTraits.every(({ check }) => check === true)
    ) {
      out.push(descriptor);
      return;
    }

    // or some match
    addTraits.forEach(({ name, check }) => {
      if (check === true) {
        out.push(descriptor + ` [${name}]`);
      }
    });
  });

// print output
out.forEach(line => console.log(line));
