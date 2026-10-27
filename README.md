# Oscilloméca

Animation pédagogique en français d’un oscilloscope électromécanique. La page contient tous ses styles, scripts et dessins ; elle ne télécharge aucune bibliothèque, police ou image.

## Ouvrir

Double-cliquer sur **index.html**, ou le glisser dans un navigateur moderne. Aucune installation, connexion Internet ou compilation n’est nécessaire. Le lien documentaire OpenStax demande Internet uniquement si on l’ouvre.

## Explorer

- Lecture/pause conserve l’état. Réinitialiser remet le temps, les miroirs et la trace à leur état initial, en conservant les réglages.
- La vitesse de lecture modifie le temps de présentation, pas la fréquence physique. Les fréquences indiquées sont celles du temps simulé.
- Choisir sinus, triangle ou carré, amplitude et fréquence. Le modèle idéal quasi statique fait suivre immédiatement le courant au miroir.
- Figer le balayage bloque le polygone à sa position courante. Si cette position est hors fenêtre utile, aucun spot n’apparaît : décocher puis figer pendant une portion éclairée.
- Supprimer la déviation maintient le miroir mobile au repos, indépendamment du courant et du polygone. Il s’agit d’un blocage pédagogique du miroir.
- Tout changement de paramètres physiques efface la trace mémorisée. Un changement de vitesse ou une pause la conserve.
- Le guide comporte quatre étapes, sans changer les réglages de l’expérience.
- Les commandes sont accessibles au clavier (Tab, flèches, Espace). Si le navigateur préfère les animations réduites, la page commence en pause.

## Principes et limites

Le repère spatial a Z pour verticale. L’écran est horizontal, dans le plan XY : l’axe vertical du graphique correspond à Y. L’abscisse graphique croît vers −X pour suivre le temps dans le sens de rotation choisi. Au repos, le rayon entre les miroirs suit −X et le rayon final +Z ; la normale du miroir mobile vaut `(1,0,1)/√2`. Le polygone tourne autour de Y, le miroir mobile autour de Z. Les deux déviations sont orthogonales au premier ordre ; les petits couplages aux angles finis sont conservés.

Le calcul cherche la première intersection avec les huit facettes du prisme, puis avec le miroir mobile fini et l’écran. Chaque réflexion utilise `r = d − 2(d·n)n`. La trace est constituée des impacts calculés, jamais d’une sinusoïde dessinée indépendamment du rayon. Une fenêtre de ±10° par facette représente un diaphragme idéal. La rotation est uniforme (22,5°/s, soit une facette toutes les 2 s) et les portions masquées ne sont pas reliées. L’abscisse est approximativement proportionnelle au temps ; elle conserve la non-linéarité optique. La durée visible utile est d’environ 0,89 s par balayage.

Les deux branches verticales portent des courants opposés. Le champ uniforme va de N vers S, suivant X au repos. Les forces `Iℓ × B` sont opposées, séparées spatialement, et leur couple est vertical. Pour un courant positif, le courant descend à gauche et monte à droite ; le couple est dirigé suivant +Z. Le zoom est une vue schématique depuis +Y. Le miroir est incliné à 45° au repos sur son support ; les dimensions mécaniques sont illustratives.

Le modèle idéal suppose `θ = kI`, avec `k = 6°` pour un courant normalisé d’amplitude 1. Un carré entraîne donc une discontinuité idéale explicitement annoncée ; aucune trajectoire de transition artificielle n’est tracée. L’inertie et le retard mécanique sont négligés : un miroir réel ne pourrait pas suivre instantanément les fronts d’un signal carré.

Le temps commun avance par pas fixes de 1/720 s, indépendamment de la cadence d’affichage. Une longue interruption de rendu n’est pas rattrapée brutalement. La trace conserve les six dernières secondes simulées, comme une mémoire pédagogique ; un écran diffusant ordinaire n’aurait pas cette rémanence. La simulation n’inclut ni diffraction, ni pertes optiques, ni temps de propagation de la lumière.

Référence : [OpenStax — Force and Torque on a Current Loop](https://openstax.org/books/university-physics-volume-2/pages/11-5-force-and-torque-on-a-current-loop).

## Validation

Avec Node.js installé, exécuter `node tests/physics.test.cjs`. Aucun paquet supplémentaire n’est requis. Les tests couvrent la réflexion, le facteur deux en géométrie plane, les intersections, les axes de déviation, les facettes, les forces et le couple, les formes de signal, la réponse idéale et la reproductibilité à plusieurs cadences.

Validation de livraison : 12 tests numériques réussis ; commandes, pause/reprise, réinitialisation, trois signaux et quatre étapes vérifiés dans le navigateur, sans erreur JavaScript observée. Présentation contrôlée sur ordinateur et avec des fenêtres de 820 × 1180 et 390 × 844 ; aucun débordement horizontal sur téléphone. Les essais ont utilisé un serveur local. La politique du navigateur de test bloque les adresses `file:` : l’ouverture directe par double-clic n’a pas été vérifiée dans cet environnement. Le document ne contient toutefois aucun chargement réseau requis, import de module ou appel `fetch`.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub et y déposer `index.html` à la racine (ainsi que ce README et les tests si souhaité).
2. Dans **Settings → Pages**, sélectionner **Deploy from a branch**.
3. Choisir la branche contenant les fichiers, puis le dossier **/ (root)** et enregistrer.
4. Attendre la fin de la publication et ouvrir l’adresse indiquée par GitHub Pages.

Il n’y a aucune étape de build. Aucun hébergement n’a été créé automatiquement.
