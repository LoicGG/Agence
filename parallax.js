window.onload = function(){
	// Crée un gestionnaire d'événements qui sera déclenché lorsque la fenêtre du navigateur est complètement chargée.
	if (typeof jQuery === 'undefined') {
		alert("ERROR: parallax.js requires jQuery.");
	} else {
		// Vérifie si jQuery est chargé. Si jQuery n'est pas défini (c'est-à-dire que jQuery n'a pas été chargé), il affiche un message d'erreur. Sinon, le reste du code est exécuté.
		var updateparallax = function(){
			parallax.width = window.innerWidth;
			parallax.height = window.innerHeight;
		}
		// Définit une fonction appelée updateparallax, qui met à jour les propriétés width et height de l'objet parallax avec les dimensions actuelles de la fenêtre du navigateur.
		updateparallax();
		// Appelle la fonction updateparallax immédiatement après que la page soit chargée pour définir les dimensions initiales du parallaxe.
		$(window).resize(function(){updateparallax();});
		// Ajoute un gestionnaire d'événements à l'objet window pour l'événement de redimensionnement de la fenêtre. À chaque fois que la fenêtre est redimensionnée, la fonction updateparallax est appelée, mettant ainsi à jour les dimensions du parallaxe en fonction des nouvelles dimensions de la fenêtre.
	}
}


// Bloc 1 : parallaxPage function =>
var parallaxPage = function(name, pageHtml){
	return{
		// Propriétés de l'objet page
		key: name,
		page : pageHtml,
		// Méthodes pour effectuer le défilement vers la droite, la gauche, le haut et le bas
		right  : function(callback){return this.transition({left:parallax.width,top:0}  ,{left:-parallax.width,top:0} ,callback);},
		left   : function(callback){return this.transition({left:-parallax.width,top:0} ,{left:parallax.width,top:0}  ,callback);},
		top    : function(callback){return this.transition({left:0,top:-parallax.height},{left:0,top:parallax.height} ,callback);},
		bottom : function(callback){return this.transition({left:0,top:parallax.height} ,{left:0,top:-parallax.height},callback);},

		// Méthode pour effectuer la transition entre les pages
		transition : function(locationNew, locationOld, callback){
			// Définit une méthode nommée transition dans l'objet parallaxPage avec trois paramètres : locationNew (la nouvelle position de la page à afficher), locationOld (la position actuelle de la page à masquer) et callback (une fonction de rappel qui sera exécutée une fois que la transition est terminée).
			if(!parallax.sliding){
				// Vérifie si l'effet de parallaxe est actuellement en cours d'exécution (parallax.sliding est false). Si ce n'est pas le cas, le code à l'intérieur du bloc if sera exécuté.
				parallax.sliding = true;
				// Défini parallax.sliding à true, indiquant que l'effet de parallaxe est en cours d'exécution et qu'aucune autre transition ne doit être initiée tant que celle-ci n'est pas terminée.
				var thisPage = this;
				// Cette ligne stocke la référence à l'objet parallaxPage actuel dans la variable thisPage. Cela est fait pour garantir que this (qui peut changer de contexte à l'intérieur des fonctions de rappel) peut être utilisé de manière cohérente.
				if(parallax.current !== this){
					// Cette ligne vérifie si la page actuelle n'est pas déjà celle sur laquelle la transition est appliquée.
					this.hide(locationNew);
					// Cette ligne masque la page actuelle en la déplaçant vers locationNew.
					if(typeof parallax.preload === 'function'){
						parallax.preload();
					}
					if(typeof this.preload === 'function'){
						this.preload();
					} 
					// Ces lignes ci-dessus vérifient que les méthodes preload soient définies pour l'objet parallax et l'objet parallaxPage actuel, respectivement. Si elles le sont, elles sont exécutées. Cela peut être utilisé pour précharger des ressources avant l'affichage de la nouvelle page.
					this.slide({left:0,top:0}, function(){
						thisPage.makeCurrent();
						parallax.sliding = false;
						if(typeof callback === 'function'){
							callback();
						}
					});
					// Cette ligne anime la page actuelle vers left:0 et top:0, ce qui signifie que la page est déplacée vers la position initiale (au centre de la fenêtre). Une fois l'animation terminée, la fonction de rappel est appelée (callback), puis la page actuelle est déclarée comme la page courante, et parallax.sliding est réinitialisé à false.
					if(typeof parallax.current !== 'undefined'){
						parallax.current.slide( locationOld,
							function(){
								parallax.sliding = false;
							}
						);
					}
					// Cette ligne vérifie si une page était déjà visible avant la transition. Si c'est le cas, elle effectue une animation pour cacher cette ancienne page (locationOld), puis réinitialise parallax.sliding à false.
					parallax.slideBackground(locationNew);
					// Cette ligne appelle la méthode slideBackground de l'objet parallax pour appliquer l'effet de parallaxe à l'arrière-plan en fonction de la nouvelle position de la page.
				}
			}
			return this; 
			// Enfin, la méthode retourne l'objet parallaxPage pour permettre les appels de méthodes en chaîne.
		},
		/* La méthode slide suivante est utilisée pour effectuer l'animation de déplacement d'une page parallaxe.*/
		slide : function(css, callback){
			// Cette ligne définit une méthode nommée slide dans l'objet parallaxPage. La méthode prend deux paramètres : css (un objet contenant les propriétés CSS à animer, telles que left et top) et callback (une fonction de rappel qui sera exécutée une fois que l'animation est terminée).
			this.page.css("display", "block");
			// Cette ligne assure que la page est affichée en définissant sa propriété CSS display à "block" avant de commencer l'animation.
			this.page.stop().animate(css, parallax.speed, parallax.easing,
				// Cette ligne utilise la fonction animate() de jQuery pour effectuer l'animation. Elle prend comme paramètres l'objet css (les propriétés CSS à animer), la vitesse de l'animation (parallax.speed) et la fonction d'interpolation (easing function) à utiliser (parallax.easing).
				function(){if(typeof callback === "function"){callback();}
				// Cette partie du code est une fonction de rappel qui sera exécutée une fois que l'animation est terminée. Elle vérifie d'abord si le paramètre callback est une fonction (typeof callback === "function") et, si c'est le cas, elle appelle la fonction de rappel.
			});
		},
		/* En résumé, la méthode slide est utilisée pour animer le déplacement de la page en utilisant les propriétés CSS spécifiées dans l'objet css.
		Une fois l'animation terminée, la fonction de rappel (si elle est fournie) est exécutée.*/

		/* Le bloc de code suivant définit la méthode hide de l'objet parallaxPage. La méthode hide est utilisée pour masquer la page actuelle en ajustant sa position CSS et en la cachant de la vue de l'utilisateur./Ce bloc de code définit la méthode hide de l'objet parallaxPage. La méthode hide est utilisée pour masquer la page actuelle en ajustant sa position CSS et en la cachant de la vue de l'utilisateur. */
		hide : function(newLocation){
			//Cette ligne définit une méthode nommée hide dans l'objet parallaxPage. La méthode prend un paramètre newLocation (un objet contenant les propriétés CSS de la nouvelle position de la page à masquer).
			newLocation = newLocation || {left:parallax.width,top:0}; //defaults left off screen
			//Cette ligne initialise newLocation en utilisant newLocation s'il est défini, sinon en utilisant l'objet {left:parallax.width, top:0}. Cela signifie que si newLocation n'est pas passé en paramètre, la page sera masquée en étant déplacée vers la gauche hors de l'écran.
			this.page.css("display", "none");
			//Cette ligne cache la page en définissant sa propriété CSS display à "none", ce qui la rend invisible à l'utilisateur.
			this.page.css(newLocation);
			//Cette ligne ajuste la position de la page en fonction de l'objet newLocation passé en paramètre. Cela déplace la page à la nouvelle position spécifiée.
			return this;
			//Enfin, la méthode hide retourne l'objet parallaxPage pour permettre les appels de méthodes en chaîne. Cela signifie que vous pouvez appeler d'autres méthodes sur le même objet après avoir appelé hide, par exemple : page.hide().show().makeCurrent();.
		},
		
		show : function(newLocation){
			// Cette ligne définit une méthode nommée show dans l'objet parallaxPage. La méthode prend un paramètre newLocation (un objet contenant les propriétés CSS de la nouvelle position de la page à afficher).
			newLocation = newLocation || {left:0,top:0}; //defaults on screen
			// Cette ligne initialise newLocation en utilisant newLocation s'il est défini, sinon en utilisant l'objet {left:0, top:0}. Cela signifie que si newLocation n'est pas passé en paramètre, la page sera affichée à sa position par défaut, c'est-à-dire au centre de l'écran.
			if(typeof parallax.current !== 'undefined'){
				parallax.current.hide();
			}
			// Cette ligne vérifie si une page était déjà visible avant d'afficher la nouvelle page. Si c'est le cas, elle masque d'abord cette ancienne page en appelant la méthode hide() sur la page courante (parallax.current).
			this.makeCurrent();
			// Cette ligne déclare la page actuelle comme étant la page courante en appelant la méthode makeCurrent(). Cette méthode met à jour l'état interne de l'objet parallax pour refléter la nouvelle page actuelle.
			this.page.css("display", "block");
			// Cette ligne rend la page visible en définissant sa propriété CSS display à "block", ce qui la rend visible à l'utilisateur.
			this.page.css(newLocation);
			// Cette ligne ajuste la position de la page en fonction de l'objet newLocation passé en paramètre. Cela déplace la page à la nouvelle position spécifiée.
			return this;
			// Enfin, la méthode show retourne l'objet parallaxPage pour permettre les appels de méthodes en chaîne. 
		},

		makeCurrent : function(){
			// Cette ligne définit une méthode nommée makeCurrent dans l'objet parallaxPage.
			if(this === parallax.current){
				return false;
				// Cette ligne vérifie si la page actuelle (this) est déjà la page courante (parallax.current). Si c'est le cas, la méthode retourne false sans effectuer d'opération supplémentaire.
			}else{
				if(typeof parallax.current !== 'undefined'){
					parallax.current.hide();
					parallax.last = parallax.current;
				}
				// Si la page actuelle n'est pas déjà la page courante, cette partie du code est exécutée. Elle masque d'abord la page courante (parallax.current.hide()) et stocke la page courante précédente dans parallax.last.
				if(parallax.updateUrl === true){ this.updateUrl(); }
				// Cette ligne vérifie si la propriété updateUrl de l'objet parallax est true. Si c'est le cas, la méthode updateUrl est appelée, ce qui met à jour l'URL du navigateur en fonction de la clé de la page (this.key).
				if(typeof parallax.onload == 'function'){ parallax.onload();}
				if(typeof this.onload === 'function'){ this.onload();}
				// Ces lignes vérifient si les fonctions de rappel onload sont définies dans l'objet parallax ou dans l'objet parallaxPage actuel. Si elles sont définies, elles sont appelées. Ces fonctions de rappel peuvent être utilisées pour exécuter du code spécifique lorsqu'une nouvelle page parallaxe devient la page courante.
				parallax.current = this;
				// Cette ligne met à jour la propriété parallax.current avec la nouvelle page courante (this), indiquant ainsi que cette page est maintenant la page principale affichée dans le parallaxe.
			}
			return true;
		},
		// Enfin, la méthode makeCurrent retourne true, indiquant que la page a été correctement rendue comme page courante.
		// En résumé, la méthode makeCurrent masque l'ancienne page courante, met à jour l'URL du navigateur si nécessaire, appelle les fonctions de rappel onload et définit la nouvelle page comme page courante dans l'objet parallax.

		// La méthode updateUrl est utilisée pour mettre à jour l'URL du navigateur en ajoutant un fragment identificateur (hash) correspondant à la clé de la page actuelle. Voici ce que fait ce bloc de code :

		updateUrl : function(){
			// Cette ligne définit une méthode nommée updateUrl dans l'objet parallaxPage.
			var url = document.URL;
			// Cette ligne récupère l'URL complète du navigateur, y compris le fragment identificateur existant (s'il y en a un).
			url = (url.lastIndexOf("#") === -1)? url : url.substring(0, url.lastIndexOf("#"));
			// Cette ligne vérifie si l'URL contient déjà un fragment identificateur (c'est-à-dire si lastIndexOf("#") renvoie -1 ou non). Si un fragment identificateur est présent dans l'URL, il est retiré en utilisant substring(0, url.lastIndexOf("#")). Sinon, l'URL reste inchangée.
			window.location.href = url + "#" + this.key;
			// Cette ligne met à jour l'URL du navigateur en ajoutant le fragment identificateur correspondant à la clé de la page actuelle (this.key). Cela permet aux utilisateurs de partager ou de sauvegarder l'URL pour revenir à cette page spécifique dans l'application parallaxe.
		},
		// En résumé, la méthode updateUrl permet de synchroniser l'URL du navigateur avec la page actuellement affichée dans l'effet parallaxe en ajoutant le fragment identificateur correspondant à la clé de la page. Cela facilite la navigation directe vers des sections spécifiques de l'application parallaxe.

		ackbar : function(){ 
			alert(this.key + " thinks it's a trap!");
			// Cette ligne affiche une fenêtre d'alerte avec le message "[Nom de la page] thinks it's a trap!", où [Nom de la page] est remplacé par la valeur de la propriété key de l'objet parallaxPage actuel. Cela signifie que l'alerte affiche le nom de la page actuelle suivi de "thinks it's a trap!".
			return this;
		},
	};
};


// Bloc 2 : parallax object
var parallax = {
	// Propriétés de l'objet parallax
	speed : 800,
	easing : 'swing',
	sliding : false,
	unusableNames : ["last", "current", "background","onload","updateUrl", "preload"],
	scaling : 0.15,

	// Méthode pour ajouter une nouvelle page au défilement parallaxe
	add : function(key,object) {
		var check = true;
		if(typeof key === 'object'){
			try{
				object = key
				key = key.attr('id');
			} catch(err){
				check = false;
				alert("ERROR:Page object lacks an id");
			}
		}else if(typeof key !== 'string'){
			check = false;
			alert("ERROR:undefined key");
		}

		if(typeof object !== 'object'){
			check = false;
			alert("ERROR:undefined page");
		}

		if(check){
			validKeyName = true;
			for(propName in this){
				if(propName === key) {
					validKeyName = false;
				}
			}
			if($.inArray(key, this.unusableNames) !== -1){
				validKeyName = false;
			}
			if(validKeyName){
				this[key] = parallaxPage(key,object);
				this[key].hide();
				this[key].page.css("position","absolute");
			}else{
				alert("ERROR:'"+key+"' cannot be used as a page identifier");
			}
		}
		return this;
	},

	// Méthode pour récupérer la page à partir de l'URL
	fromUrl : function(){
		var temp = document.URL.lastIndexOf("#")
		if(temp !== -1){
			pageName = document.URL.substring(temp + 1, document.URL.length);
			if(parallax.hasOwnProperty(pageName)){
				return parallax[pageName];
			}
		}
	},

	// Méthode pour appliquer l'effet de parallaxe sur l'arrière-plan
	slideBackground : function(newLocation){
		if(typeof this.background !== 'undefined' && typeof newLocation !== 'undefined'){
			$(this.background).animate({
				'background-position-x': '+=' + -newLocation.left * parallax.scaling + 'px',
				'background-position-y': '+=' + -newLocation.top * parallax.scaling + 'px',
				}, parallax.speed, parallax.easing);
		}
	},
};
