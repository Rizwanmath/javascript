var budgetController = (function(){
	// function constructor for income and expense

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type){
		var sum = 0;
		data.allitems[type].forEach(function (cur){
			sum = sum + cur.value;
			//value it is value which come from function contructure
			data.totals[type] = sum;
		});
	};


	var data = {
		allitems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc : 0
		},
		budget: 0,
		percentage: -1
	};

	return {
	addItem: function(type, des, val){
			var newItem, ID;
		
		// Create ID
		// ID = last id + 1
		if(data.allitems[type].length > 0){
			ID = data.allitems[type][data.allitems[type].length -1].id + 1;
		}else ID = 0;
		
		// Create new item based on inc or exp type
		  if(type === 'exp'){
		  	newItem = new Expense (ID, des, val);
		  	}else if (type === 'inc'){
	  		newItem = new Income(ID, des, val);
		  	}
		  
		 data.allitems[type].push(newItem);

		 // Return the new element
		 return newItem;
 	   },
 	   calculateBudget: function(){
 	   	//calculate total inc and exp
 	   	calculateTotal('inc');
 	   	calculateTotal('exp');

 	   	// calculate the budget; income - exp
 	   	data.budget = data.totals.inc - data.totals.exp;

 	   	// calculate the percentage of the income that we spent
 	   	if(data.totals.inc > 0){
 	   		data.percentage = Math.round((data.totals.exp / data.totals.inc  ) *100);	
 	   	}else {
 	   		data.percentage = -1;
 	   	}
 	   	

 	   	},
 	   	getBudget: function(){
 	   		return{
 	   			budget: data.budget,
 	   			totalInc: data.totals.inc,
 	   			totalExp: data.totals.exp,
 	   			percentage: data.percentage
 	   		}
 	   	},


 	   testing: function(){
 	   		console.log(data);
 	   }
	}

})();

var UIController = (function(){
		// add the new item to our data structure
		var DOM = {
			inputType: '.add__type',
			inputDescription:'.add__description',
			value:'.add__value',
			inputValue:'.add__btn',
			incomeCountainer: '.income__list',
			expenseCountainer: '.expenses__list',
			budgetLabel: '.budget__value',
			incomeLabel: '.budget__income--value',
			expenseLabel: '.budget__expenses--value',
			percentageLabel: '.budget__expenses--percentage'
		}

		return {
			getInput: function (){
				return {
					type: document.querySelector(DOM.inputType).value,
					description: document.querySelector(DOM.inputDescription).value,
					//value: document.querySelector(DOM.value).value

					// it parseFloat it convert string into number and we use it because value cn be flaot
					value: parseFloat(document.querySelector(DOM.value).value)
				};
			},

			addListItem: function(obj, type){
				var html, element, newItem;
				// create HTML sting with placeholder
				if (type === 'inc'){
					element = DOM.incomeCountainer;
				 html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';		
				}else if (type === 'exp'){
					element = DOM.expenseCountainer;
					html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				}
				// replace placeholder with some actual data
				newItem = html.replace('%id%', obj.id);
				newItem = newItem.replace('%description%', obj.description);
				newItem = newItem.replace('%value%', obj.value);
				// Insert the HTML into the DOM 
				document.querySelector(element).insertAdjacentHTML('beforeend', newItem);
			},
			// doubt
			clearFields: function(){
				var field = document.querySelectorAll(DOM.inputDescription + ',' + DOM.value);
				
				var fieldArr = Array.prototype.slice.call(field);

				fieldArr.forEach(function(current, index, array) {
					current.value = "";

				});
				fieldArr[0].focus();
			},

			displayBudget: function (obj){
				document.querySelector(DOM.budgetLabel).textContent = obj.budget;
				document.querySelector(DOM.incomeLabel).textContent = obj.totalInc;
				document.querySelector(DOM.expenseLabel).textContent = obj.totalExp;
				if(obj.percentage > 0){
					document.querySelector(DOM.percentageLabel).textContent = obj.percentage ;	
				}else {	
					document.querySelector(DOM.percentageLabel).textContent = '	% ' ;	
				}
				
			},

			DOMString: function (){
				return DOM;
			}
		};


		
})();

var controller = (function(budgetCtrl, UICtrl){
		

		function setupEventLisntner(){
			var DOM = UICtrl.DOMString();
			document.querySelector(DOM.inputValue).addEventListener('click',ctrlAddItem);
			document.addEventListener('keypress', function(event){
				if(event.keyCode === 13 || event.which === 13)
					{
						ctrlAddItem();
					}
			});	
		};

		function updateBudget(){


			// 1. Calculate the budget
			budgetController.calculateBudget();

			// 2. return the budget
			var budget = budgetController.getBudget();
			// 3. Display the budget on the ui
			UICtrl.displayBudget(budget);
			//console.log(budget);
  
		}




		var ctrlAddItem = function(){
			var input, newItem;
			// 1. Get the field input data
			input = UICtrl.getInput();
			console.log(input);
			// isNaN a function is return false if it is number otherwise it is return a ture
			if(input.description !== "" && input.value > 0 && !isNaN(input.value)){
			//2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			// 3. Add the itme to the ui
			UICtrl.addListItem(newItem, input.type);
			
			// CLear Inputs
			UICtrl.clearFields();
			}
			updateBudget();


		};

		return {
			init: function(){
				UICtrl.displayBudget({
				budget: 0,
 	   			totalInc: 0,
 	   			totalExp: 0,
 	   			percentage: -1
				});
				return setupEventLisntner();

			}
		}

})(budgetController, UIController);

 controller.init();
