
//date picket restrict
minDate = new Date().toISOString().substring(0,10);
$('#due-date').prop('min', minDate);
//due date check
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) { dd='0'+dd;} 
if(mm<10) { mm='0'+mm; } 
today = yyyy+'-'+mm+'-'+dd;

setInterval(checkduedate, 1000);
function checkduedate() {
	var duedates = document.getElementsByClassName("due-date");
	for(var i=0;i<duedates.length;i++){
		var listitem = duedates[i].parentNode.parentNode;
		var edittext = listitem.querySelector('input[type=text]');
		if(duedates[i].value == today){
			edittext.setAttribute("style","animation: animate 3s linear infinite; ");
		}
		else{
			edittext.setAttribute("style","");
		}
	}
}

//New task list item
document.getElementById("add-task").onclick = addTask;
function addTask(){

	var tasktext = document.getElementById("new-task-text").value;
	if(tasktext.trim() === ""){
		alert("Enter Task Title");
	}else{
	var duedatetext = document.getElementById("due-date").value;
	var parent=document.getElementById("items");
	var priority=document.getElementById("priority").value;
	var row=document.createElement("div");
	row.className = "row";

		var col1= document.createElement("div");
		col1.className = "col-xs-4";
	
			var checkBox=document.createElement("input");
			checkBox.type="checkbox";
			checkBox.id = "checkitem";
			checkBox.onclick = change;

			var title=document.createElement("input");
			title.type="text";
			title.value="  " +tasktext;
			title.disabled = true;

			var col1_1= document.createElement("div");
			col1_1.className = "col-xs-2";

			if(duedatetext.trim() != ""){
			var l1=document.createElement("label");
			l1.innerHTML="Due on:";

			var duedate=document.createElement("input");
			duedate.type="date";
			duedate.value=duedatetext;
			duedate.disabled = true;
			duedate.className = "due-date";
			duedate.onkeydown="return false";
			duedate.min = minDate;
			// if(duedatetext.trim() == ""){
			// 	duedate.setAttribute("style","display:none");
			// 	l1.innerHTML="Due Date Not Specified";
			// }
			col1_1.appendChild(l1);
			col1_1.appendChild(duedate);
			}


		var col2= document.createElement("div");
		col2.className = "col-xs-2";

			var editbtn=document.createElement("button");
			editbtn.innerText="Edit";
			editbtn.id = "edit-btn";
			editbtn.onclick = editTask;
			editbtn.className="btn btn-default btn-primary";

		// var col3= document.createElement("div");
		// col3.className = "col-sm-1";
	
			var delbtn=document.createElement("button");
			delbtn.innerText="Delete";
			delbtn.id = "del-btn";
			delbtn.onclick = deleteTask;
			delbtn.className="btn btn-default btn-primary";

	col1.appendChild(checkBox);
	col1.appendChild(title);
	col1.appendChild(col1_1);
	col2.appendChild(editbtn);
	col2.appendChild(delbtn);
	row.appendChild(col1);
	row.appendChild(col2);
	// row.appendChild(col3);
	parent.insertBefore(row,parent.children[priority-1]);
	$('.dialog').fadeOut(200);
	$('.add').removeClass('active');  
	$('#new-task-text').val("");
	$('#due-date').val("");
	$('#due-date').prop("type","text");
	}
}

//Edit an existing task.
function editTask() {
	console.log("Edit Task");
	var listitem = this.parentNode.parentNode;
	var checkBox = listitem.querySelector('input[type=checkbox]')
	var edittext = listitem.querySelector('input[type=text]');
	var duedate = listitem.querySelector('input[type=date]');
	var editTask = listitem.querySelector('button');

	if (editTask.innerText === "Done") {
		checkBox.disabled = false;
		edittext.disabled = true;
		if(duedate)
		duedate.disabled = true;
		editTask.innerText = "Edit";
	}
	else {
		checkBox.disabled = true;
		edittext.disabled = false;
		if(duedate)
		duedate.disabled = false;
		editTask.innerText = "Done";
		edittext.focus();
	}
}

//Delete task.
function deleteTask(){
	console.log("Delete Task...");
	listItem=this.parentNode.parentNode;
	var parent=listItem.parentNode;
	parent.removeChild(listItem);
	
}

function movetocomplete(titleString){
	var parent=document.getElementById("completed-items");
	
	var row=document.createElement("div");
	row.className = "row";

		var col1= document.createElement("div");
		col1.className = "col-sm-5";

			var title = document.createElement("input");
			title.type="text";
			title.value ="  " +titleString;
			title.disabled = true;

		var col2= document.createElement("div");
		col2.className = "col-sm-1";

			var delbtn=document.createElement("button");
			delbtn.innerText="Delete";
			delbtn.id = "del-btn";
			delbtn.onclick = deleteTask;
			delbtn.className="btn btn-default btn-primary btn-xs";

	col1.appendChild(title);
	col2.appendChild(delbtn);
	row.appendChild(col1);
	row.appendChild(col2);
	parent.appendChild(row);
}

function change() {
	console.log("change");
	var listItem = this.parentNode;
	var edittext = listItem.querySelector('input[type=text]');
    if(this.checked){
		movetocomplete(edittext.value);
		var parent=listItem.parentNode.parentNode;
		parent.removeChild(listItem.parentNode);
    } 
}


$(document).ready( function() {
  
	$('.add').click(function(e){
	  e.stopPropagation();
	 if ($(this).hasClass('active')){
	   $('.dialog').fadeOut(200);
	   $(this).removeClass('active');
	 } else {
	   $('.dialog').delay(300).fadeIn(200);
	   $(this).addClass('active');
	 }
   });
   });