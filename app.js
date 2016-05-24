(function(){
   "use strict";

   var Moosipurk = function(){

     // SEE ON SINGLETON PATTERN
     if(Moosipurk.instance){
       return Moosipurk.instance;
     }
     //this viitab Moosipurk fn
     Moosipurk.instance = this;

     this.routes = Moosipurk.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // KĆ•IK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

     // hakkan hoidma kĆµiki purke
     this.jars = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.Moosipurk = Moosipurk; // Paneme muuutja kĆ¼lge

   Moosipurk.routes = {
     'home-view': {
       'render': function(){
         // kĆ¤ivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // kĆ¤ivitame siis kui lehte laeme
         console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // kĆ¤ivitame siis kui lehte laeme
       }
     }
   };

   // KĆµik funktsioonid lĆ¤hevad Moosipurgi kĆ¼lge
   Moosipurk.prototype = {

     init: function(){
       console.log('Rakendus lĆ¤ks tĆ¶Ć¶le');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest kĆ¤sitsi muutmine kĆ¤ivitab routechange event'i ikka
       }else{
         //esimesel kĆ¤ivitamisel vaatame urli Ć¼le ja uuendame menĆ¼Ć¼d
         this.routeChange();
       }

       //saan kĆ¤tte purgid localStorage kui on
       if(localStorage.jars){
           //vĆµtan stringi ja teen tagasi objektideks
           this.jars = JSON.parse(localStorage.jars);
           console.log('laadisin localStorageist massiiivi ' + this.jars.length);

           //tekitan loendi htmli
           this.jars.forEach(function(jar){

               var new_jar = new Jar(jar.id, jar.title, jar.ingredients);

               var li = new_jar.createHtmlElement();
               document.querySelector('.list-of-jars').appendChild(li);

           });

       }else{

		   //küsin AJAXIGA
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {

					console.log(xhttp.responseText);
					//tekst -> objektideks
					Moosipurk.instance.jars = JSON.parse(xhttp.responseText);
					console.log(Moosipurk.instance.jars);

					//teen purgid htmli
					Moosipurk.instance.jars.forEach(function(jar){

					   var new_jar = new Jar(jar.id, jar.title, jar.ingredients);

					   var li = new_jar.createHtmlElement();
					   document.querySelector('.list-of-jars').appendChild(li);

				   });

				   //salvestan localStoragisse
				   localStorage.setItem('jars', JSON.stringify(Moosipurk.instance.jars));


				}
			};
			xhttp.open("GET", "save.php", true);
			xhttp.send();


	   }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trĆ¼kkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },
	 deleteJar: function(event){

		// millele vajutasin SPAN
		console.log(event.target);

		// tema parent ehk mille sees ta on LI
		console.log(event.target.parentNode);

		//mille sees see on UL
		console.log(event.target.parentNode.parentNode);

		//id
		console.log(event.target.dataset.id);

		var c = confirm("Oled kindel?");

		// vajutas no, pani ristist kinni
		if(!c){	return; }

		//KUSTUTAN
		console.log('kustutan');

		// KUSTUTAN HTMLI
		var ul = event.target.parentNode.parentNode;
		var li = event.target.parentNode;

		ul.removeChild(li);


		//KUSTUTAN OBJEKTI ja uuenda localStoragit

		var delete_id = event.target.dataset.id;

		for(var i = 0; i < this.jars.length; i++){

			if(this.jars[i].id == delete_id){
				//see on see
				//kustuta kohal i objekt Ć¤ra
				this.jars.splice(i, 1);
				break;
			}
		}

		localStorage.setItem('jars', JSON.stringify(this.jars));



	 },
     search: function(event){
         //otsikasti vĆ¤Ć¤rtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-jars li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // Ć¼he listitemi sisu tekst
             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             //kas otsisĆµna on sisus olemas
             if(stack.indexOf(needle) !== -1){
                 //olemas
                 li.style.display = 'list-item';

             }else{
                 //ei ole, index on -1, peidan
                 li.style.display = 'none';

             }

         }
     },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;
       var ingredients = document.querySelector('.ingredients').value;

       //console.log(title + ' ' + ingredients);
       //1) tekitan uue Jar'i
	   var id = guid();
       var new_jar = new Jar(id, title, ingredients);

       //lisan massiiivi purgi
       this.jars.push(new_jar);
       console.log(JSON.stringify(this.jars));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('jars', JSON.stringify(this.jars));


		//AJAX
		var xhttp = new XMLHttpRequest();

		//mis juhtub kui pĆ¤ring lĆµppeb
		xhttp.onreadystatechange = function() {

			console.log(xhttp.readyState);

			if (xhttp.readyState == 4 && xhttp.status == 200) {

				console.log(xhttp.responseText);
			}
		};

		//teeb pĆ¤ringu
		xhttp.open("GET", "save.php?id="+id+"&title="+title+"&ingredients="+ingredients, true);
		xhttp.send();


       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);


     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, vĆµtan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menĆ¼Ć¼ lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) vĆµtan maha aktiivse menĆ¼Ć¼lingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // MOOSIPURGI LĆ•PP

   var Jar = function(new_id, new_title, new_ingredients){
	 this.id = new_id;
     this.title = new_title;
     this.ingredients = new_ingredients;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // vĆµttes title ja ingredients ->
       /*
       li
        span.letter
          M <- title esimene tĆ¤ht
        span.content
          title | ingredients
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.ingredients);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

	   //DELETE nupp
	   var span_delete = document.createElement('span');
	   span_delete.style.color = "red";
	   span_delete.style.cursor = "pointer";

	   //kustutamiseks panen id kaasa
	   span_delete.setAttribute("data-id", this.id);

	   span_delete.innerHTML = " Delete";

	   li.appendChild(span_delete);

	   //keegi vajutas nuppu
	   span_delete.addEventListener("click", Moosipurk.instance.deleteJar.bind(Moosipurk.instance));

       return li;

     }
   };

   //HELPER
   function guid(){
		var d = new Date().getTime();
		if(window.performance && typeof window.performance.now === "function"){
			d += performance.now(); //use high-precision timer if available
		}
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

   // kui leht laetud kĆ¤ivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Moosipurk();
   };

})();
