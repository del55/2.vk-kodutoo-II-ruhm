(function(){
   "use strict";

   var Stipendium = function(){

     // SEE ON SINGLETON PATTERN
     if(Stipendium.instance){
       return Stipendium.instance;
     }
     //this viitab Stipendium fn
     Stipendium.instance = this;

     this.routes = Stipendium.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // KĆ•IK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

     // hakkan hoidma kĆµiki purke
     this.candidates = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.Stipendium = Stipendium; // Paneme muuutja kĆ¼lge

   Stipendium.routes = {
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
   Stipendium.prototype = {

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
       if(localStorage.candidates){
           //vĆµtan stringi ja teen tagasi objektideks
           this.candidates = JSON.parse(localStorage.candidates);
           console.log('laadisin localStorageist massiiivi ' + this.candidates.length);

           //tekitan loendi htmli
           this.candidates.forEach(function(candidate){

               var new_candidate = new Candidate(candidate.id, candidate.name, candidate.matrikkel, candidate.major, candidate.grade, candidate.type);
               var li = new_candidate.createHtmlElement();
               var new_candidate2 = new Candidate2(candidate.id, candidate.name, candidate.matrikkel, candidate.major, candidate.grade, candidate.type);
               var li2 = new_candidate2.createHtmlElement();

               document.querySelector('.list-of-candidates').appendChild(li);
               document.getElementById('kandidaadid').appendChild(li2);



           });

       }

       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-candidate').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trĆ¼kkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },
	 deleteCandidate: function(event){

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
		var ul  = event.target.parentNode.parentNode;
		var li = event.target.parentNode;

		ul.removeChild(li);



		//KUSTUTAN OBJEKTI ja uuenda localStoragit

		var delete_id = event.target.dataset.id;

		for(var i = 0; i < this.candidates.length; i++){

			if(this.candidates[i].id == delete_id){
				//see on see
				//kustuta kohal i objekt Ć¤ra
				this.candidates.splice(i, 1);
				break;
			}
		}

		localStorage.setItem('candidates', JSON.stringify(this.candidates));



	 },
     search: function(event){
         //otsikasti vĆ¤Ć¤rtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-candidates li');
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

       var name = document.querySelector('.name').value;
       var matrikkel = document.querySelector('.matrikkel').value;
       var major = document.querySelector('.major').value;
       var x = document.getElementById("finance");
       var type = x.options[x.selectedIndex].text;
       var grade = document.querySelector('.grade').value;

       //console.log(title + ' ' + major);
       //1) tekitan uue Candidate'i
	   var id = guid();
       var new_candidate = new Candidate(id, name, matrikkel, major,grade, type);
       var id2 = guid();
         var new_candidate2 = new Candidate2(id2, name, matrikkel, major,grade, type);


       //lisan massiiivi purgi
       this.candidates.push(new_candidate);
       console.log(JSON.stringify(this.candidates));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('candidates', JSON.stringify(this.candidates));


       // 2) lisan selle htmli listi juurde
       var li = new_candidate.createHtmlElement();
       document.querySelector('.list-of-candidates').appendChild(li);
       var li2 = new_candidate2.createHtmlElement();
       document.getElementById('kandidaadid').appendChild(li2);


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

   var Candidate = function(new_id, new_name, new_matrikkel, new_major, new_grade, new_type){
	  this.id = new_id;
     this.name = new_name;
     this.matrikkel = new_matrikkel;
     this.major = new_major;
     this.grade = new_grade;
     this.type = new_type;
     console.log('created new candidate');
   };
   var Candidate2 = function(new_id, new_name, new_matrikkel, new_major, new_grade, new_type){
	  this.id = new_id;
     this.name = new_name;
     this.matrikkel = new_matrikkel;
     this.major = new_major;
     this.grade = new_grade;
     this.type = new_type;
     console.log('created new candidate');
   };

   Candidate2.prototype = {
     createHtmlElement: function(){

       // vĆµttes title ja major ->
       /*
       li
        span.letter
          M <- title esimene tĆ¤ht
        span.content
          title | major
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';
       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';



       var content = document.createTextNode("Matrikli nr: " + this.matrikkel + "  KKH: " +this.grade);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

     //DELETE nupp


       return li;

     }
   };
   Candidate.prototype = {
     createHtmlElement: function(){

       // vĆµttes title ja major ->
       /*
       li
        span.letter
          M <- title esimene tĆ¤ht
        span.content
          title | major
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.name.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';



       var content = document.createTextNode("Nimi: " + this.name + ' | '+ "Eriala: " + this.major + ' | ' + "KKH: " +this.grade + ' | ' + this.type);
       var content2 = document.createTextNode("Matrikli nr: " + this.matrikkel + ' | ' + "KKH: " +this.grade);
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
	   span_delete.addEventListener("click", Stipendium.instance.deleteCandidate.bind(Stipendium.instance));

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
     var app = new Stipendium();

   };

})();
