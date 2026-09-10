/*
# Add Patriarch Portrait Images

Updates image_url, image_source, and image_credit for 8 patriarchs
using public domain / Creative Commons images from Wikimedia Commons.

## Sources
- Saint Mark: Coptic icon, Wikimedia Commons (public domain)
- Athanasius: 17th century icon from Sozopol, Bulgaria (public domain)
- Cyril I: Icon of St. Cyril of Alexandria, Wikimedia Commons
- Dioscorus I: Neo-icon by Gcopt, Wikimedia Commons
- Cyril IV: Coptic Orthodox Church photo, Wikimedia Commons
- Cyril VI: Historical photo, Wikimedia Commons (public domain)
- Shenouda III: Photo during liturgical service, Wikimedia Commons (CC)
- Tawadros II: Official portrait, Wikimedia Commons (CC)

## Notes
- Benjamin I (38th pope) and Simon II (51st pope) do not have
  historical portraits available on Wikimedia Commons. They will
  continue to show the graceful fallback icon.
*/

UPDATE patriarchs SET
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/StMarkcoptic.jpg?width=400',
  image_source = 'Wikimedia Commons',
  image_credit = 'Coptic icon of Saint Mark, public domain'
WHERE papal_number = 1;

UPDATE patriarchs SET
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Saint-Athanasius-of-Alexandria-icon-Sozopol-Bulgaria-17century.jpg?width=400',
  image_source = 'Wikimedia Commons',
  image_credit = '17th century icon from Sozopol, Bulgaria, public domain'
WHERE papal_number = 20;

UPDATE patriarchs SET
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Icon_St._Cyril_of_Alexandria.jpg?width=400',
  image_source = 'Wikimedia Commons',
  image_credit = 'Icon of St. Cyril of Alexandria'
WHERE papal_number = 24;

UPDATE patriarchs SET
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/St._Dioscorus_I_of_Alexandria.jpg?width=400',
  image_source = 'Wikimedia Commons',
  image_credit = 'Neo-icon of St. Dioscorus I by Gcopt'
WHERE papal_number = 25;

UPDATE patriarchs SET
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/PopeKyrillosIV%28110th%29.jpg?width=400',
  image_source = 'Wikimedia Commons',
  image_credit = 'Pope Cyril IV, Coptic Orthodox Church'
WHERE papal_number = 110;

UPDATE patriarchs SET
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cyril_VI_of_Alexandria.jpg?width=400',
  image_source = 'Wikimedia Commons',
  image_credit = 'Pope Cyril VI, public domain'
WHERE papal_number = 116;

UPDATE patriarchs SET
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/H.H._Pope_Shenouda_III_During_a_Liturgical_Service.jpg?width=400',
  image_source = 'Wikimedia Commons',
  image_credit = 'Pope Shenouda III during liturgical service'
WHERE papal_number = 117;

UPDATE patriarchs SET
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Tawadros_II..jpg?width=400',
  image_source = 'Wikimedia Commons',
  image_credit = 'Pope Tawadros II, CC BY-SA 2.0'
WHERE papal_number = 118;
