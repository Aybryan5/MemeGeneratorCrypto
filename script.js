document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('meme-canvas');
    const ctx = canvas.getContext('2d');

    const layers = {
        background: { img: new Image(), x: 0, y: 0, width: 500, height: 500, color: null },
        character: { img: new Image(), x: 0, y: 0, width: 500, height: 500, },
        hat: { img: new Image(), x: 0, y:0, width:500, height:500,},
        pma: { img: new Image(), x: 0, y: 0, width: 500, height: 500,} // Correction ici
    };

    let textObjects = [];
    let textObj = { text: '', color: '#ffffff', size: 35, font: 'Arial', placeholder: 'Write your meme' };
    const bgColorPicker = document.getElementById('bg-color-picker');
    const images = {
        backgrounds: {
            main: ['background/r.blue.png', 'background/r.green.png', 'background/r.orange.png', 'background/r.pink.png', 'background/r.purple.png', 'background/r.red.png', 'background/r.yellow.png'],
            custom: ['custom/arteezy.png', 'custom/astronaut.png', 'custom/baseball.png', 'custom/bedroom.png', 'custom/bigben.png', 'custom/burning.png','custom/court.png', 'custom/eiffel.png','custom/f1monaco.png','custom/funeral.png','custom/garden.png','custom/goku.png','custom/gowarts.png','custom/lotrmordor.png','custom/moon.png','custom/mrbean.png','custom/naruto.png','custom/outerspace.png','custom/pisa.png','custom/rainbow.png','custom/realmadrid.png','custom/swiss.png','custom/thisisfine.png','custom/subway.png','custom/rickmortydimension.png','custom/rickmortydimension2.png'],
        },
        characters: {
            main: ['body/normal.normal.png','body/normal.blackandgrey.png', 'body/normal.blue.png', 'body/normal.green.png',  'body/normal.orange.png', 'body/normal.peach.png', 'body/normal.pink.png', 'body/normal.purple.png', 'body/normal.red.png', 'body/normal.xray.png', 'body/normal.yellow.png','body/black.png'],
            nowif: ['nowif/nowif.normal.png','nowif/nowif.blackandgrey.png', 'nowif/nowif.blue.png', 'nowif/nowif.green.png',  'nowif/nowif.orange.png', 'nowif/nowif.peach.png', 'nowif/nowif.pink.png', 'nowif/nowif.purple.png', 'nowif/nowif.red.png', 'nowif/nowif.xray.png', 'nowif/nowif.yellow.png', 'nowif/nowif.black.png'],
        },
        hats: ['hats/1rk.png', 'hats/2wif.png', 'hats/astronaut.png','hats/avatar.png', 'hats/bald.png', 'hats/basketball.png','hats/crescent.png', 'hats/doctor.png','hats/feelers.png', 'hats/firechief.png','hats/instinct.png','hats/karateband.png','hats/maga.png','hats/mcdonalds.png', 'hats/monopolyhat.png','hats/moon.png', 'hats/naruto.png','hats/narutosasuke.png','hats/narutosenninsixtails.png','hats/poker.png','hats/police.png','hats/pope.png','hats/powerranger.png', 'hats/rs.bluepartyhat.png','hats/rs.greenpartyhat.png','hats/rs.purplepartyhat.png','hats/rs.redpartyhat.png','hats/rs.whitepartyhat.png','hats/rs.yellowpartyhat.png','hats/safetyhat.png','hats/saiyan.png', 'hats/solider.png','hats/strawhat.png', 'hats/turmp.png','hats/wifwif.png','hats/wzrd.png', 'hats/mog.png', 'hats/f1.png'],
        pma: ['pma/black.png','pma/blue.png','pma/green.png','pma/orange.png','pma/pink.png','pma/purple.png','pma/red.png','pma/teal.png','pma/whiet.png','pma/yellow.png'], // Correction ici
    };

    let currentIndex = {
        background: 0,
        character: 0,
        pma: 0, // Correction ici
        hats: 0,
    };

    let currentTextIndex = null;

    let isPmaDragging = false;
    let pmaStartX;
    let pmaStartY;

    const crossSize = 20;

    // Dessine sur le canvas
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        if (layers.background.color) {
            ctx.fillStyle = layers.background.color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (layers.background.img.src) {
            ctx.drawImage(layers.background.img, layers.background.x, layers.background.y, layers.background.width, layers.background.height);
        }
    
        if (layers.character.img.src) {
            ctx.drawImage(layers.character.img, layers.character.x, layers.character.y, layers.character.width, layers.character.height);
        }

        if (layers.hat.img.src) {
            ctx.drawImage(layers.hat.img, layers.hat.x, layers.hat.y, layers.hat.width, layers.hat.height);
        }
    
        if (document.getElementById('nobg').checked && layers.pma.img.src) {
            ctx.drawImage(layers.pma.img, layers.pma.x, layers.pma.y, layers.pma.width, layers.pma.height);
        }
    
        textObjects.forEach((textObj, index) => {
            if (textObj.text) {
                ctx.font = `${textObj.size}px ${textObj.font}`;
                ctx.fillStyle = textObj.color;
                const textWidth = ctx.measureText(textObj.text).width;
                const x = (canvas.width - textWidth) / 2;
                const y = canvas.height - textObj.size - 10;
                ctx.fillText(textObj.text, x, y);
    
                // Dessiner la croix en haut à gauche du texte
                const crossX = x - crossSize; // Placé à gauche du texte
                const crossY = y - textObj.size; // Placé au-dessus du texte
                
                // Dessin de la croix
                ctx.strokeStyle = 'red';
                ctx.beginPath();
                ctx.moveTo(crossX, crossY);
                ctx.lineTo(crossX + crossSize, crossY + crossSize);
                ctx.moveTo(crossX, crossY + crossSize);
                ctx.lineTo(crossX + crossSize, crossY);
                ctx.stroke();
    
                // Définir les coordonnées de la croix dans l'objet texte
                textObj.crossX = crossX;
                textObj.crossY = crossY;
            }
        });
    }

    // Gestionnaire d'événements pour le changement de couleur de fond en temps réel
    function handleBgColorChange() {
        layers.background.img.src = ''; // Réinitialiser l'image de fond pour utiliser la couleur de fond
        layers.background.color = bgColorPicker.value; // Définir la couleur de fond
        draw(); // Redessiner le canevas avec la nouvelle couleur de fond
    }

    // Ajouter le gestionnaire d'événements pour l'événement input du sélecteur de couleur de fond
    document.getElementById('bg-color-picker').addEventListener('input', handleBgColorChange);

    // Gère le clic sur le texte
    // Gère le clic sur le texte
function handleTextClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    textObjects.forEach((textObj, index) => {
        // Vérifier si le clic est à l'intérieur de la zone rectangulaire autour de la croix
        if (clickX >= textObj.crossX && clickX <= textObj.crossX + crossSize * 2 &&
            clickY >= textObj.crossY && clickY <= textObj.crossY + crossSize * 2) {
            // Supprimer le texte si le clic est dans la zone de la croix
            textObjects.splice(index, 1);
            draw();
            return;
        }
    });
}
    
    // Ajoute un gestionnaire d'événements pour le clic sur le canevas
    canvas.addEventListener('click', handleTextClick);
    
    
    
    

    // Télécharge le meme
    function downloadMeme() {
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = 'meme.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Gestionnaire d'événements pour le bouton "Download Meme"
    document.getElementById('download-meme').addEventListener('click', downloadMeme);


    function loadImages() {
        // Charger l'image du fond
        if (!document.getElementById('nobg').checked) {
            const backgroundArray = images.backgrounds.main;
            layers.background.img.src = backgroundArray[currentIndex.background];
            layers.background.img.onload = () => {
                if (layers.background.color) {
                    ctx.fillStyle = layers.background.color;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else {
                    ctx.drawImage(layers.background.img, 0, 0, canvas.width, canvas.height);
                }
                draw();
            };
        } else {
            const backgroundArray = images.backgrounds.custom;
            layers.background.img.src = backgroundArray[currentIndex.background];
            layers.background.img.onload = () => {
                if (layers.background.color) {
                    ctx.fillStyle = layers.background.color;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else {
                    ctx.drawImage(layers.background.img, 0, 0, canvas.width, canvas.height);
                }
                draw();
            }};

        // Charger l'image Pma
        const pmaArray = images.pma;
        layers.pma.img.src = pmaArray[currentIndex.pma];
        layers.pma.img.onload = () => {
            draw();
        };

        const hatArray = images.hats;
        layers.hat.img.src = hatArray[currentIndex.hats];
        layers.hat.img.onload = () => {
            draw();
        };

        if (!document.getElementById('cb7-2').checked) {
        const characterArray = images.characters.main;
        layers.character.img.src = characterArray[currentIndex.character];
        layers.character.img.onload = () => {
            draw();
        };
        } else {
        const characterArray = images.characters.nowif;
        layers.character.img.src = characterArray[currentIndex.character];
        layers.character.img.onload = () => {
            draw();
    }
}};
    

    function handleBgUploadChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            layers.background.img.src = event.target.result; // Stocker l'image de fond actuelle
            layers.background.color = null; // Réinitialiser la couleur d'arrière-plan
            layers.background.img.onload = () => {
                draw(); // Redessiner le canevas avec le nouvel arrière-plan
            };
        };
        reader.readAsDataURL(file);
    }

    function createGallery(galleryId, imageArray, clickHandler) {
        const gallery = document.getElementById(galleryId);
        gallery.innerHTML = '';
        
        // Vérifier si imageArray est un tableau
        if (Array.isArray(imageArray)) {
            imageArray.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.addEventListener('click', () => clickHandler(index));
                gallery.appendChild(img);
            });
        } else {
            console.error("imageArray n'est pas un tableau.");
        }
    }
    
    function getCharacterImageSrc(index) {
        const isNowifSelected = document.getElementById('cb7-2').checked;
        if (isNowifSelected) {
            return images.characters.nowif[index];
        } else {
            return images.characters.main[index];
        }
    }

    function onBackgroundClick(index) {
        currentIndex.background = index;
        layers.background.color = null; // Reset background color if an image is selected
        loadImages();
    }

    function onCharacterClick(index) {
        currentIndex.character = index;
        layers.character.img.src = getCharacterImageSrc(index);
        layers.character.img.onload = draw; // Redessiner une fois l'image chargée
    }

    function onPmaClick(index) {
        currentIndex.pma = index; // Correction ici
        const pmaArray = images.pma; // Correction ici
        layers.pma.img.src = pmaArray[index];
        layers.pma.img.onload = draw; // Redessiner une fois l'image chargée
    }

    function onHatClick(index) {
        currentIndex.hats = index; // Correction ici
        const hatArray = images.hats; // Correction ici
        layers.hat.img.src = hatArray[index];
        layers.hat.img.onload = draw; // Redessiner une fois l'image chargée
    }
    
    function handleAddText() {
        const memeTextInput = document.getElementById('meme-text');
        const textColorInput = document.getElementById('text-color');
        const textFontSelect = document.getElementById('text-font');

        const text = memeTextInput.value;
        const color = textColorInput.value;
        const font = textFontSelect.value;

        // Ajouter le nouvel objet de texte à textObjects
        textObjects.push({ text, color, font, size: 35 });

        // Redessiner le canvas pour afficher le texte ajouté
        draw();
    }

    // Gestionnaire d'événements pour le bouton "Add Text"
    document.getElementById('add-text').addEventListener('click', handleAddText);

    function updateCharacterGallery() {
        const isNowifSelected = document.getElementById('cb7-2').checked;
        const characterArray = isNowifSelected ? images.characters.nowif : images.characters.main;
        createGallery('character-gallery', characterArray, onCharacterClick);
    }
    

    function updateBackgroundGallery() {
        const nobgCheckbox = document.getElementById('nobg');
        const colorPickerContainer = document.getElementById('color-picker-container');
        if (nobgCheckbox.checked) {
            colorPickerContainer.style.display = 'block';
            document.getElementById('pma-gallery').style.display = 'block';
            document.getElementById('pma-next').style.display = 'block';
            document.getElementById('pma-prev').style.display = 'block';
            document.getElementById('upload-bg1').style.display = 'block';
            const backgroundArray = nobgCheckbox.checked ? images.backgrounds.custom : images.backgrounds.main; // Correction ici
            createGallery('background-gallery', backgroundArray, onBackgroundClick); // Correction ici
        } else {
            createGallery('background-gallery', images.backgrounds.main, onBackgroundClick); // Utiliser les images par défaut
            document.getElementById('background-gallery').style.display = 'flex';
            document.getElementById('upload-bg1').style.display = 'none';
            document.getElementById('background-next').style.display = 'block';
            document.getElementById('background-prev').style.display = 'block';
            colorPickerContainer.style.display = 'none';
            document.getElementById('pma-gallery').style.display = 'none';
            document.getElementById('pma-next').style.display = 'none';
            document.getElementById('pma-prev').style.display = 'none';
        }
        draw();
        loadImages();

    }
    
    
    function scrollGallery(galleryId, direction) {
        const gallery = document.getElementById(galleryId);
        const scrollAmount = 100;
        if (direction === 'left') {
            gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else if (direction === 'right') {
            gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
    
    function handleMousedown(e) {
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;
        if (layers.pma.x < mouseX && mouseX < layers.pma.x + layers.pma.img.width &&
            layers.pma.y < mouseY && mouseY < layers.pma.y + layers.pma.img.height) {
            isPmaDragging = true;
            pmaStartX = mouseX - layers.pma.x;
            pmaStartY = mouseY - layers.pma.y;
        }
    }
    
    function handleMousemove(e) {
        if (isPmaDragging) {
            const mouseX = e.clientX - canvas.offsetLeft;
            const mouseY = e.clientY - canvas.offsetTop;
            layers.pma.x = mouseX - pmaStartX;
            layers.pma.y = mouseY - pmaStartY;
            draw();
        }
    }
    
    function handleMouseup() {
        isPmaDragging = false;
    }

    // Fonction pour télécharger le canevas
    function downloadMeme() {
        // Créer un lien temporaire
        const link = document.createElement('a');
        // Définir le contenu du lien comme l'image du canevas
        link.href = canvas.toDataURL("image/png");
        // Nom du fichier téléchargé
        link.download = 'meme.png';
        // Simuler un clic sur le lien pour télécharger l'image
        document.body.appendChild(link);
        link.click();
        // Nettoyer le lien créé
        document.body.removeChild(link);
    }

    // Gestionnaire d'événements pour le bouton "Download Meme"
    document.getElementById('download-meme').addEventListener('click', downloadMeme);

    // Gestionnaire d'événements pour la souris pour la précision au pixel près
    function handleMouseClick(e) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        let textRemoved = false;

        textObjects.forEach((textObj, index) => {
            if (textObj.crossX && textObj.crossY) {
                if (clickX >= textObj.crossX && clickX <= textObj.crossX + crossSize &&
                    clickY >= textObj.crossY && clickY <= textObj.crossY + crossSize) {
                    textObjects.splice(index, 1); // Supprimer l'objet texte
                    currentTextIndex = null;
                    textRemoved = true;
                    drawWithoutCrosses(); // Redessiner sans les croix
                    return; // Sortir de la boucle après suppression
                }
            }

            const textWidth = ctx.measureText(textObj.text).width;
            const textHeight = textObj.size;
            const x = (canvas.width - textWidth) / 2;
            const y = canvas.height - textObj.size - 10;

            if (!textRemoved && clickX >= x && clickX <= x + textWidth &&
                clickY >= y - textHeight && clickY <= y) {
                currentTextIndex = index;
                drawWithoutCrosses(); // Redessiner sans les croix
            }
        });

        // Ajouter un nouveau texte lorsque vous cliquez sur le canevas en dehors d'un texte existant
        if (!textRemoved && currentTextIndex === null) {
            textObjects.push({...textObj});
            currentTextIndex = textObjects.length - 1;
            draw();
        }
    }

    
// Gestionnaire d'événements pour redimensionner le personnage
document.getElementById('resize-character-checkbox').addEventListener('change', function() {
    if (this.checked) {
        layers.character.width = 300; // Réduire la taille du personnage
        layers.character.height = 300; // Réduire la taille du personnage
        layers.character.x = 200;
        layers.character.y = 200;
        layers.pma.width = 300;
        layers.pma.height = 300;
        layers.pma.x = 200;
        layers.pma.y = 200;
        layers.hat.height = 300;
        layers.hat.width = 300;
        layers.hat.x = 200;
        layers.hat.y = 200;
    } else {
        layers.character.width = 500; // Restaurer la taille du personnage
        layers.character.height = 500; // Restaurer la taille du personnage
        layers.character.x = 0;
        layers.character.y = 0;
        layers.pma.width = 500;
        layers.pma.height = 500;
        layers.pma.x = 0;
        layers.pma.y = 0;
        layers.hat.width = 500;
        layers.hat.height = 500;
        layers.hat.x = 0;
        layers.hat.y = 0;
    }
    draw();
});


    // Gestionnaire d'événements pour les clics de souris
    canvas.addEventListener('click', handleMouseClick);

    // Event Listeners
    document.getElementById('upload-bg').addEventListener('change', handleBgUploadChange);
    document.getElementById('cb7-2').addEventListener('change', updateCharacterGallery);
    document.getElementById('background-prev').addEventListener('click', () => scrollGallery('background-gallery', 'left'));
    document.getElementById('background-next').addEventListener('click', () => scrollGallery('background-gallery', 'right'));
    document.getElementById('character-prev').addEventListener('click', () => scrollGallery('character-gallery', 'left'));
    document.getElementById('character-next').addEventListener('click', () => scrollGallery('character-gallery', 'right'));
    document.getElementById('pma-next').addEventListener('click', () => scrollGallery('pma-gallery', 'right'));
    document.getElementById('pma-prev').addEventListener('click', () => scrollGallery('pma-gallery', 'left'));
    document.getElementById('hat-next').addEventListener('click', () => scrollGallery('hat-gallery', 'right'));
    document.getElementById('hat-prev').addEventListener('click', () => scrollGallery('hat-gallery', 'left'));
    document.getElementById('nobg').addEventListener('change', updateBackgroundGallery);
    document.getElementById('bg-color-picker').addEventListener('input', handleBgColorChange);
    canvas.addEventListener('click', handleTextClick);
    canvas.addEventListener('mousedown', handleMousedown);
    canvas.addEventListener('mousemove', handleMousemove);
    canvas.addEventListener('mouseup', handleMouseup);

    // Initialize
    createGallery('background-gallery', images.backgrounds.main, onBackgroundClick);
    updateCharacterGallery();
    createGallery('pma-gallery', images.pma, onPmaClick);
    createGallery('hat-gallery', images.hats, onHatClick);
    updateBackgroundGallery();
    loadImages();
});
