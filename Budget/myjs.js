// it parseFloat it conve	rt string into number and we use it because value cn be flaot
//		if(data.allitems[type].length > 0){	ID = data.allitems[type][data.allitems[type].length -1].id + 1;	}else ID = 0;

var budgetController = (function(){
 // 1. Make function constructor for get inputs of inc and exp

	 function Income (id, description, value){
	 	this.id = id;
	 	this.description = description;
	 	this.value = value;
	 };

	 function Expense (id, description, value){
	 	this.id = id;
	 	this.description = description;
	 	this.value = value;
	 };

	function calculateTotal(type){
		var sum = 0;
		data.totals[type],forEach(function(cur){
			sum = sum + cur.value;
		});
		data.totals[type] = sum;
	};

	 var data ={
	 	allitems:{
	 		inc:[],
	 		exp:[]
	 	},
	 	totals:{
	 		inc:[],
	 		exp:[]
	 	},
	 	budget: 0
	 }

	 // add item into function construtor

	return {
		addItems: function(type, description, value){
			
			var insertItem, ID;
			// create id method. Use if else statement because first element should be 0 

			if (data.allitems[type] > 0){
				ID = data.allitems[type][data.allitems[type].length -1].id + 1;
			}else {
				ID = 0;
			};

			// Create new item based on inc or exp type
	 		if(type === 'inc'){
	 			insertItem = new Income(ID, description, value);
	 		}else if (type === 'exp'){
	 			insertItem = new Expense(ID, description, value);
	 		}

 			return insertItem;
 			// push is array method
			data.allitems[type].push(insertItem);

		},

		addBudget: function(){
			calculateTotal('inc');
			calculateTotal('exp');

			data.budget = data.totals.inc - data.totals.exp;
		},
		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalexp: data.totals.exp
			}
		},

		testing: function(){
			console.log(data);

		}
	}

})();

var UIController =(function(){
 

   budgetController.addItems();
 	
 	return {
 		// 1. get inputs
 		getInputs: function(){
 			return{
 				type:document.querySelector('.add__type').value,
 				description:document.querySelector('.add__description').value,
 				value:document.querySelector('.add__value').value,
 			};
 		},

 		addListItem: function(obj, type){
 			var html, newItem, element;
 			if(type === 'inc'){
 				element = '.income__list';
 				html = '<div class="item clearfix" id="income-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
 			}else if (type === 'exp'){
 				element = '.expenses__list';
 				html = '<div class="item clearfix" id="expense-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
 			}


 			// replace, it is string method we use it becuase our content is sting 
 			newItem = html.replace('%ID%', obj.ID);
 			newItem = newItem.replace('%description%', obj.description);
 			newItem = newItem.replace('%value%', obj.value);

 			document.querySelector(element).insertAdjacentHTML('beforeend', newItem)
 		},

 		displayBudget: function(obj){
 			document.querySelector('.budget__value').textContent = obj.budget;
 			document.querySelector('.budget__income--value').textContent = obj.totalInc;		
 		}
 	}



})();


var controller = (function(budgetCtrl, UIctrl){
	
	// controler
	document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);
	document.addEventListener('keypress', function(event){
		if(event.keyCode === 13 || event.which === 13){
			ctrlAddItem();
		}
	});

	//function to tell what to do
	function ctrlAddItem() {
		console.log('Every thing is working fine');
		// if we put input input method above the function then it only pick fist value
		
		// 1. inputs
		var input = UIctrl.getInputs();	
		console.log(input);

		// 2 add new item to controller
		var newItems = budgetCtrl.addItems(input.type, input.description, input.value);

		// 3 display items
		UIctrl.addListItem(newItems, input.type);

		// 4 get budget values
		var budget = budgetCtrl.getBudget();

		// 5 display the budget

		UIctrl.displayBudget(budget); 





	}

})(budgetController, UIController);

