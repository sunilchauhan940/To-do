/** Task Array Used to Store Details of All Task */
var tasks = new Array();
/** Used to hold Title of Task to be Deleted */
var deleteTaskTitle;
/** Used to hold card of Deleted Task */
var deleteCard;
/** Used to hold Title of Task to be Edited */
var editTaskTitle;
/** Used to hold Title of Task to be Undo */
var undoTaskTitle;
/** Handlebar Template for Card that Represents Task */
var taskTemplate = createHandlebar("task-card");
/** Handlebar Template for Card that Represents Image Task */
var imgtaskTemplate = createHandlebar("image-card");


/** Loads Web page and Initialize All Event Listeners */
$(document).ready(function () {
	loadTask();
	if($('#home-menu').hasClass("active")){
		showPending();
	}else if($('#bin-menu').hasClass("active")){
		showBinned();
	}else{
		showCompleted();
	}
	$(document).keydown(function(e){
		if( e.which === 90 && e.ctrlKey ){
			undoTask();
		}       
  	}); 
	$('#file-input').on('change',uploadimage)
	$('.card-columns').on('input','#colorpicker-icon',(ev) => {
		changecolor($(ev.target).parent().find("textarea"),$(ev.target).val())	
    });
	$('#pending').on('click', showPending);
	$('#completed').on('click', showCompleted);
	$('#bin').on('click', showBinned);
	$('#new-task-text').on('change', addTask);
	$('#toast-undo-btn').on('click',undoTask);
	$('.card-columns').on('click','#del-btn',setBinned);
	$('.card-columns').on('click','#img-del-btn',setBinned);
	$('.card-columns').on('click','#done-btn',setComplete);
	$('.card-columns').on('click','#img-done-btn',setComplete);
	$('.card-columns').on('click','#pending-btn',setPending);
	$('.card-columns').on('click','#img-pending-btn',setPending);
	$('.card-columns').on('click','#final-del-btn',openDeleteDialog);
	$('.card-columns').on('click','#img-final-del-btn',openDeleteDialog);
	$('#confirmdialog').on('click', '#confirm-del-btn', deleteTask);
	$('#bindialog').on('click', '#empty-bin-btn', emptyBin);
	$('#empty-bin').on('click', ()=>{$('#bindialog').modal('show');});
	$('.card-columns').on('focusin','#card-textarea',(event) => { 
		editTaskTitle = $(event.target).val(); 
	});
	$('.card-columns').on('focusout','#card-textarea', editTask);
	setTextarea();
});

/** Loads tasks from Local storage to Array */
function loadTask() {
	var temp = JSON.parse(localStorage.getItem("To_do"));
	for (var i in temp)
		tasks.push(temp[i]);
}

/** Add new task with title defined in textarea */
function addTask() {
	$("#empty-bg").css("display", "none");
	$(".card-columns").prepend(taskTemplate({ task_text: $('#new-task-text').val(),status: "Pending"}));
	tasks.push({ title: $("#new-task-text").val(), status: "Pending",color:"#fff",contentType: "text" });
	localStorage.setItem("To_do", JSON.stringify(tasks));
	setTextarea();
	$("#new-task-text").val("");
}

/** Edit given task when textarea lost focus   */
function editTask() {
	var newTitle = $(this).val();
	changeTitle(editTaskTitle, newTitle);
	localStorage.setItem("To_do", JSON.stringify(tasks));
}

/** Delete task Permenantly from local storage */
function deleteTask() {
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].title == deleteTaskTitle)
			tasks = tasks.filter(obj => {
				return obj != tasks[i];
			});
	}
	localStorage.setItem("To_do", JSON.stringify(tasks));
	deleteCard.fadeOut(500, cardRemove);
	$('#confirmdialog').modal('hide');
}

/** Opens confirm Delete dialog*/
function openDeleteDialog(){
	if(this.id === "final-del-btn"){
		deleteTaskTitle = $(this).parent().find("textarea").val();
	}else{
		var regex = new RegExp("img/(.*)")
		deleteTaskTitle = $(this).parent().find("img").attr("src").match(regex)[1];
	}
	deleteCard = $(this).parent().parent();
	$('#confirmdialog').modal('show');
}

/** Undo Task */
function undoTask(){
	$("#toast-bin").toast("hide");
	changeStatus(undoTaskTitle, "Pending");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	showPending();
}

/** Change status of current task to Binned*/
function setBinned() {
	var card = $(this).parent().parent();
	if(this.id === "del-btn"){
		undoTaskTitle = $(this).parent().find("textarea").val();
	}else{
		var regex = new RegExp("img/(.*)")
		undoTaskTitle = $(this).parent().find("img").attr("src").match(regex)[1];
	}
	changeStatus(undoTaskTitle, "Binned");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
	setCountdownTimer();
	$("#toast-bin").toast("show");
}

/** Change status of current task to Complete*/
function setComplete() {
	var card = $(this).parent().parent();
	if(this.id === "done-btn"){
		title = $(this).parent().find("textarea").val();
	}else{
		var regex = new RegExp("img/(.*)")
		title = $(this).parent().find("img").attr("src").match(regex)[1];
	}
	changeStatus(title, "Completed");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
}

/** Change status of current task to Pending*/
function setPending() {
	var card = $(this).parent().parent();
	if(this.id === "pending-btn"){
		var title = $(this).parent().find("textarea").val();
	}else{
		var regex = new RegExp("img/(.*)")
		var title = $(this).parent().find("img").attr("src").match(regex)[1];
	}
	changeStatus(title, "Pending");
	localStorage.setItem("To_do", JSON.stringify(tasks));
	card.fadeOut(500, cardRemove);
}

/** 
 * Loads tasks of specific status
 * @param {string} status - status of task
*/
function appendTask(status) {
	$("#empty-bg").css("display", "none");
	$(".card-columns").empty();
	var container = $(".card-columns");
	var task_list = tasks.filter(obj => {
		return obj.status === status && obj.contentType === "text";
	});
	var img_list = tasks.filter(obj => {
		return obj.status === status && obj.contentType === "img";;
	});
	if(task_list.length == 0 && img_list.length == 0){
		emptyTaskList();
	}
	if (task_list.length != 0) {
		for (var i = task_list.length - 1; i > -1; i--)
			container.append(taskTemplate({ task_text: task_list[i].title,status: status }));
		container.append('</div>');
	} 
	if (img_list.length != 0) {
		for (var i = img_list.length - 1; i > -1; i--)
			container.append(imgtaskTemplate({ title: img_list[i].title,status: status }));
		container.append('</div>');
	} 
}

/** Set background of page when there is no task */
function emptyTaskList() {
	$("#empty-bg").css("display", "unset");
	$(".card-columns").empty();
}

/** Shows Pending tasks on page. Used in Loading Pending Task Page */
function showPending() {
	$("#new-task-text").css("display", "block");
	$("#image-upload").css("display", "block");
	$("#title-pending").css("display", "block");
	$("#empty-bin").css("display", "none");
	$("#title-bin").css("display", "none");
	$("#title-complete").css("display", "none");
	appendTask("Pending");
	setTextarea();
}

/** Shows Binned tasks on page. Used in Loading Binned Task Page */
function showBinned() {
	$("#new-task-text").css("display", "none");
	$("#image-upload").css("display", "none");
	$("#empty-bin").css("display", "unset");
	$("#title-pending").css("display", "none");
	$("#title-bin").css("display", "block");
	$("#title-complete").css("display", "none");
	appendTask("Binned");
	setTextarea();
	setAllTextareaRealonly();
}

/** Shows Completed tasks on page. Used in Loading Completed Task Page */
function showCompleted() {
	$("#new-task-text").css("display", "none");
	$("#image-upload").css("display", "none");
	$("#title-pending").css("display", "none");
	$("#empty-bin").css("display", "none");
	$("#title-bin").css("display", "none");
	$("#title-complete").css("display", "block");
	appendTask("Completed");
	setTextarea();
	setAllTextareaRealonly();
}

/** Set static textarea to expandable textarea  */
function setTextarea() {
	$('textarea').each(function () {
		taskTitle = this.value;
		taskColorPicker = $(this).parent().find('#colorpicker-icon');
		for (var i = 0; i < tasks.length; i++) {
			if (tasks[i].title == taskTitle) {
				this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden; background-color:' + tasks[i].color +';');
				taskColorPicker.val(tasks[i].color);
				break;
			}
		}
		
	}).on('input', function () {
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
	});
}

/** Make All textarea Readonly  */
function setAllTextareaRealonly() {
	$('textarea').each(function () {
		$(this).prop("readonly",true);
	});
}

/** Removes current task card from page */
function cardRemove() {
	var parent = $(this).parent();
	this.remove();
	if (!parent.children().length > 0) {
		$("#empty-bg").css("display", "block");
	}
}

/** 
 * Change status of given task
 * @param {string} task_title - Title of task whose status you want to change.
 * @param {string} task_status - Updated Status of task. 
 */
function changeStatus(task_title, task_status) {
	console.log("changeStatus");
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].title == task_title) {
			tasks[i].status = task_status;
			break;
		}
	}
}

/**
 * Changes title of task
 * @param {string} old_title - The old title of the Task.
 * @param {string} new_title - The new title of the Task.
 */
function changeTitle(old_title, new_title) {
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].title == old_title) {
			tasks[i].title = new_title;
			break;
		}
	}
}

/** Permenantly Delete All Binned Task  */
function emptyBin() {
	tasks = tasks.filter(obj => {
		return obj.status !== "Binned";
	});
	localStorage.setItem("To_do", JSON.stringify(tasks));
	$('#bindialog').modal('hide');
	showBinned();
}

/**
 * Creates Handlebar 
 * @param {string} containerId - Id of Html container template.
 */
function createHandlebar(containerId) {
	var template = document.getElementById(containerId).innerHTML;
	Handlebars.registerHelper('ifeq', (a, b, options) => {
		if (a == b) { return options.fn(this); }
		return options.inverse(this);
	});
	return Handlebars.compile(template);
}

/** Code for undo timer  */
function setCountdownTimer(){
	var countdownNumberEl = document.getElementById('countdown-number');
	var countdown = 5;
	countdownNumberEl.textContent = countdown;
	setInterval(() => {
	  countdown = --countdown <= 0 ? 5 : countdown;
	  countdownNumberEl.textContent = countdown;
	}, 1200);
}

/** 
 * Change color of task 
 * @param {object} textarea - Object that references textarea.
 * @param {string} color - hex code of color.
*/
function changecolor(textarea,color){
	textarea.css("background-color",color);
	task_title = textarea.val();
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].title == task_title) {
			tasks[i].color = color;
			break;
		}
	}
	localStorage.setItem("To_do", JSON.stringify(tasks));
}

/** Upload Image on Server */
function uploadimage(){
	var fd = new FormData(); 
	var files = $('#file-input')[0].files[0]; 
	fd.append('file', files); 
	console.log(files);
	tasks.push({ title: files.name, status: "Pending",contentType: "img" });
	localStorage.setItem("To_do", JSON.stringify(tasks));
	$.ajax({ 
		url: 'upload.php', 
		type: 'post', 
		data: fd, 
		contentType: false, 
		processData: false, 
		success: function(response){ 
			if(response != 0){ 
				showPending();
			} 
			else{ 
				alert('file not uploaded'); 
			} 
		}, 
	}); 
}

